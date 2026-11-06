const db = require('../config/db');
const slugify = require('../utils/slugify');

/**
 * Danh sách định nghĩa các API Tool (OpenAI/Ollama Function Calling schema)
 */
const toolsList = [
  // 1. CREATE BOOKING (Đặt lịch hẹn thăm xưởng)
  {
    type: 'function',
    function: {
      name: 'create_booking',
      description: 'Đăng ký đặt lịch hẹn đàm đạo trà & thăm xưởng nghệ nhân di sản',
      parameters: {
        type: 'object',
        properties: {
          artisanId: { type: 'number', description: 'ID nghệ nhân muốn thăm xưởng' },
          artisanName: { type: 'string', description: 'Tên nghệ nhân (nếu không biết ID)' },
          fullName: { type: 'string', description: 'Họ và tên khách tham quan' },
          phone: { type: 'string', description: 'Số điện thoại liên hệ' },
          email: { type: 'string', description: 'Địa chỉ email' },
          visitDate: { type: 'string', description: 'Ngày hẹn thăm xưởng (định dạng YYYY-MM-DD)' },
          timeSlot: { type: 'string', enum: ['morning', 'afternoon'], description: 'Khung giờ: sáng (morning) hoặc chiều (afternoon)' },
          purpose: { type: 'string', description: 'Mục đích chuyến thăm (ví dụ: Tìm hiểu kỹ thuật men rạn, đàm đạo trà, đặt chế tác độc bản)' },
          note: { type: 'string', description: 'Ghi chú thêm của khách' }
        },
        required: ['fullName', 'phone', 'visitDate']
      }
    }
  },

  // 2. READ BOOKINGS (Tra cứu lịch hẹn)
  {
    type: 'function',
    function: {
      name: 'get_bookings',
      description: 'Tra cứu danh sách phiếu hẹn thăm xưởng theo số điện thoại, email hoặc mã phiếu',
      parameters: {
        type: 'object',
        properties: {
          phone: { type: 'string', description: 'Số điện thoại của khách' },
          email: { type: 'string', description: 'Email của khách' },
          bookingId: { type: 'number', description: 'Mã số phiếu hẹn cần tra cứu' }
        }
      }
    }
  },

  // 3. CANCEL BOOKING (Hủy lịch hẹn)
  {
    type: 'function',
    function: {
      name: 'cancel_booking',
      description: 'Hủy phiếu hẹn thăm xưởng nghệ nhân',
      parameters: {
        type: 'object',
        properties: {
          bookingId: { type: 'number', description: 'Mã số phiếu hẹn (ID)' },
          reason: { type: 'string', description: 'Lý do hủy hẹn' }
        },
        required: ['bookingId']
      }
    }
  },

  // 4. CREATE CRAFT (Thêm mới kiệt tác)
  {
    type: 'function',
    function: {
      name: 'create_craft',
      description: 'Thêm mới một tác phẩm thủ công di sản vào hệ thống CSDL',
      parameters: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Tên tác phẩm' },
          priceVnd: { type: 'number', description: 'Giá bán tham chiếu (VNĐ)' },
          shortDescription: { type: 'string', description: 'Mô tả ngắn gọn về tác phẩm' },
          originLine: { type: 'string', description: 'Dòng xuất xứ (ví dụ: Gốm Bát Tràng, Hà Nội)' },
          categoryName: { type: 'string', description: 'Tên thể loại (Gốm sứ, Lụa tơ tằm, Sơn mài, v.v.)' },
          regionName: { type: 'string', description: 'Vùng miền (Đồng Bằng Bắc Bộ, Miền Trung, v.v.)' },
          dimensions: { type: 'string', description: 'Kích thước tác phẩm' }
        },
        required: ['name', 'priceVnd']
      }
    }
  },

  // 5. UPDATE CRAFT (Cập nhật tác phẩm)
  {
    type: 'function',
    function: {
      name: 'update_craft',
      description: 'Cập nhật giá, mô tả hoặc thông tin tác phẩm thủ công',
      parameters: {
        type: 'object',
        properties: {
          craftId: { type: 'number', description: 'ID tác phẩm cần cập nhật' },
          craftName: { type: 'string', description: 'Tên tác phẩm (nếu không rõ ID)' },
          priceVnd: { type: 'number', description: 'Giá bán mới (VNĐ)' },
          shortDescription: { type: 'string', description: 'Mô tả mới' },
          isSpotlight: { type: 'boolean', description: 'Đánh dấu kiệt tác tiêu biểu' }
        }
      }
    }
  },

  // 6. DELETE CRAFT (Xóa tác phẩm)
  {
    type: 'function',
    function: {
      name: 'delete_craft',
      description: 'Xóa tác phẩm thủ công khỏi kho lưu trữ hệ thống',
      parameters: {
        type: 'object',
        properties: {
          craftId: { type: 'number', description: 'ID tác phẩm cần xóa' },
          craftName: { type: 'string', description: 'Tên tác phẩm (nếu không rõ ID)' }
        }
      }
    }
  },

  // 7. CREATE ARTISAN (Thêm hồ sơ nghệ nhân)
  {
    type: 'function',
    function: {
      name: 'create_artisan',
      description: 'Tạo hồ sơ vinh danh nghệ nhân thủ công mới',
      parameters: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Họ và tên nghệ nhân' },
          title: { type: 'string', description: 'Danh hiệu (Nghệ nhân Nhân dân, Nghệ nhân Ưu tú...)' },
          yearsOfExperience: { type: 'number', description: 'Số năm kinh nghiệm làm nghề' },
          biography: { type: 'string', description: 'Tiểu sử và truyền đời làm nghề' },
          specialty: { type: 'string', description: 'Sở trường kỹ pháp' }
        },
        required: ['name']
      }
    }
  },

  // 8. UPDATE ARTISAN (Cập nhật hồ sơ nghệ nhân)
  {
    type: 'function',
    function: {
      name: 'update_artisan',
      description: 'Cập nhật thông tin hồ sơ nghệ nhân',
      parameters: {
        type: 'object',
        properties: {
          artisanId: { type: 'number', description: 'ID nghệ nhân' },
          artisanName: { type: 'string', description: 'Tên nghệ nhân (nếu không rõ ID)' },
          title: { type: 'string', description: 'Danh hiệu mới' },
          yearsOfExperience: { type: 'number', description: 'Số năm kinh nghiệm mới' },
          biography: { type: 'string', description: 'Tiểu sử cập nhật' }
        }
      }
    }
  },

  // 9. DELETE ARTISAN (Xóa hồ sơ nghệ nhân)
  {
    type: 'function',
    function: {
      name: 'delete_artisan',
      description: 'Xóa hồ sơ nghệ nhân khỏi hệ thống',
      parameters: {
        type: 'object',
        properties: {
          artisanId: { type: 'number', description: 'ID nghệ nhân cần xóa' },
          artisanName: { type: 'string', description: 'Tên nghệ nhân (nếu không rõ ID)' }
        }
      }
    }
  },

  // 10. ADD FAVOURITE (Thêm yêu thích)
  {
    type: 'function',
    function: {
      name: 'add_favourite',
      description: 'Lưu tác phẩm thủ công vào danh sách yêu thích của người dùng',
      parameters: {
        type: 'object',
        properties: {
          craftId: { type: 'number', description: 'ID tác phẩm' },
          craftName: { type: 'string', description: 'Tên tác phẩm' }
        }
      }
    }
  }
];

/**
 * Trình thực thi các thao tác CRUD từ Agent Function Calling
 */
// Phân quyền công cụ AI — khớp với RBAC của REST API (authorize middleware)
const TOOL_PERMISSIONS = {
  create_craft: ['editor', 'admin'],
  update_craft: ['editor', 'admin'],
  delete_craft: ['admin'],
  create_artisan: ['editor', 'admin'],
  update_artisan: ['editor', 'admin'],
  delete_artisan: ['admin'],
};
// Các công cụ yêu cầu đăng nhập (mọi vai trò)
const LOGIN_REQUIRED_TOOLS = ['get_bookings', 'cancel_booking', 'add_favourite'];

async function executeTool(toolName, args = {}, context = {}) {
  const { userId, userRole = 'guest', pageContext = {} } = context;
  const isPrivileged = userRole === 'admin' || userRole === 'editor';

  const allowedRoles = TOOL_PERMISSIONS[toolName];
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return {
      success: false,
      message: `Bạn không có quyền thực hiện thao tác này. Yêu cầu quyền: [${allowedRoles.join(', ')}].`,
    };
  }
  if (LOGIN_REQUIRED_TOOLS.includes(toolName) && !userId) {
    return { success: false, message: 'Vui lòng đăng nhập để thực hiện thao tác này.' };
  }

  try {
    switch (toolName) {
      // ==========================================
      // 1. CREATE BOOKING
      // ==========================================
      case 'create_booking': {
        let artisanId = args.artisanId;
        let artisanName = args.artisanName;

        // Nếu chưa có artisanId nhưng có tên hoặc đang ở trang nghệ nhân/tác phẩm
        if (!artisanId) {
          const targetName = artisanName || (pageContext.entityType === 'artisan' ? pageContext.heading : null);
          if (targetName) {
            const findArtisan = await db.query(
              'SELECT id, name FROM artisans WHERE name ILIKE $1 LIMIT 1',
              [`%${targetName}%`]
            );
            if (findArtisan.rowCount > 0) {
              artisanId = findArtisan.rows[0].id;
              artisanName = findArtisan.rows[0].name;
            }
          }
        }

        // Nếu vẫn không có nghệ nhân, lấy nghệ nhân mặc định đầu tiên
        if (!artisanId) {
          const defaultArtisan = await db.query('SELECT id, name FROM artisans ORDER BY id ASC LIMIT 1');
          if (defaultArtisan.rowCount > 0) {
            artisanId = defaultArtisan.rows[0].id;
            artisanName = defaultArtisan.rows[0].name;
          }
        }

        const fullName = args.fullName || 'Khách Quý';
        const phone = args.phone || '0900000000';
        const email = args.email || (context.userEmail || null);
        const visitDate = args.visitDate || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];
        if (!/^\d{4}-\d{2}-\d{2}/.test(String(visitDate)) || isNaN(new Date(visitDate).getTime())) {
          return { success: false, message: 'Ngày hẹn không hợp lệ (định dạng YYYY-MM-DD).' };
        }
        if (String(visitDate).slice(0, 10) <= new Date().toISOString().slice(0, 10)) {
          return { success: false, message: 'Ngày hẹn phải từ ngày mai trở đi.' };
        }
        const timeSlot = args.timeSlot === 'afternoon' ? 'afternoon' : 'morning';
        const purpose = args.purpose || 'Đàm đạo trà & Tìm hiểu kỹ pháp chế tác di sản';
        const note = args.note || 'Đặt qua Trợ Lý Di Sản CraftRoots AI Agent';

        const insertSql = `
          INSERT INTO visit_bookings (
            artisan_id, user_id, full_name, phone, email,
            visit_date, time_slot, purpose, note, status
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending')
          RETURNING id, artisan_id, full_name, phone, visit_date, time_slot, status, created_at
        `;

        const res = await db.query(insertSql, [
          artisanId, userId || null, fullName, phone, email, visitDate, timeSlot, purpose, note
        ]);

        const booking = res.rows[0];
        return {
          success: true,
          action: 'create_booking',
          message: `Đã tạo thành công phiếu hẹn thăm xưởng #${booking.id}!`,
          data: {
            bookingId: booking.id,
            artisanName,
            fullName: booking.full_name,
            phone: booking.phone,
            visitDate: booking.visit_date,
            timeSlot: booking.time_slot === 'morning' ? 'Buổi sáng (08:30 - 11:30)' : 'Buổi chiều (14:00 - 17:00)',
            status: 'pending (Chờ nghệ nhân xác nhận)'
          }
        };
      }

      // ==========================================
      // 2. READ BOOKINGS
      // ==========================================
      case 'get_bookings': {
        const { phone, email, bookingId } = args;
        let query = `
          SELECT vb.id, vb.full_name AS "fullName", vb.phone, vb.email, 
                 to_char(vb.visit_date, 'YYYY-MM-DD') AS "visitDate", 
                 vb.time_slot AS "timeSlot", vb.status, vb.purpose,
                 a.name AS "artisanName"
          FROM visit_bookings vb
          JOIN artisans a ON vb.artisan_id = a.id
          WHERE 1=1
        `;
        const params = [];

        // Người dùng thường chỉ được xem phiếu hẹn của chính mình
        if (!isPrivileged) {
          params.push(userId);
          query += ` AND vb.user_id = $${params.length}`;
        }

        if (bookingId) {
          params.push(parseInt(bookingId, 10) || 0);
          query += ` AND vb.id = $${params.length}`;
        } else if (isPrivileged && phone) {
          params.push(`%${String(phone).trim()}%`);
          query += ` AND vb.phone ILIKE $${params.length}`;
        } else if (isPrivileged && email) {
          params.push(`%${String(email).trim()}%`);
          query += ` AND vb.email ILIKE $${params.length}`;
        }
        query += ` ORDER BY vb.created_at DESC LIMIT 20`;

        const res = await db.query(query, params);
        return {
          success: true,
          action: 'get_bookings',
          count: res.rowCount,
          data: res.rows
        };
      }

      // ==========================================
      // 3. CANCEL BOOKING
      // ==========================================
      case 'cancel_booking': {
        const { bookingId, reason } = args;
        if (!bookingId) {
          return { success: false, message: 'Vui lòng cung cấp mã số phiếu hẹn (bookingId) cần hủy.' };
        }

        const updateRes = await db.query(
          `UPDATE visit_bookings 
           SET status = 'cancelled', admin_note = COALESCE(admin_note, '') || $2, updated_at = NOW()
           WHERE id = $1 AND ($3::boolean OR user_id = $4)
           RETURNING id, full_name, status`,
          [
            parseInt(bookingId, 10) || 0,
            reason ? ` | Hủy bởi khách: ${reason}` : ' | Hủy qua AI Agent',
            isPrivileged,
            userId,
          ]
        );

        if (updateRes.rowCount === 0) {
          return { success: false, message: `Không tìm thấy phiếu hẹn #${bookingId}.` };
        }

        return {
          success: true,
          action: 'cancel_booking',
          message: `Đã hủy thành công phiếu hẹn #${bookingId}.`,
          data: updateRes.rows[0]
        };
      }

      // ==========================================
      // 4. CREATE CRAFT
      // ==========================================
      case 'create_craft': {
        const { name, priceVnd, shortDescription, originLine, dimensions, regionName, categoryName } = args;
        if (!name || !priceVnd) {
          return { success: false, message: 'Tên tác phẩm và giá bán là bắt buộc.' };
        }

        // Lấy region_id và category_id mặc định nếu không truyền
        let regionId = 1;
        if (regionName) {
          const rRes = await db.query('SELECT id FROM regions WHERE name ILIKE $1 LIMIT 1', [`%${regionName}%`]);
          if (rRes.rowCount > 0) regionId = rRes.rows[0].id;
        }

        let categoryId = 1;
        if (categoryName) {
          const cRes = await db.query('SELECT id FROM craft_categories WHERE name ILIKE $1 LIMIT 1', [`%${categoryName}%`]);
          if (cRes.rowCount > 0) categoryId = cRes.rows[0].id;
        }

        const craftSlug = `${slugify(name)}-${Date.now().toString().slice(-4)}`;
        const code = `CR-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

        const insertSql = `
          INSERT INTO crafts (
            name, slug, code, region_id, category_id,
            price_vnd, short_description, origin_line, dimensions,
            is_featured, is_spotlight, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true, false, NOW(), NOW())
          RETURNING id, name, slug, code, price_vnd AS "priceVnd"
        `;

        const res = await db.query(insertSql, [
          name.trim(), craftSlug, code, regionId, categoryId,
          priceVnd, shortDescription || `Tác phẩm ${name} được chế tác thủ công độc bản.`,
          originLine || 'Việt Nam', dimensions || 'Theo tiêu chuẩn nghệ nhân'
        ]);

        return {
          success: true,
          action: 'create_craft',
          message: `Đã thêm mới kiệt tác "${res.rows[0].name}" (Mã: ${res.rows[0].code}) vào CSDL!`,
          data: res.rows[0]
        };
      }

      // ==========================================
      // 5. UPDATE CRAFT
      // ==========================================
      case 'update_craft': {
        const { craftId, craftName, priceVnd, shortDescription, isSpotlight } = args;
        let targetId = craftId;

        if (!targetId && craftName) {
          const findCraft = await db.query('SELECT id FROM crafts WHERE name ILIKE $1 LIMIT 1', [`%${craftName}%`]);
          if (findCraft.rowCount > 0) targetId = findCraft.rows[0].id;
        }

        // Nếu đang ở trang chi tiết sản phẩm và không có ID, dùng ID từ URL
        if (!targetId && pageContext.currentPath?.startsWith('/crafts/')) {
          const match = pageContext.currentPath.match(/\/crafts\/(\d+)/);
          if (match) targetId = parseInt(match[1], 10);
        }

        if (!targetId) {
          return { success: false, message: 'Vui lòng cung cấp ID hoặc tên tác phẩm cần cập nhật.' };
        }

        const updates = [];
        const params = [targetId];

        if (priceVnd !== undefined) {
          params.push(priceVnd);
          updates.push(`price_vnd = $${params.length}`);
        }
        if (shortDescription !== undefined) {
          params.push(shortDescription);
          updates.push(`short_description = $${params.length}`);
        }
        if (isSpotlight !== undefined) {
          params.push(isSpotlight);
          updates.push(`is_spotlight = $${params.length}`);
        }

        if (updates.length === 0) {
          return { success: false, message: 'Không có thông tin mới nào được cung cấp để cập nhật.' };
        }

        updates.push(`updated_at = NOW()`);

        const sql = `UPDATE crafts SET ${updates.join(', ')} WHERE id = $1 RETURNING id, name, price_vnd AS "priceVnd", short_description AS "shortDescription"`;
        const res = await db.query(sql, params);

        if (res.rowCount === 0) {
          return { success: false, message: `Không tìm thấy tác phẩm với ID ${targetId}.` };
        }

        return {
          success: true,
          action: 'update_craft',
          message: `Đã cập nhật thành công tác phẩm "${res.rows[0].name}"!`,
          data: res.rows[0]
        };
      }

      // ==========================================
      // 6. DELETE CRAFT
      // ==========================================
      case 'delete_craft': {
        const { craftId, craftName } = args;
        let targetId = craftId;

        if (!targetId && craftName) {
          const findCraft = await db.query('SELECT id, name FROM crafts WHERE name ILIKE $1 LIMIT 1', [`%${craftName}%`]);
          if (findCraft.rowCount > 0) targetId = findCraft.rows[0].id;
        }

        if (!targetId) {
          return { success: false, message: 'Vui lòng cung cấp ID hoặc tên tác phẩm cần xóa.' };
        }

        const res = await db.query('DELETE FROM crafts WHERE id = $1 RETURNING id, name', [targetId]);
        if (res.rowCount === 0) {
          return { success: false, message: `Không tìm thấy tác phẩm với ID ${targetId} để xóa.` };
        }

        return {
          success: true,
          action: 'delete_craft',
          message: `Đã xóa tác phẩm "${res.rows[0].name}" (ID #${targetId}) khỏi hệ thống.`,
          data: res.rows[0]
        };
      }

      // ==========================================
      // 7. CREATE ARTISAN
      // ==========================================
      case 'create_artisan': {
        const { name, title, yearsOfExperience, biography, specialty } = args;
        if (!name) return { success: false, message: 'Tên nghệ nhân là bắt buộc.' };

        const artisanSlug = `${slugify(name)}-${Date.now().toString().slice(-4)}`;
        const code = `ART-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

        const insertSql = `
          INSERT INTO artisans (
            name, slug, code, region_id, title, years_of_experience,
            biography, specialty, created_at
          ) VALUES ($1, $2, $3, 1, $4, $5, $6, $7, NOW())
          RETURNING id, name, title, years_of_experience AS "experience"
        `;

        const res = await db.query(insertSql, [
          name.trim(), artisanSlug, code,
          title || 'Nghệ nhân Di sản',
          yearsOfExperience || 20,
          biography || `Nghệ nhân ${name} có nhiều năm cống hiến bảo tồn nghề thủ công truyền thống.`,
          specialty || 'Kỹ pháp thủ công truyền thống'
        ]);

        return {
          success: true,
          action: 'create_artisan',
          message: `Đã tạo thành công hồ sơ nghệ nhân "${res.rows[0].name}"!`,
          data: res.rows[0]
        };
      }

      // ==========================================
      // 8. UPDATE ARTISAN
      // ==========================================
      case 'update_artisan': {
        const { artisanId, artisanName, title, yearsOfExperience, biography } = args;
        let targetId = artisanId;

        if (!targetId && artisanName) {
          const findA = await db.query('SELECT id FROM artisans WHERE name ILIKE $1 LIMIT 1', [`%${artisanName}%`]);
          if (findA.rowCount > 0) targetId = findA.rows[0].id;
        }

        if (!targetId) {
          return { success: false, message: 'Vui lòng cung cấp ID hoặc tên nghệ nhân cần cập nhật.' };
        }

        const updates = [];
        const params = [targetId];

        if (title !== undefined) {
          params.push(title);
          updates.push(`title = $${params.length}`);
        }
        if (yearsOfExperience !== undefined) {
          params.push(yearsOfExperience);
          updates.push(`years_of_experience = $${params.length}`);
        }
        if (biography !== undefined) {
          params.push(biography);
          updates.push(`biography = $${params.length}`);
        }

        if (updates.length === 0) {
          return { success: false, message: 'Không có dữ liệu mới để cập nhật.' };
        }

        const sql = `UPDATE artisans SET ${updates.join(', ')} WHERE id = $1 RETURNING id, name, title, years_of_experience AS "experience"`;
        const res = await db.query(sql, params);

        return {
          success: true,
          action: 'update_artisan',
          message: `Đã cập nhật hồ sơ nghệ nhân "${res.rows[0].name}" thành công!`,
          data: res.rows[0]
        };
      }

      // ==========================================
      // 9. DELETE ARTISAN
      // ==========================================
      case 'delete_artisan': {
        const { artisanId, artisanName } = args;
        let targetId = artisanId;

        if (!targetId && artisanName) {
          const findA = await db.query('SELECT id FROM artisans WHERE name ILIKE $1 LIMIT 1', [`%${artisanName}%`]);
          if (findA.rowCount > 0) targetId = findA.rows[0].id;
        }

        if (!targetId) {
          return { success: false, message: 'Vui lòng cung cấp ID hoặc tên nghệ nhân cần xóa.' };
        }

        const res = await db.query('DELETE FROM artisans WHERE id = $1 RETURNING id, name', [targetId]);
        if (res.rowCount === 0) {
          return { success: false, message: `Không tìm thấy nghệ nhân #${targetId}.` };
        }

        return {
          success: true,
          action: 'delete_artisan',
          message: `Đã xóa nghệ nhân "${res.rows[0].name}" khỏi hệ thống.`,
          data: res.rows[0]
        };
      }

      // ==========================================
      // 10. ADD FAVOURITE
      // ==========================================
      case 'add_favourite': {
        const { craftId, craftName } = args;
        let targetId = craftId;

        if (!targetId && craftName) {
          const findC = await db.query('SELECT id, name FROM crafts WHERE name ILIKE $1 LIMIT 1', [`%${craftName}%`]);
          if (findC.rowCount > 0) targetId = findC.rows[0].id;
        }

        if (!targetId) {
          return { success: false, message: 'Không xác định được tác phẩm để lưu yêu thích.' };
        }

        await db.query(
          'INSERT INTO favourites (user_id, craft_id, created_at) VALUES ($1, $2, NOW()) ON CONFLICT DO NOTHING',
          [userId, targetId]
        );

        const craftInfo = await db.query('SELECT id, name, price_vnd AS "priceVnd" FROM crafts WHERE id = $1', [targetId]);
        return {
          success: true,
          action: 'add_favourite',
          message: `Đã lưu kiệt tác "${craftInfo.rows[0]?.name || targetId}" vào danh sách yêu thích!`,
          data: craftInfo.rows[0]
        };
      }

      default:
        return { success: false, message: `Công cụ "${toolName}" chưa được hỗ trợ.` };
    }
  } catch (err) {
    console.error(`Lỗi thực thi tool [${toolName}]:`, err);
    return { success: false, error: err.message };
  }
}

/**
 * Trích xuất ý định CRUD từ phản hồi JSON của LLM hoặc từ câu lệnh tiếng Việt tự nhiên
 */
function detectCrudIntent(message, pageContext = {}, userContext = {}) {
  if (!message || typeof message !== 'string') return null;

  // 1. Kiểm tra khối JSON trong câu trả lời hoặc lệnh của người dùng
  const jsonMatch = message.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/) || message.match(/(\{(?:[^{}]*?"(?:tool|action|function)"[^{}]*?)\})/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[1]);
      const toolName = parsed.tool || parsed.action || parsed.name || parsed.function;
      const toolArgs = parsed.arguments || parsed.parameters || parsed.params || parsed.args || parsed.data || {};
      if (toolName) {
        return { toolName, args: toolArgs };
      }
    } catch {
      // bỏ qua nếu parse JSON lỗi
    }
  }

  // 2. Phân tích tự nhiên (Heuristic Intent Recognition)
  const lower = message.toLowerCase();

  // A. Đặt lịch hẹn thăm xưởng
  if (lower.includes('đặt lịch') || lower.includes('thăm xưởng') || lower.includes('đặt hẹn')) {
    // Trích xuất số điện thoại
    const phoneMatch = message.match(/(?:sđt|sdt|điện thoại|phone|số)?\s*[:=]?\s*(0\d{9}|\+84\d{9})/i);
    // Trích xuất ngày
    const ymdMatch = message.match(/(\d{4})[/-](\d{1,2})[/-](\d{1,2})/);
    const dmyMatch = message.match(/(\d{1,2})[/-](\d{1,2})[/-](\d{4})/);
    let visitDate = null;
    if (ymdMatch) {
      visitDate = `${ymdMatch[1]}-${ymdMatch[2].padStart(2, '0')}-${ymdMatch[3].padStart(2, '0')}`;
    } else if (dmyMatch) {
      visitDate = `${dmyMatch[3]}-${dmyMatch[2].padStart(2, '0')}-${dmyMatch[1].padStart(2, '0')}`;
    }
    // Trích xuất họ tên
    const nameMatch = message.match(/(?:tên|họ tên|khách|tôi là)\s*[:=]?\s*([A-ZÀ-Ỹa-zà-ỹ\s]{2,25})(?:,|-|\n|\.|\s(?:sđt|sdt|ngày|buổi))/i);

    const timeSlot = (lower.includes('chiều') || lower.includes('pm')) ? 'afternoon' : 'morning';

    if (phoneMatch || dateMatch) {
      return {
        toolName: 'create_booking',
        args: {
          fullName: nameMatch ? nameMatch[1].trim() : (userContext.userName || 'Khách Quý'),
          phone: phoneMatch ? phoneMatch[1] : (userContext.userPhone || '0900000000'),
          visitDate: visitDate || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
          timeSlot,
          artisanName: pageContext.entityType === 'artisan' ? pageContext.heading : null
        }
      };
    }
  }

  // B. Tra cứu lịch hẹn
  if ((lower.includes('xem lịch hẹn') || lower.includes('tra cứu lịch') || lower.includes('kiểm tra lịch')) && !lower.includes('hủy')) {
    const phoneMatch = message.match(/(0\d{9})/);
    const idMatch = message.match(/(?:phiếu|mã|số|id)\s*#?(\d+)/i);
    return {
      toolName: 'get_bookings',
      args: {
        phone: phoneMatch ? phoneMatch[1] : null,
        bookingId: idMatch ? parseInt(idMatch[1], 10) : null
      }
    };
  }

  // C. Hủy lịch hẹn
  if (lower.includes('hủy lịch') || lower.includes('hủy phiếu') || lower.includes('xóa lịch hẹn')) {
    const idMatch = message.match(/(?:phiếu|mã|số|id|hẹn)\s*#?(\d+)/i);
    if (idMatch) {
      return {
        toolName: 'cancel_booking',
        args: {
          bookingId: parseInt(idMatch[1], 10)
        }
      };
    }
  }

  // D. Cập nhật giá tác phẩm
  if (lower.includes('cập nhật giá') || lower.includes('sửa giá') || lower.includes('đổi giá') || lower.includes('chỉnh giá')) {
    const idMatch = message.match(/(?:tác phẩm|sản phẩm|kiệt tác|id)\s*#?(\d+)/i);
    const priceMatch = message.match(/(\d+(?:[.,]\d+)?)\s*(triệu|tr|vnd|đ|k)?/i);
    if (priceMatch) {
      let price = parseFloat(priceMatch[1].replace(/,/g, ''));
      const unit = (priceMatch[2] || '').toLowerCase();
      if (unit === 'triệu' || unit === 'tr') price *= 1000000;
      else if (unit === 'k') price *= 1000;

      return {
        toolName: 'update_craft',
        args: {
          craftId: idMatch ? parseInt(idMatch[1], 10) : null,
          priceVnd: price
        }
      };
    }
  }

  // E. Xóa tác phẩm
  if (lower.includes('xóa tác phẩm') || lower.includes('xóa sản phẩm') || lower.includes('xóa kiệt tác')) {
    const idMatch = message.match(/(?:tác phẩm|sản phẩm|kiệt tác|id)\s*#?(\d+)/i);
    if (idMatch) {
      return {
        toolName: 'delete_craft',
        args: {
          craftId: parseInt(idMatch[1], 10)
        }
      };
    }
  }

  // F. Lưu yêu thích
  if (lower.includes('yêu thích') || lower.includes('lưu tác phẩm') || lower.includes('thích tác phẩm')) {
    return {
      toolName: 'add_favourite',
      args: {
        craftName: pageContext.heading || null
      }
    };
  }

  return null;
}

module.exports = {
  toolsList,
  executeTool,
  detectCrudIntent
};

