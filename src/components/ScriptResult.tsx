import React, { useState } from 'react';
import { GeneratedScript } from '../utils/mockAi';
import { Copy, CheckCircle2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScriptResultProps {
  script: GeneratedScript | null;
  onGenerateNew: () => void;
  isGenerating: boolean;
}

export const ScriptResult: React.FC<ScriptResultProps> = ({
  script,
  onGenerateNew,
  isGenerating,
}) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!script) return null;

  const handleCopy = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  const Section = ({ title, content, id }: { title: string; content: string; id: string }) => (
    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 relative group">
      <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
        {title}
      </h4>
      <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap pr-10">
        {content}
      </p>
      <button
        onClick={() => handleCopy(content, id)}
        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-800 rounded-md transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
        title="Copy to clipboard"
      >
        {copiedSection === id ? (
          <CheckCircle2 className="w-5 h-5 text-green-500" />
        ) : (
          <Copy className="w-5 h-5" />
        )}
      </button>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          Your Viral Script
        </h3>
        <button
          onClick={onGenerateNew}
          disabled={isGenerating}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
          New Variation
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={script.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="space-y-4"
        >
          <Section title="Hook (1-3 Seconds)" content={script.hook} id="hook" />
          <Section title="Main Body" content={script.main} id="main" />
          <Section title="Call To Action" content={script.cta} id="cta" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Section title="Caption" content={script.caption} id="caption" />
            <Section title="Hashtags" content={script.hashtags} id="hashtags" />
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
        <button
          onClick={() => handleCopy(`${script.hook}\n\n${script.main}\n\n${script.cta}\n\n${script.caption}\n\n${script.hashtags}`, 'all')}
          className="w-full flex items-center justify-center gap-2 py-3 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          {copiedSection === 'all' ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              Copied Full Script!
            </>
          ) : (
            <>
              <Copy className="w-5 h-5" />
              Copy Full Content
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};
