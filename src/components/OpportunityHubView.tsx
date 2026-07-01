import React from "react";
import { Flame, Compass, ArrowRight, Sparkles, AlertTriangle } from "lucide-react";
import { motion } from "motion/react";
import { soundManager } from "../utils/sound";

interface OpportunityHubViewProps {
  setText: (v: string) => void;
  setNiche: (v: string) => void;
  setLanguage: (v: string) => void;
  setActiveWorkspace: (v: any) => void;
}

interface Opportunity {
  id: string;
  title: string;
  category: string;
  niche: string;
  audience: string;
  urgency: "High" | "Medium" | "Steady";
  urgencyColor: string;
  description: string;
  hookSuggestion: string;
  promptText: string;
}

export default function OpportunityHubView({
  setText,
  setNiche,
  setLanguage,
  setActiveWorkspace
}: OpportunityHubViewProps) {
  const opportunities: Opportunity[] = [
    {
      id: "monsoon-tech",
      title: "Monsoon Tech & Coding Hacks",
      category: "Tech & Remote Placements",
      niche: "Tech / coding / dev",
      audience: "College Students & Job Aspirants",
      urgency: "High",
      urgencyColor: "text-rose-600 bg-rose-50 border-rose-200",
      description: "How Indian developers can utilize rain-bound off-campus days to build full-stack local AI tools instead of relying purely on mass recruiter placements.",
      hookSuggestion: "Mumbai rains me phase bina mass placements ke direct coding jobs crack kaise karein?",
      promptText: "How to prepare for off-campus software engineering placements from home during the monsoon season when college classes are suspended. Focus on building real-world open-source portfolio apps."
    },
    {
      id: "upsc-interviews",
      title: "UPSC Mock Interview Anxiety Guides",
      category: "Education & Mental Hacks",
      niche: "JEE / NEET / UPSC / SSC",
      audience: "UPSC & Competitive Exam Aspirants",
      urgency: "Steady",
      urgencyColor: "text-slate-gray bg-soft-sand border-soft-stone",
      description: "Why premium mock interview panels stress out candidates and how simple cognitive reframing tricks can help aspirants present answers with absolute IAS composure.",
      hookSuggestion: "UPSC mocks ke standard stress panel ko handle karne ka 1 elite interview secret...",
      promptText: "Why UPSC aspirants feel extreme stress before mock interviews and how to frame answers like an elite, calm IAS officer under tough cross-examinations."
    },
    {
      id: "ipl-startup",
      title: "IPL Season Attention Hijacks",
      category: "Startup & Marketing Campaigns",
      niche: "Startup / entrepreneurship",
      audience: "Founders & Creative Marketers",
      urgency: "High",
      urgencyColor: "text-rose-600 bg-rose-50 border-rose-200",
      description: "How early-stage Indian D2C brands can build clever ambient social media campaigns around live IPL scores for zero cost and gain massive viral traction.",
      hookSuggestion: "Kaise ye simple Indian business ne live IPL me 0 rupees spend karke 20 Lakh impressions liye?",
      promptText: "How early stage Indian startup brands can generate millions of impressions on zero ad budget during busy IPL matches using clever real-time social media triggers."
    },
    {
      id: "pre-diwali",
      title: "Pre-Diwali Inventory Fast Clears",
      category: "Local Business & Retail Sales",
      niche: "Finance / money / investing",
      audience: "Small Business Owners & Merchants",
      urgency: "Medium",
      urgencyColor: "text-copper bg-copper/5 border-copper/10",
      description: "A comprehensive blueprint for local retail and clothing stores in Delhi, Mumbai, and Bangalore to clear stock through hyper-targeted geo-ads.",
      hookSuggestion: "Diwali sales ke pehle ye 3 expensive digital ads band kar do, save 50k instantly...",
      promptText: "A blueprint for local retail business owners in Indian metro hubs to run high-ROI pre-Diwali marketing campaigns and clear inventory fast without burning money."
    },
    {
      id: "union-budget",
      title: "Fintech Explainer: Budget SIP Changes",
      category: "Finance & Personal Investment",
      niche: "Finance / money / investing",
      audience: "Middle-Class Earner & Mutual Fund Investors",
      urgency: "High",
      urgencyColor: "text-rose-600 bg-rose-50 border-rose-200",
      description: "Breaking down how standard tax deduction changes affect your index funds and SIP returns, explained in straightforward Hindi-English analogies.",
      hookSuggestion: "Naye finance budget me standard deductions badh gaye! Kya aapka tax bachega ya nuksan hoga?",
      promptText: "Why mutual funds standard deductions changed in the new union budget and what it means for your monthly SIP savings and income tax slabs."
    }
  ];

  const handleLoadOpportunity = (op: Opportunity) => {
    soundManager.playSparkle();
    setText(op.promptText);
    setNiche(op.niche);
    setLanguage("Hinglish");
    setActiveWorkspace("script-studio");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header Deck */}
      <div className="bg-white border border-soft-stone rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase font-extrabold text-copper tracking-widest flex items-center gap-1">
            <Compass className="w-3.5 h-3.5" />
            Trending Opportunity Hub
          </span>
          <h2 className="text-base font-bold text-charcoal mt-1">India-First Content Triggers & Seasonal Arbitrage</h2>
          <p className="text-xs text-slate-gray mt-1 leading-relaxed max-w-2xl">
            Skip generic Western prompts. These content topics are tailored to trending audience behaviors, festivals, educational cycles, and budget shifts in India.
          </p>
        </div>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase bg-copper/10 text-copper border border-copper/20">
          <span className="w-1.5 h-1.5 bg-copper rounded-full animate-ping" />
          Active Feeds Updated
        </span>
      </div>

      {/* Bento Grid Opportunities */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {opportunities.map((op, idx) => (
          <div
            key={op.id}
            className="bg-white border border-soft-stone hover:border-copper/40 rounded-2xl p-5 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2.5">
              <div className="flex justify-between items-start gap-2">
                <span className="text-[9px] text-slate-gray font-bold font-mono uppercase bg-soft-sand px-2 py-0.5 rounded border border-soft-stone">
                  {op.category}
                </span>
                <span className={`text-[8px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded border shrink-0 ${op.urgencyColor}`}>
                  {op.urgency} Interest
                </span>
              </div>

              <h3 className="text-sm font-bold text-charcoal leading-snug">{op.title}</h3>
              <p className="text-[11px] text-slate-gray leading-relaxed">{op.description}</p>

              <div className="bg-soft-sand p-3 rounded-xl border border-soft-stone">
                <span className="block text-[8px] uppercase font-bold text-copper mb-1">🔥 Hook Hook Angle Suggestion</span>
                <p className="text-[11px] font-sans font-medium text-charcoal italic leading-relaxed">
                  &ldquo;{op.hookSuggestion}&rdquo;
                </p>
              </div>
            </div>

            <button
              onClick={() => handleLoadOpportunity(op)}
              className="w-full py-2.5 bg-copper/5 hover:bg-copper text-copper hover:text-white border border-copper/20 text-[10px] uppercase tracking-wider font-bold rounded-xl transition duration-150 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Load Topic into Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
