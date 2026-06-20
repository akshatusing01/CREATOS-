import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Cpu, HelpCircle, Layers, Clipboard, AlertCircle, ThumbsUp, HelpCircle as HelpIcon, ArrowRight, CheckCircle2, RefreshCw } from "lucide-react";
import { soundManager } from "../../utils/sound";

interface ContentPillar {
  name: string;
  focus: string;
}

interface FormatPlaybook {
  dos: string[];
  donts: string[];
}

interface ContentSystemData {
  recommendedPillars: ContentPillar[];
  pillarPriority: Record<string, string>;
  recurringSeriesIdeas: { title: string; concept: string }[];
  repeatableFormula: string;
  formatPlaybook: FormatPlaybook;
  weeklyStructure: string;
  monthlyStructure: string;
  creatorSystemBottleneck: string;
  systemImprovementSuggestions: string;
}

const DEFAULT_SYSTEM: ContentSystemData = {
  recommendedPillars: [
    { name: "LeetCode Pattern Cheat-sheets", focus: "Deconstructing Big-Tech placements round equations visually." },
    { name: "No-Bs Build Sprints", "focus": "Configuring complete microservices from scratch in 45 seconds live." },
    { name: "Tier-3 Escape Playbooks", "focus": "Practical offline referral and networking steps to land interviews." }
  ],
  pillarPriority: {
    "LeetCode Pattern Cheat-sheets": "45% (Primary mass discovery)",
    "No-Bs Build Sprints": "35% (Technical authority builder)",
    "Tier-3 Escape Playbooks": "20% (Deep loyalty conversion)"
  },
  recurringSeriesIdeas: [
    { title: "Bhai Code Theek Kar (Hinglish)", concept: "User logs their heaviest broken code bugs, and you deconstruct/optimize it diagonol-split screen inside 40s." },
    { title: "The Hidden Recruiter Dossier", concept: "Interviews with active recruiters revealing off-campus application bypass tactics." }
  ],
  repeatableFormula: "Hook (Placement warning stat: 0-3s) -> Quick 1.5s visual proof -> Active walkthrough with neon form highlights -> Direct comment automated Keyword CTA",
  formatPlaybook: {
    dos: [
      "Use local Hinglish student dialogue (Bhai, placements, coders)",
      "Show absolute working proof screens within 1.5 seconds",
      "Explain complex caching or API calls with clear visual markers"
    ],
    donts: [
      "Do not start with 'Hi guys welcome back to my channel'",
      "Do not use generic corporate phrases or textbook slide loops",
      "Avoid displaying more than 1 CTA in a single video script"
    ]
  },
  weeklyStructure: "Mon: Placement Leeks Cheat-sheet | Wed: Build-along micro reel | Fri: Career escape storytelling",
  monthlyStructure: "Weeks 1-3 Discovery optimized reels; Week 4 conversion sprint targeting high-intent subscribers.",
  creatorSystemBottleneck: "Highly delayed uploading cycles due to setting up localized IDE environments live. record terminal screens beforehand.",
  systemImprovementSuggestions: "Pre-set 5 mock code environments inside docker tabs to easily batch-record 4 Reels in 60 minutes."
};

export function ContentSystemModule() {
  const [data, setData] = useState<ContentSystemData>(DEFAULT_SYSTEM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("creatoros_content_systems");
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        // use default
      }
    }
  }, []);

  const handleRegenerate = async () => {
    setLoading(true);
    setError(null);
    soundManager.playSparkle();

    try {
      const niche = localStorage.getItem("creatoros_profile_niche") || "AI Productivity & Student coding tutorials";
      const response = await fetch("/api/creator-intelligence/generate-module", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleType: "content_systems",
          context: { niche }
        })
      });

      if (!response.ok) {
        throw new Error("Failed to compile Repeatable Content System.");
      }

      const result = await response.json();
      if (result.success && result.data) {
        setData(result.data);
        localStorage.setItem("creatoros_content_systems", JSON.stringify(result.data));
        soundManager.playSuccess();

        try {
          fetch("/api/creator-intelligence/profile/content_systems", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(result.data)
          });
        } catch (dbErr) {
          console.warn("Database storage offline/delayed");
        }
      } else {
        throw new Error("No data returned by developer strategist agent.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to process generative request.");
      soundManager.playError();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="content-system-panel" className="border border-[#232225] bg-[#0c0b0e] p-6 rounded-2xl shadow-xl space-y-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#cca972]/[0.012] to-transparent pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1c1b1e] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-[#cca972]/15 text-[#cca972]">
              <Cpu className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-white font-sans">Content System Builder</h3>
          </div>
          <p className="text-[11px] text-slate-400">
            Transition from loose posts into a tightly organized long-term content machine with structured pillars, recurring series, and formulas.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRegenerate}
          disabled={loading}
          className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wider bg-[#cca972] text-[#070608] px-4 py-2.5 rounded-xl border border-white/10 hover:bg-[#ebd0a3] transition cursor-pointer self-start md:self-center disabled:opacity-50 font-mono"
        >
          {loading ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Cpu className="w-3.5 h-3.5" />
          )}
          <span>Architect repeatable system</span>
        </button>
      </div>

      {error && (
        <div className="p-3 bg-rose-950/20 border border-rose-950/50 text-rose-300 text-xs rounded-xl">
          <span>{error}</span>
        </div>
      )}

      {/* Repeatable content formula */}
      <div className="p-4 bg-slate-900/30 border border-slate-900 rounded-xl space-y-2">
        <span className="text-[9px] uppercase tracking-widest text-[#cca972] font-black block">Winning repeatable content formula</span>
        <p className="text-xs text-slate-200 mt-1 font-semibold italic">{data.repeatableFormula}</p>
      </div>

      {/* Pillars and Series Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recommended Pillars and priorities */}
        <div className="space-y-4 border border-[#1b1a1c] p-5 rounded-2xl bg-black/40">
          <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#cca972] border-b border-slate-900 pb-1.5 flex justify-between items-center">
            <span>3 Strong Content Pillars</span>
            <span className="text-[8px] text-slate-500 font-mono">Prioritized Allocation</span>
          </h4>
          <div className="space-y-3.5">
            {data.recommendedPillars.map((p, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-200">{p.name}</span>
                  <span className="text-[10px] text-[#cca972] font-mono font-bold">
                    {data.pillarPriority[p.name] || "Allocated"}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">{p.focus}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recurring Series Concepts */}
        <div className="space-y-4 border border-[#1b1a1c] p-5 rounded-2xl bg-black/40">
          <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#cca972] border-b border-slate-900 pb-1.5">
            2 Signature Series Formats
          </h4>
          <div className="space-y-4">
            {data.recurringSeriesIdeas.map((sec, idx) => (
              <div key={idx} className="p-3 bg-black/50 border border-slate-900 rounded-xl space-y-1">
                <div className="text-[11px] font-black uppercase text-slate-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#cca972]" />
                  <span>{sec.title}</span>
                </div>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">{sec.concept}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Format Playbooks Dos and Donts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 border border-emerald-950/40 bg-emerald-950/[0.015] rounded-2xl space-y-3">
          <span className="text-[10px] uppercase font-bold text-emerald-400 font-mono tracking-wider block">Rule playbooks: DOS</span>
          <ul className="space-y-2.5 text-xs text-slate-300">
            {data.formatPlaybook.dos.map((item, id) => (
              <li key={id} className="flex gap-2 items-start text-left">
                <span className="text-emerald-500 font-bold select-none">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-5 border border-rose-950/40 bg-rose-950/[0.015] rounded-2xl space-y-3">
          <span className="text-[10px] uppercase font-bold text-rose-400 font-mono tracking-wider block">Rule playbooks: DONTS</span>
          <ul className="space-y-2.5 text-xs text-slate-300">
            {data.formatPlaybook.donts.map((item, id) => (
              <li key={id} className="flex gap-2 items-start text-left">
                <span className="text-rose-500 font-bold select-none">✕</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Weekly vs Monthly Timetable Structure */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-[#0d0d10] border border-[#232225] rounded-xl space-y-1">
          <span className="block text-[8px] uppercase tracking-wider font-extrabold text-slate-500">Weekly System Rhythm</span>
          <span className="block text-xs text-slate-200 mt-1 font-semibold leading-relaxed font-sans">{data.weeklyStructure}</span>
        </div>

        <div className="p-4 bg-[#0d0d10] border border-[#232225] rounded-xl space-y-1">
          <span className="block text-[8px] uppercase tracking-wider font-extrabold text-slate-500">Monthly Strategic Cycle</span>
          <span className="block text-xs text-slate-200 mt-1 font-semibold leading-relaxed font-sans">{data.monthlyStructure}</span>
        </div>
      </div>

      {/* Bottleneck and strategic fixes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-[#1c1b1e] pt-5">
        <div className="p-4 bg-[#1a1012]/30 border border-rose-950/40 rounded-xl space-y-1.5">
          <div className="flex items-center gap-1.5 text-rose-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="text-[9px] uppercase tracking-wider font-black font-mono">System bottlenecks deconstruction</span>
          </div>
          <p className="text-xs text-slate-350 leading-relaxed font-sans">{data.creatorSystemBottleneck}</p>
        </div>

        <div className="p-4 bg-[#0e1713]/30 border border-emerald-950/40 rounded-xl space-y-1.5">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <ThumbsUp className="w-4 h-4 shrink-0" />
            <span className="text-[9px] uppercase tracking-wider font-black font-mono">Improvement playbook next steps</span>
          </div>
          <p className="text-xs text-slate-350 leading-relaxed font-sans">{data.systemImprovementSuggestions}</p>
        </div>
      </div>
    </div>
  );
}
