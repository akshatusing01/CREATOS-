import React, { useState } from "react";
import { Activity, Flame, HelpCircle, Award, Compass, Eye, ShieldCheck, Heart } from "lucide-react";
import { IntelMultiScore } from "../../types";

interface ScoreHubProps {
  scores: IntelMultiScore;
}

export const ScoreHub: React.FC<ScoreHubProps> = ({ scores }) => {
  const [hoveredDimension, setHoveredDimension] = useState<string | null>(null);

  // Map scores into printable grid list
  const dimensions = [
    { key: "hook", label: "Hook strength", value: scores.hook, icon: Flame, color: "text-amber-500 bg-amber-950/10 border-amber-900/35" },
    { key: "retention", label: "Retention hold", value: scores.retention, icon: Compass, color: "text-sky-400 bg-sky-950/10 border-sky-900/35" },
    { key: "flow", label: "Flow & clarity", value: scores.flow, icon: Activity, color: "text-emerald-400 bg-emerald-950/10 border-emerald-900/35" },
    { key: "story", label: "Story value", value: scores.story, icon: Award, color: "text-purple-400 bg-purple-950/10 border-purple-900/35" },
    { key: "emotion", label: "Emotional pull", value: scores.emotion, icon: Heart, color: "text-[#cf7051] bg-orange-950/10 border-orange-900/35" },
    { key: "cta", label: "CTA conversion", value: scores.cta, icon: Eye, color: "text-rose-400 bg-rose-950/10 border-rose-900/35" },
    { key: "packaging", label: "Aesthetic branding", value: scores.packaging, icon: ShieldCheck, color: "text-teal-400 bg-teal-950/10 border-teal-900/35" },
    { key: "audienceMatch", label: "Target match", value: scores.audienceMatch, icon: Compass, color: "text-[#cca972] bg-[#cca972]/10 border-gold-900/35" }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400 border-emerald-500/20";
    if (score >= 60) return "text-amber-400 border-amber-500/20";
    return "text-rose-450 text-rose-400 border-rose-500/20";
  };

  return (
    <div id="CochranPerformanceMetricHub" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Central Cochran circular speedometer dial */}
      <div className="lg:col-span-5 bg-[#0e0d0f] border border-[#232225] rounded-2xl p-6 flex flex-col justify-center items-center shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-at-t from-[#cca972]/[0.02] to-transparent pointer-events-none" />
        <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#cca972]/60 mb-4 font-sans block">
          Composite Lab Score
        </span>
        
        <div className="relative w-44 h-44 flex items-center justify-center">
          {/* Outer graphic dial lines */}
          <div className="absolute inset-0 rounded-full border border-[#232225] border-dashed animate-[spin_50s_linear_infinite]" />
          <div className="absolute inset-2 rounded-full border-2 border-double border-[#cca972]/10" />
          
          {/* Interactive copper gradient ring reflecting overall score */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="88"
              cy="88"
              r="76"
              stroke="#1b1a1c"
              strokeWidth="5"
              fill="transparent"
            />
            <circle
              cx="88"
              cy="88"
              r="76"
              stroke="url(#copperGradient)"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 76}
              strokeDashoffset={2 * Math.PI * 76 * (1 - scores.overall.score / 100)}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="copperGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#cca972" />
                <stop offset="100%" stopColor="#cf7051" />
              </linearGradient>
            </defs>
          </svg>

          {/* Core numerical dial display */}
          <div className="absolute text-center flex flex-col items-center justify-center">
            <span className="text-4xl font-extrabold font-mono tracking-tighter text-white bg-clip-text bg-gradient-to-br from-white to-slate-400">
              {scores.overall.score}
            </span>
            <span className={`text-[9.5px] uppercase font-black px-2 py-0.5 mt-1 tracking-wider rounded border ${getScoreColor(scores.overall.score)} bg-black/40`}>
              {scores.overall.label || "evaluated"}
            </span>
          </div>
        </div>

        <div className="mt-5 text-center px-4">
          <p className="text-xs text-slate-300 leading-normal font-sans">
            {scores.overall.reason || "Overall score computed through compound structural metrics."}
          </p>
        </div>
      </div>

      {/* Grid of secondary structural dimension scores */}
      <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {dimensions.map((dim) => {
          const IconComponent = dim.icon;
          const isHovered = hoveredDimension === dim.key;
          return (
            <div
              key={dim.key}
              onMouseEnter={() => setHoveredDimension(dim.key)}
              onMouseLeave={() => setHoveredDimension(null)}
              className={`p-4 rounded-xl border bg-[#0b0a0c]/60 cursor-help transition-all duration-200 relative overflow-hidden ${
                isHovered ? "border-[#cca972]/30 bg-[#0b0a0c]" : "border-[#232225]"
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className={`p-1.5 rounded-lg border ${dim.color}`}>
                  <IconComponent className="w-3.5 h-3.5" />
                </div>
                <span className={`text-base font-bold font-mono ${getScoreColor(dim.value.score)}`}>
                  {dim.value.score}%
                </span>
              </div>

              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 font-sans">
                  {dim.label}
                </span>
                
                {/* Expand on hover or default simple indicator */}
                <span className="block text-[8px] uppercase tracking-wide text-slate-500 font-sans mt-0.5">
                  {dim.value.label || "moderate"}
                </span>

                <div className="w-full bg-[#1b1a1c] h-1 rounded-full mt-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#cca972] to-[#cf7051] rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${dim.value.score}%` }}
                  />
                </div>
              </div>

              {/* Tooltip detail description render on hover */}
              {isHovered && (
                <div className="absolute inset-0 bg-[#0b0a0c]/98 p-3 flex flex-col justify-center border border-[#cca972]/30 rounded-xl z-10 transition-all duration-200">
                  <span className="text-[9px] uppercase font-bold text-[#cca972] tracking-wider mb-1">Diagnosis Detail</span>
                  <p className="text-[10px] text-slate-300 leading-snug line-clamp-3 font-sans">
                    {dim.value.reason || "Metrics derived from baseline analysis dataset."}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
