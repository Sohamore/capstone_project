import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Trash2 } from 'lucide-react';

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
      addBotMessage('Hello! I am ShreeBot — ask me about projects or say hi.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const startDrag = (clientX: number, clientY: number) => {
    dragging.current = true;
    offset.current = { x: clientX - pos.x, y: clientY - pos.y };
  };

  const onMouseDown = (e: React.MouseEvent) => {
    startDrag(e.clientX, e.clientY);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    startDrag(t.clientX, t.clientY);
  };

  useEffect(() => {
    const onMove = (clientX: number, clientY: number) => {
      if (!dragging.current) return;
      const nx = clientX - offset.current.x;
      const ny = clientY - offset.current.y;
      setPos({ x: Math.max(8, Math.min(window.innerWidth - 80, nx)), y: Math.max(8, Math.min(window.innerHeight - 80, ny)) });
    };
    const onMouseMove = (e: MouseEvent) => onMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) onMove(t.clientX, t.clientY);
    };
    const onUp = () => {
      if (dragging.current) {
        dragging.current = false;
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
      const res = await fetch('http://localhost:5001/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msgText }),
      });
      const json = await res.json();
      // replace the pending message
      setMessages((prev) => prev.map((m) => (m.id === pendingId ? { ...m, text: json.reply || "I didn't understand that.", pending: false, time: new Date().toISOString() } : m)));
    } catch (e) {
      setMessages((prev) => prev.map((m) => (m.id === pendingId ? { ...m, text: 'Chat server is not available.', pending: false, time: new Date().toISOString() } : m)));
    } finally {
      setSending(false);
    }
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

  // panel positioning: prefer to place panel to the left of icon if enough space
  const panelWidth = 320;
  const computePanelStyle = () => {
    const left = Math.max(8, Math.min(window.innerWidth - panelWidth - 8, pos.x - panelWidth + 28));
    const top = Math.max(8, Math.min(window.innerHeight - 160, pos.y - 200));
    return { left, top };
  };

  return (
    <div>
      {/* Floating button (draggable) */}
      <div
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        style={{ position: 'fixed', left: pos.x, top: pos.y, zIndex: 60 }}
      >
        <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white shadow-lg cursor-move relative">
          <MessageCircle className="h-6 w-6" onClick={() => setOpen((o) => !o)} />
          {/* small notification badge */}
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full ring-2 ring-white" />
        </div>
      </div>

      {/* Chat panel positioned relative to the icon */}
      {open && (
        <div style={{ position: 'fixed', zIndex: 70, ...computePanelStyle() } as React.CSSProperties}>
          <div className="w-80 bg-background rounded-lg shadow-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold">ShreeBot</div>
              <div className="flex items-center gap-2">
                <div className="text-xs text-muted-foreground">{sending ? 'Typing...' : 'Online'}</div>
                <button className="p-1 rounded hover:bg-muted" onClick={clearChat} title="Clear chat">
                  <Trash2 className="h-4 w-4" />
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
