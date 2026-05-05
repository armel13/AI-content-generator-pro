import { useState, useEffect } from 'react';
import { detectProduct, type ProductDetectionResult } from '../lib/detection';
import type { UploadedImage } from './ImageUpload';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface ProductInputProps {
  images: UploadedImage[];
  title: string;
  setTitle: (val: string) => void;
  audience: string;
  setAudience: (val: string) => void;
  onDetectionChange: (detection: ProductDetectionResult | null) => void;
}

export function ProductInput({
  images,
  title,
  setTitle,
  audience,
  setAudience,
  onDetectionChange
}: ProductInputProps) {
  const [detection, setDetection] = useState<ProductDetectionResult | null>(null);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [confirmedCategory, setConfirmedCategory] = useState<string>('');

  useEffect(() => {
    let active = true;

    // Use a small timeout to avoid synchronous set state in effect
    const timerId = setTimeout(() => {
      if (images.length === 0 && !title.trim()) {
        if (active) {
          setDetection(null);
          setNeedsConfirmation(false);
          onDetectionChange(null);
        }
        return;
      }

      const imageNames = images.map(img => img.file.name);
      const result = detectProduct(imageNames, title);

      if (active) {
        if (result.confidence < 0.6) {
          setNeedsConfirmation(true);
          setConfirmedCategory(result.category === 'Unknown' ? '' : result.category);
        } else {
          setNeedsConfirmation(false);
          setConfirmedCategory(result.category);
        }

        setDetection(result);

        if (result.confidence >= 0.6) {
          onDetectionChange(result);
        } else {
          onDetectionChange(null);
        }
      }
    }, 100);

    return () => {
      active = false;
      clearTimeout(timerId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images, title]);

  const handleConfirm = () => {
    if (!confirmedCategory.trim()) return;

    const finalDetection: ProductDetectionResult = {
      category: confirmedCategory,
      confidence: 1.0, // Manually confirmed
      style: 'General',
      useCase: 'General'
    };

    setDetection(finalDetection);
    setNeedsConfirmation(false);
    onDetectionChange(finalDetection);
  };

  return (
    <div className="w-full space-y-6 bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="space-y-4">
        <div>
          <label htmlFor="product-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Product Title <span className="text-red-500">*</span>
          </label>
          <input
            id="product-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Wireless Noise-Cancelling Headphones"
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            required
          />
        </div>

        <div>
          <label htmlFor="target-audience" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Target Audience <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <input
            id="target-audience"
            type="text"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            placeholder="e.g., Students, Gamers, Moms"
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>
      </div>

      {detection && (
        <div className={cn(
          "p-4 rounded-xl border transition-all",
          needsConfirmation
            ? "bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800"
            : "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800"
        )}>
          {needsConfirmation ? (
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    AI needs help identifying the product
                  </p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                    Please confirm or enter the product category so we can generate the best content.
                  </p>
                </div>
              </div>
              <div className="flex space-x-2 mt-2">
                <input
                  type="text"
                  value={confirmedCategory}
                  onChange={(e) => setConfirmedCategory(e.target.value)}
                  placeholder="e.g., Shoes, Electronics..."
                  className="flex-1 px-3 py-1.5 text-sm bg-white dark:bg-gray-950 border border-yellow-300 dark:border-yellow-700 rounded-md focus:ring-2 focus:ring-yellow-500 outline-none"
                />
                <button
                  onClick={handleConfirm}
                  disabled={!confirmedCategory.trim()}
                  className="px-4 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50"
                >
                  Confirm
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-500" />
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  AI detected: <span className="font-bold">{detection.category}</span>
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}