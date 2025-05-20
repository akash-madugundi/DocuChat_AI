import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const ApiKeyModal = ({ show, apiKey, onApiKeyChange, onSave, onClose }) => {
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
        className="bg-gray-800 p-6 rounded-lg shadow-2xl w-full max-w-md border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader>
          <CardTitle className="text-center text-2xl mb-2">Gemini API Key</CardTitle>
          <p className="text-sm text-gray-400 text-center">
            Please enter your Gemini API key to enable chat functionality. You can get one from Google AI Studio.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="apiKeyModalInput" className="text-gray-300">API Key</Label>
            <Input
              id="apiKeyModalInput"
              type="password"
              value={apiKey}
              onChange={onApiKeyChange}
              placeholder="Enter your Gemini API Key"
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <Button variant="outline" onClick={onClose} className="text-gray-300 border-gray-500 hover:bg-gray-700">Cancel</Button>
            <Button onClick={onSave} className="bg-gradient-to-r from-primary to-accent hover:opacity-90">Save Key</Button>
          </div>
        </CardContent>
      </motion.div>
    </motion.div>
  );
};

export default ApiKeyModal;