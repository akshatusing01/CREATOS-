import React from "react";
import { Sparkles, Trash2, Save, FileText, FileJson, Check, Copy, RefreshCw, Flame, BookOpen, Clock, AlertTriangle, Video } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ContentPackage } from "../types";
import { soundManager } from "../utils/sound";
import LoadingIndicator from "./LoadingIndicator";

interface ScriptStudioViewProps {
  text: string;
  setText: (v: string) => void;
  contentType: string;
  setContentType: (v: string) => void;
  language: string;
  setLanguage: (v: string) => void;
  niche: string;
  setNiche: (v: string) => void;
  tone: string;
  setTone: (v: string) => void;
  platform: string;
  setPlatform: (v: string) => void;
  goal: string;
  setGoal: (v: string) => void;
  loading: boolean;
  compileProgress: number;
  showProgressBar: boolean;
  contentPackage: ContentPackage | null;
  projectName: string;
  setProjectName: (v: string) => void;
  handleGenerate: () => void;
  handleClearAll: () => void;
  handleSaveProject: () => void;
  handleExportTxt: () => void;
  handleExportJson: () => void;
  handleRegenerateModule: (key: string) => void;
  moduleLoadingKey: string | null;
  copiedKey: string | null;
  handleCopyToClipboard: (text: string, key: string) => void;
  clearConfirm: boolean;
  error: string | null;
}

export default function ScriptStudioView({
  text,
  setText,
  contentType,
  setContentType,
  language,
  setLanguage,
  niche,
  setNiche,
  tone,
  setTone,
  platform,
  setPlatform,
  goal,
  setGoal,
  loading,
  compileProgress,
  showProgressBar,
  contentPackage,
  projectName,
  setProjectName,
  handleGenerate,
  handleClearAll,
  handleSaveProject,
  handleExportTxt,
  handleExportJson,
  handleRegenerateModule,
  moduleLoadingKey,
  copiedKey,
  handleCopyToClipboard,
  clearConfirm,
  error
}: ScriptStudioViewProps) {
  const [activeTab, setActiveTab] = React.useState<"scripts" | "versions">("scripts");

  // Word count & duration helper
  const getStats = (txt: string) => {
    const words = txt ? txt.trim().split(/\s+/).length : 0;
    const duration = Math.round((words / 150) * 60); // average 150 words per minute
    return { words, duration };
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
      {/* LEFT SIDE: Control Form (Spans 5/12) */}
      <div className="xl:col-span-5 space-y-6">
        <div className="bg-white border border-soft-stone rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <label className="text-xs font-bold uppercase tracking-widest text-copper flex items-center gap-2 font-sans">
              <Sparkles className="w-3.5 h-3.5 text-copper animate-pulse" />
              <span>Script Generator Deck</span>
            </label>
          </div>

          {/* 1. Raw Concept Text Area */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-bold text-charcoal flex items-center gap-1">
                <Video className="w-3.5 h-3.5 text-copper" />
                What is your content about?
              </span>
              <span className="text-[10px] text-slate-gray font-sans">Required</span>
            </div>
            <p className="text-[10px] text-slate-gray font-sans">
              Explain your video topic, draft script, target product, or rough pointers in Hinglish, Hindi, or English.
            </p>
            <div className="relative">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onFocus={() => soundManager.playHover()}
                className="w-full min-h-[140px] bg-white border border-soft-stone rounded-xl p-4 text-xs text-charcoal placeholder-slate-gray/50 focus:outline-none focus:border-copper focus:ring-1 focus:ring-copper/10 font-sans leading-relaxed resize-y"
                placeholder="e.g., How AI is changing software engineer jobs in India and why local developers should start building real products..."
              />
              {text && (
                <span className="absolute bottom-2.5 right-3 text-[9px] font-sans text-slate-gray uppercase bg-soft-sand px-2 py-0.5 rounded border border-soft-stone">
                  {text.length} chars
                </span>
              )}
            </div>

            {/* Quick Suggested Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                { label: "💡 Ollama Local coding", text: "How to setup Ollama locally for absolute beginner Indian coders in conversational Hinglish" },
                { label: "💡 UPSC Mock Prep Stress", text: "Why UPSC aspirants feel extreme stress before mock interviews & how to frame answers like an elite IAS officer" },
                { label: "💡 Hinglish finance advice", text: "3 money rules they never taught you in Indian schools about monthly SIP savings and index funds" },
                { label: "💡 Monsoon Marketing hack", text: "How local Indian street food vendors can use Instagram geo-ads during monsoons to double business" }
              ].map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setText(chip.text);
                  }}
                  className="text-[9px] bg-soft-sand hover:bg-[#eae5db] border border-soft-stone text-slate-gray hover:text-charcoal px-2.5 py-1 rounded-lg transition duration-150 cursor-pointer"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Form Settings Grid */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="space-y-1">
              <label className="block text-[10px] uppercase font-bold text-charcoal">Source Format</label>
              <select
                value={contentType}
                onChange={(e) => {
                  soundManager.playClick();
                  setContentType(e.target.value);
                }}
                className="w-full bg-white text-xs text-charcoal rounded-xl p-2.5 border border-soft-stone focus:outline-none focus:border-copper"
              >
                <option value="Topic only">Topic Description</option>
                <option value="Rough script">Rough Draft Script</option>
                <option value="Full creator script">Full Completed Script</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] uppercase font-bold text-charcoal">Target Segment</label>
              <select
                value={niche}
                onChange={(e) => {
                  soundManager.playClick();
                  setNiche(e.target.value);
                }}
                className="w-full bg-white text-xs text-charcoal rounded-xl p-2.5 border border-soft-stone focus:outline-none focus:border-copper"
              >
                <option value="Tech / coding / dev">Tech & Coding / Dev</option>
                <option value="JEE / NEET / UPSC / SSC">JEE / NEET / UPSC / SSC</option>
                <option value="College / student life">College / Student Life</option>
                <option value="Finance / money / investing">Finance & Investing</option>
                <option value="Startup / entrepreneurship">Startup & Business</option>
                <option value="Freelancing / remote work">Freelancing & Remote</option>
                <option value="Personal branding">Personal Branding</option>
                <option value="Edtech / education">Edtech & Education</option>
                <option value="Fitness / self-improvement">Fitness & Self-Help</option>
                <option value="Mixed / General">General / Pop Culture</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] uppercase font-bold text-charcoal">Speaking Tone</label>
              <select
                value={tone}
                onChange={(e) => {
                  soundManager.playClick();
                  setTone(e.target.value);
                }}
                className="w-full bg-white text-xs text-charcoal rounded-xl p-2.5 border border-soft-stone focus:outline-none focus:border-copper"
              >
                <option value="Smart friend">Smart friend</option>
                <option value="Friendly teacher">Friendly teacher</option>
                <option value="Expert advisor">Expert advisor</option>
                <option value="Founder voice">Founder voice</option>
                <option value="Student mentor">Student mentor</option>
                <option value="Straightforward Indian creator">Straightforward Indian</option>
                <option value="Storytelling creator">Storytelling format</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] uppercase font-bold text-charcoal">Platform Goal</label>
              <select
                value={goal}
                onChange={(e) => {
                  soundManager.playClick();
                  setGoal(e.target.value);
                }}
                className="w-full bg-white text-xs text-charcoal rounded-xl p-2.5 border border-soft-stone focus:outline-none focus:border-copper"
              >
                <option value="Viral">Max Virality Potential</option>
                <option value="Retention">High Viewer Retention</option>
                <option value="Clarity">Simple Explainer Clarity</option>
                <option value="Authority">Elite Industry Authority</option>
                <option value="Personal brand">Personal Connection</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] uppercase font-bold text-charcoal">Output Language</label>
              <select
                value={language}
                onChange={(e) => {
                  soundManager.playClick();
                  setLanguage(e.target.value);
                }}
                className="w-full bg-white text-xs text-charcoal rounded-xl p-2.5 border border-soft-stone focus:outline-none focus:border-copper"
              >
                <option value="Hinglish">Hinglish (conversational)</option>
                <option value="Hindi">Hindi only (हिंदी)</option>
                <option value="English">English only</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] uppercase font-bold text-charcoal">Platform Layout</label>
              <select
                value={platform}
                onChange={(e) => {
                  soundManager.playClick();
                  setPlatform(e.target.value);
                }}
                className="w-full bg-white text-xs text-charcoal rounded-xl p-2.5 border border-soft-stone focus:outline-none focus:border-copper"
              >
                <option value="Instagram Reels">Instagram Reels</option>
                <option value="YouTube Shorts">YouTube Shorts</option>
                <option value="Both">Vertical Dual-Feed (Both)</option>
              </select>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-6 space-y-2.5">
            <button
              onClick={handleGenerate}
              disabled={loading || !text.trim()}
              className="w-full flex items-center justify-center gap-2 py-4 bg-copper hover:bg-copper-hover text-white font-bold text-xs rounded-xl tracking-wider uppercase transition shadow-sm disabled:opacity-50 cursor-pointer active:scale-98"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>{loading ? "Transforming content..." : "Build My Content"}</span>
            </button>

            <button
              onClick={handleClearAll}
              className={`w-full py-2.5 text-[11px] font-semibold rounded-xl border transition-all duration-200 cursor-pointer ${
                clearConfirm
                  ? "bg-rose-50 text-rose-600 border-rose-200"
                  : "bg-soft-sand hover:bg-[#eae5db] text-slate-gray border-soft-stone"
              }`}
            >
              {clearConfirm ? "⚠️ Confirm Clear slate?" : "Clear Slate"}
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Generated Script Multiverse (Spans 7/12) */}
      <div className="xl:col-span-7 space-y-6">
        {/* Compilation progress feedback bar */}
        <AnimatePresence>
          {showProgressBar && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-4"
            >
              <div className="bg-white border border-copper/30 rounded-2xl p-4 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-copper">
                    {compileProgress === 100 ? "Creator Package Compiled!" : "Compiling Creator Package..."}
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-copper/10 text-copper px-2 py-0.5 rounded border border-copper/20">
                    {Math.floor(compileProgress)}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-soft-sand rounded-full overflow-hidden">
                  <div
                    className="h-full bg-copper transition-all duration-150"
                    style={{ width: `${compileProgress}%` }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error pipeline bar */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-sm">
            <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <div>
              <p className="font-bold text-rose-800 mb-0.5">Pipeline Processing Error</p>
              <p className="text-rose-700 text-xs leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && <LoadingIndicator />}

        {/* Empty State when no content generated */}
        {!loading && !contentPackage && (
          <div className="py-6">
            <div className="bg-white border border-soft-stone rounded-2xl p-12 text-center max-w-lg mx-auto space-y-4">
              <div className="h-12 w-12 bg-copper/10 rounded-full flex items-center justify-center mx-auto text-copper">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider">No content processed yet</h3>
              <p className="text-xs text-slate-gray leading-relaxed">
                Your generated scripts and ideas will appear here. Fill out the form on the left with your Hinglish draft or topic, and click "Build My Content" to activate the refactoring engine.
              </p>
            </div>
          </div>
        )}

        {/* Generated Content Package Display */}
        {contentPackage && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Project Saving Name Bar */}
            <div className="p-4 bg-white border border-soft-stone rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex-1 w-full">
                <label className="block text-[9px] uppercase tracking-widest font-extrabold text-slate-gray mb-1">
                  Project Title Identity
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Give your project a name..."
                  className="w-full bg-soft-sand border border-soft-stone rounded-xl py-2 px-3 text-xs font-semibold text-charcoal focus:outline-none focus:border-copper"
                />
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
                <button
                  onClick={handleSaveProject}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-copper hover:bg-copper-hover text-white text-xs font-semibold rounded-xl shadow-sm transition active:scale-98 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Project</span>
                </button>
                <button
                  onClick={handleExportTxt}
                  className="p-2 bg-soft-sand hover:bg-[#eae5db] border border-soft-stone rounded-xl text-slate-gray hover:text-charcoal transition cursor-pointer"
                  title="Export TXT Document"
                >
                  <FileText className="w-4 h-4" />
                </button>
                <button
                  onClick={handleExportJson}
                  className="p-2 bg-soft-sand hover:bg-[#eae5db] border border-soft-stone rounded-xl text-slate-gray hover:text-charcoal transition cursor-pointer"
                  title="Export JSON Struct"
                >
                  <FileJson className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Overall Quality Rating Card */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white border border-soft-stone rounded-xl p-3.5 flex flex-col justify-between">
                <span className="text-[9px] text-slate-gray font-bold uppercase tracking-wider">Hook Score</span>
                <span className="text-xl font-black text-copper mt-1 font-mono">{contentPackage.viralScore.hookStrength}%</span>
              </div>
              <div className="bg-white border border-soft-stone rounded-xl p-3.5 flex flex-col justify-between">
                <span className="text-[9px] text-slate-gray font-bold uppercase tracking-wider">Retention Potential</span>
                <span className="text-xl font-black text-copper mt-1 font-mono">{contentPackage.viralScore.retention}%</span>
              </div>
              <div className="bg-white border border-soft-stone rounded-xl p-3.5 flex flex-col justify-between">
                <span className="text-[9px] text-slate-gray font-bold uppercase tracking-wider">Clarity Index</span>
                <span className="text-xl font-black text-copper mt-1 font-mono">{contentPackage.viralScore.clarity}%</span>
              </div>
              <div className="bg-white border border-soft-stone rounded-xl p-3.5 flex flex-col justify-between">
                <span className="text-[9px] text-slate-gray font-bold uppercase tracking-wider">Impact Score</span>
                <span className="text-xl font-black text-copper mt-1 font-mono">{contentPackage.viralScore.overallScore}%</span>
              </div>
            </div>

            {/* Script studio navigation tab controller */}
            <div className="flex gap-2 border-b border-soft-stone pb-2">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setActiveTab("scripts");
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition cursor-pointer ${
                  activeTab === "scripts"
                    ? "bg-copper/10 text-copper border border-copper/20"
                    : "text-slate-gray hover:text-charcoal hover:bg-soft-sand"
                }`}
              >
                📝 Generated Variations
              </button>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setActiveTab("versions");
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition cursor-pointer ${
                  activeTab === "versions"
                    ? "bg-copper/10 text-copper border border-copper/20"
                    : "text-slate-gray hover:text-charcoal hover:bg-soft-sand"
                }`}
              >
                🔄 Multiverse Concepts
              </button>
            </div>

            <div className="space-y-4">
              {activeTab === "scripts" && (
                <div className="space-y-4">
                  {/* Viral Refactored Version */}
                  <div className="bg-white border border-soft-stone rounded-xl p-5 relative group shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                      <span className="inline-flex items-center gap-1 text-[9px] bg-copper/10 text-copper font-sans font-bold px-2.5 py-0.5 rounded-full border border-copper/20">
                        <Flame className="w-3 h-3" />
                        HYPER-VIRAL LOOP FORMAT
                      </span>
                      <div className="flex items-center gap-3 text-[10px] text-slate-gray">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {getStats(contentPackage.scripts.viral).duration}s
                        </span>
                        <span>•</span>
                        <span>{getStats(contentPackage.scripts.viral).words} words</span>
                      </div>
                    </div>
                    <p className="text-xs text-charcoal leading-relaxed whitespace-pre-line font-sans">
                      {contentPackage.scripts.viral}
                    </p>
                    <button
                      onClick={() => handleCopyToClipboard(contentPackage.scripts.viral, "script-viral")}
                      className="absolute top-4 right-4 p-1.5 bg-soft-sand hover:bg-[#eae5db] border border-soft-stone text-slate-gray hover:text-charcoal rounded-lg cursor-pointer transition"
                      title="Copy script version"
                    >
                      {copiedKey === "script-viral" ? <Check className="w-3.5 h-3.5 text-forest-green" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Classic Immersive Storytelling */}
                  <div className="bg-white border border-soft-stone rounded-xl p-5 relative group shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                      <span className="inline-flex items-center gap-1 text-[9px] bg-copper/10 text-copper font-sans font-bold px-2.5 py-0.5 rounded-full border border-copper/20">
                        <BookOpen className="w-3 h-3" />
                        CLASSIC STORYTELLING REWRITE
                      </span>
                      <div className="flex items-center gap-3 text-[10px] text-slate-gray">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {getStats(contentPackage.scripts.storytelling).duration}s
                        </span>
                        <span>•</span>
                        <span>{getStats(contentPackage.scripts.storytelling).words} words</span>
                      </div>
                    </div>
                    <p className="text-xs text-charcoal leading-relaxed whitespace-pre-line font-sans">
                      {contentPackage.scripts.storytelling}
                    </p>
                    <button
                      onClick={() => handleCopyToClipboard(contentPackage.scripts.storytelling, "script-storytelling")}
                      className="absolute top-4 right-4 p-1.5 bg-soft-sand hover:bg-[#eae5db] border border-soft-stone text-slate-gray hover:text-charcoal rounded-lg cursor-pointer transition"
                      title="Copy script version"
                    >
                      {copiedKey === "script-storytelling" ? <Check className="w-3.5 h-3.5 text-forest-green" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* No-Filler Hook First */}
                  <div className="bg-white border border-soft-stone rounded-xl p-5 relative group shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                      <span className="inline-flex items-center gap-1 text-[9px] bg-copper/10 text-copper font-sans font-bold px-2.5 py-0.5 rounded-full border border-copper/20">
                        ⚡ NO-FILLER HOOK-FIRST FORMAT
                      </span>
                      <div className="flex items-center gap-3 text-[10px] text-slate-gray">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {getStats(contentPackage.scripts.hookFirst).duration}s
                        </span>
                        <span>•</span>
                        <span>{getStats(contentPackage.scripts.hookFirst).words} words</span>
                      </div>
                    </div>
                    <p className="text-xs text-charcoal leading-relaxed whitespace-pre-line font-sans">
                      {contentPackage.scripts.hookFirst}
                    </p>
                    <button
                      onClick={() => handleCopyToClipboard(contentPackage.scripts.hookFirst, "script-hookfirst")}
                      className="absolute top-4 right-4 p-1.5 bg-soft-sand hover:bg-[#eae5db] border border-soft-stone text-slate-gray hover:text-charcoal rounded-lg cursor-pointer transition"
                      title="Copy script version"
                    >
                      {copiedKey === "script-hookfirst" ? <Check className="w-3.5 h-3.5 text-forest-green" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Dual Grid: Short (15s) vs Long (60s) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white border border-soft-stone rounded-xl p-4 relative shadow-sm">
                      <span className="block text-[9px] uppercase font-bold text-copper mb-2">⏱️ Ultra Punchy Reels (15s)</span>
                      <p className="text-charcoal text-xs leading-relaxed whitespace-pre-line">{contentPackage.scripts.short}</p>
                      <button
                        onClick={() => handleCopyToClipboard(contentPackage.scripts.short, "script-short")}
                        className="absolute top-3 right-3 p-1.5 bg-soft-sand text-slate-gray hover:text-charcoal rounded-lg cursor-pointer"
                      >
                        {copiedKey === "script-short" ? <Check className="w-3 h-3 text-forest-green" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>

                    <div className="bg-white border border-soft-stone rounded-xl p-4 relative shadow-sm">
                      <span className="block text-[9px] uppercase font-bold text-copper mb-2">📖 Detailed Exposition (60s+)</span>
                      <p className="text-charcoal text-xs leading-relaxed whitespace-pre-line">{contentPackage.scripts.longer}</p>
                      <button
                        onClick={() => handleCopyToClipboard(contentPackage.scripts.longer, "script-longer")}
                        className="absolute top-3 right-3 p-1.5 bg-soft-sand text-slate-gray hover:text-charcoal rounded-lg cursor-pointer"
                      >
                        {copiedKey === "script-longer" ? <Check className="w-3 h-3 text-forest-green" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "versions" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(Object.entries(contentPackage.fullVersions) as [string, { title: string; hook: string; script: string; caption: string }][]).map(([vKey, data]) => (
                    <div key={vKey} className="bg-white border border-soft-stone rounded-xl p-4 relative space-y-3 shadow-sm">
                      <div className="flex justify-between items-center pb-2 border-b border-soft-stone">
                        <span className="inline-block text-[9px] font-sans font-bold uppercase bg-copper/5 text-copper px-2.5 py-0.5 rounded-full border border-copper/10">
                          {vKey} Model
                        </span>
                        <button
                          onClick={() => handleCopyToClipboard(
                            `Title: ${data.title}\nHook: ${data.hook}\nScript: ${data.script}\nCaption: ${data.caption}`,
                            `v-${vKey}`
                          )}
                          className="text-slate-gray hover:text-charcoal cursor-pointer"
                          title="Copy Full Variant Block"
                        >
                          {copiedKey === `v-${vKey}` ? <Check className="w-3.5 h-3.5 text-forest-green" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      <div className="space-y-2.5 text-xs text-charcoal font-sans">
                        <div>
                          <span className="block text-[8px] text-slate-gray uppercase font-bold">Headline Idea</span>
                          <p className="font-bold text-charcoal">{data.title}</p>
                        </div>
                        <div>
                          <span className="block text-[8px] text-slate-gray uppercase font-bold">Retention Hook</span>
                          <p className="italic text-slate-gray">&ldquo;{data.hook}&rdquo;</p>
                        </div>
                        <div>
                          <span className="block text-[8px] text-slate-gray uppercase font-bold">Script Draft</span>
                          <p className="text-[11px] leading-relaxed whitespace-pre-line bg-soft-sand p-2 rounded border border-soft-stone">{data.script}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
