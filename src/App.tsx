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
  ClipboardList,
  Database,
  Cloud,
  CloudOff,
  Terminal,
  Volume2,
  VolumeX,
  Sun,
  Moon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ProfileConfig from "./components/ProfileConfig";
import ProjectHistory from "./components/ProjectHistory";
import LoadingIndicator from "./components/LoadingIndicator";
import EmptyState from "./components/EmptyState";
import { ContentPackage, SavedProject, ProfileMemory } from "./types";
import { soundManager } from "./utils/sound";
import QuoteOrb from "./components/QuoteOrb";
import FloatingAccentLayer from "./components/FloatingAccentLayer";

export default function App() {
  // Theme state switcher with localStorage persistence
  const [theme, setTheme] = useState<"atelier" | "light">(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("creatoros_theme");
      if (savedTheme === "light" || savedTheme === "atelier") {
        return savedTheme;
      }
    }
    return "atelier";
  });

  // Sound & animation preferences state (directly configurable with full reversibility)
  const [isMuted, setIsMuted] = useState(soundManager.getMuteStatus());
  const [animationsEnabled, setAnimationsEnabled] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("creatoros_animations_disabled") !== "true";
    }
    return true;
  });

  const toggleTheme = () => {
    const nextTheme = theme === "atelier" ? "light" : "atelier";
    if (typeof window !== "undefined") {
      localStorage.setItem("creatoros_theme", nextTheme);
      setTheme(nextTheme);
      soundManager.playClick();
    }
  };

  const toggleSound = () => {
    const nextValue = !isMuted;
    soundManager.setMuteStatus(nextValue);
    setIsMuted(nextValue);
    if (!nextValue) {
      soundManager.playClick();
    }
  };

  const toggleAnimations = () => {
    const nextValue = !animationsEnabled;
    if (typeof window !== "undefined") {
      localStorage.setItem("creatoros_animations_disabled", String(!nextValue));
      setAnimationsEnabled(nextValue);
      window.dispatchEvent(new Event("creatoros_settings_updated"));
    }
  };

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
  const [clearConfirm, setClearConfirm] = useState(false);

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

  // Supabase Database Connection & Setup Status
  const [dbStatus, setDbStatus] = useState<{
    configured: boolean;
    reachable: boolean;
    status: string;
    url?: string;
    setupSql?: string;
  } | null>(null);
  const [dbSyncLoading, setDbSyncLoading] = useState(false);
  const [showSqlSetup, setShowSqlSetup] = useState(false);

  // Active module view Tab category for output rendering
  const [activeTab, setActiveTab] = useState<"scripts" | "hooks-ctas" | "captions" | "analysis" | "versions">("scripts");

  // Copy success animation states
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Query live Supabase configuration status from server
  const checkDbStatus = async () => {
    try {
      const response = await fetch("/api/db-status");
      if (response.ok) {
        const data = await response.json();
        setDbStatus(data);
        return data;
      }
    } catch (e) {
      console.error("Failed to query DB integration status:", e);
    }
    return null;
  };

  // Sync / retrieve projects from Supabase
  const handleFetchSupabaseProjects = async () => {
    setDbSyncLoading(true);
    try {
      const response = await fetch("/api/projects");
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.source === "supabase") {
          setSavedProjects(result.data);
          // Sync back to local storage for offline memory
          localStorage.setItem("creatoros_history", JSON.stringify(result.data));
          triggerCopyNotification("db-synced");
        }
      } else {
        const errData = await response.json().catch(() => ({}));
        if (errData.code === "TABLE_NOT_FOUND" || response.status === 404) {
          // Keep local intact but warning user
          await checkDbStatus();
        }
      }
    } catch (e) {
      console.error("Failed to fetch Supabase records:", e);
    } finally {
      setDbSyncLoading(false);
    }
  };

  // Load Saved Projects on start & Sync Supabase DB in parallel
  useEffect(() => {
    // 1. Instantly load from localStorage for lightning fast startup UX
    const localHistory = localStorage.getItem("creatoros_history");
    if (localHistory) {
      try {
        setSavedProjects(JSON.parse(localHistory));
      } catch (e) {
        console.error("Failed to parse saved projects history", e);
      }
    }

    // 2. Query Supabase connection status & reload items if online
    const initDbSync = async () => {
      const status = await checkDbStatus();
      if (status && status.configured && status.reachable && status.status === "CONNECTED") {
        try {
          const res = await fetch("/api/projects");
          if (res.ok) {
            const body = await res.json();
            if (body.success && body.source === "supabase") {
              setSavedProjects(body.data);
              localStorage.setItem("creatoros_history", JSON.stringify(body.data));
            }
          }
        } catch (err) {
          console.error("Auto background DB sync failed:", err);
        }
      }
    };
    initDbSync();
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

    soundManager.playCompile();
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
      soundManager.playSuccess();
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

  // Save Current Project to localStorage & Supabase
  const handleSaveProject = async () => {
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
    soundManager.playSuccess();
    setActiveProjectId(newProject.id);

    // Sync to Supabase in parallel if configured & connected
    if (dbStatus?.configured && dbStatus?.reachable && dbStatus?.status === "CONNECTED") {
      try {
        const response = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newProject)
        });
        if (response.ok) {
          triggerCopyNotification("project-saved-supabase");
        } else {
          console.warn("Supabase failed saving. Stored in localStorage backup.");
          triggerCopyNotification("project-saved-local-only");
        }
      } catch (err) {
        console.error("Supabase REST POST failed:", err);
        triggerCopyNotification("project-saved-local-only");
      }
    } else {
      triggerCopyNotification("project-saved");
    }
  };

  // Restore Project from History
  const handleSelectProject = (project: SavedProject) => {
    soundManager.playClick();
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

  // Delete Project from History & Supabase
  const handleDeleteProject = async (id: string) => {
    soundManager.playClick();
    const updated = savedProjects.filter(p => p.id !== id);
    setSavedProjects(updated);
    localStorage.setItem("creatoros_history", JSON.stringify(updated));
    if (activeProjectId === id) {
      setActiveProjectId(undefined);
    }

    // Try deleting from Supabase
    if (dbStatus?.configured && dbStatus?.reachable && dbStatus?.status === "CONNECTED") {
      try {
        const response = await fetch(`/api/projects/${id}`, {
          method: "DELETE"
        });
        if (response.ok) {
          triggerCopyNotification("deleted-supabase");
        } else {
          triggerCopyNotification("deleted-local-only");
        }
      } catch (err) {
        console.error("Failed to delete project from Supabase:", err);
        triggerCopyNotification("deleted-local-only");
      }
    } else {
      triggerCopyNotification("deleted");
    }
  };

  // Targeted single-module regeneration to refine results
  const handleRegenerateModule = async (moduleKey: string) => {
    if (!text.trim() || !contentPackage) return;

    soundManager.playCompile();
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

      soundManager.playSuccess();
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
    if (!clearConfirm) {
      soundManager.playClick();
      setClearConfirm(true);
      // Automatically reset option after 4 seconds of idle
      setTimeout(() => {
        setClearConfirm(prev => {
          if (prev) return false;
          return prev;
        });
      }, 4000);
    } else {
      soundManager.playSuccess();
      setText("");
      setContentPackage(null);
      setProjectName("");
      setActiveProjectId(undefined);
      setError(null);
      setClearConfirm(false);
    }
  };

  // General element copy helper
  const handleCopyToClipboard = (textToCopy: string, keyName: string) => {
    soundManager.playClick();
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
    <div id="creatoros-app-root" className={`min-h-screen text-[#e8dfd8] bg-[#0c0c0e] font-sans relative py-6 px-4 md:px-8 flex flex-col justify-between overflow-hidden selection:bg-[#cf7051]/30 selection:text-white pb-12 transition-all duration-300 ${theme === "light" ? "theme-light" : "theme-atelier"}`}>
      {/* Background Cinematic Floating Particles & Orbs */}
      <FloatingAccentLayer />

      {/* Visual Ambient Sand and Rose Globs */}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-[#cf7051]/5 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#cca972]/3 blur-[120px] pointer-events-none" />

      {/* Main Container Layer */}
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col gap-6 z-10">
        
        {/* Header Ribbon / Controls */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 bg-[#141416]/95 backdrop-blur-xl border border-[#232225] rounded-2xl shadow-xl gap-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 bg-gradient-to-tr from-[#cf7051] to-[#cca972] rounded-xl flex items-center justify-center shadow-lg shadow-[#cf7051]/20">
              <Cpu className="w-5.5 h-5.5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-xl font-bold tracking-tight text-white font-display">CreatorOS</span>
                <span className="text-[10px] bg-[#cca972]/15 text-[#cca972] border border-[#cca972]/30 font-mono font-bold px-2.5 py-0.5 rounded-full">Atelier v3.5</span>
              </div>
              <p className="text-xs text-[#9cd69c] text-opacity-80">Refined Content Intelligence Command Center</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Direct Reversible Preferences (Sounds, Particles, and Dark/Light Theme) */}
            <button
              onClick={toggleTheme}
              onMouseEnter={() => soundManager.playHover()}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition duration-200 cursor-pointer ${
                theme === "light"
                  ? "bg-[#cf7051]/10 text-[#cf7051] border-[#cf7051]/30 hover:bg-[#cf7051]/15"
                  : "bg-[#202022] text-[#cca972] border-[#2e2c2a] hover:bg-[#2c2c2f]"
              }`}
              title={theme === "light" ? "Switch to Atelier Dark Mode" : "Switch to High-Contrast Light Mode"}
            >
              {theme === "light" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              <span>Theme: {theme === "light" ? "Light" : "Atelier"}</span>
            </button>

            <button
              onClick={toggleSound}
              onMouseEnter={() => soundManager.playHover()}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition duration-200 cursor-pointer ${
                !isMuted 
                  ? "bg-[#cf7051]/10 text-[#cf7051] border-[#cf7051]/30 hover:bg-[#cf7051]/15" 
                  : "bg-[#202022] text-[#5e5a5c] border-[#2e2b2a] hover:bg-[#28282b]"
              }`}
              title={isMuted ? "Enable click feedback audio (synthesized)" : "Mute button sounds"}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">Audio Feedback</span>
            </button>

            <button
              onClick={toggleAnimations}
              onMouseEnter={() => soundManager.playHover()}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition duration-200 cursor-pointer ${
                animationsEnabled 
                  ? "bg-[#9ca69b]/10 text-[#9ca69b] border-[#9ca69b]/30 hover:bg-[#9ca69b]/15" 
                  : "bg-[#202022] text-[#5e5a5c] border-[#2e2b2a] hover:bg-[#28282b]"
              }`}
              title={animationsEnabled ? "Disable floating animations (save CPU)" : "Enable luxury floating visual drifts"}
            >
              <Sparkles className={`w-3.5 h-3.5 ${animationsEnabled ? "animate-pulse" : ""}`} />
              <span className="hidden sm:inline">Canvas Drifts</span>
            </button>

            <div className="flex items-center gap-2 bg-[#9ca69b]/10 border border-[#9ca69b]/25 rounded-xl px-3 py-1.5 text-[10.5px] font-mono font-bold text-[#9ca69b]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#cca972] animate-ping"></span>
              GEMINI FLASH PROCESSED
            </div>
            
            <a 
              href="https://ai.studio/build"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#202022] hover:bg-[#2c2c2f] border border-[#2e2c2a] text-[#cca972] hover:text-white transition flex items-center gap-1.5"
            >
              Secrets Panel ⚙️
            </a>
          </div>
        </header>

        {/* Local Settings Configuration Area */}
        <ProfileConfig onSync={handleProfileSync} />

        {/* Dynamic Inspiration Fuel Quote System */}
        <QuoteOrb language={language} />

        {/* Dashboard Panels Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT SIDEBAR: Control Deck & History (Spans 4/12) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Input Configuration Deck */}
            <div className="bg-[#141416]/95 backdrop-blur-md border border-[#232225] rounded-2xl p-6 shadow-xl relative overflow-hidden transition duration-300 hover:border-[#cf7051]/30">
              <div className="flex justify-between items-center mb-3">
                <label className="text-xs font-bold uppercase tracking-widest text-[#cca972] flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#cf7051] animate-pulse" />
                  <span>Control Deck</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      handleLoadSample("idea");
                    }}
                    onMouseEnter={() => soundManager.playHover()}
                    className="text-[10px] bg-[#222224] hover:bg-[#2e2e32] border border-[#2e2c2a] px-3.5 py-1.5 rounded-lg text-[#e8dfd8] transition cursor-pointer"
                  >
                    💡 Sample Topic
                  </button>
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      handleLoadSample("script");
                    }}
                    onMouseEnter={() => soundManager.playHover()}
                    className="text-[10px] bg-[#222224] hover:bg-[#2e2e32] border border-[#2e2c2a] px-3.5 py-1.5 rounded-lg text-[#e8dfd8] transition cursor-pointer"
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
                  onFocus={() => soundManager.playHover()}
                  className="w-full min-h-[160px] bg-[#0c0c0e]/80 border border-[#232225] rounded-xl p-4 text-sm text-[#e8dfd8] placeholder-[#5e5a5c] focus:outline-none focus:border-[#cf7051]/60 focus:ring-1 focus:ring-[#cf7051]/20 font-sans leading-relaxed resize-y transition duration-200"
                  placeholder="Paste your topic, rough idea, bullet points or complete script here. CreatorOS will transform it completely..."
                />
                {text && (
                  <span className="absolute bottom-2.5 right-3 text-[10px] font-mono text-[#9ca69b] uppercase bg-[#141416] px-2 py-0.5 rounded border border-[#232225]">
                    {text.length} characters
                  </span>
                )}
              </div>

              {/* Form Input parameters */}
              <div className="grid grid-cols-2 gap-3.5 mt-5">
                <div>
                  <label className="block text-[10.5px] uppercase font-bold text-[#cca972] mb-1.5">Source Type</label>
                  <select
                    value={contentType}
                    onChange={(e) => {
                      soundManager.playClick();
                      setContentType(e.target.value);
                    }}
                    onMouseEnter={() => soundManager.playHover()}
                    className="w-full bg-[#18181b] text-xs text-[#e8dfd8] rounded-xl p-2.5 border border-[#28282b] focus:border-[#cf7051]/50 focus:outline-none transition cursor-pointer"
                  >
                    <option value="Topic only" className="bg-[#141416]">Topic Only</option>
                    <option value="Rough script" className="bg-[#141416]">Rough Script</option>
                    <option value="Full creator script" className="bg-[#141416]">Full Creator Script</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10.5px] uppercase font-bold text-[#cca972] mb-1.5">Target Niche</label>
                  <select
                    value={niche}
                    onChange={(e) => {
                      soundManager.playClick();
                      setNiche(e.target.value);
                    }}
                    onMouseEnter={() => soundManager.playHover()}
                    className="w-full bg-[#18181b] text-xs text-[#e8dfd8] rounded-xl p-2.5 border border-[#28282b] focus:border-[#cf7051]/50 focus:outline-none transition cursor-pointer"
                  >
                    <option value="AI" className="bg-[#141416]">AI & Agents</option>
                    <option value="Tech" className="bg-[#141416]">Tech & Development</option>
                    <option value="Business" className="bg-[#141416]">Business & Startups</option>
                    <option value="Storytelling" className="bg-[#141416]">Classic Storytelling</option>
                    <option value="Documentary" className="bg-[#141416]">Vox-style Doc</option>
                    <option value="Education" className="bg-[#141416]">Educational</option>
                    <option value="Mixed" className="bg-[#141416]">Mixed Domain</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10.5px] uppercase font-bold text-[#cca972] mb-1.5">Voice Tone</label>
                  <select
                    value={tone}
                    onChange={(e) => {
                      soundManager.playClick();
                      setTone(e.target.value);
                    }}
                    onMouseEnter={() => soundManager.playHover()}
                    className="w-full bg-[#18181b] text-xs text-[#e8dfd8] rounded-xl p-2.5 border border-[#28282b] focus:border-[#cf7051]/50 focus:outline-none transition cursor-pointer"
                  >
                    <option value="Professional" className="bg-[#141416]">Professional</option>
                    <option value="Casual" className="bg-[#141416]">Casual / Direct</option>
                    <option value="Bold" className="bg-[#141416]">Bold / Authoritative</option>
                    <option value="Emotional" className="bg-[#141416]">Emotional Story</option>
                    <option value="Educational" className="bg-[#141416]">Visual Teacher</option>
                    <option value="Story-driven" className="bg-[#141416]">Narrative Hero</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10.5px] uppercase font-bold text-[#cca972] mb-1.5">Platform Style</label>
                  <select
                    value={platform}
                    onChange={(e) => {
                      soundManager.playClick();
                      setPlatform(e.target.value);
                    }}
                    onMouseEnter={() => soundManager.playHover()}
                    className="w-full bg-[#18181b] text-xs text-[#e8dfd8] rounded-xl p-2.5 border border-[#28282b] focus:border-[#cf7051]/50 focus:outline-none transition cursor-pointer"
                  >
                    <option value="Instagram Reels" className="bg-[#141416]">Instagram Reels Only</option>
                    <option value="YouTube Shorts" className="bg-[#141416]">YouTube Shorts Only</option>
                    <option value="Both" className="bg-[#141416]">Vertical Dual-Feed (Both)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10.5px] uppercase font-bold text-[#cca972] mb-1.5">Refactor Goal</label>
                  <select
                    value={goal}
                    onChange={(e) => {
                      soundManager.playClick();
                      setGoal(e.target.value);
                    }}
                    onMouseEnter={() => soundManager.playHover()}
                    className="w-full bg-[#18181b] text-xs text-[#e8dfd8] rounded-xl p-2.5 border border-[#28282b] focus:border-[#cf7051]/50 focus:outline-none transition cursor-pointer"
                  >
                    <option value="Viral" className="bg-[#141416]">Max Virality Potential</option>
                    <option value="Retention" className="bg-[#141416]">High Dynamic Retention</option>
                    <option value="Clarity" className="bg-[#141416]">Simple Explainer Clarity</option>
                    <option value="Authority" className="bg-[#141416]">Elite Industry Authority</option>
                    <option value="Personal brand" className="bg-[#141416]">Personal Connection</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10.5px] uppercase font-bold text-[#cca972] mb-1.5">Output Language</label>
                  <select
                    value={language}
                    onChange={(e) => {
                      soundManager.playClick();
                      setLanguage(e.target.value);
                    }}
                    onMouseEnter={() => soundManager.playHover()}
                    className="w-full bg-[#18181b] text-xs text-[#e8dfd8] rounded-xl p-2.5 border border-[#28282b] focus:border-[#cf7051]/50 focus:outline-none transition cursor-pointer"
                  >
                    <option value="English" className="bg-[#141416]">Pure English</option>
                    <option value="Hinglish" className="bg-[#141416]">Spoken Hinglish (Conversational)</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-2.5">
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  onMouseEnter={() => soundManager.playHover()}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-[#cf7051] to-[#cca972] hover:brightness-110 active:scale-[0.99] text-white font-bold text-xs rounded-xl tracking-wider uppercase transition shadow-lg shadow-[#cf7051]/15 disabled:opacity-50 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#e8dfd8] animate-pulse" />
                  {loading ? "Transforming Creator Package..." : "Compile Creator Package"}
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={handleClearAll}
                    onMouseEnter={() => soundManager.playHover()}
                    className={`flex-1 py-2.5 text-[11px] font-semibold rounded-xl border transition-all duration-200 cursor-pointer ${
                      clearConfirm 
                        ? "bg-[#cf7051]/20 hover:bg-[#cf7051]/30 text-white border-[#cf7051]/60 shadow-lg shadow-[#cf7051]/10 scale-[1.01] animate-pulse" 
                        : "bg-[#202022] hover:bg-[#28282a] text-[#cca972] border-[#2e2a28]"
                    }`}
                  >
                    {clearConfirm ? "⚠️ Confirm Clear?" : "Clear Slate"}
                  </button>
                  {contentPackage && (
                    <button
                      onClick={handleSaveProject}
                      onMouseEnter={() => soundManager.playHover()}
                      className="flex-1 py-2.5 bg-[#cf7051]/10 hover:bg-[#cf7051]/20 text-[#cf7051] border border-[#cf7051]/20 text-[11px] font-semibold rounded-xl transition cursor-pointer animate-pulse"
                    >
                      {dbStatus?.status === "CONNECTED" ? "Save & Cloud Sync" : "Save Local Project"}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Supabase Sync Controller */}
            <div className="bg-[#141416]/95 backdrop-blur-md border border-[#232225] rounded-2xl p-5 shadow-xl space-y-4 transition duration-300 hover:border-[#9ca69b]/30">
              <div className="flex justify-between items-center pb-3 border-b border-[#232225]">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#cca972]" />
                  <h3 className="text-xs font-bold uppercase text-[#e8dfd8] tracking-wider font-display">Supabase Sync</h3>
                </div>
                {dbStatus?.configured && dbStatus?.reachable && dbStatus?.status === "CONNECTED" ? (
                  <div className="flex items-center gap-1.5 bg-[#9ca69b]/15 border border-[#9ca69b]/30 px-2.5 py-1 rounded text-[9.5px] text-[#9ca69b] font-semibold font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9ca69b] animate-pulse"></span>
                    LIVE
                  </div>
                ) : dbStatus?.configured && dbStatus?.reachable && dbStatus?.status === "TABLE_NOT_FOUND" ? (
                  <div className="flex items-center gap-1.5 bg-[#cca972]/15 border border-[#cca972]/30 px-2.5 py-1 rounded text-[9.5px] text-[#cca972] font-semibold font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#cca972] animate-pulse"></span>
                    TABLE ERROR
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 bg-[#202022] border border-[#28282a] px-2.5 py-1 rounded text-[9.5px] text-[#5e5a5c] font-semibold font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5e5a5c]"></span>
                    LOCAL CACHE
                  </div>
                )}
              </div>

              {/* Status explanation */}
              <div className="space-y-2">
                {!dbStatus?.configured ? (
                  <div className="p-3 bg-[#1e1a17] border border-[#cf7051]/20 rounded-xl text-xs space-y-2 text-[#e8dfd8]">
                    <p className="leading-relaxed text-opacity-80">
                      Connect your Supabase project for durable cloud persistence. Your packages will persist securely!
                    </p>
                    <div className="text-[10px] bg-[#0c0c0e] p-2.5 rounded border border-[#232225] font-mono leading-relaxed space-y-1 text-[#9ca69b]">
                      <div>1. Add to Secrets Panel:</div>
                      <div className="text-[#cca972] font-semibold">• SUPABASE_URL</div>
                      <div className="text-[#cca972] font-semibold">• SUPABASE_ANON_KEY</div>
                    </div>
                  </div>
                ) : dbStatus?.status === "CONNECTED" ? (
                  <div className="space-y-2.5 text-xs">
                    <p className="text-[#e8dfd8] text-opacity-80 leading-relaxed">
                      Synced host: <span className="font-mono text-[#cca972] select-all font-semibold break-all text-[10px] bg-[#0c0c0e] p-1.5 rounded-md border border-[#232225]">{dbStatus.url}</span>
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={handleFetchSupabaseProjects}
                        disabled={dbSyncLoading}
                        onMouseEnter={() => soundManager.playHover()}
                        className="w-full py-2.5 bg-[#cf7051]/10 hover:bg-[#cf7051]/20 text-[#cf7051] border border-[#cf7051]/25 hover:border-[#cf7051]/45 rounded-xl font-semibold text-xs transition flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${dbSyncLoading ? "animate-spin text-[#cf7051]" : ""}`} />
                        {dbSyncLoading ? "Synchronizing..." : "Retrieve Live Database"}
                      </button>
                    </div>
                  </div>
                ) : dbStatus?.status === "TABLE_NOT_FOUND" ? (
                  <div className="p-3.5 bg-[#1a120c] border border-[#cca972]/25 rounded-xl text-xs space-y-2.5 text-[#e8dfd8]">
                    <p className="leading-relaxed font-semibold text-[#cca972] flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-[#cca972] flex-shrink-0" />
                      Table 'creatoros_projects' is missing
                    </p>
                    <p className="text-[10px] leading-relaxed text-[#9ca69b]">
                      Your Supabase database connected, but the required table doesn't exist yet inside your project.
                    </p>
                    <button
                      onClick={() => {
                        soundManager.playClick();
                        setShowSqlSetup(!showSqlSetup);
                      }}
                      onMouseEnter={() => soundManager.playHover()}
                      className="w-full py-1.5 bg-[#cca972]/10 hover:bg-[#cca972]/20 text-[#cca972] border border-[#cca972]/20 rounded-lg text-[10px] font-bold transition cursor-pointer"
                    >
                      {showSqlSetup ? "Collapse Setup SQL Instructions" : "Expose Setup SQL Commands"}
                    </button>

                    {showSqlSetup && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[10px] text-[#9ca69b] pb-1">
                          <span>SQL editor statement:</span>
                          <button
                            onClick={() => handleCopyToClipboard(dbStatus.setupSql || "", "setup-sql")}
                            onMouseEnter={() => soundManager.playHover()}
                            className="bg-[#202022] text-[10px] hover:bg-[#28282a] border border-[#2e2c2a] px-2 py-0.5 rounded text-[#cca972] font-semibold transition cursor-pointer"
                          >
                            {copiedKey === "setup-sql" ? "Copied!" : "Copy Code"}
                          </button>
                        </div>
                        <pre className="text-[9px] select-all leading-normal whitespace-pre font-mono p-2 bg-[#0c0c0e] border border-[#232225] rounded text-[#e8dfd8] text-opacity-70 max-h-[140px] overflow-y-auto">
                          {dbStatus.setupSql}
                        </pre>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-3 bg-red-950/20 border border-red-500/25 rounded-xl text-xs text-red-300 space-y-1">
                    <p className="font-semibold flex items-center gap-1"><CloudOff className="w-3.5 h-3.5" /> Handshake failed</p>
                    <p className="text-[10px] text-slate-400 leading-relaxed">Error details: {dbStatus?.status || "Ping response timed out."}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Local History Sidebar Deck */}
            <div className="bg-[#141416]/95 backdrop-blur-md border border-[#232225] rounded-2xl p-5 shadow-xl transition duration-300 hover:border-[#cca972]/30">
              <div className="flex justify-between items-center pb-3 border-b border-[#232225] mb-4">
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-[#cca972]" />
                  <h3 className="text-xs font-bold uppercase text-[#e8dfd8] tracking-wider mb-0">Project Backups</h3>
                </div>
                <span className="text-[10px] bg-[#cca972]/15 border border-[#cca972]/30 font-mono font-bold px-2.5 py-0.5 rounded-full text-[#cca972]">
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
                className="space-y-6 focus:outline-none font-sans"
              >
                
                {/* Save Project Name / Metadata control */}
                <div className="p-4 bg-[#141416]/95 backdrop-blur-md border border-[#232225] rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex-1 w-full">
                    <label className="block text-[9px] uppercase tracking-widest font-extrabold text-[#cca972] mb-1">
                      Refactoring Project Identity
                    </label>
                    <input
                      type="text"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="Name your transformed asset package..."
                      className="w-full bg-[#0c0c0e]/80 border border-[#232225] rounded-xl py-2 px-3 text-sm font-semibold text-[#e8dfd8] focus:outline-none focus:border-[#cf7051]/60"
                    />
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 pt-3 sm:pt-0">
                    <button
                      onClick={handleSaveProject}
                      onMouseEnter={() => soundManager.playHover()}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#cf7051] hover:bg-[#c06041] hover:brightness-110 active:scale-[0.98] text-white shadow-lg transition cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      Save
                    </button>
                    <button
                      onClick={handleExportTxt}
                      onMouseEnter={() => soundManager.playHover()}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-[#202022] hover:bg-[#2c2c2f] border border-[#2e2c2a] text-[#cca972] hover:text-white transition cursor-pointer"
                      title="Export compiled text asset"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      TXT
                    </button>
                    <button
                      onClick={handleExportJson}
                      onMouseEnter={() => soundManager.playHover()}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-[#202022] hover:bg-[#2c2c2f] border border-[#2e2c2a] text-[#cca972] hover:text-white transition cursor-pointer"
                      title="Export JSON struct"
                    >
                      <FileJson className="w-3.5 h-3.5" />
                      JSON
                    </button>
                  </div>
                </div>

                {/* Score Widget Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
                  <div className="bg-[#141416]/95 border border-[#232225] hover:border-[#cf7051]/30 rounded-xl p-3.5 flex flex-col justify-between transition duration-200">
                    <span className="text-[10px] text-[#9ca69b] font-bold uppercase tracking-wider">Hook Strength</span>
                    <span className="text-2xl font-black text-[#cf7051] mt-2 font-mono">{contentPackage.viralScore.hookStrength}%</span>
                  </div>
                  <div className="bg-[#141416]/95 border border-[#232225] hover:border-[#cca972]/30 rounded-xl p-3.5 flex flex-col justify-between transition duration-200">
                    <span className="text-[10px] text-[#9ca69b] font-bold uppercase tracking-wider">Curiosity</span>
                    <span className="text-2xl font-black text-[#cca972] mt-2 font-mono">{contentPackage.viralScore.curiosity}%</span>
                  </div>
                  <div className="bg-[#141416]/95 border border-[#232225] hover:border-[#9ca69b]/30 rounded-xl p-3.5 flex flex-col justify-between transition duration-200">
                    <span className="text-[10px] text-[#9ca69b] font-bold uppercase tracking-wider">Retention</span>
                    <span className="text-2xl font-black text-[#9ca69b] mt-2 font-mono">{contentPackage.viralScore.retention}%</span>
                  </div>
                  <div className="bg-[#141416]/95 border border-[#232225] hover:border-[#cca972]/30 rounded-xl p-3.5 flex flex-col justify-between transition duration-200">
                    <span className="text-[10px] text-[#9ca69b] font-bold uppercase tracking-wider">Clarity</span>
                    <span className="text-2xl font-black text-[#cca972] mt-2 font-mono">{contentPackage.viralScore.clarity}%</span>
                  </div>
                  <div className="col-span-2 sm:col-span-1 bg-[#141416]/95 border border-gradient-to-tr border-[#cf7051]/20 hover:border-[#cf7051]/40 rounded-xl p-3.5 flex flex-col justify-between transition duration-200">
                    <span className="text-[10px] text-[#9ca69b] font-bold uppercase tracking-wider">Overall SCORE</span>
                    <span className="text-2xl font-black text-[#cf7051] mt-2 font-mono">{contentPackage.viralScore.overallScore}%</span>
                  </div>
                </div>

                {/* Main Tab Controller navigation */}
                <div className="flex flex-wrap gap-2 border-b border-[#232225] pb-2.5">
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setActiveTab("scripts");
                    }}
                    onMouseEnter={() => soundManager.playHover()}
                    className={`px-4 py-2.5 text-xs font-semibold rounded-xl transition cursor-pointer ${
                      activeTab === "scripts" 
                        ? "bg-[#cf7051]/10 text-[#cf7051] border border-[#cf7051]/30 font-bold" 
                        : "text-[#e8dfd8]/60 hover:text-white hover:bg-[#141416]"
                    }`}
                  >
                    📝 Refactored Scripts
                  </button>
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setActiveTab("hooks-ctas");
                    }}
                    onMouseEnter={() => soundManager.playHover()}
                    className={`px-4 py-2.5 text-xs font-semibold rounded-xl transition cursor-pointer ${
                      activeTab === "hooks-ctas" 
                        ? "bg-[#cf7051]/10 text-[#cf7051] border border-[#cf7051]/30 font-bold" 
                        : "text-[#e8dfd8]/60 hover:text-white hover:bg-[#141416]"
                    }`}
                  >
                    🪝 Scroll Hooks & CTAs
                  </button>
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setActiveTab("captions");
                    }}
                    onMouseEnter={() => soundManager.playHover()}
                    className={`px-4 py-2.5 text-xs font-semibold rounded-xl transition cursor-pointer ${
                      activeTab === "captions" 
                        ? "bg-[#cf7051]/10 text-[#cf7051] border border-[#cf7051]/30 font-bold" 
                        : "text-[#e8dfd8]/60 hover:text-white hover:bg-[#141416]"
                    }`}
                  >
                    📱 Thumbnail & Captions
                  </button>
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setActiveTab("analysis");
                    }}
                    onMouseEnter={() => soundManager.playHover()}
                    className={`px-4 py-2.5 text-xs font-semibold rounded-xl transition cursor-pointer ${
                      activeTab === "analysis" 
                        ? "bg-[#cf7051]/10 text-[#cf7051] border border-[#cf7051]/30 font-bold" 
                        : "text-[#e8dfd8]/60 hover:text-white hover:bg-[#141416]"
                    }`}
                  >
                    📊 Retention & Style Notes
                  </button>
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setActiveTab("versions");
                    }}
                    onMouseEnter={() => soundManager.playHover()}
                    className={`px-4 py-2.5 text-xs font-semibold rounded-xl transition cursor-pointer ${
                      activeTab === "versions" 
                        ? "bg-[#cf7051]/10 text-[#cf7051] border border-[#cf7051]/30 font-bold" 
                        : "text-[#e8dfd8]/60 hover:text-white hover:bg-[#141416]"
                    }`}
                  >
                    🔄 The 4 Variant Models
                  </button>
                </div>

                {/* Dynamic Modules Rendering based on Active Tab */}
                <div className="relative min-h-[400px]">
                  <AnimatePresence mode="wait">
                    {activeTab === "scripts" && (
                      <motion.div
                        key="scripts"
                        initial={{ opacity: 0, y: 12, scale: 0.995 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -12, scale: 0.995 }}
                        transition={{ duration: animationsEnabled ? 0.2 : 0, ease: "easeOut" }}
                        className="space-y-6"
                      >
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
                    </motion.div>
                  )}

                  {/* TAB 2: HOOK DECK & CTA BUILDER */}
                  {activeTab === "hooks-ctas" && (
                    <motion.div
                      key="hooks-ctas"
                      initial={{ opacity: 0, y: 12, scale: 0.995 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -12, scale: 0.995 }}
                      transition={{ duration: animationsEnabled ? 0.2 : 0, ease: "easeOut" }}
                      className="space-y-6"
                    >
                      
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
                    </motion.div>
                  )}

                  {/* TAB 3: CAPTIONS, THUMBNAILS & TAGS */}
                  {activeTab === "captions" && (
                    <motion.div
                      key="captions"
                      initial={{ opacity: 0, y: 12, scale: 0.995 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -12, scale: 0.995 }}
                      transition={{ duration: animationsEnabled ? 0.2 : 0, ease: "easeOut" }}
                      className="space-y-6"
                    >
                      
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
                    </motion.div>
                  )}

                  {/* TAB 4: RETENTION ANALYSIS & STYLE CARDS */}
                  {activeTab === "analysis" && (
                    <motion.div
                      key="analysis"
                      initial={{ opacity: 0, y: 12, scale: 0.995 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -12, scale: 0.995 }}
                      transition={{ duration: animationsEnabled ? 0.2 : 0, ease: "easeOut" }}
                      className="space-y-6"
                    >
                      
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
                    </motion.div>
                  )}

                  {/* TAB 5: MULTIPLE SELF-CONTAINED PRODUCTION VERSIONS */}
                  {activeTab === "versions" && (
                    <motion.div
                      key="versions"
                      initial={{ opacity: 0, y: 12, scale: 0.995 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -12, scale: 0.995 }}
                      transition={{ duration: animationsEnabled ? 0.2 : 0, ease: "easeOut" }}
                      className="space-y-6"
                    >
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
                    </motion.div>
                  )}
                  </AnimatePresence>
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
                <div className="bg-gradient-to-r from-[#141416]/95 to-[#232225]/40 border border-[#cf7051]/30 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-center gap-4 shadow-2xl">
                  <div>
                    <h4 className="text-xs font-black uppercase text-[#e8dfd8] tracking-widest">Execute Executive Bulk Copy</h4>
                    <p className="text-[11px] text-[#cca972]/85 mt-0.5">Copy all rewrites, hooks, CTAs, and captions cleanly formatted with a single command.</p>
                  </div>
                  <div className="flex gap-3 w-full md:w-auto">
                    <button
                      onClick={() => handleCopyToClipboard(getCompiledTextKit(), "bulk-kit")}
                      onMouseEnter={() => soundManager.playHover()}
                      className={`flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                        copiedKey === "bulk-kit" ? "bg-emerald-600 text-white" : "bg-[#cf7051] hover:bg-[#c06041] hover:scale-[1.02] text-white shadow-lg"
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
      <footer className="mt-12 pt-6 border-t border-[#232225] flex flex-col sm:flex-row justify-between items-center gap-3 text-[10px] text-[#9ca69b] uppercase tracking-widest max-w-7xl mx-auto w-full font-mono">
        <div className="flex flex-wrap justify-center gap-4">
          <span>Storage Engine: <span className="text-[#cca972] font-semibold">{dbStatus?.status === "CONNECTED" ? "Supabase Live DB & Local Storage" : "Browser localStorage API"}</span></span>
          <span className="hidden sm:inline text-white/10">•</span>
          <span>Security Model: <span className="text-[#cca972] font-semibold">Server-Side Proxy Vault</span></span>
        </div>
        <div>
          <span className="text-white/40">Crafted in Cloud Container Workspace for akshatusing02@gmail.com</span>
        </div>
      </footer>

      {/* Global Success Banner alerts */}
      <AnimatePresence>
        {copiedKey && !copiedKey.startsWith("script") && !copiedKey.startsWith("hook") && !copiedKey.startsWith("cta") && !copiedKey.startsWith("caption") && !copiedKey.startsWith("v-") && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 bg-slate-900 border border-green-500/30 text-white text-xs font-semibold py-3 px-4 rounded-xl shadow-2xl flex items-center gap-2.5 z-50"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
            <span>
              {copiedKey === "project-saved-supabase" && "Project Saved & Synchronized to Supabase!"}
              {copiedKey === "project-saved-local-only" && "Saved Locally (Warning: Supabase sync failed)"}
              {copiedKey === "project-saved" && "Transform Package Saved to Local Storage!"}
              {copiedKey === "deleted-supabase" && "Project Deleted & Cleaned from Supabase!"}
              {copiedKey === "deleted" && "Project Deleted Successfully!"}
              {copiedKey === "db-synced" && "Database Synced: Reloaded Live Records!"}
              {copiedKey === "setup-sql" && "SQL Creation Schema Copied! Paste in Supabase SQL Editor."}
              {copiedKey === "bulk-kit" && "Entire Content Package Copied to Clipboard!"}
              {!["project-saved-supabase", "project-saved", "deleted-supabase", "deleted", "db-synced", "setup-sql", "bulk-kit", "project-saved-local-only"].includes(copiedKey) && `Refactoring Completed: [${copiedKey}]`}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
