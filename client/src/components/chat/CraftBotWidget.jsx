import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../../services/api';

export default function CraftBotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [aiStatus, setAiStatus] = useState(null);
  const [hasUnread, setHasUnread] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Khởi tạo sessionId duy nhất lưu trong localStorage
  useEffect(() => {
    let storedSessionId = localStorage.getItem('craftroots_ai_session_id');
    if (!storedSessionId) {
      storedSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('craftroots_ai_session_id', storedSessionId);
    }
    setSessionId(storedSessionId);

    // Kiểm tra trạng thái Ollama Local
    api.getAiStatus()
      .then(res => setAiStatus(res))
      .catch(() => setAiStatus({ available: false }));

    // Tin nhắn chào mừng ban đầu
    const initialGreeting = {
      id: 'welcome',
      role: 'assistant',
      content: `Kính chào quý khách! Tôi là **Trợ Lý Di Sản CraftRoots**, được vận hành trực tiếp bằng **Ollama AI (Local)**.\n\nTôi có thể hỗ trợ quý khách:\n- Tìm kiếm kiệt tác theo chất liệu, mức giá & vùng miền\n- Tra cứu hồ sơ các nghệ nhân bậc thầy\n- Tìm hiểu lịch sử làng nghề & quy trình 4 giai đoạn chế tác\n- Hướng dẫn đặt lịch hẹn thăm xưởng thủ công`,
      richCards: [],
      suggestedQuestions: [
        'Gợi ý bình gốm Bát Tràng độc bản',
        'Nghệ nhân gốm nào có trên 40 năm kinh nghiệm?',
        'Có những làng nghề nào ở Đồng Bằng Bắc Bộ?',
        'Hướng dẫn đặt lịch thăm xưởng thủ công'
      ],
      createdAt: new Date().toISOString()
    };

    // Nạp lịch sử chat nếu có
    api.getAiHistory(storedSessionId)
      .then(res => {
        if (res && res.messages && res.messages.length > 0) {
          setMessages(res.messages);
        } else {
          setMessages([initialGreeting]);
        }
      })
      .catch(() => {
        setMessages([initialGreeting]);
      });
  }, []);

  // Tự động cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
      setHasUnread(false);
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (customText = null) => {
    const textToSend = (customText || input).trim();
    if (!textToSend || isLoading) return;

    const userMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: textToSend,
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await api.chatAi({
        sessionId,
        message: textToSend,
        pageContext: { currentPath: location.pathname }
      });

      const aiReply = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: response.reply,
        richCards: response.richCards || [],
        suggestedQuestions: response.suggestedQuestions || [],
        aiProvider: response.aiProvider,
        createdAt: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiReply]);
      if (!isOpen) setHasUnread(true);
    } catch (err) {
      const errorReply = {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content: `Dạ, hiện tại có chút gián đoạn khi kết nối tới hệ thống AI. Chi tiết: ${err.message}. Quý khách vui lòng thử lại sau giây lát.`,
        richCards: [],
        createdAt: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorReply]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearHistory = async () => {
    if (window.confirm('Quý khách có chắc chắn muốn làm mới cuộc trò chuyện này?')) {
      try {
        await api.deleteAiHistory(sessionId);
        const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        localStorage.setItem('craftroots_ai_session_id', newSessionId);
        setSessionId(newSessionId);
        setMessages([
          {
            id: 'welcome_new',
            role: 'assistant',
            content: 'Cuộc trò chuyện đã được làm mới. Tôi có thể hỗ trợ gì cho quý khách về kho tàng di sản thủ công Việt Nam?',
            richCards: [],
            suggestedQuestions: [
              'Tác phẩm gốm sứ men rạn cổ',
              'Danh bạ nghệ nhân bậc thầy',
              'Khám phá lụa tơ tằm Vạn Phúc'
            ],
            createdAt: new Date().toISOString()
          }
        ]);
      } catch (err) {
        console.error('Lỗi xóa lịch sử:', err);
      }
    }
  };

  const formatPrice = (val) => {
    if (!val) return 'Liên hệ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  return (
    <>
      {/* 1. Nút bong bóng chat nổi ở góc dưới bên phải */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-accent-terracotta hover:bg-[#a84719] text-white shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none cursor-pointer border-2 border-surface-crisp"
        aria-label="Mở Trợ lý AI Di sản"
        title="Trợ Lý Di Sản CraftRoots AI"
      >
        {isOpen ? (
          <span className="material-symbols-outlined text-[26px]">close</span>
        ) : (
          <div className="relative flex items-center justify-center">
            <span className="material-symbols-outlined text-[28px]">smart_toy</span>
            {hasUnread && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
            )}
          </div>
        )}
      </button>

      {/* 2. Cửa sổ hộp thoại Chatbot */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-[420px] h-[580px] max-h-[80vh] bg-surface-crisp border border-border-neutral rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn font-body-default">
          {/* Header */}
          <div className="bg-canvas-linen border-b border-border-neutral px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-accent-terracotta text-white flex items-center justify-center shadow-inner">
                <span className="material-symbols-outlined text-[22px]">auto_awesome</span>
              </div>
              <div>
                <h3 className="font-serif font-bold text-text-primary text-[15px] leading-tight flex items-center gap-1.5">
                  Trợ Lý Di Sản AI
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500" title="Trạng thái: Hoạt động" />
                </h3>
                <p className="text-[11px] text-text-secondary leading-tight mt-0.5">
                  {aiStatus?.available ? (
                    <span className="text-emerald-700 font-medium">Ollama Local ({aiStatus.recommendedModel || 'Qwen 2.5'})</span>
                  ) : (
                    <span>Tra cứu CSDL Di sản trực tiếp</span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={handleClearHistory}
                className="p-1.5 text-text-secondary hover:text-accent-terracotta hover:bg-black/5 rounded-lg transition-colors cursor-pointer"
                title="Làm mới cuộc trò chuyện"
                aria-label="Xóa lịch sử"
              >
                <span className="material-symbols-outlined text-[18px]">refresh</span>
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-black/5 rounded-lg transition-colors cursor-pointer"
                title="Thu nhỏ cửa sổ"
                aria-label="Đóng chat"
              >
                <span className="material-symbols-outlined text-[20px]">expand_more</span>
              </button>
            </div>
          </div>

          {/* Danh sách tin nhắn */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-canvas-linen/40">
            {messages.map((msg, index) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id || index}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-full`}
                >
                  <div
                    className={`p-3.5 rounded-2xl max-w-[88%] text-[13.5px] leading-relaxed shadow-sm ${
                      isUser
                        ? 'bg-accent-terracotta text-white rounded-tr-none'
                        : 'bg-surface-crisp text-text-primary border border-border-neutral rounded-tl-none'
                    }`}
                  >
                    {/* Nội dung tin nhắn (hỗ trợ hiển thị Markdown cơ bản) */}
                    <div className="whitespace-pre-wrap break-words">
                      {msg.content}
                    </div>

                    {/* Rich Cards (Thẻ kiệt tác hoặc nghệ nhân gợi ý) */}
                    {msg.richCards && msg.richCards.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-border-neutral/60 space-y-2">
                        <div className="text-[11px] font-semibold tracking-wider uppercase text-text-secondary">
                          Tác phẩm & Nghệ nhân liên quan:
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          {msg.richCards.map((card, cIdx) => (
                            <div
                              key={cIdx}
                              onClick={() => {
                                if (card.url) {
                                  navigate(card.url);
                                  setIsOpen(false);
                                }
                              }}
                              className="flex items-center gap-2.5 p-2 bg-canvas-linen/80 hover:bg-canvas-linen border border-border-neutral rounded-lg cursor-pointer transition-all hover:border-accent-terracotta group"
                            >
                              {card.thumbnailUrl ? (
                                <img
                                  src={card.thumbnailUrl}
                                  alt={card.name}
                                  className="w-12 h-12 object-cover rounded border border-border-neutral flex-shrink-0"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded bg-accent-terracotta/10 text-accent-terracotta flex items-center justify-center flex-shrink-0">
                                  <span className="material-symbols-outlined text-[20px]">
                                    {card.type === 'artisan' ? 'person' : 'palette'}
                                  </span>
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="font-serif font-bold text-text-primary text-xs truncate group-hover:text-accent-terracotta transition-colors">
                                  {card.name}
                                </div>
                                <div className="text-[11px] text-text-secondary truncate">
                                  {card.type === 'artisan'
                                    ? `${card.title || 'Nghệ nhân'} • ${card.experience || 0} năm nghề`
                                    : `${card.region || ''} • ${formatPrice(card.priceVnd)}`}
                                </div>
                              </div>
                              <span className="material-symbols-outlined text-text-secondary group-hover:text-accent-terracotta text-[18px]">
                                chevron_right
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Câu hỏi gợi ý nhanh (chỉ hiển thị dưới tin nhắn cuối cùng của Assistant) */}
                  {!isUser && msg.suggestedQuestions && index === messages.length - 1 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-[90%]">
                      {msg.suggestedQuestions.map((q, qIdx) => (
                        <button
                          key={qIdx}
                          type="button"
                          onClick={() => handleSendMessage(q)}
                          className="text-[11.5px] bg-surface-crisp border border-border-neutral hover:border-accent-terracotta hover:text-accent-terracotta text-text-secondary rounded-full px-2.5 py-1 transition-all text-left cursor-pointer shadow-2xs"
                        >
                          💬 {q}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Hiệu ứng gõ phím khi đang chờ AI phản hồi */}
            {isLoading && (
              <div className="flex items-center space-x-1.5 p-3 bg-surface-crisp border border-border-neutral rounded-2xl rounded-tl-none w-20 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-accent-terracotta animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-accent-terracotta animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-accent-terracotta animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Khung nhập tin nhắn */}
          <div className="p-3 bg-surface-crisp border-t border-border-neutral">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Hỏi về gốm sứ, lụa, nghệ nhân, giá cả..."
                disabled={isLoading}
                className="flex-1 bg-canvas-linen border border-border-neutral focus:border-accent-terracotta focus:ring-1 focus:ring-accent-terracotta rounded-xl px-3.5 py-2.5 text-xs sm:text-[13px] text-text-primary placeholder:text-text-secondary/70 focus:outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 rounded-xl bg-accent-terracotta hover:bg-[#a84719] disabled:bg-border-neutral disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors cursor-pointer shadow-sm flex-shrink-0"
                aria-label="Gửi tin nhắn"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>
            </form>
            <div className="flex items-center justify-between text-[10px] text-text-secondary mt-1.5 px-1">
              <span>Nhấn Enter để gửi</span>
              <span>CraftRoots AI Concierge • 100% Local</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
