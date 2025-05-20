import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { X, MessageSquare } from 'lucide-react';

const ChatHistoryModal = ({ show, onClose, history, onSelectHistory }) => {
  if (!show) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.7, opacity: 0 }}
        transition={{ type: 'spring', damping: 15, stiffness: 200 }}
        className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-2xl w-full max-w-md md:max-w-lg border border-white/20 flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="flex flex-row justify-between items-center pb-4 pt-2">
          <CardTitle className="text-2xl text-white">Chat History</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </Button>
        </CardHeader>
        <CardContent className="flex-grow overflow-y-auto space-y-3 pr-2">
          {history && history.length > 0 ? (
            history.map((session, index) => (
              <motion.div
                key={session.id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-700/50 p-3 rounded-lg hover:bg-gray-600/70 cursor-pointer transition-colors"
                onClick={() => onSelectHistory(session)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageSquare size={18} className="text-primary" />
                    <span className="text-sm text-gray-200">
                      Conversation {history.length - index} 
                      {session.pdfName && ` (PDF: ${session.pdfName.substring(0,20)}${session.pdfName.length > 20 ? '...' : ''})`}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {session.timestamp ? new Date(session.timestamp).toLocaleDateString() : 'Current'}
                  </span>
                </div>
                <p className="text-xs text-gray-300 mt-1 truncate">
                  {session.messages && session.messages.length > 0 ? 
                    session.messages[0].content.substring(0, 50) + '...' 
                    : 'Empty conversation'}
                </p>
              </motion.div>
            ))
          ) : (
            <CardDescription className="text-center text-gray-400 py-8">
              No chat history found. Start a new conversation!
            </CardDescription>
          )}
        </CardContent>
        <div className="pt-4 flex justify-end">
            <Button variant="outline" onClick={onClose} className="text-gray-300 border-gray-500 hover:bg-gray-700">Close</Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ChatHistoryModal;