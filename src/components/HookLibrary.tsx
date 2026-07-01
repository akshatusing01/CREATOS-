import React, { useState } from "react";
import { Sparkles, Library, Filter, Copy, Check, Info } from "lucide-react";
import { motion } from "motion/react";

interface HookFramework {
  id: string;
  name: string;
  category: "curiosity" | "emotional" | "contrarian" | "story" | "educational";
  niche: "tech" | "finance" | "students" | "startups";
  tone: "smart_friend" | "founder" | "mentor" | "bold";
  platform: "reels" | "shorts";
  goal: "virality" | "retention";
  template: string;
  example: string;
  whyItWorks: string;
}

export default function HookLibrary() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedNiche, setSelectedNiche] = useState<string>("all");
  const [selectedTone, setSelectedTone] = useState<string>("all");
  const [selectedGoal, setSelectedGoal] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const frameworks: HookFramework[] = [
    {
      id: "cur-tech-1",
      name: "The Hidden Repository",
      category: "curiosity",
      niche: "tech",
      tone: "smart_friend",
      platform: "reels",
      goal: "virality",
      template: "Bhai, agar tum [target audience] ho, toh is ek hidden secret ko bilkul ignore mat karna...",
      example: "Bhai, agar tum final-year engineering college mein ho, toh is ek hidden GitHub repo ko bilkul ignore mat karna...",
      whyItWorks: "Creates immediate FOMO (Fear Of Missing Out) and establishes personal relevance in under 3 seconds."
    },
    {
      id: "con-fin-1",
      name: "The Financial Contradiction",
      category: "contrarian",
      niche: "finance",
      tone: "bold",
      platform: "reels",
      goal: "retention",
      template: "Suno, [popular belief] sabse bada jhoot hai jo aapko sikhaya gaya hai...",
      example: "Suno, SIP mein invest karna sabse bada jhoot hai jo aapko finance influencers ne sikhaya gaya hai...",
      whyItWorks: "Attacks a highly established truth to trigger disbelief, causing the viewer to stop scrolling to see the justification."
    },
    {
      id: "edu-stu-1",
      name: "The Efficiency Hack",
      category: "educational",
      niche: "students",
      tone: "mentor",
      platform: "shorts",
      goal: "virality",
      template: "[Skill/Task] ko 3x fast seekhne ka ek scientific trick batau...",
      example: "Coding interviews ko 3x fast crack karne ka ek elder-brother advice batau...",
      whyItWorks: "Promises immense value instantly in a clear, structured manner, driving high saves and shares."
    },
    {
      id: "sto-sta-1",
      name: "The Relatable Failure",
      category: "story",
      niche: "startups",
      tone: "founder",
      platform: "reels",
      goal: "retention",
      template: "Ek dilchasp baat batau? Kaise [Subject] ne ₹0 lagakar ek crores ki brand khadi kar di...",
      example: "Ek dilchasp baat batau? Kaise ek chaiwale ne ₹0 marketing lagakar ek crores ki brand khadi kar di...",
      whyItWorks: "Human-interest narrative triggers emotional curiosity and drives high viewer session completion."
    },
    {
      id: "emo-stu-2",
      name: "The Direct Calling",
      category: "emotional",
      niche: "students",
      tone: "mentor",
      platform: "shorts",
      goal: "virality",
      template: "Agar tum is [season/event] mein sirf time waste kar rahe ho, toh ruko aur suno...",
      example: "Agar tum is exams season mein sirf reels scroll karke time waste kar rahe ho, toh 30 seconds ruko aur suno...",
      whyItWorks: "Creates direct peer-to-peer accountability, forcing self-reflection and stopping speed-scrolling."
    }
  ];

  // Filters calculation
  const filteredFrameworks = frameworks.filter(fw => {
    const matchesCat = activeCategory === "all" || fw.category === activeCategory;
    const matchesNiche = selectedNiche === "all" || fw.niche === selectedNiche;
    const matchesTone = selectedTone === "all" || fw.tone === selectedTone;
    const matchesGoal = selectedGoal === "all" || fw.goal === selectedGoal;
    return matchesCat && matchesNiche && matchesTone && matchesGoal;
  });

  return (
    <div className="space-y-6" id="hook-library-root">
      {/* Scope Clarifier */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5 shadow-sm">
        <div className="flex gap-3">
          <div className="p-2 bg-blue-500/10 rounded-xl text-blue-700 h-10 w-10 flex items-center justify-center shrink-0">
            <Library className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Hook Library • Structured Catalog</h2>
            <p className="text-xs text-slate-600 mt-1">
              <strong>What is this?</strong> A collection of high-retention structured opening hook frameworks.<br />
              <strong>Why care?</strong> Structured hooks hook. Unstructured AI text drifts. Choosing an established framework ensures strong retention.<br />
              <strong>What to do next?</strong> Filter by niche or delivery goal, click any card to copy the template, and fill it in!
            </p>
          </div>
        </div>
      </div>

      {/* Filters Hub */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Niche */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Filter Niche</label>
          <select
            value={selectedNiche}
            onChange={(e) => setSelectedNiche(e.target.value)}
            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          >
            <option value="all">All Niches</option>
            <option value="tech">Tech & Coding</option>
            <option value="finance">Personal Finance</option>
            <option value="students">Student & Exams</option>
            <option value="startups">Business & Startups</option>
          </select>
        </div>

        {/* Tone */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Filter Tone</label>
          <select
            value={selectedTone}
            onChange={(e) => setSelectedTone(e.target.value)}
            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          >
            <option value="all">All Tones</option>
            <option value="smart_friend">Sachi Baat (Friend)</option>
            <option value="founder">Founder (Authority)</option>
            <option value="mentor">Elder Brother (Mentor)</option>
            <option value="bold">Contrarian (Bold)</option>
          </select>
        </div>

        {/* Goal */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Algorithm Goal</label>
          <select
            value={selectedGoal}
            onChange={(e) => setSelectedGoal(e.target.value)}
            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          >
            <option value="all">All Goals</option>
            <option value="virality">High Virality</option>
            <option value="retention">Extreme Retention</option>
          </select>
        </div>

        {/* Category Pill select */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Hook Framework Type</label>
          <select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          >
            <option value="all">All Frameworks</option>
            <option value="curiosity">Curiosity Gap</option>
            <option value="contrarian">Contrarian/Shock</option>
            <option value="story">Storytelling</option>
            <option value="educational">Educational</option>
          </select>
        </div>
      </div>

      {/* Grid of Frameworks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredFrameworks.length > 0 ? (
          filteredFrameworks.map((fw) => (
            <div key={fw.id} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-100">
                  <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase">
                    {fw.category}
                  </span>
                  <span className="text-[9px] font-mono text-slate-400 uppercase">
                    Goal: {fw.goal}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mb-2">
                  {fw.name}
                </h3>

                <div className="space-y-3">
                  <div>
                    <span className="block text-[9px] uppercase tracking-widest text-slate-400 font-bold">Template structure:</span>
                    <p className="text-xs text-indigo-700 bg-indigo-50/50 p-2.5 rounded-lg font-mono border border-indigo-100/50 mt-1">
                      {fw.template}
                    </p>
                  </div>

                  <div>
                    <span className="block text-[9px] uppercase tracking-widest text-slate-400 font-bold">Live Indian example:</span>
                    <p className="text-xs text-slate-800 italic mt-1 bg-slate-50 p-2 rounded-lg">
                      &ldquo;{fw.example}&rdquo;
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-sans italic flex items-center gap-1">
                  <Info className="w-3 h-3" /> {fw.whyItWorks}
                </span>

                <button
                  onClick={() => handleCopyToClipboard(fw.template, fw.id)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-lg text-[10px] flex items-center gap-1 transition cursor-pointer"
                >
                  {copiedId === fw.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Template</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-slate-50 border border-slate-200 border-dashed rounded-3xl p-12 text-center col-span-2">
            <p className="text-xs text-slate-500">Bhai, matches nahi mile. Please reset the filters!</p>
          </div>
        )}
      </div>
    </div>
  );
}
