const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const { Ollama } = require('ollama');
const db = require('../config/db');
const { searchWeb } = require('./webSearch.service');

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const LOCAL_MODEL = process.env.LOCAL_AI_MODEL || 'qwen2.5:1.5b';
const ollama = new Ollama({ host: OLLAMA_HOST });

/**
 * Kiểm tra trạng thái sẵn sàng của Ollama server
 */
async function checkOllamaHealth() {
  try {
    const list = await ollama.list();
    const hasModel = list?.models?.some(m => m.name.includes(LOCAL_MODEL) || m.name.includes('qwen') || m.name.includes('llama'));
    return { available: true, models: list.models || [], hasRecommendedModel: hasModel };
  } catch (err) {
    return { available: false, error: err.message };
  }
}

/**
 * Tra cứu CSDL PostgreSQL để cung cấp ngữ cảnh thực tế cho AI (RAG / Data Grounding)
 */
async function searchDatabaseContext(query) {
  const normalizedQuery = query.toLowerCase().trim();
  const results = {
    crafts: [],
    artisans: [],
    villages: [],
    regions: [],
  };

  try {
    // Trích xuất các từ khóa ý nghĩa (loại bỏ từ nối tiếng Việt thông dụng)
    const stopWords = new Set(['cho', 'tôi', 'các', 'và', 'những', 'sản', 'phẩm', 'với', 'là', 'gì', 'nào', 'ở', 'trong', 'giá', 'cả', 'hãy', 'gợi', 'ý', 'tìm', 'kiếm', 'bằng', 'làm', 'muốn', 'mua', 'xem']);
    const rawTokens = normalizedQuery.split(/[\s,?.!]+/).filter(w => w.length >= 2 && !stopWords.has(w));
    
    // Nếu có cụm từ làng nghề, chất liệu đặc trưng giữ nguyên cụm
    const phrases = [];
    if (normalizedQuery.includes('bát tràng')) phrases.push('%bát tràng%');
    if (normalizedQuery.includes('vạn phúc')) phrases.push('%vạn phúc%');
    if (normalizedQuery.includes('hạ thái')) phrases.push('%hạ thái%');
    if (normalizedQuery.includes('chuôn ngọ')) phrases.push('%chuôn ngọ%');
    if (normalizedQuery.includes('phú vinh')) phrases.push('%phú vinh%');
    if (normalizedQuery.includes('chu đậu')) phrases.push('%chu đậu%');
    if (normalizedQuery.includes('đông hồ')) phrases.push('%đông hồ%');
    if (normalizedQuery.includes('gốm')) phrases.push('%gốm%');
    if (normalizedQuery.includes('lụa')) phrases.push('%lụa%');
    if (normalizedQuery.includes('sơn mài')) phrases.push('%sơn mài%');
    if (normalizedQuery.includes('đồng')) phrases.push('%đồng%');
    if (normalizedQuery.includes('mây tre')) phrases.push('%mây tre%');

    const searchPatterns = phrases.length > 0 ? phrases : (rawTokens.length > 0 ? rawTokens.map(t => `%${t}%`) : [`%${normalizedQuery}%`]);

    // 1. Tìm kiếm sản phẩm phù hợp trong bảng crafts
    const craftSql = `
      SELECT 
        c.id, c.name, c.slug, c.code, c.price_vnd AS "priceVnd", 
        c.origin_line AS "originLine", c.thumbnail_url AS "thumbnailUrl",
        c.short_description AS "shortDescription",
        r.name AS region, cat.name AS category, cv.name AS village
      FROM crafts c
      JOIN regions r ON c.region_id = r.id
      JOIN craft_categories cat ON c.category_id = cat.id
      LEFT JOIN craft_villages cv ON c.village_id = cv.id
      WHERE 
        c.name ILIKE ANY($1) OR 
        c.short_description ILIKE ANY($1) OR 
        cat.name ILIKE ANY($1) OR
        cv.name ILIKE ANY($1) OR
        r.name ILIKE ANY($1)
      ORDER BY c.is_spotlight DESC, c.is_featured DESC, c.id ASC
      LIMIT 3
    `;
    const craftRes = await db.query(craftSql, [searchPatterns]);
    results.crafts = craftRes.rows;

    // 2. Tìm kiếm nghệ nhân trong bảng artisans
    const artisanSql = `
      SELECT 
        a.id, a.name, a.title, a.years_of_experience AS "experience", 
        a.generation, a.avatar_url AS "avatarUrl", a.biography AS bio,
        r.name AS region, cv.name AS village
      FROM artisans a
      JOIN regions r ON a.region_id = r.id
      LEFT JOIN craft_villages cv ON a.village_id = cv.id
      WHERE a.name ILIKE ANY($1) OR a.title ILIKE ANY($1) OR cv.name ILIKE ANY($1)
      LIMIT 2
    `;
    const artisanRes = await db.query(artisanSql, [searchPatterns]);
    results.artisans = artisanRes.rows;

    // 3. Tìm kiếm làng nghề trong bảng craft_villages
    const villageSql = `
      SELECT cv.id, cv.name, cv.province, cv.century_label AS "centuryLabel", cv.summary, r.name AS region
      FROM craft_villages cv
      JOIN regions r ON cv.region_id = r.id
      WHERE cv.name ILIKE ANY($1) OR cv.province ILIKE ANY($1)
      LIMIT 2
    `;
    const villageRes = await db.query(villageSql, [searchPatterns]);
    results.villages = villageRes.rows;
  } catch (err) {
    console.error('Lỗi tra cứu CSDL cho AI Chatbot:', err.message);
  }

  return results;
}

const { toolsList, executeTool, detectCrudIntent } = require('./aiTools.service');

/**
 * Xử lý cuộc hội thoại với Ollama AI kết hợp Route Context, Web Search và CRUD Tools
 */
async function processChatMessage({ sessionId, userId, userRole = 'guest', userEmail = null, userName = null, message, pageContext = {} }) {
  const {
    currentPath = '',
    pageTitle = '',
    heading = '',
    entityType = '',
    entityName = '',
    summary: pageSummary = '',
    enableWebSearch = false
  } = pageContext;

  const userContext = { userId, userRole, userEmail, userName };

  // 1. Đảm bảo phiên hội thoại tồn tại
  const sessionCheck = await db.query('SELECT id, user_id FROM chat_sessions WHERE id = $1', [sessionId]);
  if (sessionCheck.rows.length > 0) {
    const ownerId = sessionCheck.rows[0].user_id;
    if (ownerId && ownerId !== userId) {
      const err = new Error('Bạn không có quyền truy cập phiên trò chuyện này.');
      err.statusCode = 403;
      err.errorCode = 'FORBIDDEN';
      throw err;
    }
    // Gắn chủ sở hữu cho phiên khách khi người dùng đã đăng nhập
    if (!ownerId && userId) {
      await db.query('UPDATE chat_sessions SET user_id = $1 WHERE id = $2', [userId, sessionId]);
    }
  } else {
    await db.query(
      'INSERT INTO chat_sessions (id, user_id, title) VALUES ($1, $2, $3)',
      [sessionId, userId || null, message.substring(0, 80)]
    );
  }

  // 2. Lưu tin nhắn của User vào PostgreSQL
  await db.query(
    'INSERT INTO chat_messages (session_id, sender_role, content) VALUES ($1, $2, $3)',
    [sessionId, 'user', message]
  );

  // 3. Kiểm tra ý định CRUD từ trước (Pre-detection)
  const preDetectedTool = detectCrudIntent(message, pageContext, userContext);

  // 4. Bổ sung từ khóa từ đối tượng trên trang hiện tại nếu câu hỏi có tính tham chiếu
  const contextSubject = heading || entityName || '';
  const isReferencingCurrentPage = /(cái này|tác phẩm này|sản phẩm này|nghệ nhân này|ở đây|trang này|chỗ này|món này|bình này|bức này)/i.test(message);
  
  const dbSearchQuery = (contextSubject && isReferencingCurrentPage)
    ? `${message} ${contextSubject}`
    : (contextSubject && !message.toLowerCase().includes(contextSubject.toLowerCase()) ? `${message} ${contextSubject}` : message);

  // Tra cứu dữ liệu từ CSDL CraftRoots
  const dbContext = await searchDatabaseContext(dbSearchQuery);

  // 5. Kiểm tra yêu cầu tra cứu trên mạng (Web Search)
  const isWebSearchKeyword = /(mạng|internet|google|tra cứu|tìm trên mạng|báo chí|tin tức|bài báo|wikipedia|thực tế|thế giới|ngoài đời|ngoài thị trường)/i.test(message);
  const shouldSearchWeb = Boolean(enableWebSearch || isWebSearchKeyword);

  let webResults = [];
  if (shouldSearchWeb && !preDetectedTool) {
    let webQuery = '';
    const cleanUserQuery = message.replace(/(tra cứu|tìm kiếm|trên mạng|internet|google|tin tức|bài báo|về|hãy|cho tôi|biết|xem)/gi, '').trim();

    if (contextSubject) {
      if (cleanUserQuery.length > 2 && !cleanUserQuery.toLowerCase().includes(contextSubject.toLowerCase())) {
        webQuery = `${contextSubject} ${cleanUserQuery}`;
      } else {
        webQuery = contextSubject;
      }
    } else {
      webQuery = cleanUserQuery || message;
    }

    try {
      webResults = await searchWeb(webQuery);
    } catch (searchErr) {
      console.warn('Lỗi tra cứu web trong AI Chat:', searchErr.message);
    }
  }

  // 6. Chuẩn bị Rich Cards trả về cho giao diện (Kiệt tác, Nghệ nhân, Web Citations)
  const richCards = [];

  // Thẻ kiệt tác CSDL
  dbContext.crafts.forEach(c => {
    richCards.push({
      type: 'craft',
      id: c.id,
      name: c.name,
      priceVnd: c.priceVnd,
      thumbnailUrl: c.thumbnailUrl,
      region: c.region,
      category: c.category,
      url: `/crafts/${c.id}`
    });
  });

  // Thẻ nghệ nhân CSDL
  dbContext.artisans.forEach(a => {
    richCards.push({
      type: 'artisan',
      id: a.id,
      name: a.name,
      title: a.title,
      experience: a.experience,
      avatarUrl: a.avatarUrl,
      village: a.village,
      url: `/artisans/${a.id}`
    });
  });

  // Thẻ kết quả tra cứu Internet (Wikipedia / Báo chí)
  webResults.forEach((w, wIdx) => {
    richCards.push({
      type: 'web_source',
      id: `web_${Date.now()}_${wIdx}`,
      title: w.title,
      snippet: w.snippet,
      source: w.source,
      url: w.url
    });
  });

  // 7. Thực thi hoặc kiểm tra Ollama AI
  const health = await checkOllamaHealth();
  let replyText = '';
  const toolExecutions = [];

  if (health.available) {
    try {
      // Đọc 4 tin nhắn gần nhất để duy trì ngữ cảnh
      const historyRes = await db.query(
        'SELECT sender_role AS role, content FROM chat_messages WHERE session_id = $1 ORDER BY id DESC LIMIT 5',
        [sessionId]
      );
      const pastMessages = historyRes.rows.reverse().map(m => ({
        role: m.role,
        content: m.content
      }));

      // Bối cảnh trang hiện tại
      let pageContextPrompt = '';
      if (currentPath || contextSubject) {
        pageContextPrompt = `
[NGỮ CẢNH TRANG NGƯỜI DÙNG ĐANG XEM]:
- Đường dẫn Route: ${currentPath || 'N/A'}
- Tiêu đề trang: ${pageTitle || 'N/A'}
- Đối tượng chính trên trang: ${contextSubject || 'Tổng quan di sản'}
- Tóm tắt nội dung hiển thị: ${pageSummary || 'Thông tin trang chung'}
`;
      }

      // Bối cảnh kết quả tra cứu trên mạng
      let webSearchPrompt = '';
      if (webResults.length > 0) {
        webSearchPrompt = `
[KẾT QUẢ TRA CỨU TRÊN MẠNG (INTERNET / WIKIPEDIA & BÁO CHÍ THỰC TẾ)]:
${webResults.map((r, i) => `${i + 1}. [Nguồn: ${r.source}] Tiêu đề: ${r.title}\n   Nội dung: ${r.snippet}\n   Link tham khảo: ${r.url}`).join('\n')}
`;
      }

      // Hướng dẫn công cụ CRUD
      const crudPrompt = `
[HỆ THỐNG CÔNG CỤ THAO TÁC CSDL THỰC TẾ (CRUD API TOOLS)]:
Bạn có quyền hạn thực thi các thao tác CSDL qua các API tools sau:
- create_booking: Đăng ký lịch hẹn đàm đạo trà & thăm xưởng nghệ nhân
- get_bookings: Tra cứu danh sách lịch hẹn của khách
- cancel_booking: Hủy lịch hẹn thăm xưởng
- create_craft: Thêm mới kiệt tác thủ công (Tên, giá, xuất xứ...)
- update_craft: Cập nhật giá bán, mô tả, thông tin tác phẩm
- delete_craft: Xóa tác phẩm
- create_artisan: Thêm hồ sơ nghệ nhân mới
- update_artisan: Cập nhật thông tin nghệ nhân
- delete_artisan: Xóa hồ sơ nghệ nhân
- add_favourite: Lưu kiệt tác vào danh sách yêu thích

Quy tắc:
1. Khi người dùng yêu cầu hành động CRUD (đặt lịch, sửa giá, thêm, xóa...), hãy gọi công cụ bằng cách xuất ra khối JSON:
\`\`\`json
{
  "tool": "<tên_công_cụ>",
  "arguments": { ... }
}
\`\`\`
2. Nếu câu hỏi chỉ cần giải đáp thông thường, hãy trả lời nhã nhặn, tôn vinh di sản (dưới 160 từ).
`;

      const systemPrompt = `Bạn là "Trợ Lý Di Sản CraftRoots" – Chuyên gia am tường về văn hóa và nghề thủ công truyền thống Việt Nam.
Phong cách trả lời: Lịch thiệp, trang nhã, giàu niềm tự hào văn hóa.
Bạn có quyền nhận biết trang người dùng đang xem, tra cứu internet và thực thi trực tiếp các thao tác CSDL (CRUD API).

${pageContextPrompt}
[DỮ LIỆU CSDL CRAFTROOTS NỘI BỘ]:
- Sản phẩm liên quan: ${JSON.stringify(dbContext.crafts, null, 2)}
- Nghệ nhân liên quan: ${JSON.stringify(dbContext.artisans, null, 2)}
- Làng nghề liên quan: ${JSON.stringify(dbContext.villages, null, 2)}

${webSearchPrompt}
${crudPrompt}`;

      const matched = health.models.find(m => m.name.includes(LOCAL_MODEL));
      const activeModel = matched ? matched.name : (health.models[0]?.name || LOCAL_MODEL);

      const response = await ollama.chat({
        model: activeModel,
        messages: [
          { role: 'system', content: systemPrompt },
          ...pastMessages
        ],
        tools: toolsList
      });

      // Kiểm tra xem LLM có gọi tool không (Ollama native tool_calls hoặc JSON block)
      let toolToExecute = null;
      if (response.message?.tool_calls && response.message.tool_calls.length > 0) {
        const tc = response.message.tool_calls[0];
        toolToExecute = {
          toolName: tc.function.name,
          args: tc.function.arguments || {}
        };
      } else {
        const intentFromLLM = detectCrudIntent(response.message.content, pageContext, userContext);
        toolToExecute = intentFromLLM || preDetectedTool;
      }

      if (toolToExecute) {
        const executionResult = await executeTool(toolToExecute.toolName, toolToExecute.args, { ...userContext, pageContext });
        toolExecutions.push({
          tool: toolToExecute.toolName,
          arguments: toolToExecute.args,
          result: executionResult
        });

        // Thêm thẻ CRUD Action lên đầu danh sách rich cards
        richCards.unshift({
          type: 'crud_action',
          tool: toolToExecute.toolName,
          success: executionResult.success,
          message: executionResult.message,
          data: executionResult.data
        });

        // Tạo câu trả lời xác nhận lịch thiệp từ trợ lý
        replyText = formatToolSuccessResponse(toolToExecute.toolName, executionResult, response.message.content);
      } else {
        replyText = response.message.content;
      }

    } catch (ollamaErr) {
      console.warn('Ollama chat error, chuyển sang chế độ phản hồi di sản thông minh:', ollamaErr.message);
      
      // Nếu có lệnh CRUD khi Ollama lỗi, vẫn thực thi CSDL trực tiếp
      if (preDetectedTool) {
        const executionResult = await executeTool(preDetectedTool.toolName, preDetectedTool.args, { ...userContext, pageContext });
        toolExecutions.push({
          tool: preDetectedTool.toolName,
          arguments: preDetectedTool.args,
          result: executionResult
        });
        richCards.unshift({
          type: 'crud_action',
          tool: preDetectedTool.toolName,
          success: executionResult.success,
          message: executionResult.message,
          data: executionResult.data
        });
        replyText = formatToolSuccessResponse(preDetectedTool.toolName, executionResult);
      } else {
        replyText = generateHeritageResponse(message, dbContext, false, pageContext, webResults);
      }
    }
  } else {
    // Ollama chưa bật -> Nếu có lệnh CRUD, thực thi trực tiếp bằng Engine CSDL
    if (preDetectedTool) {
      const executionResult = await executeTool(preDetectedTool.toolName, preDetectedTool.args, { ...userContext, pageContext });
      toolExecutions.push({
        tool: preDetectedTool.toolName,
        arguments: preDetectedTool.args,
        result: executionResult
      });
      richCards.unshift({
        type: 'crud_action',
        tool: preDetectedTool.toolName,
        success: executionResult.success,
        message: executionResult.message,
        data: executionResult.data
      });
      replyText = formatToolSuccessResponse(preDetectedTool.toolName, executionResult);
    } else {
      replyText = generateHeritageResponse(message, dbContext, true, pageContext, webResults);
    }
  }

  // 8. Tạo danh sách câu hỏi gợi ý phù hợp với ngữ cảnh trang
  const suggestedQuestions = generateSuggestedQuestions(pageContext);

  // 9. Lưu tin nhắn của Assistant vào PostgreSQL (kèm tool_calls)
  await db.query(
    'INSERT INTO chat_messages (session_id, sender_role, content, rich_cards, tool_calls) VALUES ($1, $2, $3, $4, $5)',
    [sessionId, 'assistant', replyText, JSON.stringify(richCards), JSON.stringify(toolExecutions)]
  );

  return {
    sessionId,
    reply: replyText,
    richCards,
    toolExecutions,
    suggestedQuestions,
    webSources: webResults,
    pageContextUsed: {
      route: currentPath,
      heading: contextSubject,
      hasWebSearch: webResults.length > 0
    },
    aiProvider: health.available ? `Ollama Local (${LOCAL_MODEL}) + CRUD APIs` : 'CraftRoots Heritage Engine (CSDL Direct CRUD)',
    isLocalOllama: health.available
  };
}

/**
 * Định dạng câu trả lời nhã nhặn sau khi thực thi thành công một hành động CRUD
 */
function formatToolSuccessResponse(toolName, result, originalContent = '') {
  if (!result.success) {
    return `Dạ, thao tác chưa thể hoàn thành: ${result.message || result.error || 'Có lỗi xảy ra'}. Quý khách vui lòng kiểm tra lại thông tin.`;
  }

  const { data = {} } = result;

  switch (toolName) {
    case 'create_booking': {
      const dateStr = data.visitDate ? new Date(data.visitDate).toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' }) : 'Sắp xếp theo lịch';
      return `Kính thưa quý khách, tôi đã hoàn tất đăng ký **Phiếu hẹn thăm xưởng #${data.bookingId}** thành công!\n\n` +
             `📋 **Thông tin chi tiết:**\n` +
             `- Nghệ nhân tiếp đón: **${data.artisanName || 'Bậc thầy di sản'}**\n` +
             `- Người liên hệ: **${data.fullName}** (${data.phone})\n` +
             `- Ngày hẹn: **${dateStr}** (${data.timeSlot})\n` +
             `- Trạng thái: **${data.status}**\n\n` +
             `Nghệ nhân rất vinh hạnh được đàm đạo trà và tiếp đón quý khách tại xưởng thủ công!`;
    }

    case 'get_bookings':
      return `Dạ, tôi đã tra cứu được **${result.count || (data ? data.length : 0)}** phiếu hẹn trong hệ thống. Quý khách có thể xem thông tin chi tiết qua danh sách đính kèm.`;

    case 'cancel_booking':
      return `Dạ, tôi đã xác nhận hủy **Phiếu hẹn #${data.id}** theo yêu cầu của quý khách. Nếu cần đặt lại lịch vào dịp khác, tôi luôn sẵn sàng hỗ trợ!`;

    case 'create_craft':
      return `Dạ, kiệt tác **"${data.name}"** (Mã: \`${data.code}\`) đã được thêm mới thành công vào kho tàng di sản với mức giá tham chiếu **${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.priceVnd)}**!`;

    case 'update_craft':
      return `Dạ, tôi đã cập nhật thành công thông tin kiệt tác **"${data.name}"** (Giá mới: **${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.priceVnd)}**) vào CSDL!`;

    case 'delete_craft':
      return `Dạ, tác phẩm **"${data.name}"** đã được xóa khỏi hệ thống CSDL theo yêu cầu của quý khách.`;

    case 'create_artisan':
      return `Dạ, hồ sơ tôn vinh nghệ nhân **"${data.name}"** (${data.title || 'Nghệ nhân di sản'}, ${data.experience || 0} năm nghề) đã được khởi tạo thành công!`;

    case 'update_artisan':
      return `Dạ, hồ sơ nghệ nhân **"${data.name}"** đã được cập nhật thành công trong hệ thống.`;

    case 'delete_artisan':
      return `Dạ, hồ sơ nghệ nhân **"${data.name}"** đã được xóa khỏi hệ thống.`;

    case 'add_favourite':
      return `Dạ, tôi đã lưu kiệt tác **"${data.name || 'tác phẩm'}"** vào danh mục yêu thích của quý khách! Quý khách có thể xem lại trong mục Yêu thích bất kỳ lúc nào.`;

    default:
      return result.message || 'Thao tác đã được thực thi thành công vào hệ thống CSDL!';
  }
}


/**
 * Trình sinh câu trả lời di sản thông minh (kết hợp PageContext & Web Results)
 */
function generateHeritageResponse(message, dbContext, showOllamaNotice = false, pageContext = {}, webResults = []) {
  const { heading = '', currentPath = '' } = pageContext;
  let response = `Kính chào quý khách! Tôi là **Trợ Lý Di Sản CraftRoots**.\n\n`;

  if (heading) {
    response += `Quý khách hiện đang khám phá thông tin về **${heading}** (tại trang \`${currentPath || 'chi tiết'}\`).\n\n`;
  }

  // Nếu có kết quả tra cứu trên mạng
  if (webResults && webResults.length > 0) {
    const top = webResults[0];
    response += `🌐 **Tra cứu trực tuyến (${top.source}):**\n"${top.snippet}"\n\n`;
    if (webResults.length > 1) {
      response += `Quý khách có thể xem thêm các bài viết báo chí và tư liệu bách khoa ở phần **Dữ liệu tra cứu trên mạng** đính kèm bên dưới.\n\n`;
    }
  }

  // Kết hợp CSDL nội bộ
  if (dbContext.crafts.length > 0) {
    const c = dbContext.crafts[0];
    const priceStr = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(c.priceVnd);
    response += `Về kiệt tác trong CSDL CraftRoots: **${c.name}** (${c.originLine || c.region}).\n`;
    response += `Mức giá tham chiếu là **${priceStr}**, thuộc danh mục **${c.category}** với quy trình chế tác thủ công độc bản.\n`;
  } else if (dbContext.artisans.length > 0) {
    const a = dbContext.artisans[0];
    response += `Về nghệ nhân lưu trữ: Bậc thầy **${a.name}** (${a.title}).\n`;
    response += `Nghệ nhân có **${a.experience} năm kinh nghiệm**, thuộc đời thứ **${a.generation || 'truyền đời'}** tại làng nghề **${a.village || a.region}**.\n`;
  } else if (!webResults || webResults.length === 0) {
    response += `Cảm ơn quý khách đã quan tâm đến kho tàng thủ công truyền thống Việt Nam.\n`;
    response += `Quý khách có thể hỏi chi tiết về chất liệu, lịch sử làng nghề, nghệ nhân bậc thầy hoặc bật tính năng tra cứu mạng để cập nhật bài báo mới nhất.`;
  }

  if (showOllamaNotice) {
    response += `\n\n> 💡 *Ghi chú môi trường:* Để kích hoạt trí tuệ nhân tạo toàn diện bằng Ollama cục bộ, bạn hãy mở terminal và khởi chạy: \`ollama serve\` và \`ollama run qwen2.5:1.5b\`.`;
  }

  return response;
}

/**
 * Tạo câu hỏi gợi ý thông minh dựa trên Route và nội dung trang hiện tại
 */
function generateSuggestedQuestions(pageContext = {}) {
  const { currentPath = '', heading = '' } = pageContext;

  if (currentPath.startsWith('/crafts/')) {
    const item = heading || 'tác phẩm này';
    return [
      `Tra cứu trên mạng lịch sử và xuất xứ của ${item}`,
      `Quy trình 4 giai đoạn chế tác tác phẩm này`,
      `Nghệ nhân tạo tác nên kiệt tác này là ai?`,
      `Gợi ý các tác phẩm cùng chất liệu độc bản`
    ];
  }

  if (currentPath.startsWith('/artisans/')) {
    const artisanName = heading || 'nghệ nhân này';
    return [
      `Tra cứu trên mạng các phóng sự, bài báo về ${artisanName}`,
      `Số năm kinh nghiệm và đời truyền nghề của nghệ nhân`,
      `Hướng dẫn đặt lịch hẹn thăm xưởng thủ công`,
      `Các kiệt tác tiêu biểu do nghệ nhân chế tác`
    ];
  }

  if (currentPath === '/directory') {
    return [
      'Gợi ý bình gốm Bát Tràng độc bản',
      'Tra cứu trên mạng kỹ thuật khảm trai Chuôn Ngọ',
      'Sơn mài Hạ Thái có những loại nào?',
      'Tìm kiếm kiệt tác lụa tơ tằm Vạn Phúc'
    ];
  }

  if (currentPath === '/regions') {
    return [
      'Đặc trưng thủ công vùng Đồng Bằng Bắc Bộ',
      'Tra cứu trên mạng các làng nghề di sản miền Trung',
      'Nghề đan lát mây tre vùng Nam Bộ',
      'Làng nghề cổ xưa nhất Việt Nam'
    ];
  }

  return [
    'Tra cứu trên mạng lịch sử gốm Bát Tràng',
    'Nghệ nhân gốm nào có trên 40 năm kinh nghiệm?',
    'Tìm hiểu quy trình chế tác tranh sơn mài',
    'Hướng dẫn đặt lịch thăm xưởng thủ công'
  ];
}

module.exports = {
  checkOllamaHealth,
  processChatMessage,
  searchDatabaseContext
};

