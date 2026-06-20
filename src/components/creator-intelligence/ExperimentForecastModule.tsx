import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Sparkles, RefreshCw, Layers, Compass, BrainCircuit, Target, Archive, Microscope, Sliders, ArrowUpRight, Flame } from "lucide-react";
import { soundManager } from "../../utils/sound";

interface ExperimentItem {
  name: string;
  hypothesis: string;
  variableChanged: string;
  variableConstant: string;
  expectedEffect: string;
  risk: string;
  measurementCriteria: string;
  successThreshold: string;
  ifWinsDecision: string;
  ifFailsDecision: string;
}

interface ForecastData {
  bestContentDirection: string;
  bestHookFamily: string;
  bestCtaType: string;
  bestFormat: string;
  bestTopicCluster: string;
  bestPostingWindow: string;
  riskFactors: string;
  confidenceLevel: number;
  whyThisForecastExists: string;
}

interface SegmentItem {
  name: string;
  ratio: number;
  painPoints: string[];
  desires: string;
  trustTriggers: string;
  ctaSensitivity: string;
  languagePreference: string;
  contentPreference: string;
  conversionPotential: string;
}

interface SegmentPrioritizationData {
  primarySegment: SegmentItem;
  secondarySegment: SegmentItem;
}

interface ArchiveContentItem {
  title: string;
  performance: string;
  hookUsed: string;
  ctaUsed: string;
}

interface ArchiveIntelligenceData {
  oldWins: ArchiveContentItem[];
  oldLosses: ArchiveContentItem[];
  oldHooks: string[];
  oldCtas: string[];
  oldBestTopics: string[];
  comparisonNotes: string;
  whatGotBetter: string;
  whatRegressed: string;
  whatObsolete: string;
  whatToRevive: string;
}

const DEFAULT_EXPERIMENTS: ExperimentItem[] = [
  {
    name: "0.5s Proof Overlay Opener",
    hypothesis: "Putting a green compiler checkmark or placements credential screenshot in the absolute first 0.5s before the face greeting increases 3s retention by 28%.",
    variableChanged: "Extreme fast visual teaser frame matching the hook sentence.",
    variableConstant: "Primary body lecture scripts, background lighting setup, backing synthesizer track.",
    expectedEffect: "Dropoff rates drop from 55% to under 30% on campus coding reels.",
    risk: "Minor visual sensory overload. Prevent by using a warm, high-contrast highlighting frame.",
    measurementCriteria: "Instagram insights dashboard initial 3-second watch rate percentage.",
    successThreshold: "Minimum 3s watch percent above 71%.",
    ifWinsDecision: "Integrate rapid product overlays across all upcoming placement cheat-sheet videos.",
    ifFailsDecision: "Test a neat split-screen visual compiler layout on the viewport instead."
  },
  {
    name: "Hinglish vs Native Hindi Tone",
    hypothesis: "Using natural campus slang Hinglish vocabulary (Bhai, placement shortcuts, coders) rather than formal textbook Hindi (Rozgaar, Chhatra, Shiksha) doubles overall comment counts.",
    variableChanged: "Vocabulary delivery tone (Conversational campus-bro vs dry textbook instructions).",
    variableConstant: "The core technical algorithm logic being visualised, terminal overlay font styles, visual compiler markers.",
    expectedEffect: "Deep conversational sentiment connection, leading to automated comment keyword drop triggers.",
    risk: "None. Campus slang is highly recognized and appreciated by 18-24 college student profiles.",
    measurementCriteria: "Comments volume & average rating sentiment indicators.",
    successThreshold: "A 45% increase on average comment rates on Hinglish videos.",
    ifWinsDecision: "Adopt Hinglish words strictly for hooks and script guidelines.",
    ifFailsDecision: "Retain plain technical English, adding basic campus references."
  }
];

const DEFAULT_FORECAST: ForecastData = {
  bestContentDirection: "Step-by-step walkthroughs bypassing initial placement resume filters using dark-theme automated tools.",
  bestHookFamily: "Mistake/warning triggers combined with quick output results (e.g., 'Ye galti apply karte waqt mat karna, bypass this loop...').",
  bestCtaType: "Keyword automated comment trigger (Comment 'PORTAL' to send script markdown webhook).",
  bestFormat: "Split-screen coding viewport showing the active tool in high speed with neon indicator rings.",
  bestTopicCluster: "Off-campus placement applications secrets, automated search matrices, Leetcode logic helpers.",
  bestPostingWindow: "Tuesdays at exactly 8:15 PM.",
  riskFactors: "Links and tools change pacing fast. Include active disclaimers to prevent viewer feedback friction.",
  confidenceLevel: 89,
  whyThisForecastExists: "Winner vs Loser analytics show a 3.5x viral loop index when viewers are offered automated template drop links. This coincides with massive placement anxiety peaks before major autumn recruitment terms."
};

const DEFAULT_SEGMENTS: SegmentPrioritizationData = {
  primarySegment: {
    name: "The Tier-3 Engineering Aspirant",
    ratio: 65,
    painPoints: ["Outdated university coding syllabus", "Lack of practical mentors", "Zero direct campus referral entries"],
    desires: "Guaranteed project blueprints, quick code optimizations, and realistic Hinglish roadmaps.",
    trustTriggers: "Seeing your active github commit lines on screen and actual placement job screenshots.",
    ctaSensitivity: "Extremely responsive to automated comment keyword delivery scripts.",
    languagePreference: "90% conversational student Hinglish.",
    contentPreference: "Fast screen recordings, visual compiler logs, zero filler greetings.",
    conversionPotential: "Excellent (ready to purchase practical bootcamp preparation courses to bypass recruiters)"
  },
  secondarySegment: {
    name: "IT Professional Stuck in Legacy Support Positions",
    ratio: 25,
    painPoints: ["Trapped in legacy software maintenance roles at 3.5LPA", "Boring visual tasks", "Fear of career stagnation"],
    desires: "Clear transition timelines, high-octane stack tools, custom negotiation hacks.",
    trustTriggers: "Clean structured codebase layouts and modular enterprise system architectural flows.",
    ctaSensitivity: "Highly receptive to high-save bookmarks to review on weekends.",
    languagePreference: "Clean, professional Hinglish.",
    contentPreference: "Detailed architectural breakdowns, clean vscode configs.",
    conversionPotential: "Excellent (the highest disposable income profile looking for solid premium tooling)"
  }
};

const DEFAULT_ARCHIVE: ArchiveIntelligenceData = {
  oldWins: [
    { title: "How I built a full portfolio website in 5 mins", performance: "115K Views", hookUsed: "Proof-first", ctaUsed: "Save for future reference" },
    { title: "Stop learning Python in 2024", performance: "92K Views", hookUsed: "Contrarian warning", ctaUsed: "Share with a peer" }
  ],
  oldLosses: [
    { title: "Introduction to HTML layout models", performance: "3.5K Views", hookUsed: "Stiff greeting text", ctaUsed: "Follow profile" },
    { title: "A day in my life as a backend engineer vlogs", performance: "5.8K Views", hookUsed: "Slow background music teaser", ctaUsed: "Save Reel" }
  ],
  oldHooks: ["Hey guys welcome to my channel...", "Let us write custom CSS..."],
  oldCtas: ["Click the link placed inside my bio", "Don't forget to follow and support my channel"],
  oldBestTopics: ["Basic terminal configurations", "Simple CSS grid parameters"],
  comparisonNotes: "Historical metrics show a fundamental audience attention shift. General introductory tutorials collapse under 12 seconds in modern high-velocity feeds. High-impact content must launch straight into active compiler execution results.",
  whatGotBetter: "Initial 3s hook rate is 3x higher, and body verbal filler pauses have been condensed by 60%.",
  whatRegressed: "Saves count dropped by 8% as emphasis shifted mostly to fast comment activations rather than bookmarks.",
  whatObsolete: "Broad text-based roadmaps or standard slides. Feeds require visual working proof overlays.",
  whatToRevive: "The 'Broken code doctor' troubleshooting series. Revive by using submitted subscriber bug examples as hooks."
};

export function ExperimentForecastModule() {
  const [subTab, setSubTab] = useState<"experiments" | "forecast" | "segments" | "archive">("forecast");
  const [experiments, setExperiments] = useState<ExperimentItem[]>(DEFAULT_EXPERIMENTS);
  const [forecast, setForecast] = useState<ForecastData>(DEFAULT_FORECAST);
  const [segments, setSegments] = useState<SegmentPrioritizationData>(DEFAULT_SEGMENTS);
  const [archive, setArchive] = useState<ArchiveIntelligenceData>(DEFAULT_ARCHIVE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load local storage
    const savedExp = localStorage.getItem("creatoros_experiment_labs");
    const savedFor = localStorage.getItem("creatoros_forecast_reports");
    const savedSeg = localStorage.getItem("creatoros_segment_maps");
    const savedArc = localStorage.getItem("creatoros_archive_intelligence");

    if (savedExp) { try { setExperiments(JSON.parse(savedExp)); } catch(e) {} }
    if (savedFor) { try { setForecast(JSON.parse(savedFor)); } catch(e) {} }
    if (savedSeg) { try { setSegments(JSON.parse(savedSeg)); } catch(e) {} }
    if (savedArc) { try { setArchive(JSON.parse(savedArc)); } catch(e) {} }
  }, []);

  const handleRegenerate = async () => {
    setLoading(true);
    setError(null);
    soundManager.playSparkle();

    try {
      const niche = localStorage.getItem("creatoros_profile_niche") || "AI Productivity & Student coding tutorials";
      
      let mType = "forecast_reports";
      if (subTab === "experiments") mType = "experiment_labs";
      else if (subTab === "segments") mType = "segment_prioritization";
      else if (subTab === "archive") mType = "archive_intelligence";

      const response = await fetch("/api/creator-intelligence/generate-module", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleType: mType,
          context: { niche }
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to generate ${subTab} telemetry.`);
      }

      const result = await response.json();
      if (result.success && result.data) {
        if (subTab === "experiments") {
          const fetched = result.data.experiments || [result.data];
          setExperiments(fetched);
          localStorage.setItem("creatoros_experiment_labs", JSON.stringify(fetched));
        } else if (subTab === "forecast") {
          setForecast(result.data);
          localStorage.setItem("creatoros_forecast_reports", JSON.stringify(result.data));
        } else if (subTab === "segments") {
          // Fallback if returned structure differs slightly
          const fetched = result.data.primarySegment ? result.data : { primarySegment: result.data, secondarySegment: DEFAULT_SEGMENTS.secondarySegment };
          setSegments(fetched);
          localStorage.setItem("creatoros_segment_maps", JSON.stringify(fetched));
        } else if (subTab === "archive") {
          setArchive(result.data);
          localStorage.setItem("creatoros_archive_intelligence", JSON.stringify(result.data));
        }
        soundManager.playSuccess();

        // Background save
        try {
          fetch(`/api/creator-intelligence/profile/${mType}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(result.data)
          });
        } catch (dbErr) {
          console.warn("Supabase save delayed");
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
    <div id="experiment-forecast-panel" className="border border-[#232225] bg-[#0c0b0e] p-6 rounded-2xl shadow-xl space-y-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#cca972]/[0.012] to-transparent pointer-events-none" />

      {/* Header with SubTabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1c1b1e] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-1 rounded bg-[#cca972]/15 text-[#cca972]">
              <Compass className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-white font-sans">Strategic Diagnostics Suite</h3>
          </div>
          <p className="text-[11px] text-slate-400 font-sans">
            Forecast future trends (Section 7), isolate hypothesis scripts variables (Section 6), profile high-value viewer ratios (Section 8), and audit regression indicators (Section 9).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-center font-mono">
          <div className="bg-black/60 p-1 rounded-lg border border-[#1c1b1e] flex flex-wrap gap-1">
            <button
              onClick={() => setSubTab("forecast")}
              className={`px-2.5 py-1.5 rounded text-[9px] font-bold uppercase transition ${
                subTab === "forecast" ? "bg-[#cca972] text-[#070608]" : "text-slate-400 hover:text-white"
              }`}
            >
              Forecast
            </button>
            <button
              onClick={() => setSubTab("experiments")}
              className={`px-2.5 py-1.5 rounded text-[9px] font-bold uppercase transition ${
                subTab === "experiments" ? "bg-[#cca972] text-[#070608]" : "text-slate-400 hover:text-white"
              }`}
            >
              Labs
            </button>
            <button
              onClick={() => setSubTab("segments")}
              className={`px-2.5 py-1.5 rounded text-[9px] font-bold uppercase transition ${
                subTab === "segments" ? "bg-[#cca972] text-[#070608]" : "text-slate-400 hover:text-white"
              }`}
            >
              Segments Map
            </button>
            <button
              onClick={() => setSubTab("archive")}
              className={`px-2.5 py-1.5 rounded text-[9px] font-bold uppercase transition ${
                subTab === "archive" ? "bg-[#cca972] text-[#070608]" : "text-slate-400 hover:text-white"
              }`}
            >
              Archive Intel
            </button>
          </div>

          <button
            type="button"
            onClick={handleRegenerate}
            disabled={loading}
            className="flex items-center gap-2 text-[10px] bg-[#1a191c] text-slate-200 px-3 py-2 rounded-xl border border-slate-900 hover:bg-black transition disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-3 animate-spin" /> : <BrainCircuit className="w-3" />}
            <span>Synthesize Telemetry</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/20 border border-rose-950/50 text-rose-300 text-xs rounded-xl">
          <span>{error}</span>
        </div>
      )}

      {/* SUB-VIEW 1: FORECAST ENGINE */}
      {subTab === "forecast" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Main Probabilities indicators */}
          <div className="space-y-4 border border-[#1c1b1e] p-5 rounded-2xl bg-black/40">
            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#cca972] border-b border-slate-900 pb-1.5 flex justify-between items-center font-mono">
              <span>Predictive directional markers</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded font-bold">
                Confidence: {forecast.confidenceLevel}%
              </span>
            </h4>

            <div className="p-4 bg-black/55 border border-slate-900 rounded-xl space-y-1">
              <span className="text-[8px] uppercase tracking-wider font-extrabold text-slate-500">Suggested high-probability content direction</span>
              <p className="text-xs text-white mt-1 leading-relaxed font-semibold">{forecast.bestContentDirection}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div className="p-3 bg-[#0d0d10] border border-slate-900 rounded-lg">
                <span className="text-[8px] font-bold text-slate-500 uppercase block">Optimal Hook Family</span>
                <span className="text-xs text-slate-200 font-medium tracking-tight block mt-0.5">{forecast.bestHookFamily}</span>
              </div>
              <div className="p-3 bg-[#0d0d10] border border-slate-900 rounded-lg">
                <span className="text-[8px] font-bold text-slate-500 uppercase block">Optimal CTA Style</span>
                <span className="text-xs text-emerald-400 font-semibold tracking-tight block mt-0.5">{forecast.bestCtaType}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div className="p-3 bg-[#0d0d10] border border-slate-900 rounded-lg">
                <span className="text-[8px] font-bold text-slate-500 uppercase block">Optimal Niche Format</span>
                <span className="text-xs text-slate-200 font-medium tracking-tight block mt-0.5">{forecast.bestFormat}</span>
              </div>
              <div className="p-3 bg-[#0d0d10] border border-slate-900 rounded-lg">
                <span className="text-[8px] font-bold text-slate-500 uppercase block">Best Timing Window</span>
                <span className="text-xs text-[#cca972] font-semibold tracking-tight block mt-0.5">{forecast.bestPostingWindow}</span>
              </div>
            </div>
          </div>

          {/* Forecasting Diagnosis Explanation */}
          <div className="grid grid-cols-1 gap-4 font-sans justify-start">
            <div className="p-4 bg-[#cca972]/[0.015] border border-[#cca972]/15 rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 text-[#cca972]">
                <Flame className="w-4 h-4 shrink-0" />
                <span className="text-[9px] uppercase font-mono tracking-widest font-black">Forecast strategic justification</span>
              </div>
              <p className="text-xs text-slate-350 leading-relaxed">{forecast.whyThisForecastExists}</p>
            </div>

            <div className="p-4 bg-[#1a1012]/30 border border-rose-950/40 rounded-xl space-y-2">
              <span className="text-[9px] uppercase font-black text-rose-450 text-rose-450 font-mono tracking-wider block">Identified threat/Disclaimers factors</span>
              <p className="text-xs text-slate-350 leading-relaxed">{forecast.riskFactors}</p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: EXPERIMENT LABS */}
      {subTab === "experiments" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {experiments.map((exp, id) => (
              <div key={id} className="border border-[#232225] bg-black/40 p-5 rounded-2xl space-y-4">
                <div className="space-y-1">
                  <span className="text-[8px] text-[#cca972] uppercase font-mono font-black tracking-widest block">Isolating Hypotheses</span>
                  <h4 className="text-sm font-extrabold text-white">{exp.name}</h4>
                </div>

                <p className="text-xs text-slate-300 bg-[#0d0d10] p-3.5 border border-slate-900 leading-relaxed rounded-xl italic">
                  "{exp.hypothesis}"
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                  <div className="p-3.5 bg-[#1a1012]/15 border border-rose-950/30 rounded-lg">
                    <span className="text-[8px] font-black uppercase text-rose-400 block font-mono">Isolated variable changed</span>
                    <span className="text-slate-200 mt-1 block leading-relaxed">{exp.variableChanged}</span>
                  </div>
                  <div className="p-3.5 bg-slate-900/40 border border-slate-800 rounded-lg">
                    <span className="text-[8px] font-black uppercase text-slate-400 block font-mono">Variables kept constant</span>
                    <span className="text-slate-300 mt-1 block leading-relaxed">{exp.variableConstant}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed border-t border-slate-900 pt-3">
                  <div>
                    <span className="text-[8px] font-bold text-slate-500 uppercase block">Expected effect</span>
                    <span className="text-slate-300">{exp.expectedEffect}</span>
                  </div>
                  <div>
                    <span className="text-[8px] font-bold text-slate-500 uppercase block">Measurement criteria</span>
                    <span className="text-slate-300">{exp.measurementCriteria}</span>
                  </div>
                </div>

                <div className="border-t border-[#1c1b1e] pt-3.5 grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div className="p-3 bg-emerald-950/[0.015] border border-emerald-950/25 rounded-lg space-y-1 text-xs">
                    <span className="text-[8px] font-black uppercase text-emerald-450 text-emerald-400 font-mono">Wins next steps</span>
                    <span className="text-slate-300 leading-relaxed block">{exp.ifWinsDecision}</span>
                  </div>
                  <div className="p-3 bg-rose-950/[0.015] border border-rose-950/25 rounded-lg space-y-1 text-xs">
                    <span className="text-[8px] font-black uppercase text-rose-450 text-rose-400 font-mono">Fails revision trigger</span>
                    <span className="text-slate-300 leading-relaxed block">{exp.ifFailsDecision}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: SEGMENTS MAPS */}
      {subTab === "segments" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[segments.primarySegment, segments.secondarySegment].filter(Boolean).map((seg, id) => (
            <div key={id} className="border border-[#232225] bg-black/40 p-5 rounded-2xl space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#cca972]/15 text-[#cca972] font-mono text-[9px] px-3.5 py-1 rounded-bl font-bold">
                {seg.ratio}% of Audience
              </div>

              <div className="space-y-1">
                <span className="text-[8px] text-slate-500 uppercase font-bold tracking-widest font-mono">
                  {id === 0 ? "PRIMARY DEMOGRAPHIC FOCUS" : "SECONDARY DEMOGRAPHIC FOCUS"}
                </span>
                <h4 className="text-sm font-extrabold text-white">{seg.name}</h4>
              </div>

              <div className="p-3 bg-[#cca972]/[0.015] border border-[#cca972]/10 rounded-xl leading-relaxed text-xs">
                <span className="text-[9px] uppercase font-black text-[#cca972] block">Main aspirational desires</span>
                <p className="text-slate-300 mt-0.5">{seg.desires}</p>
              </div>

              <div className="space-y-1.5 text-xs font-sans">
                <span className="text-[8px] font-black uppercase text-slate-500 font-mono tracking-wider block">Pains and obstacles</span>
                <div className="flex flex-wrap gap-2">
                  {seg.painPoints.map((p, idx) => (
                    <span key={idx} className="bg-slate-900 border border-slate-800 text-slate-300 font-medium text-[10px] px-2.5 py-1 rounded">
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 border-t border-slate-900 pt-3 text-[11px] font-sans leading-relaxed text-slate-300">
                <div>
                  <span className="text-[8px] font-bold text-slate-500 uppercase block">Trust Indicators trigger</span>
                  <span className="text-slate-200">{seg.trustTriggers}</span>
                </div>
                <div>
                  <span className="text-[8px] font-bold text-slate-500 uppercase block">Language configuration</span>
                  <span className="text-slate-200">{seg.languagePreference}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[10px] font-mono border-t border-slate-900 pt-3">
                <div className="p-2.5 bg-emerald-950/[0.015] border border-emerald-950/20 rounded-lg">
                  <span className="text-[8px] uppercase text-[#cca972] block font-bold">CTA response index</span>
                  <span className="text-slate-250 block mt-0.5 text-slate-300">{seg.ctaSensitivity}</span>
                </div>
                <div className="p-2.5 bg-[#cca972]/[0.015] border border-[#cca972]/10 rounded-lg">
                  <span className="text-[8px] uppercase text-[#cca972] block font-bold">Conversion potentials</span>
                  <span className="text-slate-250 block mt-0.5 text-slate-300 capitalize">{seg.conversionPotential}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUB-VIEW 4: ARCHIVE INTELLIGENCE */}
      {subTab === "archive" && (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Wins vs Losses analysis */}
            <div className="space-y-4 border border-emerald-950/25 bg-[#0e1713]/15 p-5 rounded-2xl">
              <span className="text-[9px] uppercase font-black text-emerald-400 font-mono tracking-widest block">Historic archive winners</span>
              <div className="space-y-3">
                {archive.oldWins.map((item, idx) => (
                  <div key={idx} className="p-3 bg-black/45 hover:bg-black/80 border border-slate-900 rounded-xl flex items-center justify-between text-xs transition duration-200">
                    <div className="space-y-0.5">
                      <span className="font-bold text-white leading-relaxed truncate max-w-[170px] block">{item.title}</span>
                      <span className="text-[10px] text-slate-500">H: {item.hookUsed} | C: {item.ctaUsed}</span>
                    </div>
                    <span className="bg-emerald-950/40 text-emerald-400 font-mono text-[10px] px-2 py-1 rounded inline-block font-bold">
                      {item.performance}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 border border-rose-950/25 bg-[#1a1012]/15 p-5 rounded-2xl">
              <span className="text-[9px] uppercase font-black text-rose-450 text-rose-450 font-mono tracking-widest block">Historic archive losers</span>
              <div className="space-y-3">
                {archive.oldLosses.map((item, idx) => (
                  <div key={idx} className="p-3 bg-black/45 hover:bg-black/80 border border-slate-900 rounded-xl flex items-center justify-between text-xs transition duration-200">
                    <div className="space-y-0.5">
                      <span className="font-bold text-white leading-relaxed truncate max-w-[170px] block">{item.title}</span>
                      <span className="text-[10px] text-slate-500">H: {item.hookUsed} | C: {item.ctaUsed}</span>
                    </div>
                    <span className="bg-rose-950/40 text-rose-400 font-mono text-[10px] px-2 py-1 rounded inline-block font-bold">
                      {item.performance}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Broad comparison notes */}
          <div className="p-4 bg-slate-900/35 border border-slate-800 rounded-xl space-y-1">
            <span className="text-[9px] uppercase font-black text-[#cca972] block tracking-wide">Historical timeline progression notes</span>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">{archive.comparisonNotes}</p>
          </div>

          {/* Regression vs progression flags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#0e1713]/30 border border-emerald-950/40 rounded-xl space-y-1">
              <span className="block text-[8px] uppercase tracking-wider font-extrabold text-emerald-400">Metrics progression indicators</span>
              <span className="block text-xs text-slate-200 mt-1 font-semibold leading-relaxed font-sans">{archive.whatGotBetter}</span>
            </div>

            <div className="p-4 bg-[#1a1012]/30 border border-rose-950/40 rounded-xl space-y-1">
              <span className="block text-[8px] uppercase tracking-wider font-extrabold text-rose-400">Threat regression warning indicators</span>
              <span className="block text-xs text-slate-200 mt-1 font-semibold leading-relaxed font-sans">{archive.whatRegressed}</span>
            </div>
          </div>

          {/* Obsolete vs Revivable slots */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-[#1c1b1e] pt-5">
            <div className="p-3.5 bg-slate-900/30 border border-slate-850 rounded-xl space-y-0.5">
              <span className="text-[8px] font-black text-rose-455 text-rose-400 uppercase">Consider completely obsolete</span>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed font-sans">{archive.whatObsolete}</p>
            </div>

            <div className="p-3.5 bg-[#cca972]/[0.02] border border-[#cca972]/15 rounded-xl space-y-0.5">
              <span className="text-[8px] font-black text-[#cca972] uppercase">Revivable concept playbook</span>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed font-sans">{archive.whatToRevive}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
