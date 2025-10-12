import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Trash2, X } from 'lucide-react';

const CHAT_POS_KEY = 'chatbot_position_v1';
const CHAT_HISTORY_KEY = 'chatbot_history_v1';

type Message = {
  id: number;
  from: 'user' | 'bot';
  text: string;
  time: string;
  pending?: boolean;
};

const ChatBot: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: window.innerWidth - 90, y: window.innerHeight - 180 });
  const [isVisible, setIsVisible] = useState(true);
  const [sending, setSending] = useState(false);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const idRef = useRef(1);
  const messagesRef = useRef<HTMLDivElement | null>(null);

  // load position & history
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CHAT_POS_KEY);
      if (raw) setPos(JSON.parse(raw));
    } catch (e) {
      console.warn('Failed to load chat position from localStorage', e);
    }
    try {
      const raw = localStorage.getItem(CHAT_HISTORY_KEY);
      if (raw) {
        const parsed: Message[] = JSON.parse(raw);
        setMessages(parsed);
        if (parsed.length) idRef.current = parsed[parsed.length - 1].id + 1;
      }
    } catch (e) {
      console.warn('Failed to load chat history', e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep chatbot visible on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(true);
    };

    const handleResize = () => {
      // Adjust position on window resize to keep it in view
      setPos(prev => ({
        x: Math.min(prev.x, window.innerWidth - 80),
        y: Math.min(prev.y, window.innerHeight - 80)
      }));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // save history and position
  useEffect(() => {
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(CHAT_POS_KEY, JSON.stringify(pos));
  }, [pos]);

  // auto-scroll when messages change
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, open]);

  // greeting when opening
  useEffect(() => {
    if (open && messages.length === 0) {
      addBotMessage('Hello! I am Shri krishna steel works AI Assistant, powered by Google Gemini. I can help you with information about our steel products, services, and answer any questions you may have. How can I assist you today?');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const startDrag = (clientX: number, clientY: number) => {
    dragging.current = true;
    offset.current = { x: clientX - pos.x, y: clientY - pos.y };
    // Prevent text selection during drag
    document.body.style.userSelect = 'none';
  };

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    startDrag(e.clientX, e.clientY);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const t = e.touches[0];
    startDrag(t.clientX, t.clientY);
  };

  useEffect(() => {
    const onMove = (clientX: number, clientY: number) => {
      if (!dragging.current) return;
      const nx = clientX - offset.current.x;
      const ny = clientY - offset.current.y;
      // Keep chatbot within viewport bounds
      setPos({ 
        x: Math.max(8, Math.min(window.innerWidth - 80, nx)), 
        y: Math.max(8, Math.min(window.innerHeight - 80, ny)) 
      });
    };
    const onMouseMove = (e: MouseEvent) => onMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) onMove(t.clientX, t.clientY);
    };
    const onUp = () => {
      if (dragging.current) {
        dragging.current = false;
        // Restore text selection
        document.body.style.userSelect = '';
        localStorage.setItem(CHAT_POS_KEY, JSON.stringify(pos));
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchend', onUp);
      // Ensure userSelect is restored on cleanup
      document.body.style.userSelect = '';
    };
  }, [pos]);

  const addUserMessage = (txt: string) => {
    const msg: Message = { id: idRef.current++, from: 'user', text: txt, time: new Date().toISOString() };
    setMessages((m) => [...m, msg]);
  };

  const addBotMessage = (txt: string, pending = false) => {
    const msg: Message = { id: idRef.current++, from: 'bot', text: txt, time: new Date().toISOString(), pending };
    setMessages((m) => [...m, msg]);
  };

  const sendMessage = async () => {
    if (!text.trim() || sending) return;
    const msgText = text.trim();
    addUserMessage(msgText);
    setText('');
    setSending(true);

    // add a pending typing indicator
    const pendingId = idRef.current;
    addBotMessage('...', true);

    try {
      // Use a CORS proxy to avoid CORS issues
      const proxyUrl = 'https://api.allorigins.win/raw?url=';
      const apiUrl = encodeURIComponent(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyDUzWFFnyyepSkhXDIHQmCKaHaGpO5DRzs`);
      
      const response = await fetch(proxyUrl + apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a helpful assistant for Shri krishna steel works, a steel fabrication company. Please provide helpful and professional responses about steel products, services, and general inquiries. Keep responses concise and relevant to steel fabrication business. User message: ${msgText}`
            }]
          }]
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I didn't understand that. Please try again.";
      
      // replace the pending message
      setMessages((prev) => prev.map((m) => (m.id === pendingId ? { ...m, text: reply, pending: false, time: new Date().toISOString() } : m)));
    } catch (e) {
      console.error('Gemini API error:', e);
      // Fallback to a simple response system
      const fallbackResponse = getFallbackResponse(msgText);
      setMessages((prev) => prev.map((m) => (m.id === pendingId ? { ...m, text: fallbackResponse, pending: false, time: new Date().toISOString() } : m)));
    } finally {
      setSending(false);
    }
  };

  // Fallback response system when API is not available
  const getFallbackResponse = (userMessage: string) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return 'Hello! Welcome to Shri krishna steel works. How can I help you today?';
    }
    
    if (message.includes('product') || message.includes('steel')) {
      return 'We offer a wide range of steel products including structural beams, custom gates, industrial platforms, staircase railings, steel trusses, and workshop equipment. Would you like to know more about any specific product?';
    }
    
    if (message.includes('price') || message.includes('cost')) {
      return 'Our pricing varies based on the product and specifications. Steel beams start at ₹450/kg, platforms at ₹380/sq ft, and railings at ₹2,500/meter. For custom quotes, please contact us directly.';
    }
    
    if (message.includes('contact') || message.includes('phone') || message.includes('number')) {
      return 'You can reach us at +91 9226133650 or email us at shrikrishnasteel0809@gmail.com. We\'re located on Pune-Bangalore Highway, Near Hotel Annapurna, Gote, Tal.Karad, Dist. Satara.';
    }
    
    if (message.includes('service') || message.includes('fabrication')) {
      return 'We provide comprehensive steel fabrication services including construction steel, custom fabrication, and industrial components. We serve residential, commercial, and industrial projects across Maharashtra.';
    }
    
    if (message.includes('location') || message.includes('address')) {
      return 'We are located on Pune-Bangalore Highway, Near Hotel Annapurna, Gote, Tal.Karad, Dist. Satara. You can also call us at +91 9226133650 for directions.';
    }
    
    if (message.includes('experience') || message.includes('year') || message.includes('established')) {
      return 'We have over 15 years of experience in steel fabrication with 72+ completed projects and 50+ happy clients across 8+ cities in Maharashtra.';
    }
    
    return 'Thank you for your message! For detailed information about our steel products and services, please contact us at +91 9226133650 or visit our website. We\'d be happy to help you with your steel fabrication needs.';
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem(CHAT_HISTORY_KEY);
  };

  // panel positioning: ensure panel stays within viewport
  const panelWidth = 320;
  const panelHeight = 400;
  const computePanelStyle = () => {
    // Calculate position relative to viewport, not page
    const viewportLeft = Math.max(8, Math.min(window.innerWidth - panelWidth - 8, pos.x - panelWidth + 28));
    const viewportTop = Math.max(8, Math.min(window.innerHeight - panelHeight - 8, pos.y - panelHeight + 28));
    
    return { 
      left: viewportLeft, 
      top: viewportTop,
      position: 'fixed' as const
    };
  };

  // Close chat when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (open) {
        const target = event.target as Element;
        // Check if click is outside the chat panel
        if (!target.closest('.chat-panel') && !target.closest('.chatbot-button')) {
          setOpen(false);
        }
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  return (
    <div>
      {/* Floating button (draggable) - only show when chat is closed */}
      {!open && isVisible && (
        <div
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          style={{ 
            position: 'fixed', 
            left: pos.x, 
            top: pos.y, 
            zIndex: 9999,
            transition: 'opacity 0.3s ease-in-out'
          }}
          className="chatbot-button"
        >
          <div className="w-14 h-14 rounded-full bg-white border-2 border-primary flex items-center justify-center shadow-lg cursor-move relative overflow-hidden">
            <img 
              src="/photos/logo.jpg" 
              alt="Shri krishna steel works Logo" 
              className="w-full h-full object-cover rounded-full pointer-events-none"
            />
            {/* Clickable overlay for opening chat */}
            <div 
              className="absolute inset-0 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!dragging.current) {
                  setOpen(true);
                }
              }}
            />
            {/* small notification badge */}
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full ring-2 ring-white" />
          </div>
        </div>
      )}

      {/* Chat panel positioned relative to the icon */}
      {open && (
        <div style={{ 
          position: 'fixed', 
          zIndex: 10000, 
          ...computePanelStyle() 
        } as React.CSSProperties}>
          <div className="w-80 bg-background rounded-lg shadow-lg p-3 chat-panel">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold">Shri krishna steel works AI</div>
              <div className="flex items-center gap-2">
                <div className="text-xs text-muted-foreground">{sending ? 'Typing...' : 'Online'}</div>
                <button className="p-1 rounded hover:bg-muted" onClick={clearChat} title="Clear chat">
                  <Trash2 className="h-4 w-4" />
                </button>
                <button 
                  className="p-1 rounded hover:bg-muted" 
                  onClick={() => setOpen(false)} 
                  title="Close chat"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div ref={messagesRef} className="h-56 overflow-auto mb-2 space-y-2">
              {messages.map((m) => (
                <div key={m.id} className={`p-2 rounded max-w-[85%] ${m.from === 'user' ? 'bg-primary text-white ml-auto' : 'bg-muted-foreground text-foreground'}`}>
                  <div className="text-sm">{m.text}</div>
                  <div className="text-[10px] text-muted-foreground mt-1">{new Date(m.time).toLocaleString()}</div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Input value={text} onChange={(e) => setText((e.target as HTMLInputElement).value)} onKeyDown={onKeyDown} placeholder="Type a message" />
              <Button onClick={sendMessage} disabled={sending}>{sending ? '...' : 'Send'}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
