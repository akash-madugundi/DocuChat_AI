import React from 'react';
import { Button } from '@/components/ui/button';
import { Bot, Settings, LogOut, History } from 'lucide-react';

const ChatHeader = ({ user, onShowApiKeyModal, onLogout, onShowHistoryModal }) => {
  return (
    <header className="p-4 shadow-md bg-white/5 backdrop-blur-md flex justify-between items-center border-b border-white/10">
      <div className="flex items-center space-x-2">
        <Bot size={32} className="text-primary" />
        <h1 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          DocuChat AI
        </h1>
      </div>
      <div className="flex items-center space-x-2 sm:space-x-3">
        {user && <span className="text-xs sm:text-sm text-gray-300 hidden md:block">Welcome, {user.email}</span>}
        <Button variant="ghost" size="icon" onClick={onShowHistoryModal} className="hover:bg-white/10" title="Chat History">
          <History size={20} />
        </Button>
        <Button variant="ghost" size="icon" onClick={onShowApiKeyModal} className="hover:bg-white/10" title="API Key Settings">
          <Settings size={20} />
        </Button>
        <Button variant="ghost" size="icon" onClick={onLogout} className="hover:bg-white/10" title="Logout">
          <LogOut size={20} />
        </Button>
      </div>
    </header>
  );
};

export default ChatHeader;