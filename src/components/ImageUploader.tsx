import React, { useCallback, useState } from 'react';
import { UploadCloud, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageUploaderProps {
  onImagesSelected: (files: File[]) => void;
  maxImages?: number;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImagesSelected,
  maxImages = 100
}) => {
  const [images, setImages] = useState<{ file: File; url: string }[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback((newFiles: File[]) => {
    const validFiles = newFiles.filter(file => file.type.startsWith('image/'));

    setImages(prev => {
      const combined = [...prev];
      for (const file of validFiles) {
        if (combined.length < maxImages) {
          combined.push({ file, url: URL.createObjectURL(file) });
        }
      }
      onImagesSelected(combined.map(img => img.file));
      return combined;
    });
  }, [maxImages, onImagesSelected]);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, [handleFiles]);

  const onFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  }, [handleFiles]);

  const removeImage = useCallback((indexToRemove: number) => {
    setImages(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[indexToRemove].url);
      updated.splice(indexToRemove, 1);
      onImagesSelected(updated.map(img => img.file));
      return updated;
    });
  }, [onImagesSelected]);

  return (
    <div className="w-full">
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
        }`}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          id="image-upload"
          onChange={onFileInput}
        />
        <label
          htmlFor="image-upload"
          className="cursor-pointer flex flex-col items-center justify-center gap-4"
        >
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
            <UploadCloud className="w-8 h-8 text-gray-500 dark:text-gray-400" />
          </div>
          <div>
            <p className="text-lg font-medium text-gray-700 dark:text-gray-200">
              Click to upload or drag and drop
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              SVG, PNG, JPG or GIF (max. {maxImages} images)
            </p>
          </div>
        </label>
      </div>

      {images.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Uploaded Images ({images.length}/{maxImages})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <AnimatePresence>
              {images.map((img, index) => (
                <motion.div
                  key={img.url}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
                >
                  <img
                    src={img.url}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};
