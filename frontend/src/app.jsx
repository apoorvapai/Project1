
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import EmployeeCard from './components/EmployeeCard';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [...prev, { type: 'user', text: query, timestamp }]);
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:8000/chat', { query });
      setMessages((prev) => [...prev, { type: 'bot', text: res.data.response, timestamp }]);
    } catch (err) {
      setError('Failed to process query. Please try again.');
    }
    setLoading(false);
    setQuery('');
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Function to split text into paragraphs and process ** for bold
const renderMessageText = (text) => {
  const paragraphs = text.split('\n').filter((p) => p.trim());
  return paragraphs.map((paragraph, index) => {
    // Replace **text** with <strong>text</strong>
    const formattedText = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return (
      <p
        key={index}
        className="text-sm md:text-base leading-relaxed mb-2 last:mb-0"
        dangerouslySetInnerHTML={{ __html: formattedText }}
      />
    );
  });
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold mb-10 text-blue-700 tracking-tight drop-shadow-sm">
        HR Resource Chatbot
      </h1>
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col h-[85vh]">
        <div
          ref={chatContainerRef}
          className="flex-1 p-8 overflow-y-auto space-y-6 bg-gray-50 rounded-t-2xl"
        >
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`flex items-start gap-4 ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.type === 'bot' && (
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">HR</span>
                  </div>
                )}
                <div
                  className={`max-w-[75%] p-4 rounded-2xl shadow-lg ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
                  }`}
                >
                  {renderMessageText(message.text)}
                  <p
                    className={`text-xs mt-2 ${
                      message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {message.timestamp}
                  </p>
                </div>
                {message.type === 'user' && (
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-600 font-semibold">U</span>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-center text-sm font-medium"
            >
              {error}
            </motion.p>
          )}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start items-start gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-semibold">HR</span>
              </div>
              <div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-lg border border-gray-200">
                <p className="text-sm text-gray-500 italic">Typing...</p>
              </div>
            </motion.div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="p-4 border-t bg-white rounded-b-2xl">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about HR resources (e.g., Find Python developers)"
              className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 text-sm md:text-base"
            />
            <button
              type="submit"
              disabled={loading}
              className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
