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
          className="w-24 h-24 rounded-full border-4 border-t-[#cf7051] border-r-[#cf7051]/30 border-b-[#cca972]/10 border-l-[#cca972]/30"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="absolute inset-2 rounded-full border-2 border-b-[#cca972] border-t-transparent border-l-transparent border-r-[#cca972]/20"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#cf7051] animate-spin" />
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
            <div className="flex items-center gap-2 text-[#cca972] text-[10px] font-black uppercase tracking-wider">
              <CurrentIcon className="w-4 h-4 animate-pulse text-[#cf7051]" />
              <span>CreatorOS Engine</span>
            </div>
            <p className="text-sm font-medium text-[#e8dfd8] leading-snug">
              {MESSAGES[msgIndex].text}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress status bar */}
      <div className="w-64 h-1.5 bg-[#0c0c0e] rounded-full overflow-hidden mt-6 border border-[#232225] shadow-inner">
        <motion.div
          initial={{ width: "5%" }}
          animate={{ width: "95%" }}
          transition={{ duration: 18, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-[#cf7051] via-[#cca972] to-[#9ca69b] rounded-full"
        />
      </div>
      <span className="text-[9px] text-[#9ca69b] font-mono mt-3 uppercase tracking-widest">
        Compiling packages • Do not close tabs
      </span>
    </div>
  );
}
