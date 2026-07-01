import React from "react";
import { Brain, Sparkles, AlertTriangle, ArrowRight, Check, Copy, RefreshCw } from "lucide-react";
import { motion } from "motion/react";
import { ContentPackage } from "../types";
import { soundManager } from "../utils/sound";

interface ContentAdvisorViewProps {
  contentPackage: ContentPackage | null;
  handleRegenerateModule: (key: string) => void;
  moduleLoadingKey: string | null;
  copiedKey: string | null;
  handleCopyToClipboard: (text: string, key: string) => void;
  setActiveWorkspace: (ws: any) => void;
}

export default function ContentAdvisorView({
  contentPackage,
  handleRegenerateModule,
  moduleLoadingKey,
  copiedKey,
  handleCopyToClipboard,
  setActiveWorkspace
}: ContentAdvisorViewProps) {
  if (!contentPackage) {
    return (
      <div className="py-12">
        <div className="bg-white border border-soft-stone rounded-2xl p-12 text-center max-w-lg mx-auto space-y-5">
          <div className="h-12 w-12 bg-[#eae5db] rounded-full flex items-center justify-center mx-auto text-copper">
            <Brain className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider">Advisor is awaiting raw script</h3>
          <p className="text-xs text-slate-gray leading-relaxed">
            "Your biggest weakness can't be evaluated without content." Go to the Script Studio to generate your first draft script or input your content idea! Once done, the Advisor will instantly dissect your hooks, pacing, and CTAs.
          </p>
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveWorkspace("script-studio");
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-copper hover:bg-copper-hover text-white text-xs font-bold rounded-xl transition cursor-pointer"
          >
            <span>Go to Script Studio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  const { overallScore, hookStrength, retention, clarity } = contentPackage.viralScore;

  // Derive score labels
  const getScoreVerdict = (score: number) => {
    if (score >= 90) return { text: "Outstanding Retention Level", color: "text-forest-green bg-green-50" };
    if (score >= 75) return { text: "Highly Optimized", color: "text-copper bg-copper/5" };
    return { text: "Needs Instant Polish", color: "text-amber-600 bg-amber-50" };
  };

  const overallVerdict = getScoreVerdict(overallScore);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* 1. Executive Summary & Impact Indicator */}
      <div className="bg-white border border-soft-stone rounded-2xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-soft-sand border border-soft-stone rounded-xl">
          <span className="text-[10px] uppercase font-bold text-slate-gray tracking-wider">Overall Impact Score</span>
          <div className="relative flex items-center justify-center my-4">
            {/* Minimal Circular Progress Indicator */}
            <svg className="w-28 h-28 transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r="46"
                className="stroke-soft-stone"
                strokeWidth="7"
                fill="transparent"
              />
              <circle
                cx="56"
                cy="56"
                r="46"
                className="stroke-copper transition-all duration-1000"
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 46}`}
                strokeDashoffset={`${2 * Math.PI * 46 * (1 - overallScore / 100)}`}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-3xl font-black text-charcoal font-mono">{overallScore}%</span>
            </div>
          </div>
          <span className={`text-[10px] font-bold px-3 py-1 rounded-full border border-current ${overallVerdict.color}`}>
            {overallVerdict.text}
          </span>
        </div>

        <div className="md:col-span-8 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-extrabold text-copper tracking-widest flex items-center gap-1">
                <Brain className="w-3.5 h-3.5" />
                Intelligent Executive Coach
              </span>
              <h2 className="text-base font-bold text-charcoal mt-1">Hinglish Creator Audits & Retention Diagnostics</h2>
            </div>
            <button
              onClick={() => handleRegenerateModule("retentionAnalysis")}
              disabled={moduleLoadingKey !== null}
              className="px-3 py-1.5 bg-soft-sand hover:bg-[#eae5db] border border-soft-stone text-slate-gray hover:text-charcoal text-[10px] font-bold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${moduleLoadingKey === "retentionAnalysis" ? "animate-spin" : ""}`} />
              Refine Diagnostics
            </button>
          </div>

          <p className="text-xs text-slate-gray leading-relaxed">
            Below is a strategic critique of your speaking patterns, dropoff risks, and delivery benchmarks. Your content matches the niche parameters specified in Script Studio.
          </p>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-soft-sand border border-soft-stone rounded-xl">
              <span className="block text-[8px] uppercase tracking-wider font-extrabold text-slate-gray">Hook Strength</span>
              <span className="text-sm font-black text-charcoal font-mono mt-1 block">{hookStrength}%</span>
            </div>
            <div className="p-3 bg-soft-sand border border-soft-stone rounded-xl">
              <span className="block text-[8px] uppercase tracking-wider font-extrabold text-slate-gray">Pacing Index</span>
              <span className="text-sm font-black text-charcoal font-mono mt-1 block">{retention}%</span>
            </div>
            <div className="p-3 bg-soft-sand border border-soft-stone rounded-xl">
              <span className="block text-[8px] uppercase tracking-wider font-extrabold text-slate-gray">Clarity Score</span>
              <span className="text-sm font-black text-charcoal font-mono mt-1 block">{clarity}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Conversational Critique: Strengths, Weaknesses, Solutions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* WEAKNESSES */}
        <div className="bg-white border border-rose-100 rounded-2xl p-5 shadow-sm space-y-3.5">
          <div className="flex items-center gap-2 text-rose-800">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <h4 className="text-xs font-bold uppercase tracking-wider">Potential Viewer Dropoff Risks (Weaknesses)</h4>
          </div>
          <p className="text-[11px] text-slate-gray">
            These are elements in your draft script or topic where high-speed mobile audiences might swipe away:
          </p>
          <ul className="space-y-3">
            {contentPackage.retentionAnalysis.weaknesses.map((w, idx) => (
              <li key={idx} className="text-xs text-charcoal leading-relaxed flex gap-2.5 items-start">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* SOLUTIONS */}
        <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-sm space-y-3.5">
          <div className="flex items-center gap-2 text-emerald-800">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <h4 className="text-xs font-bold uppercase tracking-wider">Actionable Speed Tweak Solutions</h4>
          </div>
          <p className="text-[11px] text-slate-gray">
            Implement these structural modifications immediately to maximize retention and keep engagement high:
          </p>
          <ul className="space-y-3">
            {contentPackage.retentionAnalysis.suggestions.map((s, idx) => (
              <li key={idx} className="text-xs text-charcoal leading-relaxed flex gap-2.5 items-start">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 3. Speaking & Delivery Directive */}
      <div className="bg-white border border-soft-stone rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-soft-stone">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal">Creator Delivery Directive</h3>
            <p className="text-[10px] text-slate-gray">Physical guidelines for pacing, energy distribution, and hook execution</p>
          </div>
          <button
            onClick={() => handleRegenerateModule("styleNotes")}
            disabled={moduleLoadingKey !== null}
            className="text-[10px] text-copper hover:text-copper-hover font-bold flex items-center gap-1 cursor-pointer"
          >
            Adjust Delivery Profile
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-charcoal">
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-soft-sand">
              <span className="text-slate-gray font-semibold uppercase text-[10px]">Style Blueprint:</span>
              <span className="font-bold">{contentPackage.styleNotes.style}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-soft-sand">
              <span className="text-slate-gray font-semibold uppercase text-[10px]">Talking Speed:</span>
              <span className="font-bold text-right">{contentPackage.styleNotes.pacing}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-soft-sand">
              <span className="text-slate-gray font-semibold uppercase text-[10px]">Delivery Tone:</span>
              <span className="font-bold">{contentPackage.styleNotes.tone}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-gray font-semibold uppercase text-[10px]">Emotional Energy:</span>
              <span className="font-mono text-copper font-bold">{contentPackage.styleNotes.emotionalEnergy}</span>
            </div>
          </div>

          <div className="bg-soft-sand p-4 rounded-xl border border-soft-stone flex flex-col justify-between space-y-3">
            <div>
              <span className="block text-[9px] uppercase font-bold text-copper mb-1">Strongest Hook Angle</span>
              <p className="italic leading-relaxed font-sans text-charcoal">&ldquo;{contentPackage.styleNotes.strongestAngle}&rdquo;</p>
            </div>
            <div className="pt-2 border-t border-soft-stone">
              <span className="block text-[9px] uppercase font-bold text-copper mb-1">Avatar Alignment</span>
              <p className="leading-relaxed font-sans text-[11px] text-slate-gray">{contentPackage.styleNotes.audienceMatch}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Side-by-Side Hook Comparative Audit */}
      <div className="bg-white border border-soft-stone rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal">Comparative Hook Dissection</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-soft-sand border border-soft-stone p-4 rounded-xl">
            <span className="block text-[8px] uppercase font-bold text-copper">1. Hook Trigger</span>
            <p className="text-[11px] text-charcoal mt-2 leading-relaxed">{contentPackage.retentionAnalysis.pipeline.hook}</p>
          </div>
          <div className="bg-soft-sand border border-soft-stone p-4 rounded-xl">
            <span className="block text-[8px] uppercase font-bold text-copper">2. Setup Step</span>
            <p className="text-[11px] text-charcoal mt-2 leading-relaxed">{contentPackage.retentionAnalysis.pipeline.setup}</p>
          </div>
          <div className="bg-soft-sand border border-soft-stone p-4 rounded-xl">
            <span className="block text-[8px] uppercase font-bold text-copper">3. Tension release</span>
            <p className="text-[11px] text-charcoal mt-2 leading-relaxed">{contentPackage.retentionAnalysis.pipeline.tension}</p>
          </div>
          <div className="bg-soft-sand border border-soft-stone p-4 rounded-xl">
            <span className="block text-[8px] uppercase font-bold text-copper">4. Value Payoff</span>
            <p className="text-[11px] text-charcoal mt-2 leading-relaxed">{contentPackage.retentionAnalysis.pipeline.payoff}</p>
          </div>
          <div className="bg-soft-sand border border-soft-stone p-4 rounded-xl">
            <span className="block text-[8px] uppercase font-bold text-copper">5. Conversion CTA</span>
            <p className="text-[11px] text-charcoal mt-2 leading-relaxed">{contentPackage.retentionAnalysis.pipeline.cta}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
