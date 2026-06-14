/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Copy,
  Download,
  Save,
  RefreshCw,
  Flame,
  TrendingUp,
  BarChart3,
  Layers,
  Settings,
  HelpCircle,
  Check,
  FileJson,
  FileText,
  Trash2,
  Cpu,
  Video,
  AlertTriangle,
  Bookmark,
  Share2,
  MessageSquare,
  Hash,
  Search,
  BookOpen,
  FolderOpen,
  ClipboardList
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ProfileConfig from "./components/ProfileConfig";
import ProjectHistory from "./components/ProjectHistory";
import LoadingIndicator from "./components/LoadingIndicator";
import EmptyState from "./components/EmptyState";
import { ContentPackage, SavedProject, ProfileMemory } from "./types";

export default function App() {
  // Input parameters state
  const [text, setText] = useState("");
  const [contentType, setContentType] = useState("Rough script");
  const [language, setLanguage] = useState("English");
  const [niche, setNiche] = useState("AI");
  const [tone, setTone] = useState("Educational");
  const [platform, setPlatform] = useState("Both");
  const [rewriteStrength, setRewriteStrength] = useState("Medium rewrite");
  const [goal, setGoal] = useState("Viral");
  const [style, setStyle] = useState("Storytelling");

  // Custom metadata syncing from localStorage config
  const [profileMemory, setProfileMemory] = useState<ProfileMemory | null>(null);

  // App running states
  const [loading, setLoading] = useState(false);
  const [moduleLoadingKey, setModuleLoadingKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [contentPackage, setContentPackage] = useState<ContentPackage | null>(null);
  const [projectName, setProjectName] = useState("");

  // History State
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | undefined>(undefined);

  // Active module view Tab category for output rendering
  const [activeTab, setActiveTab] = useState<"scripts" | "hooks-ctas" | "captions" | "analysis" | "versions">("scripts");

  // Copy success animation states
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Load Saved Projects on start
  useEffect(() => {
    const history = localStorage.getItem("creatoros_history");
    if (history) {
      try {
        setSavedProjects(JSON.parse(history));
      } catch (e) {
        console.error("Failed to parse saved projects history", e);
      }
    }
  }, []);

  // Quick Action: Pre-populate sample creator scripts for user convenience if empty
  const handleLoadSample = (sampleType: "idea" | "script") => {
    if (sampleType === "idea") {
      setText(
        "AI agents are starting to run locally instead of in the cloud. I want to tell creators how they can run a local autonomous model in 3 simple steps so they never pay OpenAI subscription costs again, using Ollama and a custom terminal script. It should feel incredibly smart and counter-intuitive."
      );
      setContentType("Topic only");
      setNiche("AI");
      setTone("Bold");
      setGoal("Viral");
    } else {
      setText(
        "Hey everyone, today we are talking about why you should start coding in 2026. Coding is not dead because of AI, in fact, AI is making coders 10x faster. If you don't know how to command AI, you will be replaced by someone who does. Let me show you how to start learning python in 30 seconds."
      );
      setContentType("Rough script");
      setNiche("Tech");
      setTone("Educational");
      setGoal("Retention");
    }
  };

  // Sync profile options with input form defaults
  const handleProfileSync = (profile: ProfileMemory) => {
    setProfileMemory(profile);
    // sync default parameters to make starting faster
    setLanguage(profile.language);
    setNiche(profile.niche);
    setTone(profile.tone);
    setStyle(profile.style);
    setRewriteStrength(profile.rewriteStrength);
  };

  // Run content transformation API pipeline
  const handleGenerate = async () => {
    if (!text.trim()) {
      setError("Please paste a script, topic, or rough draft first before running CreatorOS.");
      return;
    }

    setLoading(true);
    setError(null);
    setContentPackage(null);

    try {
      const response = await fetch("/api/transform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          contentType,
          language,
          niche,
          tone,
          platform,
          rewriteStrength,
          goal,
          style,
          profileMemory
        }),
      });

      if (!response.ok) {
        let errMsg = "Failed to trigger AI content transformation.";
        try {
          const result = await response.json();
          errMsg = result.error || errMsg;
        } catch {
          try {
            const rawText = await response.text();
            if (rawText.includes("<!doctype") || rawText.includes("<html")) {
              errMsg = "Server returned an HTML error page. This usually indicates a server error, a network timeout, or that the backend has crashed.";
            } else {
              errMsg = rawText.substring(0, 150) || errMsg;
            }
          } catch {}
        }
        throw new Error(errMsg);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || "Failed to trigger AI content transformation.");
      }

      setContentPackage(result.data);
      // Auto-suggest a default project name based on inputs
      const shortTopic = text.trim().substring(0, 30) + "...";
      setProjectName(`Refactor: ${niche} - ${shortTopic}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Network lost or Server API error. Make sure your GEMINI_API_KEY is configured correctly in the Secrets Panel.");
    } finally {
      setLoading(false);
    }
  };

  // Save Current Project to localStorage
  const handleSaveProject = () => {
    if (!contentPackage) return;

    const nameToSave = projectName.trim() || `Transform Project - ${new Date().toLocaleDateString()}`;
    const newProject: SavedProject = {
      id: activeProjectId || Date.now().toString(),
      name: nameToSave,
      timestamp: new Date().toISOString(),
      inputText: text,
      config: {
        contentType,
        language,
        niche,
        tone,
        platform,
        rewriteStrength,
        goal,
        style
      },
      packageData: contentPackage
    };

    let updatedList = [...savedProjects];
    const existingIndex = updatedList.findIndex(p => p.id === newProject.id);
    
    if (existingIndex > -1) {
      updatedList[existingIndex] = newProject;
    } else {
      updatedList.unshift(newProject);
    }

    setSavedProjects(updatedList);
    localStorage.setItem("creatoros_history", JSON.stringify(updatedList));
    setActiveProjectId(newProject.id);

    // Toast-like feedback
    triggerCopyNotification("project-saved");
  };

  // Restore Project from History
  const handleSelectProject = (project: SavedProject) => {
    setActiveProjectId(project.id);
    setText(project.inputText);
    setContentType(project.config.contentType);
    setLanguage(project.config.language);
    setNiche(project.config.niche);
    setTone(project.config.tone);
    setPlatform(project.config.platform);
    setRewriteStrength(project.config.rewriteStrength);
    setGoal(project.config.goal);
    setStyle(project.config.style);
    setContentPackage(project.packageData);
    setProjectName(project.name);
    setError(null);
  };

  // Delete Project from History
  const handleDeleteProject = (id: string) => {
    const updated = savedProjects.filter(p => p.id !== id);
    setSavedProjects(updated);
    localStorage.setItem("creatoros_history", JSON.stringify(updated));
    if (activeProjectId === id) {
      setActiveProjectId(undefined);
    }
  };

  // Targeted single-module regeneration to refine results
  const handleRegenerateModule = async (moduleKey: string) => {
    if (!text.trim() || !contentPackage) return;

    setModuleLoadingKey(moduleKey);
    setError(null);

    try {
      const response = await fetch("/api/regenerate-module", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          contentType,
          language,
          niche,
          tone,
          platform,
          rewriteStrength,
          goal,
          style,
          moduleKey,
          currentValue: (contentPackage as any)[moduleKey],
          profileMemory
        })
      });

      if (!response.ok) {
        let errMsg = `Failed to refine ${moduleKey} module.`;
        try {
          const result = await response.json();
          errMsg = result.error || errMsg;
        } catch {
          try {
            const rawText = await response.text();
            if (rawText.includes("<!doctype") || rawText.includes("<html")) {
              errMsg = "Server returned an HTML error page. This usually indicates a server error, a network timeout, or that the backend has crashed.";
            } else {
              errMsg = rawText.substring(0, 150) || errMsg;
            }
          } catch {}
        }
        throw new Error(errMsg);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || `Failed to refine ${moduleKey} module.`);
      }

      setContentPackage((prev: any) => {
        if (!prev) return null;
        return {
          ...prev,
          [moduleKey]: result.data
        };
      });

      triggerCopyNotification(`regen-${moduleKey}`);
    } catch (err: any) {
      console.error(err);
      setError(`Module refinement failed: ${err.message}`);
    } finally {
      setModuleLoadingKey(null);
    }
  };

  // Clear App deck for clean slate
  const handleClearAll = () => {
    if (confirm("Reset current inputs and empty the working slate?")) {
      setText("");
      setContentPackage(null);
      setProjectName("");
      setActiveProjectId(undefined);
      setError(null);
    }
  };

  // General element copy helper
  const handleCopyToClipboard = (textToCopy: string, keyName: string) => {
    navigator.clipboard.writeText(textToCopy);
    triggerCopyNotification(keyName);
  };

  const triggerCopyNotification = (key: string) => {
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  // Full-kit bulk compilers
  const getCompiledTextKit = (): string => {
    if (!contentPackage) return "";
    let data = `=== CREATOROS PACKAGE: ${projectName || "Untitled"} ===\n`;
    data += `Goal: ${goal} | Niche: ${niche} | Tone: ${tone} | Language: ${language}\n\n`;

    data += `--- REWRITTEN SCRIPT (VIRAL VERSION) ---\n${contentPackage.scripts.viral}\n\n`;
    data += `--- REWRITTEN SCRIPT (STORYTELLING) ---\n${contentPackage.scripts.storytelling}\n\n`;
    data += `--- REWRITTEN SCRIPT (HOOK FIRST) ---\n${contentPackage.scripts.hookFirst}\n\n`;

    data += `--- HOOKS ---\n`;
    data += `[Curiosity] ${contentPackage.hooks.curiosity.join(" | ")}\n`;
    data += `[Shock] ${contentPackage.hooks.shock.join(" | ")}\n`;
    data += `[Negative] ${contentPackage.hooks.negative.join(" | ")}\n\n`;

    data += `--- CALLS TO ACTION ---\n`;
    data += `[Follow CTA] ${contentPackage.ctas.follow.join("\n")}\n`;
    data += `[Comment Trigger] ${contentPackage.ctas.comment.join("\n")}\n\n`;

    data += `--- CAPTIONS & METADATA ---\n`;
    data += `[Viral Format]\n${contentPackage.captions.viralFormat}\n\n`;
    data += `[SEO Keywords] ${contentPackage.keywords.primary.join(", ")}\n`;
    data += `[Hashtags] ${contentPackage.hashtags.broad.join(" ")}\n`;

    return data;
  };

  const handleExportTxt = () => {
    const rawData = getCompiledTextKit();
    if (!rawData) return;
    const blob = new Blob([rawData], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `CreatorOS-${projectName.toLowerCase().replace(/\s+/g, "-")}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJson = () => {
    if (!contentPackage) return;
    const blob = new Blob([JSON.stringify(contentPackage, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `CreatorOS-${projectName.toLowerCase().replace(/\s+/g, "-")}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen text-slate-200 bg-slate-950 font-sans relative py-6 px-4 md:px-8 flex flex-col justify-between overflow-hidden"
         style={{ background: "radial-gradient(circle at 60% 0%, #151030 0%, #060913 100%)" }}>
      
      {/* Visual Ambient Globs */}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-indigo-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />

      {/* Main Container Layer */}
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col gap-6 z-10">
        
        {/* Header Ribbon / Controls */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Cpu className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white font-display">CreatorOS</span>
                <span className="text-xs bg-indigo-500/20 text-indigo-300 font-mono font-bold px-2 py-0.5 rounded-full">Personal v3.5</span>
              </div>
              <p className="text-xs text-slate-400">Personal-use extreme content factory & performance booster</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-2.5 py-1 text-[11px] font-mono font-semibold text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              GEMINI FLASH PROCESSED
            </div>
            
            <a 
              href="https://ai.studio/build"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gray-900 border border-gray-800 hover:border-gray-750 text-slate-300 transition flex items-center gap-1.5"
            >
              Secrets Panel ⚙️
            </a>
          </div>
        </header>

        {/* Local Settings Configuration Area */}
        <ProfileConfig onSync={handleProfileSync} />

        {/* Dashboard Panels Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT SIDEBAR: Control Deck & History (Spans 4/12) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Input Configuration Deck */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="flex justify-between items-center mb-3">
                <label className="text-xs font-bold uppercase tracking-widest text-indigo-300 flex items-center gap-2">
                  <span>Control Deck</span>
                </label>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleLoadSample("idea")}
                    className="text-[10px] bg-slate-800 hover:bg-slate-700 hover:text-white px-2 py-1 rounded text-slate-300 transition"
                  >
                    💡 Sample Topic
                  </button>
                  <button
                    onClick={() => handleLoadSample("script")}
                    className="text-[10px] bg-slate-800 hover:bg-slate-700 hover:text-white px-2 py-1 rounded text-slate-300 transition"
                  >
                    📝 Sample Script
                  </button>
                </div>
              </div>

              {/* Paste Inputs Textarea */}
              <div className="relative">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full min-h-[160px] bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/55 font-sans leading-relaxed resize-y"
                  placeholder="Paste your topic, rough idea, bullet points or complete script here. CreatorOS will transform it completely..."
                />
                {text && (
                  <span className="absolute bottom-2.5 right-3 text-[10px] font-mono text-slate-500 uppercase bg-slate-900/80 px-2 py-0.5 rounded border border-gray-800">
                    {text.length} characters
                  </span>
                )}
              </div>

              {/* Form Input parameters */}
              <div className="grid grid-cols-2 gap-3.5 mt-5">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Source Type</label>
                  <select
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value)}
                    className="w-full bg-gray-900 text-xs text-white rounded-lg p-2.5 border border-white/10 focus:outline-none"
                  >
                    <option value="Topic only">Topic Only</option>
                    <option value="Rough script">Rough Script</option>
                    <option value="Full creator script">Full Creator Script</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Target Niche</label>
                  <select
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    className="w-full bg-gray-900 text-xs text-white rounded-lg p-2.5 border border-white/10 focus:outline-none"
                  >
                    <option value="AI">AI & Agents</option>
                    <option value="Tech">Tech & Development</option>
                    <option value="Business">Business & Startups</option>
                    <option value="Storytelling">Classic Storytelling</option>
                    <option value="Documentary">Vox-style Doc</option>
                    <option value="Education">Educational</option>
                    <option value="Mixed">Mixed Domain</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Voice Tone</label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full bg-gray-900 text-xs text-white rounded-lg p-2.5 border border-white/10 focus:outline-none"
                  >
                    <option value="Professional">Professional</option>
                    <option value="Casual">Casual / Direct</option>
                    <option value="Bold">Bold / Authoritative</option>
                    <option value="Emotional">Emotional Story</option>
                    <option value="Educational">Visual Teacher</option>
                    <option value="Story-driven">Narrative Hero</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Platform Style</label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full bg-gray-900 text-xs text-white rounded-lg p-2.5 border border-white/10 focus:outline-none"
                  >
                    <option value="Instagram Reels">Instagram Reels Only</option>
                    <option value="YouTube Shorts">YouTube Shorts Only</option>
                    <option value="Both">Vertical Dual-Feed (Both)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Refactor Goal</label>
                  <select
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="w-full bg-gray-900 text-xs text-white rounded-lg p-2.5 border border-white/10 focus:outline-none"
                  >
                    <option value="Viral">Max Virality Potential</option>
                    <option value="Retention">High Dynamic Retention</option>
                    <option value="Clarity">Simple Explainer Clarity</option>
                    <option value="Authority">Elite Industry Authority</option>
                    <option value="Personal brand">Personal Connection</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Output Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-gray-900 text-xs text-white rounded-lg p-2.5 border border-white/10 focus:outline-none"
                  >
                    <option value="English">Pure English</option>
                    <option value="Hinglish">Spoken Hinglish (Conversational)</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-2.5">
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl tracking-wider uppercase transition shadow-lg shadow-indigo-600/30 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-teal-300 animate-pulse" />
                  {loading ? "Transforming Creator Package..." : "Compile Creator Package"}
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={handleClearAll}
                    className="flex-1 py-2 bg-gray-900 hover:bg-gray-800 text-[11px] font-semibold text-slate-300 border border-white/5 rounded-lg transition"
                  >
                    Clear Slate
                  </button>
                  {contentPackage && (
                    <button
                      onClick={handleSaveProject}
                      className="flex-1 py-2 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-300 border border-emerald-500/20 text-[11px] font-semibold rounded-lg transition"
                    >
                      Save As Local Project
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Local History Sidebar Deck */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl">
              <div className="flex justify-between items-center pb-3 border-b border-gray-800 mb-4">
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-xs font-bold uppercase text-slate-300 tracking-wider">Project Backups</h3>
                </div>
                <span className="text-[10px] bg-indigo-500/25 px-2 py-0.5 rounded text-indigo-200">
                  {savedProjects.length} STORES
                </span>
              </div>
              
              <ProjectHistory
                projects={savedProjects}
                onSelect={handleSelectProject}
                onDelete={handleDeleteProject}
                selectedId={activeProjectId}
              />
            </div>

          </div>

          {/* RIGHT VIEW AREA: Dynamic Transform Deck (Spans 8/12) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Error Banner */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-950/40 border border-red-500/30 rounded-2xl flex items-start gap-3.5 text-sm"
              >
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <div>
                  <p className="font-bold text-white mb-0.5">Pipeline Processing Outage</p>
                  <p className="text-red-300/80 text-xs leading-relaxed">{error}</p>
                </div>
              </motion.div>
            )}

            {/* Loader Trigger screen */}
            {loading && <LoadingIndicator />}

            {/* Empty view screen before initial process */}
            {!loading && !contentPackage && (
              <div className="py-12">
                <EmptyState 
                  type="no-input" 
                  onAction={() => handleLoadSample("idea")}
                  actionText="Apply Sample AI Agent Concept"
                />
              </div>
            )}

            {/* FULLY TRANSFORMED CREATOR PACKAGE CARD */}
            {contentPackage && !loading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                tabIndex={0}
                className="space-y-6 focus:outline-none"
              >
                
                {/* Save Project Name / Metadata control */}
                <div className="p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex-1 w-full">
                    <label className="block text-[9px] uppercase tracking-widest font-extrabold text-indigo-300 mb-1">
                      Refactoring Project Identity
                    </label>
                    <input
                      type="text"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="Name your transformed asset package..."
                      className="w-full bg-black/30 border border-white/5 rounded-lg py-1.5 px-3 text-sm font-semibold text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                    <button
                      onClick={handleSaveProject}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition"
                    >
                      <Save className="w-3.5 h-3.5" />
                      Save
                    </button>
                    <button
                      onClick={handleExportTxt}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-gray-800 hover:bg-gray-700 text-slate-300 border border-gray-700 transition"
                      title="Export compiled text asset"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      TXT
                    </button>
                    <button
                      onClick={handleExportJson}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-gray-800 hover:bg-gray-700 text-slate-300 border border-gray-700 transition"
                      title="Export JSON struct"
                    >
                      <FileJson className="w-3.5 h-3.5" />
                      JSON
                    </button>
                  </div>
                </div>

                {/* Score Widget Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-3 flex flex-col justify-between">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Hook Strength</span>
                    <span className="text-2xl font-black text-indigo-400 mt-2">{contentPackage.viralScore.hookStrength}%</span>
                  </div>
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-3 flex flex-col justify-between">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Curiosity</span>
                    <span className="text-2xl font-black text-purple-400 mt-2">{contentPackage.viralScore.curiosity}%</span>
                  </div>
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-3 flex flex-col justify-between">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Retention</span>
                    <span className="text-2xl font-black text-emerald-400 mt-2">{contentPackage.viralScore.retention}%</span>
                  </div>
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-3 flex flex-col justify-between">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Clarity</span>
                    <span className="text-2xl font-black text-amber-400 mt-2">{contentPackage.viralScore.clarity}%</span>
                  </div>
                  <div className="col-span-2 sm:col-span-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-3 flex flex-col justify-between">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Overall SCORE</span>
                    <span className="text-2xl font-black text-rose-400 mt-2">{contentPackage.viralScore.overallScore}%</span>
                  </div>
                </div>

                {/* Main Tab Controller navigation */}
                <div className="flex flex-wrap gap-2 border-b border-gray-800 pb-1.5">
                  <button
                    onClick={() => setActiveTab("scripts")}
                    className={`px-4 py-2 text-xs font-semibold rounded-xl transition ${
                      activeTab === "scripts" ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    📝 Refactored Scripts
                  </button>
                  <button
                    onClick={() => setActiveTab("hooks-ctas")}
                    className={`px-4 py-2 text-xs font-semibold rounded-xl transition ${
                      activeTab === "hooks-ctas" ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    🪝 Scroll Hooks & CTAs
                  </button>
                  <button
                    onClick={() => setActiveTab("captions")}
                    className={`px-4 py-2 text-xs font-semibold rounded-xl transition ${
                      activeTab === "captions" ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    📱 Thumbnail & Captions
                  </button>
                  <button
                    onClick={() => setActiveTab("analysis")}
                    className={`px-4 py-2 text-xs font-semibold rounded-xl transition ${
                      activeTab === "analysis" ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    📊 Retention & Style Notes
                  </button>
                  <button
                    onClick={() => setActiveTab("versions")}
                    className={`px-4 py-2 text-xs font-semibold rounded-xl transition ${
                      activeTab === "versions" ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    🔄 The 4 Variant Models
                  </button>
                </div>

                {/* Dynamic Modules Rendering based on Active Tab */}
                <div className="space-y-6">
                  
                  {/* TAB 1: SCRIPTS MODULE */}
                  {activeTab === "scripts" && (
                    <div className="space-y-6">
                      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                          <div>
                            <h3 className="text-sm font-bold text-indigo-400">Transform Multiverse (Script Rewrites)</h3>
                            <p className="text-[11px] text-slate-400">Choose the ideal framework variation derived from your raw draft.</p>
                          </div>
                          <button
                            onClick={() => handleRegenerateModule("scripts")}
                            disabled={moduleLoadingKey !== null}
                            className="bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 self-start"
                          >
                            <RefreshCw className={`w-3 h-3 ${moduleLoadingKey === "scripts" ? "animate-spin" : ""}`} />
                            {moduleLoadingKey === "scripts" ? "Refining..." : "Refine Scripts Only"}
                          </button>
                        </div>

                        {/* Script cards layout container */}
                        <div className="space-y-4">
                          
                          {/* Hyper-Viral Loop script variation */}
                          <div className="bg-black/30 border border-white/5 rounded-xl p-4 relative group">
                            <span className="inline-flex items-center gap-1 text-[10px] bg-red-600/20 text-red-300 font-mono font-bold px-2 py-0.5 rounded-md mb-2">
                              <Flame className="w-3 h-3" />
                              HYPER-VIRAL LOOP VARIATION
                            </span>
                            <p className="text-white text-xs leading-relaxed whitespace-pre-line font-mono">
                              {contentPackage.scripts.viral}
                            </p>
                            <button
                              onClick={() => handleCopyToClipboard(contentPackage.scripts.viral, "script-viral")}
                              className="absolute top-3 right-3 p-1.5 bg-gray-900 border border-gray-800 hover:bg-gray-800 text-slate-300 rounded-lg text-xs"
                              title="Copy version script"
                            >
                              {copiedKey === "script-viral" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>

                          {/* Classic Immersive Storytelling variation */}
                          <div className="bg-black/30 border border-white/5 rounded-xl p-4 relative group">
                            <span className="inline-flex items-center gap-1 text-[10px] bg-purple-600/20 text-purple-300 font-mono font-bold px-2 py-0.5 rounded-md mb-2">
                              <BookOpen className="w-3 h-3" />
                              IMMERSIVE STORYTELLING FORMAT (Hero's Journey)
                            </span>
                            <p className="text-white text-xs leading-relaxed whitespace-pre-line font-medium text-slate-300">
                              {contentPackage.scripts.storytelling}
                            </p>
                            <button
                              onClick={() => handleCopyToClipboard(contentPackage.scripts.storytelling, "script-story")}
                              className="absolute top-3 right-3 p-1.5 bg-gray-900 border border-gray-800 hover:bg-gray-800 text-slate-300 rounded-lg text-xs"
                            >
                              {copiedKey === "script-story" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>

                          {/* No-Filler Hook First adaptation */}
                          <div className="bg-black/30 border border-white/5 rounded-xl p-4 relative group">
                            <span className="inline-flex items-center gap-1 text-[10px] bg-blue-600/20 text-blue-300 font-mono font-bold px-2 py-0.5 rounded-md mb-2">
                              ⚡ NO-FILLER HOOK-FIRST ADAPTATION
                            </span>
                            <p className="text-white text-xs leading-relaxed whitespace-pre-line font-mono">
                              {contentPackage.scripts.hookFirst}
                            </p>
                            <button
                              onClick={() => handleCopyToClipboard(contentPackage.scripts.hookFirst, "script-hookfirst")}
                              className="absolute top-3 right-3 p-1.5 bg-gray-900 border border-gray-800 hover:bg-gray-800 text-slate-300 rounded-lg text-xs"
                            >
                              {copiedKey === "script-hookfirst" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>

                          {/* Grid with Short (15s) vs Long (60-90s) formats & clean original */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            
                            <div className="bg-black/30 border border-white/5 rounded-xl p-4 relative">
                              <span className="block text-[10px] font-bold text-amber-400 mb-2">⏱️ ULTRA PUNCHY REELS (15-30 SECONDS)</span>
                              <p className="text-slate-300 text-xs leading-relaxed whitespace-pre-line font-mono">{contentPackage.scripts.short}</p>
                              <button
                                onClick={() => handleCopyToClipboard(contentPackage.scripts.short, "script-short")}
                                className="absolute top-3 right-3 p-1.5 bg-gray-900 border border-gray-800 text-slate-400 rounded-lg"
                              >
                                {copiedKey === "script-short" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              </button>
                            </div>

                            <div className="bg-black/30 border border-white/5 rounded-xl p-4 relative">
                              <span className="block text-[10px] font-bold text-teal-400 mb-2">📖 INTEGRATED DETAILED EXPOSITION (60-90 SECONDS)</span>
                              <p className="text-slate-300 text-xs leading-relaxed whitespace-pre-line font-medium text-slate-300">{contentPackage.scripts.longer}</p>
                              <button
                                onClick={() => handleCopyToClipboard(contentPackage.scripts.longer, "script-longer")}
                                className="absolute top-3 right-3 p-1.5 bg-gray-900 border border-gray-800 text-slate-400 rounded-lg"
                              >
                                {copiedKey === "script-longer" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              </button>
                            </div>

                          </div>

                          {/* Original Cleaned Formatter */}
                          <div className="bg-black/30 border border-white/5 rounded-xl p-4 relative">
                            <span className="block text-[10px] font-bold text-indigo-400 mb-2">Cleaned / Structured Base Model</span>
                            <p className="text-slate-400 text-xs leading-relaxed whitespace-pre-line">{contentPackage.scripts.originalCleaned}</p>
                            <button
                              onClick={() => handleCopyToClipboard(contentPackage.scripts.originalCleaned, "script-original-cleaned")}
                              className="absolute top-3 right-3 p-1.5 bg-gray-900 border border-gray-800 text-slate-400 rounded-lg"
                            >
                              {copiedKey === "script-original-cleaned" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>

                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: HOOK DECK & CTA BUILDER */}
                  {activeTab === "hooks-ctas" && (
                    <div className="space-y-6">
                      
                      {/* Hooks Section Card */}
                      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                          <div>
                            <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wider">Scroll-Stopping Hooks Array</h3>
                            <p className="text-[11px] text-slate-400">7 distinctive emotional starting angles to immediately freeze viewer thumbs.</p>
                          </div>
                          <button
                            onClick={() => handleRegenerateModule("hooks")}
                            disabled={moduleLoadingKey !== null}
                            className="bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 self-start"
                          >
                            <RefreshCw className={`w-3 h-3 ${moduleLoadingKey === "hooks" ? "animate-spin" : ""}`} />
                            Refine Hooks list
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Loop other hooks */}
                          {Object.entries(contentPackage.hooks).map(([key, list]) => {
                            if (!Array.isArray(list)) return null;
                            const colors: Record<string, string> = {
                              curiosity: "border-indigo-500/30 text-indigo-300 bg-indigo-950/20",
                              shock: "border-purple-500/30 text-purple-300 bg-purple-950/20",
                              negative: "border-red-500/30 text-red-300 bg-red-950/20",
                              story: "border-teal-500/30 text-teal-300 bg-teal-950/20",
                              question: "border-blue-500/30 text-blue-300 bg-blue-950/20",
                              contrarian: "border-amber-500/30 text-amber-300 bg-amber-950/20",
                              scrollStopper: "border-pink-500/30 text-pink-300 bg-pink-950/20"
                            };
                            return (
                              <div key={key} className="bg-black/20 rounded-xl p-4 border border-white/5 relative">
                                <span className={`inline-block text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md mb-2.5 ${colors[key] || "bg-gray-800"}`}>
                                  {key.replace(/([A-Z])/g, " $1")} Hook Type
                                </span>
                                <ul className="space-y-2 text-xs text-white">
                                  {list.map((hook, idx) => (
                                    <li key={idx} className="flex items-start gap-2 italic hover:text-indigo-200 transition">
                                      <span className="text-slate-500 font-mono shrink-0">#{idx + 1}</span>
                                      <span>&ldquo;{hook}&rdquo;</span>
                                    </li>
                                  ))}
                                </ul>
                                <button
                                  onClick={() => handleCopyToClipboard(list.join("\n"), `hook-${key}`)}
                                  className="absolute top-3.5 right-3.5 text-xs text-slate-500 hover:text-white"
                                  title="Copy hook set"
                                >
                                  {copiedKey === `hook-${key}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* CTA Generator Card */}
                      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                          <div>
                            <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wider">Audience Action CTAs</h3>
                            <p className="text-[11px] text-slate-400">Contextual calls-to-action designed to convert passive scrolls into loyal assets or comments.</p>
                          </div>
                          <button
                            onClick={() => handleRegenerateModule("ctas")}
                            disabled={moduleLoadingKey !== null}
                            className="bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 self-start"
                          >
                            <RefreshCw className={`w-3 h-3 ${moduleLoadingKey === "ctas" ? "animate-spin" : ""}`} />
                            Refine Call-to-actions
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {Object.entries(contentPackage.ctas).map(([key, list]) => {
                            if (!Array.isArray(list)) return null;
                            return (
                              <div key={key} className="bg-black/20 border border-white/5 rounded-xl p-3.5 relative">
                                <span className="block text-[10px] font-mono uppercase text-indigo-400 font-bold mb-2">
                                  {key} conversion trigger
                                </span>
                                <ul className="space-y-2 text-xs text-slate-300">
                                  {list.map((cta, idx) => (
                                    <li key={idx} className="bg-black/30 p-2 rounded border border-white/5 leading-relaxed">
                                      {cta}
                                    </li>
                                  ))}
                                </ul>
                                <button
                                  onClick={() => handleCopyToClipboard(list.join("\n"), `cta-${key}`)}
                                  className="absolute top-3 right-3 text-xs text-slate-500 hover:text-white"
                                >
                                  {copiedKey === `cta-${key}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </div>
                  )}

                  {/* TAB 3: CAPTIONS, THUMBNAILS & TAGS */}
                  {activeTab === "captions" && (
                    <div className="space-y-6">
                      
                      {/* Caption Generator */}
                      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                          <div>
                            <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wider">Multi-Format Bio Captions</h3>
                            <p className="text-[11px] text-slate-400">Clean copy variants formatted exactly for Instagram Reels and YouTube feeds.</p>
                          </div>
                          <button
                            onClick={() => handleRegenerateModule("captions")}
                            disabled={moduleLoadingKey !== null}
                            className="bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 self-start"
                          >
                            <RefreshCw className={`w-3 h-3 ${moduleLoadingKey === "captions" ? "animate-spin" : ""}`} />
                            Refine Captions
                          </button>
                        </div>

                        <div className="space-y-4">
                          {(Object.entries(contentPackage.captions) as [string, string][]).map(([key, textVal]) => {
                            return (
                              <div key={key} className="bg-black/20 border border-white/5 rounded-xl p-4 relative group">
                                <span className="inline-block text-[10px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded-md mb-2 uppercase tracking-wide">
                                  {key.replace(/([A-Z])/g, " $1")} caption format
                                </span>
                                <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                                  {textVal}
                                </p>
                                <button
                                  onClick={() => handleCopyToClipboard(textVal, `caption-${key}`)}
                                  className="absolute top-4.5 right-4 text-xs text-slate-500 hover:text-white"
                                >
                                  {copiedKey === `caption-${key}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Thumbnail Text Overlay Suggestions */}
                      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                          <div>
                            <h3 className="text-sm font-bold text-slate-300">Thumbnail Overlay Copywriter</h3>
                            <p className="text-[11px] text-slate-500">Short, brutal micro segments formatted to display perfectly on high-speed canvases.</p>
                          </div>
                          <button
                            onClick={() => handleRegenerateModule("thumbnailText")}
                            disabled={moduleLoadingKey !== null}
                            className="text-[10px] bg-gray-800 hover:bg-gray-700 text-slate-300 px-3 py-1.5 rounded-lg"
                          >
                            Refine Overlay Text
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-black/30 border border-white/5 rounded-xl p-4">
                            <span className="block text-[10px] text-indigo-400 uppercase font-bold mb-2">⏱️ Under 3-Words Extreme</span>
                            <ul className="space-y-2 text-xs">
                              {contentPackage.thumbnailText.short.map((t, i) => (
                                <li key={i} className="text-white font-black bg-indigo-500/10 border border-indigo-500/20 p-2 rounded text-center">
                                  &ldquo;{t}&rdquo;
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="bg-black/30 border border-white/5 rounded-xl p-4">
                            <span className="block text-[10px] text-purple-400 uppercase font-bold mb-2">⚡ 2-Line High Contrast</span>
                            <ul className="space-y-2 text-xs">
                              {contentPackage.thumbnailText.punchy.map((t, i) => (
                                <li key={i} className="text-white font-extrabold bg-purple-500/10 border border-purple-500/20 p-2 rounded text-center">
                                  &ldquo;{t}&rdquo;
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="bg-black/30 border border-white/5 rounded-xl p-4">
                            <span className="block text-[10px] text-emerald-400 uppercase font-bold mb-2">🤔 Curiosity Gap Builder</span>
                            <ul className="space-y-2 text-xs">
                              {contentPackage.thumbnailText.curiosityBased.map((t, i) => (
                                <li key={i} className="text-white bg-emerald-500/10 border border-emerald-500/20 p-2 rounded text-center font-semibold italic">
                                  &ldquo;{t}&rdquo;
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Hashtags & Keywords Modules */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Hashtag list widget */}
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="text-xs font-bold uppercase text-indigo-400">Hashtags Categorizer</h4>
                            <button
                              onClick={() => handleRegenerateModule("hashtags")}
                              className="text-[10px] text-slate-500 hover:text-white"
                            >
                              Regen
                            </button>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <span className="block text-[10px] text-slate-400 font-bold mb-1.5">Niche focused:</span>
                              <p className="text-xs text-slate-300 font-mono tracking-wide">
                                {contentPackage.hashtags.niche.join(" ")}
                              </p>
                            </div>
                            
                            <div>
                              <span className="block text-[10px] text-slate-400 font-bold mb-1.5">Topic focused:</span>
                              <p className="text-xs text-slate-300 font-mono tracking-wide col-span-2">
                                {contentPackage.hashtags.topicSpecific.join(" ")}
                              </p>
                            </div>

                            <div className="bg-black/30 p-3 rounded-lg border border-white/5 relative">
                              <span className="block text-[10px] text-emerald-400 font-bold mb-1.5">⭐ Ready Copy Blocks (Instagram / TikTok):</span>
                              {contentPackage.hashtags.platformFriendlySets.map((block, idx) => (
                                <p key={idx} className="text-xs text-slate-200 mt-1 font-mono hover:text-indigo-300 cursor-pointer"
                                   onClick={() => handleCopyToClipboard(block.join(" "), `tag-set-${idx}`)}>
                                  {block.join(" ")}
                                </p>
                              ))}
                              <small className="block text-[9px] text-slate-500 mt-2">Click any copy block to send cleanly to clipboard.</small>
                            </div>
                          </div>
                        </div>

                        {/* Keyword list widget */}
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="text-xs font-bold uppercase text-indigo-400">SEO Keyword Registry</h4>
                            <button
                              onClick={() => handleRegenerateModule("keywords")}
                              className="text-[10px] text-slate-500 hover:text-white"
                            >
                              Regen
                            </button>
                          </div>

                          <div className="space-y-3.5">
                            <div>
                              <span className="block text-[9px] text-slate-500 font-mono uppercase">Primary Query Target:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {contentPackage.keywords.primary.map((k, i) => (
                                  <span key={i} className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-white/5">
                                    {k}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div>
                              <span className="block text-[9px] text-slate-500 font-mono uppercase">Long-Tail Hooks:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {contentPackage.keywords.longTail.map((k, i) => (
                                  <span key={i} className="text-[11px] bg-emerald-900/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800/20">
                                    {k}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="bg-black/30 p-2.5 rounded-lg border border-white/5">
                              <span className="block text-[9px] text-slate-400 font-mono uppercase mb-1">High-Volume Search Phrases:</span>
                              <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4">
                                {contentPackage.keywords.searchPhrases.map((phrase, i) => (
                                  <li key={i}>{phrase}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>

                      </div>

                    </div>
                  )}

                  {/* TAB 4: RETENTION ANALYSIS & STYLE CARDS */}
                  {activeTab === "analysis" && (
                    <div className="space-y-6">
                      
                      {/* Pipeline retention step diagnostics */}
                      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                          <div>
                            <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wider">Dynamic Viewer Retention Diagnostics</h3>
                            <p className="text-[11px] text-slate-400">Strategic breakdown of speaking patterns, tension releases and CTAs drops.</p>
                          </div>
                          <button
                            onClick={() => handleRegenerateModule("retentionAnalysis")}
                            disabled={moduleLoadingKey !== null}
                            className="bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 self-start"
                          >
                            <RefreshCw className={`w-3 h-3 ${moduleLoadingKey === "retentionAnalysis" ? "animate-spin" : ""}`} />
                            Refine Diagnostics
                          </button>
                        </div>

                        {/* 5 Stage Retention pipeline cards */}
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 mb-5">
                          <div className="bg-black/40 border border-white/5 p-3.5 rounded-xl">
                            <span className="block text-[9px] text-indigo-400 font-mono uppercase font-bold">1. Hook Trigger</span>
                            <p className="text-[11px] text-slate-200 mt-2 leading-relaxed">{contentPackage.retentionAnalysis.pipeline.hook}</p>
                          </div>
                          <div className="bg-black/40 border border-white/5 p-3.5 rounded-xl">
                            <span className="block text-[9px] text-purple-400 font-mono uppercase font-bold">2. Setup Step</span>
                            <p className="text-[11px] text-slate-200 mt-2 leading-relaxed">{contentPackage.retentionAnalysis.pipeline.setup}</p>
                          </div>
                          <div className="bg-black/40 border border-white/5 p-3.5 rounded-xl">
                            <span className="block text-[9px] text-red-400 font-mono uppercase font-bold">3. Tension release</span>
                            <p className="text-[11px] text-slate-200 mt-2 leading-relaxed">{contentPackage.retentionAnalysis.pipeline.tension}</p>
                          </div>
                          <div className="bg-black/40 border border-white/5 p-3.5 rounded-xl">
                            <span className="block text-[9px] text-emerald-400 font-mono uppercase font-bold">4. Value Payoff</span>
                            <p className="text-[11px] text-slate-200 mt-2 leading-relaxed">{contentPackage.retentionAnalysis.pipeline.payoff}</p>
                          </div>
                          <div className="bg-black/40 border border-white/5 p-3.5 rounded-xl">
                            <span className="block text-[9px] text-amber-400 font-mono uppercase font-bold">5. Conversion CTA</span>
                            <p className="text-[11px] text-slate-200 mt-2 leading-relaxed">{contentPackage.retentionAnalysis.pipeline.cta}</p>
                          </div>
                        </div>

                        {/* Weakness & Improvements lists */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-red-950/15 border border-red-900/30 rounded-xl p-4">
                            <h4 className="text-xs font-bold text-red-300 uppercase mb-2">🚨 Potential Audience Dropoff Risks</h4>
                            <ul className="space-y-2 text-xs text-slate-300 list-disc pl-5">
                              {contentPackage.retentionAnalysis.weaknesses.map((w, i) => (
                                <li key={i} className="leading-relaxed">{w}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="bg-emerald-950/15 border border-emerald-900/30 rounded-xl p-4">
                            <h4 className="text-xs font-bold text-emerald-300 uppercase mb-2">🚀 Actionable Speed Tweak Solutions</h4>
                            <ul className="space-y-2 text-xs text-slate-300 list-disc pl-5">
                              {contentPackage.retentionAnalysis.suggestions.map((s, i) => (
                                <li key={i} className="leading-relaxed">{s}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Title Generator Section */}
                      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-widest">Viral Title & click-stopper Ideas</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-black/30 border border-white/5 rounded-xl p-3.5">
                            <span className="block text-[10px] text-indigo-400 font-bold uppercase mb-2">Creative Shorts Titles</span>
                            <ul className="space-y-2 text-xs text-white">
                              {contentPackage.titles.titleIdeas.map((t, idx) => (
                                <li key={idx} className="flex gap-1.5 items-start hover:text-indigo-400 cursor-pointer"
                                    onClick={() => handleCopyToClipboard(t, `title-${idx}`)}>
                                  <span className="text-slate-500 font-mono">#{idx+1}</span>
                                  <span>&ldquo;{t}&rdquo;</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="bg-black/30 border border-white/5 rounded-xl p-3.5">
                            <span className="block text-[10px] text-purple-400 font-bold uppercase mb-2">Clickable YouTube Headlines</span>
                            <ul className="space-y-2 text-xs text-white">
                              {contentPackage.titles.headlines.map((t, idx) => (
                                <li key={idx} className="flex gap-1.5 items-start hover:text-purple-400 cursor-pointer"
                                    onClick={() => handleCopyToClipboard(t, `headline-${idx}`)}>
                                  <span className="text-slate-500 font-mono">#{idx+1}</span>
                                  <span>&ldquo;{t}&rdquo;</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="bg-black/30 border border-white/5 rounded-xl p-3.5">
                            <span className="block text-[10px] text-rose-400 font-bold uppercase mb-2">Aggressive Click-Stoppers</span>
                            <ul className="space-y-2 text-xs text-white">
                              {contentPackage.titles.scrollStopping.map((t, idx) => (
                                <li key={idx} className="flex gap-1.5 items-start hover:text-rose-400 cursor-pointer"
                                    onClick={() => handleCopyToClipboard(t, `stopping-${idx}`)}>
                                  <span className="text-slate-500 font-mono">#{idx+1}</span>
                                  <span>&ldquo;{t}&rdquo;</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Instructor Style Notes Card */}
                      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <h3 className="text-sm font-bold text-slate-300">Creator Delivery Blueprint</h3>
                            <p className="text-[11px] text-slate-500">Physical directives regarding pacing, style tone, and energetic thresholds.</p>
                          </div>
                          <button
                            onClick={() => handleRegenerateModule("styleNotes")}
                            className="text-[10px] text-slate-500 hover:text-white"
                          >
                            Tweak Delivery Profile
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                            <span className="block text-[10px] text-indigo-400 font-bold uppercase mb-2">Physical Delivery parameters</span>
                            
                            <table className="w-full text-xs text-slate-300 space-y-2">
                              <tbody>
                                <tr className="border-b border-gray-800">
                                  <td className="py-2 text-slate-500 font-semibold uppercase">Style Layout:</td>
                                  <td className="py-2 pl-4 font-bold text-white">{contentPackage.styleNotes.style}</td>
                                </tr>
                                <tr className="border-b border-gray-800">
                                  <td className="py-2 text-slate-500 font-semibold uppercase">Talking speed & pacing:</td>
                                  <td className="py-2 pl-4 text-slate-300">{contentPackage.styleNotes.pacing}</td>
                                </tr>
                                <tr className="border-b border-gray-800">
                                  <td className="py-2 text-slate-500 font-semibold uppercase">Emotional tone:</td>
                                  <td className="py-2 pl-4 text-slate-300">{contentPackage.styleNotes.tone}</td>
                                </tr>
                                <tr>
                                  <td className="py-2 text-slate-500 font-semibold uppercase">Energy Profile:</td>
                                  <td className="py-2 pl-4 text-slate-300 font-mono text-indigo-400">{contentPackage.styleNotes.emotionalEnergy}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          <div className="bg-black/20 p-4 rounded-xl border border-white/5 flex flex-col justify-between">
                            <div>
                              <span className="block text-[10px] text-emerald-400 font-bold uppercase mb-2">Perfect Audience Avatar match</span>
                              <p className="text-xs text-slate-300 leading-relaxed">{contentPackage.styleNotes.audienceMatch}</p>
                            </div>
                            <div className="pt-4 border-t border-gray-800 mt-4">
                              <span className="block text-[10px] text-amber-400 font-bold uppercase mb-1">Strongest Competitive Hook Angle</span>
                              <p className="text-xs text-slate-300 leading-relaxed italic">&ldquo;{contentPackage.styleNotes.strongestAngle}&rdquo;</p>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* TAB 5: MULTIPLE SELF-CONTAINED PRODUCTION VERSIONS */}
                  {activeTab === "versions" && (
                    <div className="space-y-6">
                      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                          <div>
                            <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-widest">Self-Contained Content Packages</h3>
                            <p className="text-[11px] text-slate-400">4 distinct product concepts, complete with title, hook, text script, and caption.</p>
                          </div>
                          <button
                            onClick={() => handleRegenerateModule("fullVersions")}
                            disabled={moduleLoadingKey !== null}
                            className="bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 self-start"
                          >
                            <RefreshCw className={`w-3 h-3 ${moduleLoadingKey === "fullVersions" ? "animate-spin" : ""}`} />
                            Refine All 4 Versions
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {(Object.entries(contentPackage.fullVersions) as [string, { title: string; hook: string; script: string; caption: string }][]).map(([vKey, data]) => {
                            const badgeColors: Record<string, string> = {
                              conservative: "bg-blue-600/20 text-blue-300 border-blue-500/30",
                              viral: "bg-red-600/20 text-red-300 border-red-500/30",
                              storytelling: "bg-purple-600/20 text-purple-300 border-purple-500/30",
                              concise: "bg-emerald-600/20 text-emerald-300 border-emerald-500/30"
                            };

                            return (
                              <div key={vKey} className="bg-black/30 border border-white/5 rounded-xl p-4.5 relative space-y-3">
                                <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                                  <span className={`inline-block text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md border ${badgeColors[vKey] || "bg-gray-800"}`}>
                                    {vKey} execution model
                                  </span>
                                  <button
                                    onClick={() => handleCopyToClipboard(
                                      `Title: ${data.title}\nHook: ${data.hook}\nScript: ${data.script}\nCaption: ${data.caption}`,
                                      `v-${vKey}`
                                    )}
                                    className="text-xs text-slate-500 hover:text-white"
                                    title="Copy package parameters"
                                  >
                                    {copiedKey === `v-${vKey}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                  </button>
                                </div>

                                <div className="space-y-2 text-xs">
                                  <div>
                                    <span className="block text-[9px] text-slate-500 uppercase font-mono">Click-proven Title:</span>
                                    <p className="text-white font-bold">{data.title}</p>
                                  </div>
                                  <div>
                                    <span className="block text-[9px] text-slate-500 uppercase font-mono">Thumb-Freeze Hook:</span>
                                    <p className="text-slate-300 italic font-mono">&ldquo;{data.hook}&rdquo;</p>
                                  </div>
                                  <div>
                                    <span className="block text-[9px] text-slate-500 uppercase font-mono">Production Script:</span>
                                    <p className="text-slate-200 whitespace-pre-line leading-relaxed bg-black/40 p-2.5 rounded border border-white/5 text-[11px] font-mono">{data.script}</p>
                                  </div>
                                  <div>
                                    <span className="block text-[9px] text-slate-500 uppercase font-mono">Accompanying Caption:</span>
                                    <p className="text-slate-400 leading-normal line-clamp-2">{data.caption}</p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                </div>

                {/* Overarching encouraging notes from the system */}
                {contentPackage.notes && (
                  <div className="bg-emerald-950/10 border border-emerald-500/20 rounded-2xl p-4.5 mt-4 text-xs italic text-emerald-300 flex items-start gap-3">
                    <Sparkles className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Director Feedback Loop:</strong> {contentPackage.notes}
                    </span>
                  </div>
                )}

                {/* Consolidated Executive Action Bar */}
                <div className="bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-indigo-950/40 border border-indigo-500/20 rounded-2.5xl p-5 flex flex-col md:flex-row justify-between items-center gap-4 shadow-2xl">
                  <div>
                    <h4 className="text-xs font-black uppercase text-slate-200 tracking-wider">Execute Executive Bulk Copy</h4>
                    <p className="text-[11px] text-indigo-300/80 mt-0.5">Copy all rewrites, hooks, CTAs, and captions cleanly formatted with a single command.</p>
                  </div>
                  <div className="flex gap-3 w-full md:w-auto">
                    <button
                      onClick={() => handleCopyToClipboard(getCompiledTextKit(), "bulk-kit")}
                      className={`flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl text-xs font-bold transition ${
                        copiedKey === "bulk-kit" ? "bg-emerald-600 text-white" : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30"
                      }`}
                    >
                      {copiedKey === "bulk-kit" ? (
                        <>
                          <Check className="w-4 h-4 animate-bounce" />
                          Complete Kit Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy Entire Package
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </motion.div>
            )}

          </div>

        </div>

      </div>

      {/* Footer Meta Diagnostics */}
      <footer className="mt-8 pt-4 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-3 text-[10px] text-slate-500 uppercase tracking-widest max-w-7xl mx-auto w-full">
        <div className="flex gap-4">
          <span>Storage Engine: <span className="text-indigo-400">Browser localStorage API</span></span>
          <span>•</span>
          <span>Security Model: <span className="text-indigo-400">Server-Side Proxy Vault</span></span>
        </div>
        <div>
          <span>Crafted in Cloud Container Workspace for akshatusing02@gmail.com</span>
        </div>
      </footer>

      {/* Global Success Banner alerts */}
      <AnimatePresence>
        {copiedKey && !copiedKey.startsWith("script") && !copiedKey.startsWith("hook") && !copiedKey.startsWith("cta") && !copiedKey.startsWith("caption") && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 bg-slate-900 border border-green-500/30 text-white text-xs font-semibold py-3 px-4 rounded-xl shadow-2xl flex items-center gap-2 z-50"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
            <span>Refactoring Action Executed Successfully: Completed [{copiedKey}]</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
