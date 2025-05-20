import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";

import ChatHeader from "@/components/chat/ChatHeader";
import ChatMessageList from "@/components/chat/ChatMessageList";
import ChatPdfStatus from "@/components/chat/ChatPdfStatus";
import ChatMessageInput from "@/components/chat/ChatMessageInput";
import ApiKeyModal from "@/components/chat/ApiKeyModal";
import ChatHistoryModal from "@/components/chat/ChatHistoryModal";

import { useChatState } from "@/hooks/useChatState";
import { useChatApi } from "@/hooks/useChatApi";
import { useChatHistory } from "@/hooks/useChatHistory";
import { usePdfHandling } from "@/hooks/usePdfHandling";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const ChatPage = () => {
  const { user, logout: authLogout } = useAuth();
  const { toast } = useToast();

  const {
    messages,
    setMessages,
    inputValue,
    setInputValue,
    pdfText,
    setPdfText,
    pdfName,
    setPdfName,
    isLoadingPdf,
    setIsLoadingPdf,
    isSending,
    setIsSending,
    messagesEndRef,
  } = useChatState();

  const {
    geminiApiKey,
    tempApiKey,
    showApiKeyModal,
    handleOpenApiKeyModal,
    handleApiKeySave,
    handleApiKeyChange,
    handleCloseApiKeyModal,
  } = useChatApi();

  const {
    showHistoryModal,
    handleOpenHistoryModal,
    handleCloseHistoryModal,
    handleSelectHistory,
    saveCurrentChatToHistory,
    combinedHistoryForModal,
    clearCurrentChatState,
    setChatHistory,
  } = useChatHistory(
    messages,
    pdfName,
    pdfText,
    setMessages,
    setPdfName,
    setPdfText
  );

  const { fileInputRef, handlePdfUpload, handleClearPdf, triggerPdfUpload } =
    usePdfHandling(setPdfText, setPdfName, setMessages, setIsLoadingPdf);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    const userMessage = {
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsSending(true);

    try {
      // Call backend ask API with user question
      const response = await fetch(`${backendUrl}/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: userMessage.content }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const data = await response.json();

      // Use backend answer or fallback message
      const botResponseText =
        data.answer || "Sorry, I could not find an answer.";

      const botMessage = {
        type: "bot",
        content: botResponseText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Message Error",
        description: "Could not send message. " + error.message,
        variant: "destructive",
      });
      const errorMessage = {
        type: "system",
        content: `Error: Failed to get response. ${error.message}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  const handleLogout = () => {
    saveCurrentChatToHistory(); // Save current chat before clearing and logging out
    clearCurrentChatState(); // Clear messages, PDF details, and current session from localStorage
    setChatHistory([]); // Clear history state on logout
    authLogout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 text-white">
      <ChatHeader
        user={user}
        onShowApiKeyModal={handleOpenApiKeyModal}
        onLogout={handleLogout}
        onShowHistoryModal={handleOpenHistoryModal}
      />

      <ChatMessageList
        messages={messages}
        messagesEndRef={messagesEndRef}
        isSending={isSending}
      />

      <ChatPdfStatus
        pdfName={pdfName}
        isLoadingPdf={isLoadingPdf}
        onClearPdf={handleClearPdf}
      />

      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePdfUpload}
        accept="application/pdf"
        className="hidden"
      />
      <ChatMessageInput
        inputValue={inputValue}
        onInputChange={(e) => setInputValue(e.target.value)}
        onSendMessage={handleSendMessage}
        onFileUploadClick={triggerPdfUpload}
        isLoadingPdf={isLoadingPdf}
        isSending={isSending}
        pdfName={pdfName}
      />

      <ApiKeyModal
        show={showApiKeyModal}
        apiKey={tempApiKey}
        onApiKeyChange={handleApiKeyChange}
        onSave={handleApiKeySave}
        onClose={handleCloseApiKeyModal}
      />

      <ChatHistoryModal
        show={showHistoryModal}
        onClose={handleCloseHistoryModal}
        history={combinedHistoryForModal()}
        onSelectHistory={handleSelectHistory}
      />
    </div>
  );
};

export default ChatPage;
