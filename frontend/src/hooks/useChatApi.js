import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

export const useChatApi = () => {
  const { toast } = useToast();
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [tempApiKey, setTempApiKey] = useState(''); // For modal input
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  useEffect(() => {
    const storedApiKey = localStorage.getItem('geminiApiKey');
    if (storedApiKey) {
      setGeminiApiKey(storedApiKey);
      setTempApiKey(storedApiKey);
    }
  }, []);

  const handleOpenApiKeyModal = () => {
    setTempApiKey(geminiApiKey);
    setShowApiKeyModal(true);
  };

  const handleApiKeySave = () => {
    if (!tempApiKey.trim()) {
      toast({ title: "API Key Missing", description: "Please enter a valid Gemini API key.", variant: "destructive" });
      return;
    }
    setGeminiApiKey(tempApiKey);
    localStorage.setItem('geminiApiKey', tempApiKey);
    setShowApiKeyModal(false);
    toast({ title: "API Key Saved", description: "Your Gemini API key has been saved." });
  };

  const handleApiKeyChange = (e) => {
    setTempApiKey(e.target.value);
  };

  const handleCloseApiKeyModal = () => {
    setShowApiKeyModal(false);
  };

  return {
    geminiApiKey,
    tempApiKey,
    showApiKeyModal,
    handleOpenApiKeyModal,
    handleApiKeySave,
    handleApiKeyChange,
    handleCloseApiKeyModal
  };
};