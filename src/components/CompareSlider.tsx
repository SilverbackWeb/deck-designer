import React, { useState } from 'react';

interface CompareSliderProps {
  originalImage: string;
  generatedImage: string;
}

const CompareSlider: React.FC<CompareSliderProps> = ({ originalImage, generatedImage }) => {
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
       <h2 className="text-2xl font-bold mb-4 text-center">Compare & Refine</h2>
      <div className="relative w-full aspect-video rounded-lg overflow-hidden select-none group border-2 border-gray-700 shadow-lg">
        <img
          src={originalImage}
          alt="Original room"
          className="absolute inset-0 w-full h-full object-contain"
        />
        <div
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <img
            src={generatedImage}
            alt="AI generated room"
            className="absolute inset-0 w-full h-full object-contain"
          />
        </div>
        <div className="absolute top-0 bottom-0 bg-white w-1 cursor-ew-resize" style={{ left: `calc(${sliderPosition}% - 2px)` }}>
            <div className="absolute top-1/2 -translate-y-1/2 -left-4 bg-white rounded-full h-9 w-9 flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path></svg>
            </div>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPosition}
          onChange={handleSliderChange}
          className="absolute inset-0 w-full h-full cursor-ew-resize opacity-0"
          aria-label="Comparison slider"
        />
        <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">Before</div>
        <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">After</div>
      </div>
    </div>
  );
};

export default CompareSlider;