import React, { useState, useEffect } from "react";
import { ProfileMemory } from "../types";
import { Save, Check, RefreshCw, Sparkles, BookOpen, UserCheck } from "lucide-react";
import { motion } from "motion/react";

interface ProfileConfigProps {
  onSync: (profile: ProfileMemory) => void;
}

const DEFAULT_PROFILE: ProfileMemory = {
  language: "English",
  niche: "Mixed",
  tone: "Educational",
  style: "Storytelling",
  hookStyle: "Curiosity gap",
  ctaStyle: "Trigger word comment builder",
  rewriteStrength: "Medium rewrite",
};

export default function ProfileConfig({ onSync }: ProfileConfigProps) {
  const [profile, setProfile] = useState<ProfileMemory>(DEFAULT_PROFILE);
  const [saved, setSaved] = useState(false);

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
    localStorage.setItem("creatoros_profile", JSON.stringify(profile));
    setSaved(true);
    onSync(profile);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (confirm("Reset layout preferences to standard defaults?")) {
      setProfile(DEFAULT_PROFILE);
      localStorage.setItem("creatoros_profile", JSON.stringify(DEFAULT_PROFILE));
      onSync(DEFAULT_PROFILE);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="bg-gray-900/60 backdrop-blur-md rounded-2xl border border-gray-800/80 p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-800 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-semibold text-gray-100">Profile Settings (localStorage)</h3>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Define your unique brand metadata to permanently seed every single AI generation.
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleReset}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-800 hover:bg-gray-700 text-gray-400 border border-gray-700 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset
          </button>
          <button
            onClick={handleSave}
            className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
              saved
                ? "bg-emerald-600 text-white"
                : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/10"
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
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Language</label>
          <select
            value={profile.language}
            onChange={(e) => handleChange("language", e.target.value)}
            className="w-full bg-gray-800/80 hover:bg-gray-800 text-gray-200 text-sm rounded-xl py-2 px-3 border border-gray-700/60 focus:border-indigo-500 focus:outline-none transition"
          >
            <option value="English">English</option>
            <option value="Hinglish">Hinglish</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Niched Focus</label>
          <select
            value={profile.niche}
            onChange={(e) => handleChange("niche", e.target.value)}
            className="w-full bg-gray-800/80 hover:bg-gray-800 text-gray-200 text-sm rounded-xl py-2 px-3 border border-gray-700/60 focus:border-indigo-500 focus:outline-none transition"
          >
            <option value="AI">AI / AI Agents</option>
            <option value="Tech">Tech / Coding</option>
            <option value="Business">Business / Startups</option>
            <option value="Storytelling">Storytelling</option>
            <option value="Documentary">Documentary</option>
            <option value="Education">Education</option>
            <option value="Mixed">Mixed / General</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Default Tone</label>
          <select
            value={profile.tone}
            onChange={(e) => handleChange("tone", e.target.value)}
            className="w-full bg-gray-800/80 hover:bg-gray-800 text-gray-200 text-sm rounded-xl py-2 px-3 border border-gray-700/60 focus:border-indigo-500 focus:outline-none transition"
          >
            <option value="Professional">Professional</option>
            <option value="Casual">Casual / Direct</option>
            <option value="Bold">Bold / Assertive</option>
            <option value="Emotional">Emotional / Relatable</option>
            <option value="Educational">Educational</option>
            <option value="Story-driven">Story-driven</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Rewrite Strength</label>
          <select
            value={profile.rewriteStrength}
            onChange={(e) => handleChange("rewriteStrength", e.target.value)}
            className="w-full bg-gray-800/80 hover:bg-gray-800 text-gray-200 text-sm rounded-xl py-2 px-3 border border-gray-700/60 focus:border-indigo-500 focus:outline-none transition"
          >
            <option value="Light rewrite">Light tweak (Preserve original structure)</option>
            <option value="Medium rewrite">Balanced rewrite (Optimized split)</option>
            <option value="Full rewrite">Full Refactor (Hyper-creative build)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Preferred Production Style</label>
          <select
            value={profile.style}
            onChange={(e) => handleChange("style", e.target.value)}
            className="w-full bg-gray-800/80 hover:bg-gray-800 text-gray-200 text-sm rounded-xl py-2 px-3 border border-gray-700/60 focus:border-indigo-500 focus:outline-none transition"
          >
            <option value="Storytelling">Classic Story Arc</option>
            <option value="Documentary">Vox-style Mini-doc</option>
            <option value="AI / Tech">High-Tempo Technical Review</option>
            <option value="Business">Entrepreneur Case Studies</option>
            <option value="Educational">Visual Explanation Deck</option>
            <option value="Mixed">Mixed Layout</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Hook Strategy Preference</label>
          <input
            type="text"
            value={profile.hookStyle}
            onChange={(e) => handleChange("hookStyle", e.target.value)}
            placeholder="e.g. Negative outcome or contrarian statement"
            className="w-full bg-gray-800/80 text-gray-200 text-sm rounded-xl py-2 px-3 border border-gray-700/60 focus:border-indigo-500 focus:outline-none transition"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-gray-400 mb-1.5">CTA Conversion Preference</label>
          <input
            type="text"
            value={profile.ctaStyle}
            onChange={(e) => handleChange("ctaStyle", e.target.value)}
            placeholder="e.g. Comment 'GROW' to trigger automated ManyChat DM link"
            className="w-full bg-gray-800/80 text-gray-200 text-sm rounded-xl py-2 px-3 border border-gray-700/60 focus:border-indigo-500 focus:outline-none transition"
          />
        </div>
      </div>
      
      {/* Help box */}
      <div className="mt-4 flex items-center gap-2 p-3 bg-indigo-950/20 rounded-xl border border-indigo-900/30">
        <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0" />
        <span className="text-[11px] text-indigo-300">
          <strong>Persistent Identity:</strong> These custom presets will be automatically merged into local context variables on your client device, giving you a custom brand experience even without high enterprise overheads.
        </span>
      </div>
    </div>
  );
}
