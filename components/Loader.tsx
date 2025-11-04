
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

interface LoaderProps {
    message: string;
}

const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-gray-800/50 rounded-lg">
        <SparklesIcon className="w-12 h-12 text-cyan-400 animate-pulse mb-4" />
        <p className="text-xl font-semibold text-white">{message}</p>
        <div className="w-48 h-2 bg-gray-700 rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-cyan-400 animate-loader-bar"></div>
        </div>
        <style>{`
            @keyframes loader-bar {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }
            .animate-loader-bar {
                animation: loader-bar 2s linear infinite;
            }
        `}</style>
    </div>
  );
};

export default Loader;
