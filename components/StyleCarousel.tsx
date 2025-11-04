
import React from 'react';
import { GeneratedImage } from '../types';

interface StyleCarouselProps {
  images: GeneratedImage[];
  onSelectStyle: (imageUrl: string) => void;
  selectedImageUrl: string | null;
}

const StyleCarousel: React.FC<StyleCarouselProps> = ({ images, onSelectStyle, selectedImageUrl }) => {
  if (!images || images.length === 0) {
    return null;
  }
  
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4 text-center">Choose a Style to Begin</h2>
      <div className="flex gap-4 overflow-x-auto p-4 -mx-4">
        {images.map(({ style, imageUrl }) => (
          <div
            key={style}
            onClick={() => onSelectStyle(imageUrl)}
            className={`relative flex-shrink-0 w-48 h-32 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 overflow-hidden group ${selectedImageUrl === imageUrl ? 'ring-4 ring-cyan-400' : 'ring-2 ring-transparent hover:ring-cyan-500'}`}
          >
            <img src={imageUrl} alt={style} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 flex items-end p-2 transition-opacity duration-300 opacity-100 group-hover:opacity-100">
              <h3 className="text-white font-semibold text-sm">{style}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StyleCarousel;
