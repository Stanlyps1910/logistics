import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, User, Shield, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';

export default function ChatBox({ variant = 'light' }) {
  const { user } = useAuth();
  const { messages, sendMessage } = useChat();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const isDark = variant === 'dark';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;
    sendMessage(user.role, user.name, user.email, newMessage.trim());
    setNewMessage('');
  };

  const formatTime = (ts) => {
    const d = new Date(ts);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (ts) => {
    const d = new Date(ts);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const groupedMessages = messages.reduce((groups, msg) => {
    const dateLabel = formatDate(msg.timestamp);
    if (!groups[dateLabel]) groups[dateLabel] = [];
    groups[dateLabel].push(msg);
    return groups;
  }, {});

  return (
    <div className={`flex flex-col h-full ${isDark ? 'text-white' : 'text-slate-800'}`}>
      <div className={`flex items-center gap-3 px-6 py-4 border-b ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
          <MessageSquare className={`w-5 h-5 ${isDark ? 'text-emerald-400' : 'text-primary'}`} />
        </div>
        <div>
          <h3 className={`font-display font-bold text-sm uppercase tracking-wide ${isDark ? 'text-white' : 'text-dark'}`}>
            {user?.role === 'admin' ? 'Client Messages' : 'Admin Support'}
          </h3>
          <p className={`text-xs ${isDark ? 'text-white/50' : 'text-slate-400'}`}>
            {messages.length} message{messages.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4" style={{ maxHeight: 'min(380px, 50vh)' }}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <MessageSquare className={`w-10 h-10 mb-3 ${isDark ? 'text-white/20' : 'text-slate-300'}`} />
            <p className={`text-sm font-medium ${isDark ? 'text-white/40' : 'text-slate-400'}`}>No messages yet</p>
            <p className={`text-xs mt-1 ${isDark ? 'text-white/30' : 'text-slate-400'}`}>
              {user?.role === 'admin' ? 'Clients will appear here when they message you.' : 'Send a message to admin support.'}
            </p>
          </div>
        ) : (
          Object.entries(groupedMessages).map(([dateLabel, msgs]) => (
            <div key={dateLabel}>
              <div className="flex justify-center mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${isDark ? 'bg-white/5 text-white/40' : 'bg-slate-100 text-slate-500'}`}>
                  {dateLabel}
                </span>
              </div>
              {msgs.map((msg) => {
                const isOwn = msg.senderRole === user?.role;
                return (
                  <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3`}>
                    <div className="max-w-[78%]">
                      <div className={`flex items-center gap-1.5 mb-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                        <span className={`text-xs font-medium ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                          {isOwn ? 'You' : msg.senderName}
                        </span>
                        {msg.senderRole === 'admin' ? (
                          <Shield className={`w-3 h-3 ${isDark ? 'text-emerald-400' : 'text-primary'}`} />
                        ) : (
                          <User className={`w-3 h-3 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                        )}
                      </div>
                      <div
                        className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                          isOwn
                            ? isDark
                              ? 'bg-emerald-600 text-white rounded-br-md'
                              : 'bg-primary text-white rounded-br-md'
                            : isDark
                              ? 'bg-white/10 text-white/90 rounded-bl-md'
                              : 'bg-slate-100 text-slate-700 rounded-bl-md'
                        }`}
                      >
                        {msg.content}
                      </div>
                      <div className={`flex items-center gap-1 mt-0.5 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                        <Clock className={`w-3 h-3 ${isDark ? 'text-white/30' : 'text-slate-400'}`} />
                        <span className={`text-[10px] ${isDark ? 'text-white/30' : 'text-slate-400'}`}>
                          {formatTime(msg.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className={`flex items-center gap-2 px-4 py-3 border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className={`flex-1 px-4 py-2.5 rounded-xl text-sm outline-none transition-all ${
            isDark
              ? 'bg-white/5 border border-white/10 text-white placeholder:text-white/25 focus:border-emerald-500/50'
              : 'bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-primary/30'
          }`}
        />
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className={`p-2.5 rounded-xl transition-all cursor-pointer ${
            newMessage.trim()
              ? isDark
                ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                : 'bg-primary text-white hover:bg-primary/90'
              : isDark
                ? 'bg-white/5 text-white/20'
                : 'bg-slate-100 text-slate-300'
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
