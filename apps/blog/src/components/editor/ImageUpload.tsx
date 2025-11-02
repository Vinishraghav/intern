'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiX } from 'react-icons/fi';

type ImageUploadProps = {
  value?: string;
  onChange: (value: string) => void;
  className?: string;
};

export function ImageUpload({
  value,
  onChange,
  className = '',
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setIsUploading(true);
      
      // In a real app, you would upload the file to your server here
      // For now, we'll just create a local URL for preview
      const fileUrl = URL.createObjectURL(file);
      
      // Simulate upload delay
      setTimeout(() => {
        setPreview(fileUrl);
        onChange(fileUrl);
        setIsUploading(false);
      }, 1000);
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
    maxFiles: 1,
  });

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onChange('');
  };

  if (preview) {
    return (
      <div
        className={`relative group rounded-lg border-2 border-dashed border-gray-300 ${className}`}
      >
        <img
          src={preview}
          alt="Preview"
          className="w-full h-48 object-cover rounded-lg"
        />
        <button
          onClick={removeImage}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          type="button"
        >
          <FiX size={16} />
        </button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`p-8 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors ${className} ${
        isDragActive ? 'border-blue-500 bg-blue-50' : ''
      }`}
    >
      <input {...getInputProps()} />
      {isUploading ? (
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
          <p className="text-sm text-gray-600">Uploading...</p>
        </div>
      ) : (
        <>
          <FiUpload className="w-10 h-10 text-gray-400 mb-2" />
          <p className="text-sm text-center text-gray-600">
            {isDragActive
              ? 'Drop the image here'
              : 'Drag & drop an image here, or click to select'}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Recommended size: 1200x630px
          </p>
        </>
      )}
    </div>
  );
}
