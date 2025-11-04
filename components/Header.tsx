
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

interface HeaderProps {
    onReset: () => void;
    hasContent: boolean;
}

const Header: React.FC<HeaderProps> = ({ onReset, hasContent }) => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-700">
      <div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <SparklesIcon className="w-8 h-8 text-cyan-400" />
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            AI Deck Design Consultant
          </h1>
        </div>
        {hasContent && (
            <button
                onClick={onReset}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 text-sm"
            >
                Start Over
            </button>
        )}
      </div>
    </header>
  );
};

export default Header;