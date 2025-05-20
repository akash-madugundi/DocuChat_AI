import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

const ChatPdfStatus = ({ pdfName, isLoadingPdf, onClearPdf }) => {
  return (
    <AnimatePresence>
      {pdfName && !isLoadingPdf && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="p-2 px-4 bg-white/5 text-sm text-gray-300 flex items-center justify-between"
        >
          <div className="flex items-center space-x-2">
            <FileText size={16} className="text-green-400" />
            <span>Active PDF: <span className="font-semibold">{pdfName}</span></span>
          </div>
          <Button variant="ghost" size="sm" onClick={onClearPdf} className="text-red-400 hover:text-red-300">
            Clear PDF
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatPdfStatus;