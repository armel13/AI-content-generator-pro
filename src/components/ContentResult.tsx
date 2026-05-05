import { useState } from 'react';
import type { GeneratedContent } from '../lib/generator';
import { Copy, Check, RefreshCw, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

interface ContentResultProps {
  content: GeneratedContent;
  onGenerateNew: () => void;
  isGenerating: boolean;
}

const Section = ({ title, text, id, copiedId, handleCopy }: { title: string, text: string, id: string, copiedId: string | null, handleCopy: (text: string, id: string) => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 hover:border-blue-200 dark:hover:border-blue-800 transition-colors group shadow-sm"
  >
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
        {title}
      </h3>
      <button
        onClick={() => handleCopy(text, id)}
        className="p-1.5 rounded-md text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        title="Copy to clipboard"
      >
        {copiedId === id ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </button>
    </div>
    <p className="text-gray-800 dark:text-gray-200 text-base leading-relaxed whitespace-pre-wrap">
      {text}
    </p>
  </motion.div>
);

export function ContentResult({ content, onGenerateNew, isGenerating }: ContentResultProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-6 h-6 text-blue-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Generated Content
          </h2>
        </div>

        <button
          onClick={onGenerateNew}
          disabled={isGenerating}
          className={cn(
            "flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg text-sm font-medium transition-colors",
            isGenerating && "opacity-50 cursor-not-allowed"
          )}
        >
          <RefreshCw className={cn("w-4 h-4", isGenerating && "animate-spin")} />
          <span>New Variation</span>
        </button>
      </div>

      <div className="grid gap-4">
        <Section title="Hook (1-3 Seconds)" text={content.hook} id="hook" copiedId={copiedId} handleCopy={handleCopy} />
        <Section title="Main Script" text={content.script} id="script" copiedId={copiedId} handleCopy={handleCopy} />
        <Section title="Call To Action (CTA)" text={content.cta} id="cta" copiedId={copiedId} handleCopy={handleCopy} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Section title="Caption" text={content.caption} id="caption" copiedId={copiedId} handleCopy={handleCopy} />
          <Section title="Hashtags" text={content.hashtags} id="hashtags" copiedId={copiedId} handleCopy={handleCopy} />
        </div>
      </div>
    </div>
  );
}