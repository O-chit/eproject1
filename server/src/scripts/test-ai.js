const { checkOllamaHealth, processChatMessage } = require('../services/aiChat.service');

async function testAI() {
  console.log('🤖 Đang kiểm tra kết nối Ollama Local...');
  const health = await checkOllamaHealth();
  console.log('Ollama Health:', health);

  console.log('\n💬 Đang thử nghiệm gửi câu hỏi di sản...');
  const result = await processChatMessage({
    sessionId: 'test_session_local_01',
    message: 'Gợi ý cho tôi các sản phẩm gốm sứ Bát Tràng và giá cả',
    pageContext: { currentPath: '/' }
  });

  console.log('\n--- KẾT QUẢ PHẢN HỒI TỪ AI CHATBOT ---');
  console.log('Provider:', result.aiProvider);
  console.log('Rich Cards count:', result.richCards.length);
  console.log('Reply:\n', result.reply);
  console.log('---------------------------------------');
  process.exit(0);
}

testAI().catch(err => {
  console.error('Lỗi kiểm thử AI:', err);
  process.exit(1);
});
