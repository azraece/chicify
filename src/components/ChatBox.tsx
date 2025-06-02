'use client';
import { useState } from 'react';

export default function ChatBox() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages([...messages, `🧑: ${userMessage}`]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!res.ok) {
        throw new Error('API request failed');
      }

      const data = await res.json();
      setMessages(prev => [...prev, `🤖: ${data.reply || 'Üzgünüm, bir hata oluştu.'}`]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, `🤖: ❌ Bir hata oluştu. Lütfen tekrar deneyin.`]);
    } finally {
      setLoading(false);
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="p-4 border rounded-lg w-full max-w-xl mx-auto space-y-4 bg-white shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 text-center">
        AI Chat Assistant 🤖
      </h3>
      
      <div className="h-64 overflow-y-auto border p-3 bg-gray-50 rounded-lg scrollbar-thin">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center text-sm">
            Merhaba! Size nasıl yardımcı olabilirim?
          </p>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className="mb-2">
              <p className="text-sm leading-relaxed">{msg}</p>
            </div>
          ))
        )}
        {loading && (
          <div className="flex items-center space-x-2 text-gray-500">
            <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            <span className="text-sm">AI düşünüyor...</span>
          </div>
        )}
      </div>
      
      <div className="flex space-x-2">
        <input
          className="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:border-blue-500"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Mesajınızı yazın... (Enter ile gönder)"
          disabled={loading}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={sendMessage}
          disabled={loading || !input.trim()}
        >
          {loading ? '⏳' : 'Gönder'}
        </button>
      </div>
    </div>
  );
} 