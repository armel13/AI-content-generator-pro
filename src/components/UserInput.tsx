import React, { useState, useEffect } from 'react';
import { ProductDetails } from '../utils/mockAi';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface UserInputProps {
  detectedProduct: ProductDetails | null;
  onGenerate: (title: string, audience: string) => void;
  isGenerating: boolean;
}

export const UserInput: React.FC<UserInputProps> = ({
  detectedProduct,
  onGenerate,
  isGenerating,
}) => {
  const [title, setTitle] = useState('');
  const [audience, setAudience] = useState('');

  useEffect(() => {
    if (detectedProduct) {
      setTitle(detectedProduct.title);
    }
  }, [detectedProduct]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onGenerate(title, audience);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <h3 className="text-lg font-semibold mb-4">Content Details</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Product Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="e.g. Sepatu Sneakers Putih"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 dark:border-gray-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Target Audience (Optional)
          </label>
          <input
            type="text"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            placeholder="e.g. Anak Kuliahan, Pekerja Kantoran"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 dark:border-gray-700"
          />
        </div>

        <button
          type="submit"
          disabled={!title.trim() || isGenerating}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-5 h-5" />
              </motion.div>
              Generating Magic...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Script
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};
