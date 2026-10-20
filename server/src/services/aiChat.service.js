const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const { Ollama } = require('ollama');
const db = require('../config/db');

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
    
    // Nếu có cụm từ "bát tràng", "vạn phúc", "hạ thái"... giữ nguyên cụm
    const phrases = [];
    if (normalizedQuery.includes('bát tràng')) phrases.push('%bát tràng%');
    if (normalizedQuery.includes('vạn phúc')) phrases.push('%vạn phúc%');
    if (normalizedQuery.includes('hạ thái')) phrases.push('%hạ thái%');
    if (normalizedQuery.includes('chuôn ngọ')) phrases.push('%chuôn ngọ%');
    if (normalizedQuery.includes('phú vinh')) phrases.push('%phú vinh%');
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

/**
 * Xử lý cuộc hội thoại với Ollama AI (hoặc Intelligent Local Fallback)
 */
async function processChatMessage({ sessionId, userId, message, pageContext }) {
  // 1. Đảm bảo phiên hội thoại tồn tại
  const sessionCheck = await db.query('SELECT id FROM chat_sessions WHERE id = $1', [sessionId]);
  if (sessionCheck.rows.length === 0) {
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

  // 3. Tra cứu dữ liệu từ 22 bảng CSDL CraftRoots
  const dbContext = await searchDatabaseContext(message);

  // Chuẩn bị rich cards trả về cho giao diện
  const richCards = [];
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

  // 4. Kiểm tra xem Ollama có đang chạy không
  const health = await checkOllamaHealth();
  let replyText = '';

  if (health.available) {
    // Ollama đang online -> Gọi mô hình Local LLM
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

      // Tạo System Prompt chứa tri thức thực tế
      const systemPrompt = `Bạn là "Trợ Lý Di Sản CraftRoots" – Chuyên gia tư vấn về nghề thủ công truyền thống Việt Nam.
Phong cách trả lời: Lịch thiệp, trang nhã, giàu niềm tự hào văn hóa, súc tích (dưới 150 từ).
Luôn ưu tiên dựa vào dữ liệu thực tế từ CSDL CraftRoots dưới đây:

[DỮ LIỆU CSDL CRAFTROOTS THỰC TẾ]:
- Sản phẩm gợi ý: ${JSON.stringify(dbContext.crafts, null, 2)}
- Nghệ nhân liên quan: ${JSON.stringify(dbContext.artisans, null, 2)}
- Làng nghề liên quan: ${JSON.stringify(dbContext.villages, null, 2)}

Hãy chào hỏi nhã nhặn, giải đáp câu hỏi của người dùng và hướng dẫn họ xem chi tiết tác phẩm hoặc nghệ nhân nếu phù hợp.`;

      // Chọn model có sẵn thực tế trong Ollama
      const matched = health.models.find(m => m.name.includes(LOCAL_MODEL));
      const activeModel = matched ? matched.name : (health.models[0]?.name || LOCAL_MODEL);

      const response = await ollama.chat({
        model: activeModel,
        messages: [
          { role: 'system', content: systemPrompt },
          ...pastMessages
        ],
      });

      replyText = response.message.content;
    } catch (ollamaErr) {
      console.warn('Ollama chat error, chuyển sang chế độ phản hồi di sản thông minh:', ollamaErr.message);
      replyText = generateHeritageResponse(message, dbContext);
    }
  } else {
    // Ollama chưa bật -> Trả về câu trả lời thông minh dựa trên dữ liệu thật + thông báo trạng thái
    replyText = generateHeritageResponse(message, dbContext, true);
  }

  // 5. Câu hỏi gợi ý tiếp theo
  const suggestedQuestions = [
    "Khám phá các kiệt tác gốm sứ Bát Tràng",
    "Tìm hiểu nghệ nhân ưu tú làm tranh sơn mài",
    "Hướng dẫn đặt lịch thăm xưởng thủ công",
    "Bản đồ 6 vùng di sản văn hóa Việt Nam"
  ];

  // 6. Lưu tin nhắn của Assistant vào PostgreSQL
  await db.query(
    'INSERT INTO chat_messages (session_id, sender_role, content, rich_cards) VALUES ($1, $2, $3, $4)',
    [sessionId, 'assistant', replyText, JSON.stringify(richCards)]
  );

  return {
    sessionId,
    reply: replyText,
    richCards,
    suggestedQuestions,
    aiProvider: health.available ? `Ollama Local (${LOCAL_MODEL})` : 'CraftRoots Heritage Engine (CSDL Direct)',
    isLocalOllama: health.available
  };
}

/**
 * Trình sinh câu trả lời di sản thông minh dựa trên dữ liệu CSDL thực tế
 */
function generateHeritageResponse(message, dbContext, showOllamaNotice = false) {
  let response = `Kính chào quý khách! Tôi là **Trợ Lý Di Sản CraftRoots**.\n\n`;

  if (dbContext.crafts.length > 0) {
    const c = dbContext.crafts[0];
    const priceStr = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(c.priceVnd);
    response += `Theo dữ liệu di sản của CraftRoots, tôi xin gợi ý kiệt tác **${c.name}** (${c.originLine || c.region}).\n`;
    response += `Tác phẩm có mức giá tham chiếu là **${priceStr}**, thuộc danh mục **${c.category}** với quy trình chế tác thủ công cầu kỳ.\n\n`;
    response += `Quý khách có thể bấm vào thẻ bên dưới để xem thông số kích thước, kỹ pháp và 4 giai đoạn hoàn thiện chi tiết.`;
  } else if (dbContext.artisans.length > 0) {
    const a = dbContext.artisans[0];
    response += `Về nghệ nhân, CraftRoots vinh danh **${a.name}** (${a.title}).\n`;
    response += `Bậc thầy có **${a.experience} năm kinh nghiệm**, thuộc đời thứ **${a.generation || 'truyền đời'}** tại **${a.village || a.region}**.\n\n`;
    response += `Quý khách có thể xem hồ sơ hoặc đặt lịch hẹn đến thăm xưởng của nghệ nhân qua thẻ thông tin đính kèm.`;
  } else {
    response += `Cảm ơn quý khách đã quan tâm đến kho tàng thủ công truyền thống Việt Nam.\n\n`;
    response += `Quý khách có thể tra cứu các kiệt tác gốm men rạn Bát Tràng, sơn mài Hạ Thái, lụa Vạn Phúc, khảm trai Chuôn Ngọ hoặc tìm hiểu về 6 vùng di sản văn hóa trải dài khắp đất nước.`;
  }

  if (showOllamaNotice) {
    response += `\n\n> 💡 *Ghi chú môi trường:* Để kích hoạt trí tuệ nhân tạo toàn diện bằng Ollama cục bộ, bạn hãy mở terminal và khởi chạy: \`ollama run qwen2.5:3b\`.`;
  }

  return response;
}

module.exports = {
  checkOllamaHealth,
  processChatMessage,
  searchDatabaseContext
};
