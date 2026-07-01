import React, { useState } from "react";
import { Sparkles, ArrowRight, ArrowLeft, Loader2, Copy, Check, RefreshCw, Send, HelpCircle, Flame, CheckCircle, FileText } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ContentPackage } from "../types";

interface ScriptLabProps {
  onSaveProject?: (name: string, text: string, data: ContentPackage) => void;
}

export default function ScriptLab({ onSaveProject }: ScriptLabProps) {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [ideaText, setIdeaText] = useState<string>("");
  const [niche, setNiche] = useState<string>("tech");
  const [tone, setTone] = useState<string>("smart_friend");
  const [platform, setPlatform] = useState<string>("instagram");
  const [language, setLanguage] = useState<string>("hinglish");

  // Output content state
  const [contentPackage, setContentPackage] = useState<ContentPackage | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Selected choices during wizard
  const [selectedHookType, setSelectedHookType] = useState<string>("curiosity");
  const [selectedCtaType, setSelectedCtaType] = useState<string>("comment");
  const [selectedScriptVersion, setSelectedScriptVersion] = useState<string>("viral");

  const handleCopyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleGenerate = async () => {
    if (!ideaText.trim()) {
      setError("Bhai, raw content/idea likhna zaroori hai!");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/transform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: ideaText,
          contentType: "rough_concept",
          language,
          niche,
          tone,
          platform,
          rewriteStrength: "high",
          goal: "retention",
          style: "dynamic"
        })
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        throw new Error(resData.error || "Failed to generate script package");
      }

      setContentPackage(resData.data);
      // Auto transition to step 2 after generation
      setStep(2);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong. Please verify your Gemini API key in Settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setContentPackage(null);
    setIdeaText("");
  };

  const handleSave = () => {
    if (!contentPackage) return;
    const title = ideaText.split("\n")[0].substring(0, 30) || "Atelier Script Project";
    onSaveProject?.(title, ideaText, contentPackage);
    handleCopyToClipboard("Project saved", "project-saved");
  };

  // Helper to extract hook suggestions
  const getHooksToDisplay = () => {
    if (!contentPackage) return [];
    return [
      { type: "curiosity", label: "Curiosity Trigger", text: contentPackage.hooks.curiosity?.[0] || "Wait, do you know this secret?" },
      { type: "shock", label: "Contrarian/Shock statement", text: contentPackage.hooks.shock?.[0] || "This is completely wrong!" },
      { type: "story", label: "Storytelling Starter", text: contentPackage.hooks.story?.[0] || "Suno ek dilchasp kahani..." }
    ].filter(h => h.text);
  };

  // Helper to extract scripts based on selection
  const getScriptToDisplay = () => {
    if (!contentPackage) return "";
    switch (selectedScriptVersion) {
      case "storytelling":
        return contentPackage.scripts.storytelling;
      case "viral":
        return contentPackage.scripts.viral;
      case "concise":
        return contentPackage.scripts.short;
      default:
        return contentPackage.scripts.improved;
    }
  };

  // Helper to extract CTAs
  const getCtasToDisplay = () => {
    if (!contentPackage) return [];
    return [
      { type: "comment", label: "Comment Magnet", text: contentPackage.ctas.comment?.[0] || "Comment below!" },
      { type: "dm", label: "DM Auto-Response", text: contentPackage.ctas.dm?.[0] || "DM me 'GROWTH'!" },
      { type: "save", label: "Save-worthy Value", text: contentPackage.ctas.save?.[0] || "Save this reel!" }
    ].filter(c => c.text);
  };

  return (
    <div className="space-y-6" id="script-lab-root">
      {/* Informational UX Ribbon */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-5 shadow-sm">
        <div className="flex gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-700 h-10 w-10 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Script Lab • Atelier Mode</h2>
            <p className="text-xs text-slate-600 mt-1">
              <strong>What is this?</strong> A progressive scriptwriting editor. It splits the script building into structured phases.<br />
              <strong>Why care?</strong> Randomly generated AI scripts look robotic. Selecting hooks first keeps the flow conversational and engaging.<br />
              <strong>What to do next?</strong> Enter your content idea below to initiate the step-by-step process. Only one step is visible at a time.
            </p>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between max-w-xl mx-auto">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                step === s ? "bg-[#cf7051] text-white shadow-md shadow-[#cf7051]/30" : step > s ? "bg-emerald-100 text-emerald-800 border border-emerald-200" : "bg-slate-100 text-slate-400 border border-slate-200"
              }`}>
                {step > s ? <CheckCircle className="w-4 h-4" /> : s}
              </div>
              <span className={`text-[10px] uppercase font-bold tracking-wider hidden sm:inline ${step === s ? "text-slate-900" : "text-slate-400"}`}>
                {s === 1 && "Idea"}
                {s === 2 && "Hook"}
                {s === 3 && "Script"}
                {s === 4 && "CTA"}
                {s === 5 && "Publish"}
              </span>
              {s < 5 && <div className="w-6 md:w-12 h-[2px] bg-slate-200 hidden sm:block" />}
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1: IDEA INPUT */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm max-w-2xl mx-auto relative overflow-hidden"
          >
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Step 1: Write Your Creative Concept</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Your Rough Idea / Raw Script (Hinglish/English)</label>
                <textarea
                  value={ideaText}
                  onChange={(e) => setIdeaText(e.target.value)}
                  placeholder="e.g., 3 high paying skills for college students in 2026. Explain coding, UI design, and copywriting."
                  className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:ring-2 focus:ring-[#cf7051] focus:border-transparent transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Niche Focus</label>
                  <select
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="tech">Tech & Coding</option>
                    <option value="finance">Personal Finance</option>
                    <option value="students">Student & Education</option>
                    <option value="startups">Business & Startups</option>
                    <option value="memes">Meme & Entertainment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Key Tone</label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="smart_friend">Sachi Baat (Smart Friend)</option>
                    <option value="founder">Elite Founder (Authority)</option>
                    <option value="mentor">Elder Brother (Guidance)</option>
                    <option value="bold">Contrarian (Bold/Direct)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Target Platform</label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="instagram">Instagram Reels</option>
                    <option value="youtube">YouTube Shorts</option>
                    <option value="linkedin">LinkedIn Video</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Language Blend</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="hinglish">Conversational Hinglish</option>
                    <option value="english">Premium English Only</option>
                    <option value="hindi">Pure Hindi (Urdu/Devanagari style)</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs">
                  {error}
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-[#cf7051] hover:bg-[#c06041] disabled:bg-slate-400 text-white font-bold py-3 px-6 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-md cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing & Doctoring with Gemini...</span>
                  </>
                ) : (
                  <>
                    <span>Submit & Craft Hook</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: HOOK SELECTOR */}
        {step === 2 && contentPackage && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm max-w-2xl mx-auto"
          >
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Step 2: Choose Your Scroll-Stopper Hook</h3>
              <span className="text-xs bg-amber-500/10 text-amber-700 px-2 py-0.5 rounded-lg font-mono">3 FRAMING FORMULAS</span>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Select the opening line that matches your hook psychology. This dictates how we secure retention in the first 3 seconds:
            </p>

            <div className="space-y-4 mb-6">
              {getHooksToDisplay().map((hook) => (
                <label
                  key={hook.type}
                  onClick={() => setSelectedHookType(hook.type)}
                  className={`block p-4 rounded-xl border transition cursor-pointer relative ${
                    selectedHookType === hook.type
                      ? "border-[#cf7051] bg-[#cf7051]/5 text-slate-900"
                      : "border-slate-200 hover:border-slate-300 bg-slate-50"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] uppercase font-mono font-bold text-indigo-600">
                      {hook.label}
                    </span>
                    <input
                      type="radio"
                      name="hookRadio"
                      checked={selectedHookType === hook.type}
                      onChange={() => {}}
                      className="text-[#cf7051] focus:ring-[#cf7051]"
                    />
                  </div>
                  <p className="text-xs font-bold text-slate-800 mt-2 leading-relaxed">
                    &ldquo;{hook.text}&rdquo;
                  </p>
                </label>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Go Back</span>
              </button>

              <button
                onClick={() => setStep(3)}
                className="bg-[#cf7051] hover:bg-[#c06041] text-white font-bold py-2.5 px-6 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Continue to Script</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: SCRIPT DRAFTING */}
        {step === 3 && contentPackage && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm max-w-3xl mx-auto"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Step 3: Refine Your Custom Delivery Script</h3>
                <p className="text-[11px] text-slate-400">Complete with visual cues [B-roll] and pacing notes.</p>
              </div>
              
              {/* Variant Selector */}
              <div className="flex gap-1.5 bg-slate-100 p-1 rounded-lg">
                {(["viral", "storytelling", "concise"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setSelectedScriptVersion(v)}
                    className={`px-3 py-1 rounded-md text-[10px] uppercase font-bold transition cursor-pointer ${
                      selectedScriptVersion === v ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated Live Prompter Box */}
            <div className="relative mb-6">
              <span className="absolute top-3 left-3 text-[9px] font-mono bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                PROMPTER READY
              </span>
              <button
                onClick={() => handleCopyToClipboard(getScriptToDisplay(), "script-copy")}
                className="absolute top-2.5 right-3 text-slate-400 hover:text-slate-700 z-10"
              >
                {copiedKey === "script-copy" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>

              <textarea
                value={getScriptToDisplay()}
                onChange={(e) => {
                  // Allow local overrides of the script during final steps
                  const updated = { ...contentPackage };
                  if (selectedScriptVersion === "storytelling") updated.scripts.storytelling = e.target.value;
                  else if (selectedScriptVersion === "concise") updated.scripts.short = e.target.value;
                  else updated.scripts.viral = e.target.value;
                  setContentPackage(updated);
                }}
                className="w-full h-80 p-5 pt-10 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 text-xs font-mono leading-relaxed leading-7 whitespace-pre-line focus:ring-1 focus:ring-[#cf7051]"
              />
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Go Back</span>
              </button>

              <button
                onClick={() => setStep(4)}
                className="bg-[#cf7051] hover:bg-[#c06041] text-white font-bold py-2.5 px-6 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Choose CTA</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 4: CTA PICKER */}
        {step === 4 && contentPackage && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm max-w-2xl mx-auto"
          >
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Step 4: Pick Your Conversion Magnet (CTA)</h3>
              <span className="text-xs bg-emerald-500/10 text-emerald-700 px-2 py-0.5 rounded-lg font-mono">ALGO RETENTION DRIVERS</span>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Select the final call to action to drop at the end of your clip. It focuses on boosting engagement and direct actions:
            </p>

            <div className="space-y-4 mb-6">
              {getCtasToDisplay().map((cta) => (
                <label
                  key={cta.type}
                  onClick={() => setSelectedCtaType(cta.type)}
                  className={`block p-4 rounded-xl border transition cursor-pointer relative ${
                    selectedCtaType === cta.type
                      ? "border-[#cf7051] bg-[#cf7051]/5 text-slate-900"
                      : "border-slate-200 hover:border-slate-300 bg-slate-50"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] uppercase font-mono font-bold text-emerald-600">
                      {cta.label}
                    </span>
                    <input
                      type="radio"
                      name="ctaRadio"
                      checked={selectedCtaType === cta.type}
                      onChange={() => {}}
                      className="text-[#cf7051] focus:ring-[#cf7051]"
                    />
                  </div>
                  <p className="text-xs font-bold text-slate-800 mt-2 leading-relaxed">
                    &ldquo;{cta.text}&rdquo;
                  </p>
                </label>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={() => setStep(3)}
                className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Go Back</span>
              </button>

              <button
                onClick={() => setStep(5)}
                className="bg-[#cf7051] hover:bg-[#c06041] text-white font-bold py-2.5 px-6 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Finalize & Publish</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 5: CAPTION & PUBLISH */}
        {step === 5 && contentPackage && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm max-w-3xl mx-auto space-y-6"
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Step 5: Perfect Final Asset Package</h3>
                <p className="text-[11px] text-slate-400">Everything formatted and ready to deploy.</p>
              </div>
              <button
                onClick={handleReset}
                className="text-[10px] text-slate-500 hover:text-slate-900 flex items-center gap-1 border border-slate-200 px-3 py-1.5 rounded-lg font-bold"
              >
                <RefreshCw className="w-3 h-3" />
                <span>New Project</span>
              </button>
            </div>

            {/* Thumbnail Idea */}
            <div className="bg-gradient-to-tr from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-4.5">
              <h4 className="text-xs font-black uppercase text-amber-800 tracking-wider mb-2">📸 Optimized Thumbnail Overlays</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-white border border-amber-100 rounded-lg p-3 text-center">
                  <span className="block text-[9px] text-slate-400 font-mono">PUNCHY</span>
                  <p className="text-xs font-bold text-slate-800 mt-1">
                    &ldquo;{contentPackage.thumbnailText.punchy?.[0] || "Don't Skip!"}&rdquo;
                  </p>
                </div>
                <div className="bg-white border border-amber-100 rounded-lg p-3 text-center">
                  <span className="block text-[9px] text-slate-400 font-mono">CURIOSITY</span>
                  <p className="text-xs font-bold text-slate-800 mt-1">
                    &ldquo;{contentPackage.thumbnailText.curiosityBased?.[0] || "This Changed Everything"}&rdquo;
                  </p>
                </div>
                <div className="bg-white border border-amber-100 rounded-lg p-3 text-center">
                  <span className="block text-[9px] text-slate-400 font-mono">SHORT</span>
                  <p className="text-xs font-bold text-slate-800 mt-1">
                    &ldquo;{contentPackage.thumbnailText.short?.[0] || "Do this now!"}&rdquo;
                  </p>
                </div>
              </div>
            </div>

            {/* Caption format */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 relative">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider">✍️ High-SEO Feed Caption</h4>
                <button
                  onClick={() => handleCopyToClipboard(contentPackage.captions.viralFormat, "caption-copy")}
                  className="text-slate-400 hover:text-slate-700"
                >
                  {copiedKey === "caption-copy" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-white border border-slate-100 p-3 rounded-lg font-sans">
                {contentPackage.captions.viralFormat}
              </p>
            </div>

            {/* Metadata (Hashtags + Keywords) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-200 p-4.5 rounded-2xl">
                <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider mb-2">🏷️ Curated Reels Hashtags</h4>
                <p className="text-xs font-mono text-indigo-700 tracking-wide leading-relaxed">
                  {contentPackage.hashtags.niche.concat(contentPackage.hashtags.topicSpecific).join(" ")}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4.5 rounded-2xl">
                <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider mb-2">🔍 Search SEO Keywords</h4>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {contentPackage.keywords.primary.concat(contentPackage.keywords.longTail).slice(0, 8).map((word, index) => (
                    <span key={index} className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-mono">
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA action bar */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3 justify-end">
              <button
                onClick={handleSave}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Save to Workspace Database</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
