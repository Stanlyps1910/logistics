import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState(() => {
    try {
      const stored = localStorage.getItem('nexafreight_chat');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const intervalRef = useRef(null);

  const loadMessages = useCallback(() => {
    try {
      const stored = localStorage.getItem('nexafreight_chat');
      const parsed = stored ? JSON.parse(stored) : [];
      setMessages(prev => {
        if (JSON.stringify(prev) !== JSON.stringify(parsed)) return parsed;
        return prev;
      });
    } catch {
      setMessages([]);
    }
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(loadMessages, 3000);
    const handleStorage = (e) => {
      if (e.key === 'nexafreight_chat') loadMessages();
    };
    window.addEventListener('storage', handleStorage);
    return () => {
      clearInterval(intervalRef.current);
      window.removeEventListener('storage', handleStorage);
    };
  }, [loadMessages]);

  const sendMessage = (senderRole, senderName, senderEmail, content) => {
    const newMessage = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 7),
      senderRole,
      senderName,
      senderEmail,
      content,
      timestamp: new Date().toISOString(),
    };
    const existing = JSON.parse(localStorage.getItem('nexafreight_chat') || '[]');
    const updated = [...existing, newMessage];
    localStorage.setItem('nexafreight_chat', JSON.stringify(updated));
    setMessages(updated);
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
}
