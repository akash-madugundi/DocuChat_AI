import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

export const useChatHistory = ( currentMessages, currentPdfName, currentPdfText, setMessages, setPdfName, setPdfText ) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  // Load chat history from localStorage
  useEffect(() => {
    if (user?.email) {
      const allHistory = [];
      const currentChatSessionKey = `chatSession_${user.email}_current`;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(`chatSession_${user.email}_`) && key !== currentChatSessionKey) {
          try {
            allHistory.push(JSON.parse(localStorage.getItem(key)));
          } catch (e) {
            console.error(`Failed to parse history item ${key}`, e);
          }
        }
      }
      allHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setChatHistory(allHistory);
    }
  }, [user]);

  const handleOpenHistoryModal = () => setShowHistoryModal(true);
  const handleCloseHistoryModal = () => setShowHistoryModal(false);

  const saveCurrentChatToHistory = useCallback(() => {
    if (user?.email && (currentMessages.length > 0 || currentPdfName)) {
      const sessionId = `chatSession_${user.email}_${new Date().toISOString()}`;
      const sessionData = {
        id: sessionId,
        messages: currentMessages,
        pdfName: currentPdfName,
        pdfText: currentPdfText,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(sessionId, JSON.stringify(sessionData));
      setChatHistory(prev => [sessionData, ...prev].sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)));
      return sessionData;
    }
    return null;
  }, [user, currentMessages, currentPdfName, currentPdfText]);


  const handleSelectHistory = (session) => {
    if (user?.email && (currentMessages.length > 0 || currentPdfName) && session.id !== 'current') {
      const currentSessionKey = `chatSession_${user.email}_current`;
      const currentSessionDataString = localStorage.getItem(currentSessionKey);
      if (currentSessionDataString) {
        const currentSessionData = JSON.parse(currentSessionDataString);
        const isAlreadySavedHistorical = chatHistory.some(hist => hist.id === currentSessionData.id && hist.id !== 'current');
        
        if (currentSessionData.messages.length > 0 || currentSessionData.pdfName) {
          if(!isAlreadySavedHistorical || currentSessionData.id === 'current') {
            const newHistoricalId = `chatSession_${user.email}_${currentSessionData.timestamp || new Date().toISOString()}`;
            const newHistoricalSession = { ...currentSessionData, id: newHistoricalId };
            localStorage.setItem(newHistoricalId, JSON.stringify(newHistoricalSession));
            setChatHistory(prev => [newHistoricalSession, ...prev]
              .filter((s, index, self) => index === self.findIndex((t) => t.id === s.id || (s.id === 'current' && t.id === 'current'))) // Ensure unique by id
              .sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)));
          }
        }
      }
    }

    setMessages(session.messages || []);
    setPdfName(session.pdfName || '');
    setPdfText(session.pdfText || ''); // Load PDF text as well
    toast({ title: "Chat Loaded", description: `Loaded conversation from ${session.timestamp ? new Date(session.timestamp).toLocaleString() : 'current session'}.` });
    handleCloseHistoryModal();

    // Update current session to reflect the loaded history
    const currentChatSessionKey = `chatSession_${user.email}_current`;
    localStorage.setItem(currentChatSessionKey, JSON.stringify({
        id: 'current',
        messages: session.messages || [],
        pdfName: session.pdfName || '',
        pdfText: session.pdfText || '', // Persist PDF text for current session
        timestamp: new Date().toISOString() 
    }));
  };

  const combinedHistoryForModal = useCallback(() => {
    const currentSessionData = {
      id: 'current',
      messages: currentMessages,
      pdfName: currentPdfName,
      pdfText: currentPdfText, // Include for completeness
      timestamp: new Date().toISOString()
    };
    const historical = chatHistory.filter(h => h.id !== 'current');
    
    if (currentMessages.length > 0 || currentPdfName) {
      return [currentSessionData, ...historical].sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
    }
    return historical.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [currentMessages, currentPdfName, currentPdfText, chatHistory]);


  const clearCurrentChatState = () => {
    setMessages([]);
    setPdfName('');
    setPdfText('');
    if (user?.email) {
        localStorage.removeItem(`chatSession_${user.email}_current`);
    }
  };

  return {
    showHistoryModal,
    chatHistory, // The list of non-current sessions
    handleOpenHistoryModal,
    handleCloseHistoryModal,
    handleSelectHistory,
    saveCurrentChatToHistory,
    combinedHistoryForModal, // Function to get current + historical for modal
    clearCurrentChatState,
    setChatHistory // Allow direct update if needed e.g. on logout
  };
};