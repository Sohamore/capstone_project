import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Trash2, X, Bot, User } from 'lucide-react';

const CHAT_HISTORY_KEY = 'chatbot_history_v2';

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
  const [sending, setSending] = useState(false);
  const idRef = useRef(1);
  const messagesRef = useRef<HTMLDivElement | null>(null);

  // OpenAI API configuration
  const OPENAI_API_KEY = "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";

  // Load chat history
  useEffect(() => {
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
  }, []);

  // Save chat history
  useEffect(() => {
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
  }, [messages]);

  // Auto-scroll when messages change
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, open]);

  // Greeting when opening
  useEffect(() => {
    if (open && messages.length === 0) {
      addBotMessage('Hello! I am Shri Krishna Steel Works AI Assistant, powered by OpenAI. I can help you with information about our steel products, services, and answer any questions you may have. How can I assist you today?');
    }
  }, [open]);


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

    const pendingId = idRef.current;
    addBotMessage('Thinking...', true);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful AI assistant for Shri Krishna Steel Works, a steel fabrication company. Provide helpful and professional responses about steel products, services, and general inquiries. Keep responses concise and relevant to steel fabrication business. Always be polite and helpful.'
            },
            {
              role: 'user',
              content: msgText
            }
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || "I didn't understand that. Please try again.";
      
      setMessages((prev) => prev.map((m) => (m.id === pendingId ? { ...m, text: reply, pending: false, time: new Date().toISOString() } : m)));
    } catch (e) {
      console.error('OpenAI API error:', e);
      const fallbackResponse = getFallbackResponse(msgText);
      setMessages((prev) => prev.map((m) => (m.id === pendingId ? { ...m, text: fallbackResponse, pending: false, time: new Date().toISOString() } : m)));
    } finally {
      setSending(false);
    }
  };

  const getFallbackResponse = (userMessage: string) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return 'Hello! Welcome to Shri Krishna Steel Works. How can I help you today?';
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


  // Close chat when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (open) {
        const target = event.target as Element;
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
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating button - always visible */}
      {!open && (
        <div
          className="chatbot-floating-button chatbot-button"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 border-2 border-white flex items-center justify-center shadow-xl cursor-pointer relative overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <img 
              src="/photos/logo.jpg" 
              alt="Shri Krishna Steel Works Logo" 
              className="w-full h-full object-cover rounded-full pointer-events-none"
            />
            {/* Clickable overlay for opening chat */}
            <div 
              className="absolute inset-0 cursor-pointer"
              onClick={() => setOpen(true)}
            />
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full ring-2 ring-white animate-pulse" />
          </div>
        </div>
      )}

      {/* Chat panel - positioned at bottom right */}
      {open && (
        <div 
          className="chatbot-panel" 
        >
          <div className="w-96 bg-white rounded-xl shadow-2xl border border-gray-200 chat-panel mb-4">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Shri Krishna Steel Works AI</div>
                    <div className="text-xs opacity-90">{sending ? 'Typing...' : 'Online'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    className="p-2 rounded-lg hover:bg-white/20 transition-colors" 
                    onClick={clearChat} 
                    title="Clear chat"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <button 
                    className="p-2 rounded-lg hover:bg-white/20 transition-colors" 
                    onClick={() => setOpen(false)} 
                    title="Close chat"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div ref={messagesRef} className="h-80 overflow-auto p-4 space-y-3 bg-gray-50">
              {messages.map((m) => (
                <div key={m.id} className={`flex gap-2 ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.from === 'bot' && (
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <div className={`max-w-[80%] ${m.from === 'user' ? 'order-first' : ''}`}>
                    <div className={`p-3 rounded-lg ${
                      m.from === 'user' 
                        ? 'bg-blue-500 text-white rounded-br-sm' 
                        : 'bg-white text-gray-800 rounded-bl-sm border border-gray-200'
                    }`}>
                      <div className="text-sm whitespace-pre-wrap">{m.text}</div>
                    </div>
                    <div className={`text-xs text-gray-500 mt-1 ${m.from === 'user' ? 'text-right' : 'text-left'}`}>
                      {new Date(m.time).toLocaleTimeString()}
                    </div>
                  </div>
                  {m.from === 'user' && (
                    <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-200 rounded-b-xl">
              <div className="flex gap-2">
                <Input 
                  value={text} 
                  onChange={(e) => setText(e.target.value)} 
                  onKeyDown={onKeyDown} 
                  placeholder="Type your message..." 
                  className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  disabled={sending}
                />
                <Button 
                  onClick={sendMessage} 
                  disabled={sending || !text.trim()}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4"
                >
                  {sending ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
