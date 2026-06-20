import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Sparkles, Brain, AlertCircle, RefreshCw, BarChart2, TrendingUp, HelpCircle, Activity } from "lucide-react";
import { soundManager } from "../../utils/sound";

interface TrendReport {
  reportId: string;
  overallScore: number;
  hookScore: number;
  retentionScore: number;
}

interface TrendAverage {
  averageOverall: number;
  averageHook: number;
  averageRetention: number;
}

interface ProgressIntelData {
  last5Trend: TrendReport[];
  last10Trend: TrendAverage[];
  strongestImprovementArea: string;
  weakestImprovementArea: string;
  progressSummary: string;
  nextTarget: string;
  bottleneckChange: string;
  coachNote: string;
}

const DEFAULT_PROGRESS: ProgressIntelData = {
  last5Trend: [
    { reportId: "CI-01", overallScore: 65, hookScore: 58, retentionScore: 60 },
    { reportId: "CI-02", overallScore: 68, hookScore: 65, retentionScore: 62 },
    { reportId: "CI-03", overallScore: 72, hookScore: 75, retentionScore: 68 },
    { reportId: "CI-04", overallScore: 78, hookScore: 82, retentionScore: 71 },
    { reportId: "CI-05", overallScore: 84, hookScore: 89, retentionScore: 76 }
  ],
  last10Trend: [
    { averageOverall: 68, averageHook: 63, averageRetention: 65 },
    { averageOverall: 78, averageHook: 81, averageRetention: 72 }
  ],
  strongestImprovementArea: "Hook Quality (increased +31% by shifting from talking intros to visual-overlay outcome proofs inside 2 seconds)",
  weakestImprovementArea: "Explanation retention pacing (slight density lag in the middle, needs faster pattern interrupts)",
  progressSummary: "Your script performance has improved consecutively for the last 5 logs. The 3s hook dropoff rate on Instagram is down by 45% because you stopped using slow verbal pitches.",
  nextTarget: "Tighten midsection visuals. Introduce text zooms, sound transitions, or split screen layouts every 2 seconds.",
  bottleneckChange: "The early cliff dropoff is now completely solved. Your active bottleneck has shifted to mid-reels visual stagnation.",
  coachNote: "Bhai, kamaal kar diya! Hook metrics are green. For your next 3 script revisions, don't write any tech definition; instead show live console output screens immediately."
};

export function ProgressDashboardModule() {
  const [data, setData] = useState<ProgressIntelData>(DEFAULT_PROGRESS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [historyCount, setHistoryCount] = useState(0);

  useEffect(() => {
    // Read history count
    const savedHistory = localStorage.getItem("creatoros_intel_history");
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setHistoryCount(parsed.length);
      } catch (e) {
        setHistoryCount(0);
      }
    }

    const saved = localStorage.getItem("creatoros_progress_intel");
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        // fallback
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
          moduleType: "progress_dashboard",
          context: { niche }
        })
      });

      if (!response.ok) {
        throw new Error("Failed to compile progress logs.");
      }

      const result = await response.json();
      if (result.success && result.data) {
        setData(result.data);
        localStorage.setItem("creatoros_progress_intel", JSON.stringify(result.data));
        soundManager.playSuccess();

        try {
          fetch("/api/creator-intelligence/profile/progress_reports", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(result.data)
          });
        } catch (dbErr) {
          console.warn("Supabase background save offline/delayed");
        }
      } else {
        throw new Error("Invalid response received from progress engine.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to process progress dashboards.");
      soundManager.playError();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="progress-dashboard-panel" className="border border-[#232225] bg-[#0c0b0e] p-6 rounded-2xl shadow-xl space-y-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#cca972]/[0.015] to-transparent pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1c1b1e] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-[#cca972]/15 text-[#cca972]">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-white font-sans">Progress & Trends Dashboard</h3>
          </div>
          <p className="text-[11px] text-slate-400">
            Track consecutive improvements across analyzed scripts. Watch your Hook, Retention, and Overall Scores compound over time.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRegenerate}
          disabled={loading}
          className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wider bg-[#cca972] text-[#070608] px-4 py-2.5 rounded-xl border border-white/10 hover:bg-[#ebd0a3] transition cursor-pointer self-start md:self-center disabled:opacity-50"
        >
          {loading ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Activity className="w-3.5 h-3.5" />
          )}
          <span>Synthesize Progress Trends</span>
        </button>
      </div>

      {error && (
        <div className="p-3 bg-rose-950/20 border border-rose-950/50 text-rose-300 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-455" />
          <span>{error}</span>
        </div>
      )}

      {/* Numerical and graphical trends comparison */}
      {historyCount < 5 ? (
        <div className="p-8 border border-dashed border-[#232225] bg-[#141316]/50 rounded-xl flex flex-col items-center justify-center text-center space-y-4">
          <Brain className="w-10 h-10 text-[#cca972]/85 animate-pulse" />
          <div className="space-y-1 max-w-sm">
            <h4 className="text-xs font-bold uppercase text-white tracking-widest font-sans">Growth Coaching Locked</h4>
            <p className="text-[11px] text-slate-400">Complete at least 5 analyses to unlock personalized coaching.</p>
          </div>
          <div className="w-full max-w-xs space-y-2">
            <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500 font-sans">
              <span>Progress</span>
              <span>{historyCount}/5 analyses completed</span>
            </div>
            <div className="h-1.5 w-full bg-[#1c1b1e] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#cca972] rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, (historyCount / 5) * 100)}%` }} 
              />
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Progress chart representation */}
            <div className="p-4 bg-black/45 border border-slate-900 rounded-xl space-y-4">
              <span className="text-[9px] uppercase font-bold text-[#cca972] tracking-widest block border-b border-slate-900 pb-1">consecutive audit scores index</span>
              <div className="space-y-3.5 text-xs font-mono">
                {data.last5Trend?.map((trend, i) => (
                  <div key={i} className="flex items-center justify-between gap-3">
                    <span className="text-slate-550 text-slate-500">{trend.reportId}</span>
                    <div className="flex-1 flex items-center gap-2 px-3">
                      <div className="h-2 bg-[#cca972]/10 rounded-full flex-1 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${trend.overallScore}%` }}
                          transition={{ duration: 0.8 }}
                          className="h-full bg-[#cca972]"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3 font-semibold text-slate-300">
                      <span className="text-[10px] text-slate-500">Hook: {trend.hookScore}%</span>
                      <span className="text-[#cca972]">{trend.overallScore}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Macro performance increments */}
            <div className="p-4 bg-black/45 border border-slate-900 rounded-xl space-y-4">
              <span className="text-[9px] uppercase font-bold text-[#cca972] tracking-widest block border-b border-slate-900 pb-1">10-report averages trajectory</span>
              {data.last10Trend && data.last10Trend.length >= 2 ? (
                <div className="space-y-4 pt-1 font-sans text-xs">
                  <div className="flex items-center justify-between p-3 bg-slate-900/30 border border-slate-900 rounded-lg">
                    <div>
                      <span className="block text-[8px] uppercase text-slate-500">Earlier 10 reports avg</span>
                      <span className="block text-sm font-extrabold text-slate-350">{data.last10Trend[0].averageOverall}%</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[8px] uppercase text-emerald-500 font-bold">Latest 10 reports avg</span>
                      <span className="block text-sm font-extrabold text-emerald-400">+{data.last10Trend[1].averageOverall - data.last10Trend[0].averageOverall}% increase ({data.last10Trend[1].averageOverall}%)</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 italic leading-normal">
                    "{data.progressSummary}"
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-500">Gathering more historical indexes to display averages...</p>
              )}
            </div>
          </div>

          {/* Strengths versus Weaknesses Trajectory comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-950/[0.02] border border-emerald-950/25 rounded-xl space-y-1.5">
              <span className="text-[9px] uppercase font-bold text-emerald-400 tracking-wider">Strongest Improvement Area</span>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">{data.strongestImprovementArea}</p>
            </div>

            <div className="p-4 bg-rose-950/[0.02] border border-rose-950/25 rounded-xl space-y-1.5">
              <span className="text-[9px] uppercase font-bold text-[#cca972] tracking-wider">Most critical active stagnancy area</span>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">{data.weakestImprovementArea}</p>
            </div>
          </div>

          {/* Next Target & Bottleneck state */}
          <div className="p-4 bg-black/40 border border-[#232225] rounded-xl text-xs font-sans space-y-2">
            <span className="block text-[9.5px] uppercase font-bold text-[#cca972] tracking-wider border-b border-slate-900 pb-1">strategist roadmap tasks</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-[8px] uppercase text-slate-500 font-bold">next improvement target</span>
                <p className="text-slate-200 font-medium mt-0.5">{data.nextTarget}</p>
              </div>
              <div>
                <span className="text-[8px] uppercase text-slate-500 font-bold">bottleneck transition shift</span>
                <p className="text-[#cca972] font-semibold mt-0.5">{data.bottleneckChange}</p>
              </div>
            </div>
          </div>

          {/* The Live Coach Notes */}
          <div className="p-5 bg-[#cca972]/[0.025] border border-[#cca972]/20 rounded-xl space-y-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#cca972]/10 text-[#cca972] text-[8px] font-bold px-3 py-1 rounded-bl">Hinglish Coach Memo</div>
            <span className="block text-[10px] uppercase font-bold text-[#cca972] tracking-wider">Active strategists directive</span>
            <p className="text-xs text-white leading-relaxed font-sans font-semibold">"{data.coachNote}"</p>
          </div>
        </>
      )}
    </div>
  );
}
