import React, { useState } from "react";
import { Flame, Calendar, BookOpen, Trophy, Film, Sparkles, Copy, Check, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PulseTrend {
  id: string;
  name: string;
  icon: any;
  category: "festivals" | "students" | "cricket" | "bollywood";
  opportunity: string;
  hooks: string[];
  angle: string;
  cta: string;
}

export default function IndiaPulseEngine() {
  const [activeCategory, setActiveCategory] = useState<string>("festivals");
  const [selectedTrendId, setSelectedTrendId] = useState<string>("diwali");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const trends: PulseTrend[] = [
    {
      id: "diwali",
      name: "Diwali Festivities & Shopping",
      icon: Flame,
      category: "festivals",
      opportunity: "Explain complex personal finance or premium device reviews as a 'Shopping Hack to save ₹15,000 before the Diwali sales end.'",
      hooks: [
        "💸 'Diwali pe mehnge tohfe lena band karo, ye check karo...'",
        "🔥 'Dussehra se Diwali tak, ye 3 tech secrets aapko ₹15,000 bachayenge!'"
      ],
      angle: "Review devices by analyzing the absolute value-for-money rather than showing raw benchmarks.",
      cta: "Comment 'SALE' and I'll send you my secret spreadsheet of best Diwali product deals!"
    },
    {
      id: "holi",
      name: "Holi Post-Festive Recovery",
      icon: Calendar,
      category: "festivals",
      opportunity: "Start hair-care, skin-care, or startup marketing breakdown tutorials focusing on 'how brands capitalized on color chaos.'",
      hooks: [
        "🎨 'Holi ke pakke rang ko 2 minute mein kaise hatayein...'",
        "🔥 'Holi marketing ka ye gajab ka fail aapko bohot bada lesson dega!'"
      ],
      angle: "Analyze the psychology of seasonal marketing or present immediate grooming rescue hacks.",
      cta: "Share this reel with a friend whose face is still pink with Holi colors!"
    },
    {
      id: "exams",
      name: "Semester Exams Stress Hacks",
      icon: BookOpen,
      category: "students",
      opportunity: "Target 18-24 college students. Offer short-form tutorials on 'how to design an exam revision cheat-sheet in Obsidian/Notion.'",
      hooks: [
        "📚 'Agar tumhare exams parso hain aur tumne kuch nahi padha...'",
        "💡 'Exam revision ko 3x fast karne ki ye standard scientifically-proven technique.'"
      ],
      angle: "Provide immediate tactical steps instead of general moral lectures about studying hard.",
      cta: "DM me 'STUDY' and I'll send you my Notion exam planner template for free!"
    },
    {
      id: "placements",
      name: "Engineering Placements Grit",
      icon: BookOpen,
      category: "students",
      opportunity: "Break down real-world resume templates, mock interview secrets, or free roadmap portfolios.",
      hooks: [
        "💼 'Ye 3 resume mistakes ki wajah se hi tum short-list nahi ho rahe ho...'",
        "🔥 'Engineering college ke year 3 mein ho? Is system ko bilkul ignore mat karna!'"
      ],
      angle: "Perform a brutal teardown of conventional advice to offer authentic, developer-friendly guidance.",
      cta: "Save this reel now before your next interview round starts!"
    },
    {
      id: "ipl",
      name: "IPL Matches & Cricket Fevers",
      icon: Trophy,
      category: "cricket",
      opportunity: "Bridge cricket enthusiasm with business models. E.g., 'How IPL franchises actually make money even if you watch it for free on JioCinema.'",
      hooks: [
        "🏏 'IPL franchises free streaming se kaise crores kama rahi hain...'",
        "🔥 'World cup finals ki ye tick-selling ticket manipulation strategy check karo!'"
      ],
      angle: "Perform business case studies behind stadium sales, dynamic pricing, and team-sponsorships.",
      cta: "Comment your favorite IPL team below and I'll analyze their revenue model next!"
    },
    {
      id: "monsoon",
      name: "Chai-Time Monsoon Storytelling",
      icon: Film,
      category: "bollywood",
      opportunity: "Create high-retention aesthetic reels showing rainy landscapes combined with comforting, nostalgic voiceovers on business failures.",
      hooks: [
        "🌧️ 'Suno, chai peete-peete ek aisi brand ki kahani batau jo viral hui par doob gayi...'",
        "☕ 'Rainy day aesthetics ke piche ka bada business model samajho.'"
      ],
      angle: "Use low-fi ambient B-roll paired with high-impact historical or marketing story narrative.",
      cta: "Comment 'STORY' and I'll send you the playlist of my favorite startup case studies!"
    }
  ];

  const categories = [
    { id: "festivals", name: "Festivals & Events", icon: Flame },
    { id: "students", name: "Student & Placement Cycles", icon: BookOpen },
    { id: "cricket", name: "Cricket & Sports Spikes", icon: Trophy },
    { id: "bollywood", name: "Bollywood & Pop Culture", icon: Film }
  ];

  const filteredTrends = trends.filter(t => t.category === activeCategory);
  const selectedTrend = trends.find(t => t.id === selectedTrendId) || trends[0];

  return (
    <div className="space-y-6" id="india-pulse-root">
      {/* Scope Clarifier */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 rounded-2xl p-5 shadow-sm">
        <div className="flex gap-3">
          <div className="p-2 bg-orange-500/10 rounded-xl text-orange-700 h-10 w-10 flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">India Pulse Engine • Cultural Trends</h2>
            <p className="text-xs text-slate-600 mt-1">
              <strong>What is this?</strong> A real-time awareness simulator keeping you locked in with Indian cultural spikes.<br />
              <strong>Why care?</strong> Localized content aligning with festivals, cricket events, or student stress peaks gets up to 4.2x higher organic reach.<br />
              <strong>What to do next?</strong> Select a trend category, pick an active event, and copy the customized hooks or call-to-actions.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Side: Categories and Trend List */}
        <div className="md:col-span-5 space-y-4">
          {/* Category Filter */}
          <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-sm flex flex-col gap-1">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest px-2.5 mb-1 select-none">
              Filter Categories
            </span>
            {categories.map(cat => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    // Auto-select first trend in the category
                    const firstTrend = trends.find(t => t.category === cat.id);
                    if (firstTrend) setSelectedTrendId(firstTrend.id);
                  }}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition ${
                    activeCategory === cat.id
                      ? "bg-orange-50 text-orange-800 font-bold border-l-2 border-[#cf7051]"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* List of active trends in the selected category */}
          <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm space-y-2">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block select-none mb-2">
              Active Indian Trends
            </span>
            <div className="space-y-1">
              {filteredTrends.map(t => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTrendId(t.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between cursor-pointer transition ${
                      selectedTrendId === t.id
                        ? "bg-slate-900 text-white font-bold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5" />
                      <span>{t.name}</span>
                    </div>
                    <span className="text-[9px] bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded font-bold uppercase">
                      ACTIVE
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Generated Content Assets based on active trend */}
        <div className="md:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="pb-3 border-b border-slate-100 flex justify-between items-center">
            <div>
              <span className="text-[9px] bg-orange-100 text-orange-800 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wide">
                Live Pulse output
              </span>
              <h3 className="text-sm font-extrabold text-slate-900 mt-1 uppercase">
                {selectedTrend.name}
              </h3>
            </div>
            <Info className="w-4 h-4 text-slate-300" title="Based on dynamic India calendar events" />
          </div>

          {/* Opportunity section */}
          <div className="space-y-1.5">
            <h4 className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">🎯 Today's Formatting Opportunity</h4>
            <p className="text-xs text-slate-800 leading-relaxed font-medium bg-slate-50 border border-slate-150 p-3.5 rounded-xl">
              {selectedTrend.opportunity}
            </p>
          </div>

          {/* Hook section */}
          <div className="space-y-2">
            <h4 className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">⚡ Curated Hinglish Hooks</h4>
            <div className="space-y-2">
              {selectedTrend.hooks.map((hook, index) => (
                <div key={index} className="bg-slate-50 border border-slate-150 p-3 rounded-xl relative group flex justify-between items-center">
                  <p className="text-xs font-bold text-slate-900 italic font-sans pr-8">
                    &ldquo;{hook}&rdquo;
                  </p>
                  <button
                    onClick={() => handleCopyToClipboard(hook, `hook-${index}`)}
                    className="text-slate-400 hover:text-slate-700 shrink-0"
                  >
                    {copiedKey === `hook-${index}` ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Script Angle */}
          <div className="space-y-1.5">
            <h4 className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">🎬 Strategic Script Angle</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              {selectedTrend.angle}
            </p>
          </div>

          {/* CTA section */}
          <div className="space-y-1.5 pt-4 border-t border-slate-100">
            <h4 className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">🚀 Conversion Call-To-Action (CTA)</h4>
            <div className="bg-orange-50/50 border border-orange-100 p-3 rounded-xl flex justify-between items-center relative group">
              <p className="text-xs text-slate-800 font-semibold italic">
                &ldquo;{selectedTrend.cta}&rdquo;
              </p>
              <button
                onClick={() => handleCopyToClipboard(selectedTrend.cta, "cta-copy")}
                className="text-slate-400 hover:text-slate-700 shrink-0"
              >
                {copiedKey === "cta-copy" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
