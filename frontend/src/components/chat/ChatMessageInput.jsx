import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Paperclip, Send, Loader2 } from 'lucide-react';

const ChatMessageInput = ({ 
  inputValue, 
  onInputChange, 
  onSendMessage, 
  onFileUploadClick, 
  isLoadingPdf, 
  isSending, 
  pdfName 
}) => {
  return (
    <footer className="p-4 bg-white/5 backdrop-blur-md border-t border-white/10">
      <div className="flex items-center space-x-3">
        <Button variant="outline" size="icon" onClick={onFileUploadClick} disabled={isLoadingPdf} className="bg-transparent border-primary text-primary hover:bg-primary/10">
          {isLoadingPdf ? <Loader2 className="h-5 w-5 animate-spin" /> : <Paperclip size={20} />}
        </Button>
        <Textarea
          value={inputValue}
          onChange={onInputChange}
          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), onSendMessage())}
          placeholder={pdfName ? `Ask about ${pdfName}...` : "Type your message..."}
          className="flex-1 resize-none bg-white/10 placeholder-gray-400 border-white/20 focus:bg-white/20 min-h-[40px] max-h-[120px] h-[40px]"
          disabled={isLoadingPdf || isSending}
        />
        <Button onClick={onSendMessage} disabled={isLoadingPdf || isSending || !inputValue.trim()} className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity">
          {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send size={20} />}
          <span className="ml-2 hidden sm:inline">Send</span>
        </Button>
      </div>
    </footer>
  );
};

export default ChatMessageInput;