import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../../services/api';
import { emitAgentCrudAction } from '../../services/liveAgentSync';

export default function CraftBotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [aiStatus, setAiStatus] = useState(null);
  const [hasUnread, setHasUnread] = useState(false);
  const [enableWebSearch, setEnableWebSearch] = useState(true);
  const [currentPageName, setCurrentPageName] = useState('');

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Identify current page title and route
  const updateCurrentPageInfo = useCallback(() => {
    const path = location.pathname;
    const h1 = document.querySelector('h1')?.innerText?.trim();
    if (h1) {
      setCurrentPageName(h1);
    } else if (path === '/') {
      setCurrentPageName('Home');
    } else if (path === '/directory' || path === '/crafts') {
      setCurrentPageName('Crafts Directory');
    } else if (path === '/artisans') {
      setCurrentPageName('Artisans Directory');
    } else if (path === '/regions') {
      setCurrentPageName('Heritage Map');
    } else if (path === '/seasonal') {
      setCurrentPageName('Seasonal Collections');
    } else if (path === '/contact') {
      setCurrentPageName('Contact & Booking');
    } else {
      setCurrentPageName(path);
    }
  }, [location.pathname]);

  useEffect(() => {
    const timer = setTimeout(updateCurrentPageInfo, 150);
    return () => clearTimeout(timer);
  }, [location.pathname, location.search, updateCurrentPageInfo]);

  // Extract detailed page context for AI Agent
  const getPageContext = () => {
    const path = location.pathname;
    const title = document.title || 'CraftRoots';
    const h1 = document.querySelector('h1')?.innerText?.trim() || '';
    const mainEl = document.querySelector('main');
    
    let entityType = 'general';
    let entityName = h1;
    let summary = '';

    if (path.startsWith('/crafts/')) {
      entityType = 'craft';
      summary = `Craft: ${h1}. ${mainEl?.innerText?.slice(0, 350) || ''}`;
    } else if (path.startsWith('/artisans/')) {
      entityType = 'artisan';
      summary = `Artisan profile: ${h1}. ${mainEl?.innerText?.slice(0, 350) || ''}`;
    } else if (path === '/directory' || path === '/crafts') {
      entityType = 'directory';
      summary = 'Vietnamese traditional craft heritage discovery directory.';
    } else if (path === '/artisans') {
      entityType = 'artisans_list';
      summary = 'Directory of elite and master artisans of Vietnam.';
    } else if (path === '/regions') {
      entityType = 'regions';
      summary = 'Map of Vietnamese cultural craft heritage regions.';
    } else if (path === '/seasonal') {
      entityType = 'seasonal';
      summary = 'Seasonal heritage collections.';
    } else {
      summary = mainEl?.innerText?.slice(0, 250) || title;
    }

    return {
      currentPath: path,
      search: location.search,
      pageTitle: title,
      heading: h1 || title,
      entityType,
      entityName: entityName || h1,
      summary: summary.replace(/\s+/g, ' ').trim(),
      enableWebSearch
    };
  };

  // Initialize unique sessionId in localStorage
  useEffect(() => {
    let storedSessionId = localStorage.getItem('craftroots_ai_session_id');
    if (!storedSessionId) {
      storedSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('craftroots_ai_session_id', storedSessionId);
    }
    setSessionId(storedSessionId);

    // Check Ollama Local status
    api.getAiStatus()
      .then(res => setAiStatus(res))
      .catch(() => setAiStatus({ available: false }));

    // Welcome greeting message
    const initialGreeting = {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I am your **CraftRoots Heritage Assistant** (powered by **Local AI Agent + CRUD APIs**).\n\nI can:\n- 🧭 **Recognize the current page** you are browsing to provide tailored recommendations\n- 🌐 **Search online (Wikipedia & reliable archives)** for the latest cultural research\n- ⚡ **Directly execute database operations**: Book artisan studio visits, check reservations, update craft details, or save your favorites!`,
      richCards: [],
      suggestedQuestions: [
        'Book an artisan studio visit (Nguyen Van An, Phone 0912345678, Nov 20)',
        'Look up my booking reservations (Phone 0912345678)',
        'Search online history of Bat Trang ceramics',
        'Save this craft to my favorites'
      ],
      createdAt: new Date().toISOString()
    };

    // Load chat history if available
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

  // Auto scroll to bottom
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
      const pageContext = getPageContext();
      const response = await api.chatAi({
        sessionId,
        message: textToSend,
        pageContext
      });

      // Emit Live State Sync to whole app
      if (response.toolExecutions && Array.isArray(response.toolExecutions)) {
        response.toolExecutions.forEach((exec) => {
          if (exec.result && exec.result.success) {
            emitAgentCrudAction({
              tool: exec.tool,
              data: exec.result.data,
              arguments: exec.arguments,
              message: exec.result.message
            });
          }
        });
      }

      const aiReply = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: response.reply,
        richCards: response.richCards || [],
        suggestedQuestions: response.suggestedQuestions || [],
        aiProvider: response.aiProvider,
        webSources: response.webSources || [],
        pageContextUsed: response.pageContextUsed,
        createdAt: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiReply]);
      if (!isOpen) setHasUnread(true);
    } catch (err) {
      const errorReply = {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content: `We are currently experiencing a brief disruption connecting to the AI system. Details: ${err.message}. Please try again shortly.`,
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
    if (window.confirm('Are you sure you want to reset this conversation?')) {
      try {
        await api.deleteAiHistory(sessionId);
        const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        localStorage.setItem('craftroots_ai_session_id', newSessionId);
        setSessionId(newSessionId);
        setMessages([
          {
            id: 'welcome_new',
            role: 'assistant',
            content: `The conversation has been reset. I am with you on the **${currentPageName || 'CraftRoots'}** page. What would you like to explore about our heritage or search online?`,
            richCards: [],
            suggestedQuestions: [
              `Search online for information about ${currentPageName || 'Bat Trang craft village'}`,
              'Master artisan directory',
              'Discover Van Phuc mulberry silk'
            ],
            createdAt: new Date().toISOString()
          }
        ]);
      } catch (err) {
        console.error('Error clearing history:', err);
      }
    }
  };

  const formatPrice = (val) => {
    if (!val) return 'Contact';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  return (
    <>
      {/* 1. Floating chat button in bottom right corner */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-accent-terracotta hover:bg-[#a84719] text-white shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none cursor-pointer border-2 border-surface-crisp"
        aria-label="Open AI Heritage Assistant"
        title="CraftRoots AI Heritage Assistant (Context & Web Search Aware)"
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

      {/* 2. Chat dialog window */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-[440px] h-[600px] max-h-[82vh] bg-surface-crisp border border-border-neutral rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn font-body-default">
          {/* Header */}
          <div className="bg-canvas-linen border-b border-border-neutral px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-accent-terracotta text-white flex items-center justify-center shadow-inner">
                <span className="material-symbols-outlined text-[22px]">auto_awesome</span>
              </div>
              <div>
                <h3 className="font-serif font-bold text-text-primary text-[15px] leading-tight flex items-center gap-1.5">
                  AI Heritage Assistant
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500" title="Status: Online" />
                </h3>
                <p className="text-[11px] text-text-secondary leading-tight mt-0.5">
                  {aiStatus?.available ? (
                    <span className="text-emerald-700 font-medium">Ollama Local ({aiStatus.recommendedModel || 'Qwen 2.5'})</span>
                  ) : (
                    <span>Direct Heritage DB Query</span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={handleClearHistory}
                className="p-1.5 text-text-secondary hover:text-accent-terracotta hover:bg-black/5 rounded-lg transition-colors cursor-pointer"
                title="Reset conversation"
                aria-label="Clear history"
              >
                <span className="material-symbols-outlined text-[18px]">refresh</span>
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-black/5 rounded-lg transition-colors cursor-pointer"
                title="Minimize chat"
                aria-label="Close chat"
              >
                <span className="material-symbols-outlined text-[20px]">expand_more</span>
              </button>
            </div>
          </div>

          {/* Sub-header: Current Route + Web Search Toggle */}
          <div className="bg-canvas-linen/95 border-b border-border-neutral px-3.5 py-1.5 flex items-center justify-between text-[11px] select-none">
            <div className="flex items-center gap-1.5 text-text-secondary truncate max-w-[65%]" title={`Currently on: ${currentPageName}`}>
              <span className="material-symbols-outlined text-[14px] text-accent-terracotta flex-shrink-0 animate-pulse">
                location_searching
              </span>
              <span className="truncate">
                Page: <span className="font-semibold text-text-primary">{currentPageName || 'CraftRoots'}</span>
              </span>
            </div>

            <button
              type="button"
              onClick={() => setEnableWebSearch(!enableWebSearch)}
              className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-medium transition-all cursor-pointer border shadow-2xs ${
                enableWebSearch
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-gray-100 text-gray-500 border-gray-300 hover:bg-gray-200'
              }`}
              title={enableWebSearch ? 'Internet search enabled (Wikipedia + reliable publications)' : 'Enable internet search'}
            >
              <span className="material-symbols-outlined text-[13px]">
                {enableWebSearch ? 'public' : 'public_off'}
              </span>
              <span>{enableWebSearch ? 'Web Search: On' : 'Web Search: Off'}</span>
            </button>
          </div>

          {/* Messages list */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-canvas-linen/40">
            {messages.map((msg, index) => {
              const isUser = msg.role === 'user';
              const crudCards = (msg.richCards || []).filter(c => c.type === 'crud_action');
              const heritageCards = (msg.richCards || []).filter(c => c.type === 'craft' || c.type === 'artisan');
              const webCards = (msg.richCards || []).filter(c => c.type === 'web_source');

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
                    {/* Message content */}
                    <div className="whitespace-pre-wrap break-words">
                      {msg.content}
                    </div>

                    {/* CRUD Action Cards */}
                    {crudCards.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-border-neutral/60 space-y-2">
                        <div className="text-[10.5px] font-bold tracking-wider uppercase text-accent-terracotta flex items-center gap-1">
                          <span className="material-symbols-outlined text-[15px]">database</span>
                          Database action executed:
                        </div>
                        {crudCards.map((crud, crIdx) => (
                          <div
                            key={crIdx}
                            className={`p-2.5 rounded-xl border text-xs shadow-2xs ${
                              crud.success
                                ? 'bg-amber-50/90 border-amber-200/90 text-amber-950'
                                : 'bg-red-50/90 border-red-200 text-red-900'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 font-bold">
                              <span className="material-symbols-outlined text-[17px] text-accent-terracotta flex-shrink-0">
                                {crud.tool === 'create_booking' ? 'event_available'
                                  : crud.tool === 'cancel_booking' ? 'event_busy'
                                  : crud.tool === 'update_craft' ? 'price_change'
                                  : crud.tool === 'create_craft' ? 'add_circle'
                                  : crud.tool === 'delete_craft' ? 'delete_forever'
                                  : crud.tool === 'add_favourite' ? 'favorite'
                                  : 'task_alt'}
                              </span>
                              <span className="leading-snug">{crud.message}</span>
                            </div>

                            {/* Booking details */}
                            {crud.data && crud.tool === 'create_booking' && (
                              <div className="text-[11px] space-y-0.5 text-text-secondary mt-1.5 pt-1.5 border-t border-amber-200/70 font-mono">
                                <div>Booking ID: <strong>#{crud.data.bookingId}</strong> ({crud.data.status})</div>
                                <div>Artisan: {crud.data.artisanName}</div>
                                <div>Time: {crud.data.timeSlot} • {new Date(crud.data.visitDate).toLocaleDateString('en-US')}</div>
                              </div>
                            )}

                            {/* Craft price update details */}
                            {crud.data && crud.tool === 'update_craft' && (
                              <div className="text-[11px] text-text-secondary mt-1 font-mono">
                                Craft: <strong>{crud.data.name}</strong> • New price: {formatPrice(crud.data.priceVnd)}
                              </div>
                            )}

                            {/* Create craft details */}
                            {crud.data && crud.tool === 'create_craft' && (
                              <div className="text-[11px] text-text-secondary mt-1 font-mono">
                                Code: <code>{crud.data.code}</code> • Price: {formatPrice(crud.data.priceVnd)}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Rich Cards: Crafts & Artisans */}
                    {heritageCards.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-border-neutral/60 space-y-2">
                        <div className="text-[11px] font-semibold tracking-wider uppercase text-text-secondary">
                          Related Crafts &amp; Artisans:
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          {heritageCards.map((card, cIdx) => (
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
                                    ? `${card.title || 'Master Artisan'} • ${card.experience || 0} yrs experience`
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

                    {/* Rich Cards: Web Search Results */}
                    {webCards.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-border-neutral/60 space-y-1.5">
                        <div className="text-[10.5px] font-bold tracking-wider uppercase text-emerald-800 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px] text-emerald-600">travel_explore</span>
                          Web Search Results:
                        </div>
                        <div className="space-y-1.5">
                          {webCards.map((wCard, wIdx) => (
                            <a
                              key={wIdx}
                              href={wCard.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block p-2 bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-200 rounded-lg transition-colors group cursor-pointer text-left"
                            >
                              <div className="flex items-center justify-between text-xs font-semibold text-emerald-900 group-hover:underline">
                                <span className="truncate pr-1">{wCard.title}</span>
                                <span className="text-[9.5px] font-normal text-emerald-700 bg-white px-1.5 py-0.5 rounded border border-emerald-200 flex-shrink-0">
                                  {wCard.source}
                                </span>
                              </div>
                              {wCard.snippet && (
                                <p className="text-[11px] text-text-secondary line-clamp-2 mt-1 leading-snug">
                                  {wCard.snippet}
                                </p>
                              )}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Suggested questions */}
                  {!isUser && msg.suggestedQuestions && index === messages.length - 1 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-[92%]">
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

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex items-center space-x-1.5 p-3 bg-surface-crisp border border-border-neutral rounded-2xl rounded-tl-none w-24 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-accent-terracotta animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-accent-terracotta animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-accent-terracotta animate-bounce [animation-delay:0.4s]" />
                <span className="text-[10px] text-text-secondary ml-1 animate-pulse">
                  {enableWebSearch ? 'Searching...' : 'Processing...'}
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input form */}
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
                placeholder={
                  currentPageName
                    ? `Ask about "${currentPageName}" or search online...`
                    : "Ask about crafts, artisans, or search the web..."
                }
                disabled={isLoading}
                className="flex-1 bg-canvas-linen border border-border-neutral focus:border-accent-terracotta focus:ring-1 focus:ring-accent-terracotta rounded-xl px-3.5 py-2.5 text-xs sm:text-[13px] text-text-primary placeholder:text-text-secondary/70 focus:outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 rounded-xl bg-accent-terracotta hover:bg-[#a84719] disabled:bg-border-neutral disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors cursor-pointer shadow-sm flex-shrink-0"
                aria-label="Send message"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>
            </form>
            <div className="flex items-center justify-between text-[10px] text-text-secondary mt-1.5 px-1">
              <span>Press Enter to send</span>
              <span>CraftRoots AI Concierge • Context &amp; Web Aware</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
