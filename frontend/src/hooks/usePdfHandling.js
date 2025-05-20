import { useRef } from "react";
import { useToast } from "@/components/ui/use-toast";

// pdfjs-dist via CDN (ESM import)
import * as pdfjsLib from "https://cdn.jsdelivr.net/npm/pdfjs-dist@5.2.133/+esm";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const usePdfHandling = (
  setPdfText,
  setPdfName,
  setMessages,
  setIsLoadingPdf
) => {
  const { toast } = useToast();
  const fileInputRef = useRef(null);

  const uploadPdfToBackend = async (extractedText) => {
    const response = await fetch(`${backendUrl}/upload_pdf`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: extractedText }),
    });
    if (!response.ok) throw new Error("Failed to upload PDF content");
    return response.json();
  };

  const clearPdfFromBackend = async () => {
    const response = await fetch(`${backendUrl}/clear_pdf`, {
      method: "POST",
    });
    if (!response.ok) throw new Error("Failed to clear PDF content on backend");
    return response.json();
  };

  const extractTextFromPdf = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdn.jsdelivr.net/npm/pdfjs-dist@5.2.133/build/pdf.worker.min.mjs";

    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((item) => item.str).join(" ");
      fullText += pageText + "\n\n";
    }

    return fullText;
  };

  const handlePdfUpload = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setIsLoadingPdf(true);
      const newPdfName = file.name;

      toast({
        title: "Uploading PDF...",
        description: "Extracting text and sending to backend.",
      });

      try {
        const extractedText = await extractTextFromPdf(file);
        setPdfText(extractedText);
        setPdfName(newPdfName);

        await uploadPdfToBackend(extractedText);

        toast({
          title: "PDF Processed!",
          description: `Text extracted from ${newPdfName} and sent to backend.`,
        });

        setMessages((prev) => [
          ...prev,
          {
            type: "system",
            content: `Successfully processed PDF: ${newPdfName}`,
            timestamp: new Date(),
          },
        ]);
      } catch (error) {
        console.error("Error processing PDF:", error);
        toast({
          title: "PDF Upload Error",
          description: error.message || "Failed to process or send PDF.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingPdf(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    } else if (file) {
      toast({
        title: "Invalid File",
        description: "Please upload a valid PDF file.",
        variant: "destructive",
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleClearPdf = async () => {
    setPdfText("");
    setPdfName("");

    try {
      await clearPdfFromBackend();

      toast({
        title: "PDF Cleared",
        description:
          "The PDF context has been cleared on frontend and backend.",
      });

      setMessages((prev) => [
        ...prev,
        {
          type: "system",
          content: "PDF context cleared",
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Error clearing PDF context:", error);
      toast({
        title: "Clear PDF Error",
        description: "Failed to clear PDF context on backend.",
        variant: "destructive",
      });
    }
  };

  const triggerPdfUpload = () => {
    fileInputRef.current?.click();
  };

  return {
    fileInputRef,
    handlePdfUpload,
    handleClearPdf,
    triggerPdfUpload,
  };
};
