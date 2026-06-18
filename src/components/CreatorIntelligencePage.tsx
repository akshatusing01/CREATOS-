import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Activity, 
  Brain, 
  History, 
  Download, 
  Copy, 
  Check, 
  AlertCircle, 
  FileText, 
  TrendingUp, 
  BookOpen, 
  Sliders, 
  Award, 
  ShieldCheck, 
  Database,
  ArrowRight,
  RefreshCw,
  Cpu
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CreatorIntelligenceReport } from "../types";
import { soundManager } from "../utils/sound";

// Import custom modular system components
import { InputWorkspace } from "./creator-intelligence/InputWorkspace";
import { ScoreHub } from "./creator-intelligence/ScoreHub";
import { StrategyPlaybook } from "./creator-intelligence/StrategyPlaybook";
import { ScriptAnatomy } from "./creator-intelligence/ScriptAnatomy";
import { ProductionSuite } from "./creator-intelligence/ProductionSuite";
import { CreatorDNAView } from "./creator-intelligence/CreatorDNAView";
import { HistoryVault } from "./creator-intelligence/HistoryVault";

// Import pre-seeded strategy templates
import { 
  MOCK_SCRIPT_DOCTOR_REPORT, 
  MOCK_PERFORMANCE_REPORT, 
  MOCK_DNA_REPORT, 
  MOCK_WINNER_LOSER_REPORT,
  MOCK_COMPETITOR_REPORT,
  MOCK_MULTI_PATTERN_REPORT,
  MOCK_FULL_AUDIT_REPORT,
  MOCK_STRATEGY_ENGINE_REPORT,
  MOCK_HISTORY_REPORTS 
} from "./creator-intelligence/mockReports";

export default function CreatorIntelligencePage() {
  // Analytical Modes List
  const INTEL_MODES = [
    { key: "script_doctor", label: "Script Doctor", desc: "Line-by-line hooks, pacing, and CTAs diagnostic", icon: Sparkles },
    { key: "performance_analyzer", label: "Performance Analyzer", desc: "Retention drops and metrics optimization", icon: Activity },
    { key: "creator_dna_builder", label: "Creator DNA Builder", desc: "Uncover core styles, triggers, and content niche", icon: Brain },
    { key: "winner_loser_comparison", label: "Winner vs Loser", desc: "Direct contrast side-by-side gap insights", icon: Award },
    { key: "competitor_analysis", label: "Competitor Analysis", desc: "Style gap vs industry references", icon: Sliders },
    { key: "multi_pattern_analysis", label: "Multi-Content Patterns", desc: "Identify batch performance errors", icon: BookOpen },
    { key: "full_content_audit", label: "Full Content Audit", desc: "Macro qualitative and systems roadmap", icon: ShieldCheck },
    { key: "strategy_engine", label: "Content Strategy Engine", desc: "Targeted hooks lists & idea pipelines", icon: DbIcon }
  ];

  // Helper custom icon mapping if DB is requested
  function DbIcon(props: any) {
    return <Database className={props.className} />;
  }

  // Active state management
  const [activeMode, setActiveMode] = useState<string>("script_doctor");
  const [currentReport, setCurrentReport] = useState<CreatorIntelligenceReport | null>(MOCK_SCRIPT_DOCTOR_REPORT);
  const [history, setHistory] = useState<CreatorIntelligenceReport[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState<string>("");
  const [saveStatus, setSaveStatus] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync state with localStorage fallback
  useEffect(() => {
    // Sync historical archives
    const savedHistory = localStorage.getItem("creatoros_intel_history");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        setHistory(MOCK_HISTORY_REPORTS);
      }
    } else {
      setHistory(MOCK_HISTORY_REPORTS);
      localStorage.setItem("creatoros_intel_history", JSON.stringify(MOCK_HISTORY_REPORTS));
    }

    // Sync active mode selection
    const savedMode = localStorage.getItem("creatoros_intel_active_mode");
    if (savedMode) {
      setActiveMode(savedMode);
      loadMockForMode(savedMode);
    }
  }, []);

  const loadMockForMode = (mode: string) => {
    if (mode === "script_doctor") setCurrentReport(MOCK_SCRIPT_DOCTOR_REPORT);
    else if (mode === "performance_analyzer") setCurrentReport(MOCK_PERFORMANCE_REPORT);
    else if (mode === "creator_dna_builder") setCurrentReport(MOCK_DNA_REPORT);
    else if (mode === "winner_loser_comparison") setCurrentReport(MOCK_WINNER_LOSER_REPORT);
    else if (mode === "competitor_analysis") setCurrentReport(MOCK_COMPETITOR_REPORT);
    else if (mode === "multi_pattern_analysis") setCurrentReport(MOCK_MULTI_PATTERN_REPORT);
    else if (mode === "full_content_audit") setCurrentReport(MOCK_FULL_AUDIT_REPORT);
    else if (mode === "strategy_engine") setCurrentReport(MOCK_STRATEGY_ENGINE_REPORT);
    else setCurrentReport(MOCK_SCRIPT_DOCTOR_REPORT); // Fallback standard
  };

  const handleModeChange = (key: string) => {
    soundManager.playClick();
    setActiveMode(key);
    localStorage.setItem("creatoros_intel_active_mode", key);
    loadMockForMode(key);
    setErrorMessage(null);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Run dynamic analysis API connection
  const handleAnalyze = async (inputData: any) => {
    setIsAnalyzing(true);
    setErrorMessage(null);
    soundManager.playSparkle();

    // Staged loading state machine logic
    const steps = [
      "STAGE A: Parsing Input Variables & Metrics...",
      "STAGE B: Extracting Script Narrative Coordinates...",
      "STAGE C: Formulating Hook and Retention Diagnostic Matrices...",
      "STAGE D: Sifting Comparative Patterns & DNA Markers...",
      "STAGE E: Synthesizing Dynamic Strategist Report JSON..."
    ];

    let currentStepIdx = 0;
    setLoadingStep(steps[0]);
    const stepInterval = setInterval(() => {
      currentStepIdx++;
      if (currentStepIdx < steps.length) {
        setLoadingStep(steps[currentStepIdx]);
      }
    }, 1500);

    try {
      const response = await fetch("/api/creator-intelligence/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: activeMode, inputData })
      });

      clearInterval(stepInterval);

      if (!response.ok) {
        const errDetails = await response.json();
        throw new Error(errDetails.error || "Synthesis Failed.");
      }

      const result = await response.json();
      if (!result.success || !result.data) {
        throw new Error("Invalid report response envelope received from engine.");
      }

      // Add report metadata
      const newReport: CreatorIntelligenceReport = {
        ...result.data,
        id: "intel_" + Date.now(),
        createdAt: new Date().toISOString()
      };

      setCurrentReport(newReport);
      
      // Update historical archives securely
      const updatedHistory = [newReport, ...history];
      setHistory(updatedHistory);
      localStorage.setItem("creatoros_intel_history", JSON.stringify(updatedHistory));

      // Successfully generated sound
      soundManager.playSuccess();
      showToast("Strategist Report Synthesized Successfully!");

    } catch (err: any) {
      console.error(err);
      soundManager.playError();
      setErrorMessage(
        err.message || 
        "Synthesis failed on server gateway. Please verify your GEMINI_API_KEY parameters inside the Secrets Sidebar."
      );
    } finally {
      setIsAnalyzing(false);
      setLoadingStep("");
    }
  };

  // Single report export logic
  const handleExportMarkdown = (report: CreatorIntelligenceReport) => {
    const mdContent = `\
# CREATOR INTELLIGENCE EVALUATION REPORT
**Mode:** ${report.mode.toUpperCase()}
**Title:** ${report.title}
**Date:** ${new Date(report.createdAt).toUTCString()}

## EXECUTIVE SUMMARY
${report.summary}

## DIAGNOSTIC DIMENSION RATINGS
- Hook strength: ${report.scores.hook.score}% (${report.scores.hook.label})
- Retention potential: ${report.scores.retention.score}% (${report.scores.retention.label})
- Narrative flow: ${report.scores.flow.score}% (${report.scores.flow.label})
- Audience matching index: ${report.scores.audienceMatch.score}% (${report.scores.audienceMatch.label})
- Compounded core grade: ${report.scores.overall.score}% (${report.scores.overall.label})

## EXECUTIVE STRATEGY PLAYBOOK
### Keep Doing
${report.strategy.keepDoing.map(x => `- ${x}`).join("\n")}

### Stop Doing
${report.strategy.stopDoing.map(x => `- ${x}`).join("\n")}

### Critical Bottleneck
${report.strategy.biggestBottleneck}

### Highest Leverage Fix
${report.strategy.highestLeverageFix}

## DETAILED SCRIPT REWRITE ALTERNATIVE
${report.improvedVersion}
`;

    const blob = new Blob([mdContent], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `CI-Report-${report.id}.md`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Markdown Report Saved Successfully!");
  };

  return (
    <div className="min-h-screen bg-[#070608] text-slate-100 pb-20 relative select-none selection:bg-[#cca972]/30 selection:text-white">
      {/* Absolute faint copper mesh grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#cca972/[0.015]_1px,transparent_1px),linear-gradient(to_bottom,#cca972/[0.015]_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      {/* Primary toast container popup */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#cca972] text-[#070608] font-sans font-bold text-xs uppercase tracking-widest px-5 py-3 rounded-full shadow-2xl flex items-center gap-2 border border-white/20"
          >
            <Sparkles className="w-4 h-4 text-[#070608]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10 relative">
        
        {/* HERO SECTION - The Obsidian Strategy Lab */}
        <div className="relative border border-[#232225] bg-[#0c0b0e] p-8 rounded-2xl shadow-3xl overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#cca972]/[0.025] to-transparent pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#cca972]/20 to-transparent" />
          
          <div className="space-y-2 max-w-2xl">
            <span className="text-[10px] uppercase font-black tracking-widest text-[#cca972] bg-[#cca972]/10 px-3 py-1 rounded-full border border-[#cca972]/20 inline-block font-sans">
              ✦ CreatorOS Strategy Sandbox
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white font-display">
              The Obsidian Strategy Lab
            </h1>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Analyze transcripts, script structures, compare winner metrics, and map Creator DNA profile matrices using deep analytical networks.
            </p>
          </div>

          <div className="flex gap-3 self-start md:self-center">
            {currentReport && (
              <button
                type="button"
                onClick={() => handleExportMarkdown(currentReport)}
                className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-400 hover:text-[#cca972] bg-white/[0.02] hover:bg-white/[0.04] px-4 py-2.5 rounded-xl border border-[#232225] transition duration-200 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Executive Report</span>
              </button>
            )}
          </div>
        </div>

        {/* MODE SELECTOR GRID */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 font-sans">Evaluate Substation Operations Mode</h2>
            <p className="text-[11px] text-slate-500 font-sans mt-0.5">Toggle sub-workspaces targeting specialized content diagnostics.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {INTEL_MODES.map((mode) => {
              const IconComponent = mode.icon;
              const isActive = activeMode === mode.key;
              return (
                <button
                  key={mode.key}
                  type="button"
                  onClick={() => handleModeChange(mode.key)}
                  className={`p-4 rounded-xl border text-left flex flex-col justify-between h-[100px] transition-all duration-300 relative overflow-hidden group cursor-pointer ${
                    isActive
                      ? "bg-[#cca972]/5 border-[#cca972]/45 scale-[1.02] shadow-[0_0_15px_-3px_rgba(204,169,114,0.1)] text-white"
                      : "bg-[#0b0a0c]/80 border-[#1c1b1e] hover:border-[#38373b] hover:bg-[#141316] text-[#b0afb2]"
                  }`}
                >
                  <div className="flex justify-between items-start w-full">
                    <div className={`p-1.5 rounded-lg ${isActive ? "bg-[#cca972]/15 text-[#cca972]" : "bg-black/40 text-slate-500 group-hover:text-slate-300"}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#cca972] animate-ping" />
                    )}
                  </div>
                  
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-wider font-sans mt-2">{mode.label}</span>
                    <span className="block text-[8.5px] text-slate-505 text-slate-500 mt-0.5 font-sans leading-tight line-clamp-1">{mode.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* INPUT PANEL COCHRAN HUB */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          <InputWorkspace 
            activeMode={activeMode} 
            isAnalyzing={isAnalyzing} 
            onAnalyze={handleAnalyze} 
          />
        </div>

        {/* ERROR STATE VIEW */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 bg-rose-950/[0.04] border border-rose-950/45 text-rose-450 text-rose-400 rounded-2xl flex items-start gap-3.5"
          >
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider">Strategic Pipeline Error</h4>
              <p className="text-xs text-slate-300 leading-normal font-sans">{errorMessage}</p>
            </div>
          </motion.div>
        )}

        {/* INTENTIONAL PREMIUM LOADING STATE SKELETON */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8 pointer-events-none select-none py-10"
            >
              <div className="text-center space-y-3 max-w-md mx-auto py-4">
                <div className="relative w-12 h-12 mx-auto">
                  <RefreshCw className="w-10 h-10 text-[#cca972] animate-spin opacity-80" />
                  <Cpu className="w-5 h-5 text-white absolute inset-0 m-auto" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#cca972] font-sans">{loadingStep}</h3>
                <p className="text-[10px] text-slate-500">Compiling structural vectors, grading hooks algorithms, and aligning output schemas...</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 opacity-35">
                <div className="md:col-span-4 h-56 bg-slate-900/30 rounded-2xl animate-pulse border border-slate-900" />
                <div className="md:col-span-8 h-56 bg-slate-900/30 rounded-2xl animate-pulse border border-slate-900" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* THE MAIN REPORT OUTPUT DISPLAY */}
        {currentReport && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-10"
          >
            
            {/* COMPONENT 1: METRICS HUB AREA */}
            <div className="space-y-4">
              <div>
                <span className="text-[10px] uppercase font-extrabold text-[#cca972] tracking-wider font-sans">Compacted Strategic Summary</span>
                <p className="text-sm font-medium text-white italic leading-relaxed mt-1">"{currentReport.summary}"</p>
              </div>
              <ScoreHub scores={currentReport.scores} />
            </div>

            {/* COMPONENT 2: PLAYBOOK PANEL */}
            <StrategyPlaybook strategy={currentReport.strategy} />

            {/* COMPONENT 3: SCRIPT REWRITE ALTERNATIVES */}
            {(currentReport.improvedVersion || currentReport.shorterVersion || currentReport.punchierVersion) && (
              <ProductionSuite 
                originalText="Source evaluation script parsed successfully." 
                improvedVersion={currentReport.improvedVersion}
                shorterVersion={currentReport.shorterVersion}
                punchierVersion={currentReport.punchierVersion}
              />
            )}

            {/* COMPONENT 4: SCRIPT STRUCTURAL MAP */}
            {currentReport.structure && currentReport.structure.length > 0 && (
              <ScriptAnatomy structure={currentReport.structure} />
            )}

            {/* COMPONENT 5: CREATOR DNA */}
            {currentReport.creatorDNAUpdate && (
              <CreatorDNAView dna={currentReport.creatorDNAUpdate} />
            )}

          </motion.div>
        )}

        {/* EMPTY STATE - WHEN CURRENT REPORT IS DELETED OR OFFLINE */}
        {!currentReport && !isAnalyzing && (
          <div className="p-12 border border-[#232225] bg-[#0c0b0e] h-[220px] rounded-2xl flex flex-col justify-center items-center text-center space-y-3 shadow-xl">
            <BookOpen className="w-8 h-8 text-[#cca972] animate-pulse" />
            <div>
              <h4 className="text-xs font-bold uppercase text-white tracking-widest font-sans">Lab Workspace Empty</h4>
              <p className="text-xs text-slate-500 mt-1">Load reference templates above or run a fresh AI Diagnostic rewrite.</p>
            </div>
          </div>
        )}

        {/* HISTORIC ARCHIVES VAULT CONTAINER */}
        <HistoryVault 
          history={history} 
          activeReportId={currentReport?.id} 
          onSelectReport={(report) => {
            setCurrentReport(report);
            setActiveMode(report.mode);
          }} 
          onExportMarkdown={handleExportMarkdown} 
        />

      </div>
    </div>
  );
}
