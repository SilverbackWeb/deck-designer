import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { ChatIcon } from './icons/ChatIcon';
import { ShoppingBagIcon } from './icons/ShoppingBagIcon';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-2xl flex flex-col h-[30rem]">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold text-center">Design Chat</h2>
        <p className="text-sm text-gray-400 text-center">Refine your deck design or ask for advice.</p>
        <p className="text-xs text-gray-500 text-center mt-1">e.g., "Add a built-in bench" or "What kind of wood is that?"</p>
      </div>
      <div className="flex-grow p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'model' && (
              <div className="w-8 h-8 rounded-full bg-cyan-500 flex-shrink-0 flex items-center justify-center">
                 <ChatIcon className="w-5 h-5 text-white" />
              </div>
            )}
            <div className={`max-w-xs md:max-w-md p-3 rounded-lg ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-cyan-500 flex-shrink-0 flex items-center justify-center">
                <ChatIcon className="w-5 h-5 text-white" />
            </div>
            <div className="max-w-xs md:max-w-md p-3 rounded-lg bg-gray-700 text-gray-200">
              <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
        <div className="flex items-center bg-gray-700 rounded-lg">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow bg-transparent p-3 text-gray-200 placeholder-gray-400 focus:outline-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-cyan-500 text-white rounded-r-lg p-3 disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-cyan-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;