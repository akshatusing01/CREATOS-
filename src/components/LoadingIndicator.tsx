import React, { useState, useEffect } from "react";
import { Loader2, Sparkles, Cpu, Activity, Video } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const MESSAGES = [
  { text: "Ingesting raw concepts & extracting core values...", icon: Cpu },
  { text: "Analyzing viewer psychological hook triggers...", icon: Sparkles },
  { text: "Injecting Retention-First speaking rhythm curves...", icon: Activity },
  { text: "Applying professional B-Roll director layout marks...", icon: Video },
  { text: "Structuring ready-to-publish titles, thumbnail lines & tags...", icon: Loader2 },
  { text: "Assembling your 4 custom production-ready script models...", icon: Sparkles }
];

export default function LoadingIndicator() {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const CurrentIcon = MESSAGES[msgIndex].icon;

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 min-h-[400px]">
      <div className="relative mb-8">
        {/* Ring animations */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          className="w-24 h-24 rounded-full border-4 border-t-indigo-500 border-r-indigo-400/30 border-b-purple-500/10 border-l-purple-500/30"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="absolute inset-2 rounded-full border-2 border-b-teal-500 border-t-transparent border-l-transparent border-r-teal-500/20"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
        </div>
      </div>

      <div className="text-center max-w-sm h-16 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={msgIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center gap-2"
          >
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              <CurrentIcon className="w-4 h-4 animate-pulse text-indigo-400" />
              <span>CreatorOS Engine</span>
            </div>
            <p className="text-sm font-medium text-gray-300 leading-snug">
              {MESSAGES[msgIndex].text}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress status bar */}
      <div className="w-64 h-1.5 bg-gray-800 rounded-full overflow-hidden mt-6 border border-gray-700/50">
        <motion.div
          initial={{ width: "5%" }}
          animate={{ width: "95%" }}
          transition={{ duration: 18, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-full"
        />
      </div>
      <span className="text-[10px] text-gray-500 font-mono mt-3 uppercase tracking-widest">
        Compiling packages • Do not close tabs
      </span>
    </div>
  );
}
