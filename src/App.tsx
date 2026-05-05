import { useState, useEffect } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ProductDetection } from './components/ProductDetection';
import { UserInput } from './components/UserInput';
import { ScriptResult } from './components/ScriptResult';
import { detectProduct, generateScript, ProductDetails, GeneratedScript } from './utils/mockAi';
import { Moon, Sun, Wand2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [, setImages] = useState<File[]>([]);
  const [detectedProduct, setDetectedProduct] = useState<ProductDetails | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [confirmedProduct, setConfirmedProduct] = useState<ProductDetails | null>(null);
  const [generatedScript, setGeneratedScript] = useState<GeneratedScript | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [audience, setAudience] = useState('');

  // Handle dark mode
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleImagesSelected = async (files: File[]) => {
    setImages(files);
    setConfirmedProduct(null);
    setGeneratedScript(null);

    if (files.length > 0) {
      setIsDetecting(true);
      try {
        const product = await detectProduct(files[0]);
        setDetectedProduct(product);
      } catch (error) {
        console.error("Failed to detect product", error);
      } finally {
        setIsDetecting(false);
      }
    } else {
      setDetectedProduct(null);
    }
  };

  const handleProductConfirm = (product: ProductDetails) => {
    setConfirmedProduct(product);
  };

  const handleGenerateScript = async (title: string, targetAudience: string) => {
    if (!confirmedProduct) return;

    setIsGenerating(true);
    setAudience(targetAudience);

    try {
      const script = await generateScript(
        { ...confirmedProduct, title },
        targetAudience
      );
      setGeneratedScript(script);
    } catch (error) {
      console.error("Failed to generate script", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateVariation = () => {
    if (confirmedProduct) {
      handleGenerateScript(confirmedProduct.title, audience);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
              <Wand2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 hidden sm:block">
              AI Content Generator Pro
            </h1>
          </div>

          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            Create Viral Scripts in Seconds
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Upload your product images, let our AI analyze them, and generate high-converting TikTok-style scripts, captions, and hashtags instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Input */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4">1. Upload Product Images</h3>
              <ImageUploader onImagesSelected={handleImagesSelected} maxImages={100} />
            </div>

            <AnimatePresence>
              {(isDetecting || detectedProduct) && !confirmedProduct && (
                <ProductDetection
                  detectedProduct={detectedProduct}
                  isDetecting={isDetecting}
                  onConfirm={handleProductConfirm}
                />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {confirmedProduct && (
                <UserInput
                  detectedProduct={confirmedProduct}
                  onGenerate={handleGenerateScript}
                  isGenerating={isGenerating}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Right Column - Output */}
          <div className="lg:col-span-7">
            <div className="sticky top-24">
              <AnimatePresence mode="wait">
                {generatedScript ? (
                  <ScriptResult
                    script={generatedScript}
                    onGenerateNew={handleGenerateVariation}
                    isGenerating={isGenerating}
                  />
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center bg-white/50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700"
                  >
                    <Wand2 className="w-12 h-12 text-gray-400 dark:text-gray-600 mb-4 opacity-50" />
                    <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">
                      Your script will appear here
                    </h3>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2 max-w-sm">
                      Upload an image and confirm the product details to generate your first viral script.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
