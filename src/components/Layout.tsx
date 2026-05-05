import React from 'react';
import { useDarkMode } from '../hooks/useDarkMode';
import { Moon, Sun, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function Layout({ children }: { children: React.ReactNode }) {
  const { theme, toggleTheme } = useDarkMode();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-6xl">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">ContentGen Pro</span>
          </div>

          <nav className="flex items-center">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-gray-400 hover:text-gray-100" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600 hover:text-gray-900" />
              )}
            </button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.div>
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-800 py-8 mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>© {new Date().getFullYear()} ContentGen Pro. Built for creators.</p>
      </footer>
    </div>
  );
}