import React from "react";
import { Sparkles, TrendingUp, Calendar, ArrowRight, Zap } from "lucide-react";
import { motion } from "motion/react";

interface CreatorPulseProps {
  eventVibe: "diwali" | "holi" | "independence" | "normal";
  onNavigateToScriptLab: () => void;
}

export default function CreatorPulse({ eventVibe, onNavigateToScriptLab }: CreatorPulseProps) {
  // Dynamic content based on active festival/event vibe
  const getVibeContent = () => {
    switch (eventVibe) {
      case "diwali":
        return {
          vibeTitle: "Diwali Season Warmth",
          opportunity: "Pre-Diwali cleaning (Dussehra to Diwali transition) and shopping hacks are viral. Frame your tech/finance advice around 'Smart shopping secret to save ₹10,000 this Diwali'.",
          pattern: "Short Reels starting with high-energy physical movement (holding dry fruit boxes or cleaning gadgets) then transitioning to elite screen recordings of tricks are hitting 2.5M+ views in India.",
          festivalHook: "🔥 'Diwali gifts pe paise waste karna band karo!' - Start with this shocking statement to capture premium tech-buyers.",
          accentBg: "from-amber-500/10 to-orange-500/5",
          accentBorder: "border-amber-200",
          accentText: "text-amber-700"
        };
      case "holi":
        return {
          vibeTitle: "Holi Festival Energy",
          opportunity: "Post-Holi skin/hair care hacks, eco-friendly celebration guides, and startup 'Holi marketing fail' analyses are gaining incredible traction. Focus on 'the chaos after Holi'.",
          pattern: "Split-screen reaction clips explaining psychological tricks behind viral street-style Holi reels are seeing a 45% increase in save-rates on Instagram.",
          festivalHook: "🎨 'Holi ka rang toh utar jayega, par ye financial regret nahi...' - A high-stopping hook for finance/educational creators.",
          accentBg: "from-pink-500/10 to-purple-500/5",
          accentBorder: "border-pink-200",
          accentText: "text-pink-700"
        };
      case "independence":
        return {
          vibeTitle: "Desh Bhakti Pride",
          opportunity: "Tributes, Indian brand growth stories (Tata, Amul, ISRO), and modern India's tech revolutions are dominating the algorithms. Perfect for business and general education creators.",
          pattern: "Map visualizers combined with vintage archive photos of old India vs. fast cuts of modern tech parks are averaging 1.8M+ views on YouTube Shorts.",
          festivalHook: "🇮🇳 'Ye 3 Indian brands ne gore logo ki companies ko hara diya!' - Highly emotional storytelling hook to drive national pride and shares.",
          accentBg: "from-orange-500/10 to-emerald-500/5",
          accentBorder: "border-orange-200",
          accentText: "text-orange-700"
        };
      default:
        return {
          vibeTitle: "Regular Monsoon Grit",
          opportunity: "Chai-time storytelling, monsoon workspace set-up guides, and end-of-semester exam preparation tips are trending among Gen-Z students. Frame lessons as 'brotherly/sisterly advice'.",
          pattern: "Text-to-speech voiceovers with soothing background music combined with satisfying keyboard typing or rainy window B-rolls are sweeping Reels right now.",
          festivalHook: "🌧️ 'Agar tum is rainy season mein sirf time waste kar rahe ho...' - Direct, urgent hook to drive high attention.",
          accentBg: "from-blue-500/10 to-slate-500/5",
          accentBorder: "border-blue-200",
          accentText: "text-blue-700"
        };
    }
  };

  const current = getVibeContent();

  return (
    <div className="space-y-6" id="creator-pulse-root">
      {/* Scope Clarifier - answering What, Why, and Next */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-5 shadow-sm">
        <div className="flex gap-3">
          <div className="p-2 bg-amber-500/10 rounded-xl text-amber-700 h-10 w-10 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Creator Pulse • Daily Intel</h2>
            <p className="text-xs text-slate-600 mt-1">
              <strong>What is this?</strong> A real-time content strategy guide tailored for the Indian cultural calendar.<br />
              <strong>Why care?</strong> Algorithms favor creators who latch onto trending patterns and seasonal sentiment early.<br />
              <strong>What to do next?</strong> Read today's trend cards below, select a hook, and hit <strong>Create Now</strong> to write your script!
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Today's Opportunity */}
        <motion.div
          whileHover={{ y: -4 }}
          className={`bg-white border ${current.accentBorder} rounded-2xl p-5 shadow-sm flex flex-col justify-between`}
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className={`p-1.5 rounded-lg bg-orange-100 ${current.accentText}`}>
                <Sparkles className="w-4 h-4" />
              </span>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Today's Opportunity</h3>
            </div>
            <p className="text-sm font-bold text-slate-900 leading-snug mb-3">
              Seasonal Catalyst: {current.vibeTitle}
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              {current.opportunity}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>UPDATED 2H AGO</span>
            <span className="text-amber-600 font-semibold">HIGH PRIORITY</span>
          </div>
        </motion.div>

        {/* Card 2: Trending Pattern */}
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
                <TrendingUp className="w-4 h-4" />
              </span>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Trending Indian Pattern</h3>
            </div>
            <p className="text-sm font-bold text-slate-900 leading-snug mb-3">
              Viral Formatting Paradigm
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              {current.pattern}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>AVG REACH: 1.5M+</span>
            <span className="text-indigo-600 font-semibold">ALGO APPROVED</span>
          </div>
        </motion.div>

        {/* Card 3: Festival Hook Idea */}
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="p-1.5 rounded-lg bg-rose-100 text-rose-700">
                <Calendar className="w-4 h-4" />
              </span>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Festival Hook Idea</h3>
            </div>
            <p className="text-sm font-bold text-slate-900 leading-snug mb-3">
              Cultural Relatability Factor
            </p>
            <div className="bg-rose-50/50 p-3 rounded-xl border border-rose-100/50 my-2">
              <p className="text-xs text-rose-950 font-medium italic">
                {current.festivalHook}
              </p>
            </div>
            <p className="text-[11px] text-slate-500">
              Adapts traditional festive emotion to modern short-form business or tech storytelling instantly.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>TONE: HONEST BOLD</span>
            <span className="text-rose-600 font-semibold">READY TO USE</span>
          </div>
        </motion.div>
      </div>

      {/* Prominent High-Contrast Call to Action */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div>
          <h3 className="text-base font-bold font-display tracking-tight text-white flex items-center gap-2">
            Got an idea brewing today?
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Take today's insights directly to the Atelier Script Lab. We'll turn your rough concept into an optimized script with curated visual cues, scroll-stoppers, and SEO hashtags.
          </p>
        </div>
        <button
          onClick={onNavigateToScriptLab}
          className="w-full md:w-auto bg-[#cf7051] hover:bg-[#c06041] hover:scale-[1.02] text-white font-bold py-3 px-6 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-lg shrink-0 cursor-pointer"
        >
          <span>Create Now</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
