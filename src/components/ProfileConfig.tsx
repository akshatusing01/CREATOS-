import React, { useState, useEffect } from "react";
import { ProfileMemory } from "../types";
import { Save, Check, RefreshCw, Sparkles, BookOpen, UserCheck } from "lucide-react";
import { motion } from "motion/react";
import { soundManager } from "../utils/sound";

interface ProfileConfigProps {
  onSync: (profile: ProfileMemory) => void;
}

const DEFAULT_PROFILE: ProfileMemory = {
  language: "Hinglish",
  niche: "Tech / coding / dev",
  tone: "Smart friend",
  style: "Storytelling",
  hookStyle: "Mistake hook (e.g. 'Bhai, ye mistake mat karo')",
  ctaStyle: "Comment trigger keyword (e.g. Comment 'CODE' to get direct link)",
  rewriteStrength: "Medium rewrite",
};

export default function ProfileConfig({ onSync }: ProfileConfigProps) {
  const [profile, setProfile] = useState<ProfileMemory>(DEFAULT_PROFILE);
  const [saved, setSaved] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem("creatoros_profile");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setProfile(parsed);
        onSync(parsed);
      } catch (e) {
        console.error("Failed to parse saved profile data", e);
      }
    } else {
      // populate defaults
      localStorage.setItem("creatoros_profile", JSON.stringify(DEFAULT_PROFILE));
      onSync(DEFAULT_PROFILE);
    }
  }, []);

  const handleChange = (field: keyof ProfileMemory, value: string) => {
    const updated = { ...profile, [field]: value };
    setProfile(updated);
    setSaved(false);
  };

  const handleSave = () => {
    soundManager.playSuccess();
    localStorage.setItem("creatoros_profile", JSON.stringify(profile));
    setSaved(true);
    onSync(profile);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (!resetConfirm) {
      soundManager.playClick();
      setResetConfirm(true);
      setTimeout(() => setResetConfirm(false), 4000);
    } else {
      soundManager.playSuccess();
      setProfile(DEFAULT_PROFILE);
      localStorage.setItem("creatoros_profile", JSON.stringify(DEFAULT_PROFILE));
      onSync(DEFAULT_PROFILE);
      setSaved(true);
      setResetConfirm(false);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="bg-[#141416]/95 backdrop-blur-md rounded-2xl border border-[#232225] p-6 shadow-2xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#232225] pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#cca972]" />
            <h3 className="text-base font-semibold text-[#e8dfd8]">Profile Settings (localStorage)</h3>
          </div>
          <p className="text-[11px] text-[#9ca69b] mt-0.5">
            Define your unique brand metadata to permanently seed every single AI generation.
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleReset}
            onMouseEnter={() => soundManager.playHover()}
            className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
              resetConfirm
                ? "bg-[#cf7051]/20 border-[#cf7051]/55 text-[#cf7051] animate-pulse"
                : "bg-[#202022] hover:bg-[#2c2c2f] text-[#cca972] border-[#2e2c2a]"
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${resetConfirm ? "animate-spin" : ""}`} />
            {resetConfirm ? "Confirm Reset Defaults?" : "Reset"}
          </button>
          <button
            onClick={handleSave}
            onMouseEnter={() => soundManager.playHover()}
            className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              saved
                ? "bg-emerald-600 text-white"
                : "bg-[#cf7051] hover:bg-[#c06041] hover:brightness-110 text-white shadow-lg shadow-[#cf7051]/10"
            }`}
          >
            {saved ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Saved Local!
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                Save Profile
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Preference Selector Cards */}
        <div>
          <label className="block text-xs font-semibold text-[#9ca69b] mb-1.5">Language</label>
          <select
            value={profile.language}
            onChange={(e) => {
              soundManager.playClick();
              handleChange("language", e.target.value);
            }}
            className="w-full bg-[#0c0c0e]/80 hover:bg-[#0c0c0e]/95 text-[#e8dfd8] text-xs rounded-xl py-2 px-3 border border-[#232225] focus:border-[#cf7051]/60 focus:outline-none transition cursor-pointer"
          >
            <option value="Hinglish">Hinglish</option>
            <option value="Hindi">Hindi</option>
            <option value="English">English</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#9ca69b] mb-1.5">Niched Focus</label>
          <select
            value={profile.niche}
            onChange={(e) => {
              soundManager.playClick();
              handleChange("niche", e.target.value);
            }}
            className="w-full bg-[#0c0c0e]/80 hover:bg-[#0c0c0e]/95 text-[#e8dfd8] text-xs rounded-xl py-2 px-3 border border-[#232225] focus:border-[#cf7051]/60 focus:outline-none transition cursor-pointer"
          >
            <option value="AI tools for Indian students">AI tools for Indian students</option>
            <option value="Tech / coding / dev">Tech / coding / dev</option>
            <option value="JEE / NEET / UPSC / SSC">JEE / NEET / UPSC / SSC</option>
            <option value="College / student life">College / student life</option>
            <option value="Finance / money / investing">Finance / money / investing</option>
            <option value="Startup / entrepreneurship">Startup / entrepreneurship</option>
            <option value="Freelancing / remote work">Freelancing / remote work</option>
            <option value="Personal branding">Personal branding</option>
            <option value="Edtech / education">Edtech / education</option>
            <option value="Fitness / self-improvement">Fitness / self-improvement</option>
            <option value="Meme / entertainment">Meme / entertainment</option>
            <option value="Mixed / General">Mixed / General</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#9ca69b] mb-1.5">Default Tone</label>
          <select
            value={profile.tone}
            onChange={(e) => {
              soundManager.playClick();
              handleChange("tone", e.target.value);
            }}
            className="w-full bg-[#0c0c0e]/80 hover:bg-[#0c0c0e]/95 text-[#e8dfd8] text-xs rounded-xl py-2 px-3 border border-[#232225] focus:border-[#cf7051]/60 focus:outline-none transition cursor-pointer"
          >
            <option value="Friendly teacher">Friendly teacher</option>
            <option value="Smart friend">Smart friend</option>
            <option value="Expert advisor">Expert advisor</option>
            <option value="Founder voice">Founder voice</option>
            <option value="Student mentor">Student mentor</option>
            <option value="Straightforward Indian creator">Straightforward Indian creator</option>
            <option value="Proof-based educator">Proof-based educator</option>
            <option value="Storytelling creator">Storytelling creator</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#9ca69b] mb-1.5">Rewrite Strength</label>
          <select
            value={profile.rewriteStrength}
            onChange={(e) => {
              soundManager.playClick();
              handleChange("rewriteStrength", e.target.value);
            }}
            className="w-full bg-[#0c0c0e]/80 hover:bg-[#0c0c0e]/95 text-[#e8dfd8] text-xs rounded-xl py-2 px-3 border border-[#232225] focus:border-[#cf7051]/60 focus:outline-none transition cursor-pointer"
          >
            <option value="Light rewrite">Light tweak (Preserve original structure)</option>
            <option value="Medium rewrite">Balanced rewrite (Optimized split)</option>
            <option value="Full rewrite">Full Refactor (Hyper-creative build)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#9ca69b] mb-1.5">Preferred Production Style</label>
          <select
            value={profile.style}
            onChange={(e) => {
              soundManager.playClick();
              handleChange("style", e.target.value);
            }}
            className="w-full bg-[#0c0c0e]/80 hover:bg-[#0c0c0e]/95 text-[#e8dfd8] text-xs rounded-xl py-2 px-3 border border-[#232225] focus:border-[#cf7051]/60 focus:outline-none transition cursor-pointer"
          >
            <option value="Hinglish Reel Format">Hinglish Reel Format</option>
            <option value="Storytelling">Classic Story Arc</option>
            <option value="Documentary">Vox-style Mini-doc</option>
            <option value="AI / Tech">High-Tempo Technical Review</option>
            <option value="Business">Entrepreneur Case Studies</option>
            <option value="Educational">Visual Explanation Deck</option>
            <option value="Mixed">Mixed Layout</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#9ca69b] mb-1.5">Hook Strategy Preference</label>
          <input
            type="text"
            value={profile.hookStyle}
            onChange={(e) => handleChange("hookStyle", e.target.value)}
            placeholder="e.g. Negative outcome or contrarian statement"
            className="w-full bg-[#0c0c0e]/80 text-[#e8dfd8] text-xs rounded-xl py-2 px-3 border border-[#232225] focus:border-[#cf7051]/60 focus:outline-none transition"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-[#9ca69b] mb-1.5">CTA Conversion Preference</label>
          <input
            type="text"
            value={profile.ctaStyle}
            onChange={(e) => handleChange("ctaStyle", e.target.value)}
            placeholder="e.g. Comment 'GROW' to trigger automated ManyChat DM link"
            className="w-full bg-[#0c0c0e]/80 text-[#e8dfd8] text-xs rounded-xl py-2 px-3 border border-[#232225] focus:border-[#cf7051]/60 focus:outline-none transition"
          />
        </div>
      </div>
      
      {/* Help box */}
      <div className="mt-4 flex items-center gap-2 p-3 bg-[#cf7051]/10 rounded-xl border border-[#cf7051]/20">
        <Sparkles className="w-4 h-4 text-[#cca972] flex-shrink-0 animate-pulse" />
        <span className="text-[10px] text-[#9ca69b] leading-relaxed">
          <strong className="text-[#cca972]">Persistent Identity:</strong> These custom presets will be automatically merged into local context variables on your client device, giving you a custom brand experience even without high enterprise overheads.
        </span>
      </div>
    </div>
  );
}
