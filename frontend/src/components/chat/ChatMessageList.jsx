import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User } from 'lucide-react';

const ChatMessageList = ({ messages, messagesEndRef, isSending }) => {
  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
      <AnimatePresence initial={false}>
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            layout
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl p-3 rounded-2xl shadow-md break-words
              ${msg.type === 'user' 
                ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-br-none' 
                : 'bg-gray-700 text-gray-200 rounded-bl-none'
              }
              ${msg.type === 'system' && 'bg-yellow-600/30 text-yellow-200 w-full text-center italic text-sm'}
            `}>
              <div className="flex items-center mb-1">
                {msg.type === 'bot' && <Bot size={18} className="mr-2 text-accent"/>}
                {msg.type === 'user' && <User size={18} className="mr-2 text-blue-300"/>}
                <span className="font-semibold text-xs">
                  {msg.type === 'user' ? 'You' : msg.type === 'bot' ? 'DocuChat AI' : 'System'}
                </span>
              </div>
              <p className="text-sm">{msg.content}</p>
              {msg.timestamp && (
                <p className={`text-xs mt-1 ${msg.type === 'user' ? 'text-blue-200/70' : 'text-gray-400/70'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <div ref={messagesEndRef} />
      {isSending && (
        <motion.div 
          initial={{ opacity: 0, y:10 }}
          animate={{ opacity: 1, y:0 }}
          className="flex justify-start"
        >
          <div className="max-w-xs md:max-w-md p-3 rounded-2xl shadow-md bg-gray-700 text-gray-200 rounded-bl-none flex items-center">
            <Bot size={18} className="mr-2 text-accent"/>
            <span className="text-sm italic">DocuChat AI is typing</span>
            <span className="animate-pulse">...</span>
          </div>
        </motion.div>
      )}
    </main>
  );
};

export default ChatMessageList;