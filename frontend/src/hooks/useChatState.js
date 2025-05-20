import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';

export const useChatState = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [pdfText, setPdfText] = useState('');
  const [pdfName, setPdfName] = useState('');
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(scrollToBottom, [messages, scrollToBottom]);

  // Load current chat session from localStorage
  useEffect(() => {
    if (user?.email) {
      const currentChatSessionKey = `chatSession_${user.email}_current`;
      const storedCurrentMessages = localStorage.getItem(currentChatSessionKey);
      if (storedCurrentMessages) {
        try {
          const parsedSession = JSON.parse(storedCurrentMessages);
          setMessages(parsedSession.messages || []);
          setPdfName(parsedSession.pdfName || '');
          setPdfText(parsedSession.pdfText || '');
        } catch (e) {
          console.error("Failed to parse current messages from localStorage", e);
          localStorage.removeItem(currentChatSessionKey);
        }
      } else {
        // If no current session, clear state
        setMessages([]);
        setPdfName('');
        setPdfText('');
      }
    }
  }, [user]);

  // Save current chat session to localStorage
  useEffect(() => {
    if (user?.email) {
      const currentChatSessionKey = `chatSession_${user.email}_current`;
      const sessionData = {
        id: 'current',
        messages,
        pdfName,
        pdfText,
        timestamp: new Date().toISOString()
      };
      if (messages.length > 0 || pdfName) {
        localStorage.setItem(currentChatSessionKey, JSON.stringify(sessionData));
      } else {
        // Only remove if it exists and should be cleared
        if(localStorage.getItem(currentChatSessionKey)) {
            localStorage.removeItem(currentChatSessionKey);
        }
      }
    }
  }, [messages, pdfName, pdfText, user]);

  return {
    messages, setMessages,
    inputValue, setInputValue,
    pdfText, setPdfText,
    pdfName, setPdfName,
    isLoadingPdf, setIsLoadingPdf,
    isSending, setIsSending,
    messagesEndRef
  };
};