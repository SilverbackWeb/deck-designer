
import React, { useCallback, useState } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  }, [onImageUpload]);

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };


  return (
    <div className="w-full max-w-2xl text-center p-8">
        <h2 className="text-3xl font-bold text-white mb-2">Design Your Dream Deck</h2>
        <p className="text-lg text-gray-400 mb-8">Upload a photo of your yard and let our AI generate new deck designs for you.</p>
        <label
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300 ${isDragging ? 'border-cyan-400 bg-gray-700' : 'border-gray-600 bg-gray-800 hover:bg-gray-700'}`}
        >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadIcon className="w-10 h-10 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-400">
                <span className="font-semibold text-cyan-400">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, or WEBP (MAX. 10MB)</p>
            </div>
            <input id="dropzone-file" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} />
        </label>
    </div>
  );
};

export default ImageUploader;