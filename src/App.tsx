import { useState } from 'react';
import { Layout } from './components/Layout';
import { ImageUpload, type UploadedImage } from './components/ImageUpload';
import { ProductInput } from './components/ProductInput';
import { ContentResult } from './components/ContentResult';
import type { ProductDetectionResult } from './lib/detection';
import { generateScript, type GeneratedContent } from './lib/generator';
import { Wand2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [title, setTitle] = useState('');
  const [audience, setAudience] = useState('');
  const [detection, setDetection] = useState<ProductDetectionResult | null>(null);

  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (!title.trim() || !detection) return;

    setIsGenerating(true);
    // Simulate API delay for better UX
    setTimeout(() => {
      const result = generateScript(title, audience, detection);
      setContent(result);
      setIsGenerating(false);
    }, 800);
  };

  const isReadyToGenerate = title.trim().length > 0 && detection !== null;

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-10 md:py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-gray-900 dark:text-white">
            Generate Viral Product Content in <span className="text-blue-600 dark:text-blue-500">Seconds</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Upload your product images and let our AI create high-converting TikTok scripts, captions, and hashtags automatically.
          </p>
        </div>

        <div className="w-full max-w-3xl space-y-8">
          {/* Step 1: Images */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-sm mr-2">1</span>
              Upload Images <span className="text-sm font-normal text-gray-500 ml-2">(Optional)</span>
            </h2>
            <ImageUpload images={images} setImages={setImages} />
          </section>

          {/* Step 2: Product Details */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-sm mr-2">2</span>
              Product Details
            </h2>
            <ProductInput
              images={images}
              title={title}
              setTitle={setTitle}
              audience={audience}
              setAudience={setAudience}
              onDetectionChange={setDetection}
            />
          </section>

          {/* Generate Button */}
          <div className="pt-4 pb-8 flex justify-center">
            <button
              onClick={handleGenerate}
              disabled={!isReadyToGenerate || isGenerating}
              className={`
                flex items-center space-x-2 px-8 py-4 rounded-full text-lg font-bold shadow-lg transition-all
                ${isReadyToGenerate && !isGenerating
                  ? 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 hover:shadow-xl'
                  : 'bg-gray-300 dark:bg-gray-800 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              <Wand2 className={`w-5 h-5 ${isGenerating ? 'animate-pulse' : ''}`} />
              <span>{isGenerating ? 'Generating Magic...' : 'Generate AI Content'}</span>
            </button>
          </div>

          {/* Step 3: Results */}
          <AnimatePresence>
            {content && (
              <motion.section
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
                  <ContentResult
                    content={content}
                    onGenerateNew={handleGenerate}
                    isGenerating={isGenerating}
                  />
                </div>
              </motion.section>
            )}
          </AnimatePresence>

        </div>
      </div>
    </Layout>
  );
}

export default App;