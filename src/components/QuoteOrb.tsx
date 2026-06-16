import React, { useState, useEffect } from "react";
import { Sparkles, RefreshCw, Quote } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { soundManager } from "../utils/sound";

interface QuoteOrbProps {
  language: string; 
  niche?: string;
}

interface QuoteItem {
  id: string;
  text: string;
  author: string;
  lang: "English" | "Hinglish";
}

const QUOTES: QuoteItem[] = [
  // Pure English
  {
    id: "e1",
    text: "Your first 3 seconds dictate your next 30 days of reach. Hook them with the tension, reward them with the relief.",
    author: "Creator Strategy",
    lang: "English",
  },
  {
    id: "e2",
    text: "The average human has an 8-second attention span. Simple communication always beats complex jargon.",
    author: "UX Psychology",
    lang: "English",
  },
  {
    id: "e3",
    text: "Great scripts are not written; they are structural holdings. Stage the revelation, never just list the facts.",
    author: "Directing Manual",
    lang: "English",
  },
  {
    id: "e4",
    text: "The hook is the wrapper. The information is the prize. Make the wrapper so compelling they have no choice but to tear it open.",
    author: "Viral Growth",
    lang: "English",
  },
  {
    id: "e5",
    text: "Don't build just a hook. Build a curiosity gap. Tell them what occurred, but hide how or why until the final frame.",
    author: "Retention Lead",
    lang: "English",
  },
  // Hinglish
  {
    id: "h1",
    text: "Script aisi likho ki log scroll karna hi bhool jayein. Har line me ek suspense ya B-roll marker hona chahiye.",
    author: "Content Guru",
    lang: "Hinglish",
  },
  {
    id: "h2",
    text: "Pehla 3 second attention kheechta hai, par baaki ka 57 seconds content aur emotion se hi rukta hai.",
    author: "Analyst Vibe",
    lang: "Hinglish",
  },
  {
    id: "h3",
    text: "Viewers ko gyaan mat do, unhe solution do. Apne speech me high energy visual beats ko design karo.",
    author: "Shorts Architect",
    lang: "Hinglish",
  },
  {
    id: "h4",
    text: "Loop script aisi buraao ki video khatam hone par viewer ko pata na chale ki video kab dobara shuru ho gayi.",
    author: "Virality Team",
    lang: "Hinglish",
  },
  {
    id: "h5",
    text: "Simple spoken lines always beat high-sounding English definitions. Logon ke dil tak pahuncho, dimaag khud-ba-khud sunega.",
    author: "Public Speaker",
    lang: "Hinglish",
  }
];

export default function QuoteOrb({ language }: QuoteOrbProps) {
  const [activeQuote, setActiveQuote] = useState<QuoteItem>(QUOTES[0]);
  const [isHovered, setIsHovered] = useState(false);

  // Filter quotes based on language context
  const filtered = QUOTES.filter(
    (q) => q.lang.toLowerCase() === language.toLowerCase()
  );
  
  const finalPool = filtered.length > 0 ? filtered : QUOTES;

  useEffect(() => {
    // Select a random quote from the filtered pool
    const randomIdx = Math.floor(Math.random() * finalPool.length);
    setActiveQuote(finalPool[randomIdx]);
  }, [language]);

  const handleShuffle = () => {
    soundManager.playClick();
    const otherQuotes = finalPool.filter((q) => q.id !== activeQuote.id);
    if (otherQuotes.length > 0) {
      const idx = Math.floor(Math.random() * otherQuotes.length);
      setActiveQuote(otherQuotes[idx]);
    } else {
      const idx = Math.floor(Math.random() * finalPool.length);
      setActiveQuote(finalPool[idx]);
    }
  };

  return (
    <motion.div
      onMouseEnter={() => {
        setIsHovered(true);
        soundManager.playHover();
      }}
      onMouseLeave={() => setIsHovered(false)}
      className="relative bg-[#171719] border border-[#2e2b29] rounded-2xl p-5 shadow-lg overflow-hidden flex flex-col md:flex-row items-center justify-between gap-5 transition-all duration-300 hover:border-[#cf7051]/40"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Soft Glow Orbs representing anti-gravity creative power */}
      <div 
        className="absolute -right-20 -bottom-20 w-40 h-40 rounded-full bg-[#cf7051]/10 blur-[40px] pointer-events-none transition-all duration-500"
        style={{ transform: isHovered ? "scale(1.3) translate(-10px, -10px)" : "scale(1)" }}
      />
      <div className="absolute -left-10 -top-10 w-24 h-24 rounded-full bg-[#cca972]/5 blur-[25px] pointer-events-none" />

      {/* Interactive Floating Quote Icon */}
      <div className="relative flex-shrink-0">
        <motion.div
          animate={{ 
            y: [0, -6, 0],
            rotate: [0, 2, -2, 0]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 5, 
            ease: "easeInOut" 
          }}
          className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#cf7051] to-[#cca972] p-0.5 flex items-center justify-center shadow-md shadow-[#cf7051]/15"
        >
          <div className="w-full h-full bg-[#121214] rounded-[10px] flex items-center justify-center">
            <Quote className="w-5 h-5 text-[#cca972]" />
          </div>
        </motion.div>
        
        {/* Anti-gravity floating rings */}
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="absolute -inset-1.5 border border-[#cf7051]/20 rounded-xl pointer-events-none"
        />
      </div>

      {/* Quote Display Area */}
      <div className="flex-1 text-center md:text-left z-10">
        <div className="flex items-center justify-center md:justify-start gap-1.5 mb-1">
          <span className="text-[10px] uppercase font-bold text-[#cca972] tracking-wider font-mono">
            Creator Intelligence Fuel
          </span>
          <Sparkles className="w-3 h-3 text-[#cf7051] animate-pulse" />
        </div>
        
        <div className="relative min-h-[48px] flex items-center justify-center md:justify-start">
          <AnimatePresence mode="wait">
            <motion.p
              key={activeQuote.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.25 }}
              className="text-xs md:text-sm font-medium text-[#e8dfd8] leading-relaxed italic"
            >
              "{activeQuote.text}"
            </motion.p>
          </AnimatePresence>
        </div>
        
        <div className="mt-1.5 flex items-center justify-center md:justify-start gap-2">
          <span className="text-[10.5px] text-[#9ca69b] font-semibold">
            — {activeQuote.author}
          </span>
          <span className="text-[9px] bg-[#222224] border border-[#2c2b2e] text-[#9ca69b] px-1.5 py-0.5 rounded font-mono">
            {activeQuote.lang} Mode
          </span>
        </div>
      </div>

      {/* Action to shuffle */}
      <button
        onClick={handleShuffle}
        className="flex-shrink-0 p-2.5 rounded-xl bg-[#202022] hover:bg-[#2e2e32] border border-[#2e2c2a] text-[#cca972] hover:text-white transition duration-200 flex items-center justify-center group"
        title="Shuffle inspirational quote"
      >
        <RefreshCw className="w-4 h-4 transition duration-300 group-hover:rotate-180" />
      </button>
    </motion.div>
  );
}
