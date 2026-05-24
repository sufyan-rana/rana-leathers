'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Trash2, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random()}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          session_id: sessionId,
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I am having trouble connecting. Please try again later.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-[#8B3A1A] hover:bg-[#1A0F0A] text-white p-4 rounded-full shadow-lg transition-all duration-300 z-50 group"
      >
        <MessageCircle size={24} className="group-hover:scale-110 transition" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-[#F5EFE6] rounded-xl shadow-2xl flex flex-col z-50 border border-[#D4AF37]/30 overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-4 bg-gradient-to-r from-[#1A0F0A] to-[#8B3A1A] text-white">
            <div>
              <h3 className="font-semibold">RANA LEATHER'S Assistant</h3>
              <p className="text-xs opacity-75">Ask me about our products!</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={clearChat}
                className="hover:bg-white/20 p-1 rounded transition"
                title="Clear chat"
              >
                <Trash2 size={18} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 p-1 rounded transition"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 mt-8">
                <MessageCircle size={40} className="mx-auto mb-3 opacity-50" />
                <p className="text-sm">Hello! I'm here to help you with:</p>
                <ul className="text-xs mt-2 space-y-1">
                  <li>• Product information and pricing</li>
                  <li>• Leather care tips</li>
                  <li>• Shipping and returns</li>
                  <li>• Sizing and availability</li>
                </ul>
              </div>
            )}
            
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-[#8B3A1A] text-white'
                      : 'bg-white border border-gray-200 text-[#1A0F0A]'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p className="text-xs opacity-50 mt-1">
                    {msg.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 p-3 rounded-lg">
                  <Loader2 size={16} className="animate-spin text-[#8B3A1A]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about leather products..."
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D4AF37] bg-white"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-[#8B3A1A] hover:bg-[#1A0F0A] text-white p-2 rounded-lg transition disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
