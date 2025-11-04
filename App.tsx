
import React, { useState, useCallback } from 'react';
import { ChatMessage, GeneratedImage } from './types';
import { DESIGN_STYLES } from './constants';
import { reimagineImage, refineImage, getChatResponse } from './services/geminiService';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import StyleCarousel from './components/StyleCarousel';
import CompareSlider from './components/CompareSlider';
import ChatInterface from './components/ChatInterface';
import Loader from './components/Loader';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [selectedGeneratedImage, setSelectedGeneratedImage] = useState<string | null>(null);
  const [activeImageInSlider, setActiveImageInSlider] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const generateInitialStyles = useCallback(async (image: string) => {
    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);
    setChatHistory([]);
    try {
      const imagePromises = DESIGN_STYLES.map(style =>
        reimagineImage(image, style).then(imageUrl => ({ style, imageUrl }))
      );
      const results = await Promise.all(imagePromises);
      setGeneratedImages(results);
      if (results.length > 0) {
        setSelectedGeneratedImage(results[0].imageUrl);
        setActiveImageInSlider(results[0].imageUrl);
        setChatHistory([{ role: 'model', text: 'Your dream decks are ready! Select a style and let me know how we can perfect it.' }]);
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while generating styles. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setOriginalImage(base64String);
      generateInitialStyles(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectStyle = (imageUrl: string) => {
    setSelectedGeneratedImage(imageUrl);
    setActiveImageInSlider(imageUrl);
    setChatHistory([{ role: 'model', text: 'Great choice! How can I refine this deck design for you?' }]);
  };
  
  const addMessageToChat = (message: ChatMessage) => {
      setChatHistory(prev => [...prev, message]);
  }

  const handleSendMessage = async (messageText: string) => {
    addMessageToChat({ role: 'user', text: messageText });
    setIsChatLoading(true);

    const refinementKeywords = ['make', 'change', 'add', 'remove', 'put', 'replace', 'turn', 'edit', 'update'];
    const isRefinement = refinementKeywords.some(keyword => messageText.toLowerCase().split(' ').includes(keyword));

    try {
      if (isRefinement && activeImageInSlider) {
        const newImageUrl = await refineImage(activeImageInSlider, messageText);
        setActiveImageInSlider(newImageUrl);
        addMessageToChat({ role: 'model', text: "Here is the updated design. What else would you like to change?" });
      } else {
        const responseText = await getChatResponse(messageText);
        addMessageToChat({ role: 'model', text: responseText });
      }
    } catch (err) {
      console.error("Error processing message:", err);
      addMessageToChat({ role: 'model', text: "Sorry, I couldn't process that request. Please try again." });
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleReset = () => {
    setOriginalImage(null);
    setGeneratedImages([]);
    setSelectedGeneratedImage(null);
    setActiveImageInSlider(null);
    setChatHistory([]);
    setIsLoading(false);
    setIsChatLoading(false);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col">
      <Header onReset={handleReset} hasContent={!!originalImage} />
      <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col items-center">
        {!originalImage && <ImageUploader onImageUpload={handleImageUpload} />}
        
        {isLoading && <Loader message="Our AI is designing your dream deck... This may take a moment." />}

        {error && <div className="text-red-400 bg-red-900/50 p-4 rounded-lg">{error}</div>}

        {!isLoading && originalImage && (
          <div className="w-full max-w-7xl flex flex-col gap-8">
            <StyleCarousel
              images={generatedImages}
              onSelectStyle={handleSelectStyle}
              selectedImageUrl={selectedGeneratedImage}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {activeImageInSlider && (
                <CompareSlider
                  originalImage={originalImage}
                  generatedImage={activeImageInSlider}
                />
              )}
              <ChatInterface
                messages={chatHistory}
                onSendMessage={handleSendMessage}
                isLoading={isChatLoading}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;