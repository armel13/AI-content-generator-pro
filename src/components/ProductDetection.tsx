import React, { useState, useEffect } from 'react';
import { ProductDetails } from '../utils/mockAi';
import { Check, Edit2, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductDetectionProps {
  detectedProduct: ProductDetails | null;
  isDetecting: boolean;
  onConfirm: (product: ProductDetails) => void;
}

export const ProductDetection: React.FC<ProductDetectionProps> = ({
  detectedProduct,
  isDetecting,
  onConfirm,
}) => {
  const [editedTitle, setEditedTitle] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (detectedProduct) {
      setEditedTitle(detectedProduct.title);
    }
  }, [detectedProduct]);

  if (isDetecting) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Zap className="w-8 h-8 text-blue-500 mb-4" />
        </motion.div>
        <p className="text-lg font-medium text-blue-700 dark:text-blue-300">
          AI is analyzing your image...
        </p>
      </div>
    );
  }

  if (!detectedProduct) return null;

  const handleConfirm = () => {
    onConfirm({
      ...detectedProduct,
      title: editedTitle,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Product Detected
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Please confirm or edit the details below
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Product Title
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              disabled={!isEditing}
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-900 dark:border-gray-700 disabled:opacity-50"
            />
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 border rounded-lg hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
            >
              <Edit2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            <span className="block text-gray-500 dark:text-gray-400 mb-1">Category</span>
            <span className="font-medium">{detectedProduct.category}</span>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            <span className="block text-gray-500 dark:text-gray-400 mb-1">Style</span>
            <span className="font-medium">{detectedProduct.style}</span>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            <span className="block text-gray-500 dark:text-gray-400 mb-1">Use Case</span>
            <span className="font-medium">{detectedProduct.useCase}</span>
          </div>
        </div>

        <button
          onClick={handleConfirm}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
        >
          <Check className="w-5 h-5" />
          Confirm Details
        </button>
      </div>
    </motion.div>
  );
};
