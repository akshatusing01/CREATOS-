import React from "react";
import { CheckSquare, Share2, Copy, Check, RefreshCw, Hash, Search, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { ContentPackage } from "../types";
import { soundManager } from "../utils/sound";

interface PublishKitViewProps {
  contentPackage: ContentPackage | null;
  copiedKey: string | null;
  handleCopyToClipboard: (text: string, key: string) => void;
  handleRegenerateModule: (key: string) => void;
  moduleLoadingKey: string | null;
  getCompiledTextKit: () => string;
  setActiveWorkspace: (ws: any) => void;
}

export default function PublishKitView({
  contentPackage,
  copiedKey,
  handleCopyToClipboard,
  handleRegenerateModule,
  moduleLoadingKey,
  getCompiledTextKit,
  setActiveWorkspace
}: PublishKitViewProps) {
  const [checklistItems, setChecklistItems] = React.useState([
    { id: "check-hook", text: "Is the first Hook statement spoken in under 3 seconds?", checked: false },
    { id: "check-subs", text: "Are dual-language (Hinglish/English) subtitles clear and aligned?", checked: false },
    { id: "check-cta", text: "Is the final CTA focused on a single instruction (e.g., share, save, comment)?", checked: false },
    { id: "check-sound", text: "Is background trending music ducked to -15dB during voiceovers?", checked: false },
    { id: "check-thumb", text: "Does the Thumbnail text overlap contain under 3 extreme punchy words?", checked: false }
  ]);

  if (!contentPackage) {
    return (
      <div className="py-12">
        <div className="bg-white border border-soft-stone rounded-2xl p-12 text-center max-w-lg mx-auto space-y-5">
          <div className="h-12 w-12 bg-[#eae5db] rounded-full flex items-center justify-center mx-auto text-copper">
            <Share2 className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider">Publish Kit is waiting for script</h3>
          <p className="text-xs text-slate-gray leading-relaxed">
            "You cannot prepare publishing assets without content." Go to the Script Studio to generate your first draft. Once processed, the Publish Kit will automatically generate captions, hashtags, SEO tags, and thumbnail suggestions.
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

  const handleToggleCheck = (id: string) => {
    soundManager.playClick();
    setChecklistItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 animate-fadeIn"
    >
      {/* 1. Header and Quick Bulk Copy */}
      <div className="bg-white border border-soft-stone rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase font-extrabold text-copper tracking-widest flex items-center gap-1">
            <Share2 className="w-3.5 h-3.5" />
            Creator Publish Kit
          </span>
          <h2 className="text-base font-bold text-charcoal mt-1">Posting Copywriter, Hashtag Registry & Pre-flight Checklist</h2>
          <p className="text-xs text-slate-gray mt-1 leading-relaxed">
            All caption assets and tags sync automatically from the Script Studio source script.
          </p>
        </div>

        <button
          onClick={() => handleCopyToClipboard(getCompiledTextKit(), "bulk-kit")}
          className={`px-5 py-3 rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-2 cursor-pointer ${
            copiedKey === "bulk-kit" ? "bg-forest-green text-white" : "bg-copper hover:bg-copper-hover text-white"
          }`}
        >
          {copiedKey === "bulk-kit" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copiedKey === "bulk-kit" ? "Entire Kit Copied!" : "Copy Entire Package"}</span>
        </button>
      </div>

      {/* 2. Caption Generator Block */}
      <div className="bg-white border border-soft-stone rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal">Multi-Format Bio Captions</h3>
            <p className="text-[10px] text-slate-gray">Variants formatted cleanly for vertical platform feeds.</p>
          </div>
          <button
            onClick={() => handleRegenerateModule("captions")}
            disabled={moduleLoadingKey !== null}
            className="px-3 py-1.5 bg-soft-sand hover:bg-[#eae5db] border border-soft-stone text-slate-gray hover:text-charcoal text-[10px] font-bold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${moduleLoadingKey === "captions" ? "animate-spin" : ""}`} />
            Refine Captions
          </button>
        </div>

        <div className="space-y-4">
          {(Object.entries(contentPackage.captions) as [string, string][]).map(([key, textVal]) => (
            <div key={key} className="bg-soft-sand border border-soft-stone rounded-xl p-4 relative group">
              <span className="inline-block text-[9px] bg-[#eae5db] text-charcoal font-semibold px-2 py-0.5 rounded-md mb-2.5 uppercase tracking-wide">
                {key.replace(/([A-Z])/g, " $1")} Format
              </span>
              <p className="text-xs text-charcoal leading-relaxed whitespace-pre-line font-sans">
                {textVal}
              </p>
              <button
                onClick={() => handleCopyToClipboard(textVal, `caption-${key}`)}
                className="absolute top-4.5 right-4 p-1.5 bg-white border border-soft-stone text-slate-gray hover:text-charcoal rounded-lg cursor-pointer transition"
              >
                {copiedKey === `caption-${key}` ? <Check className="w-3.5 h-3.5 text-forest-green" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Thumbnail Suggester & Tag Matrices */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Thumbnail Suggester */}
        <div className="lg:col-span-7 bg-white border border-soft-stone rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal">Thumbnail Text Cover Suggests</h3>
              <p className="text-[10px] text-slate-gray">Short, extreme punchy text hook segments for vertical layouts.</p>
            </div>
            <button
              onClick={() => handleRegenerateModule("thumbnailText")}
              disabled={moduleLoadingKey !== null}
              className="text-[10px] text-copper font-bold cursor-pointer hover:text-copper-hover"
            >
              Refine Thumbnail suggestions
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-soft-sand p-3.5 rounded-xl border border-soft-stone space-y-2">
              <span className="block text-[8px] uppercase tracking-wider font-extrabold text-copper">⏱️ Under 3-Words</span>
              <ul className="space-y-1.5 text-xs">
                {contentPackage.thumbnailText.short.map((t, idx) => (
                  <li key={idx} className="bg-white border border-soft-stone p-2 rounded text-center text-charcoal font-black">
                    &ldquo;{t}&rdquo;
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-soft-sand p-3.5 rounded-xl border border-soft-stone space-y-2">
              <span className="block text-[8px] uppercase tracking-wider font-extrabold text-copper">⚡ 2-Line Contrast</span>
              <ul className="space-y-1.5 text-xs">
                {contentPackage.thumbnailText.punchy.map((t, idx) => (
                  <li key={idx} className="bg-white border border-soft-stone p-2 rounded text-center text-charcoal font-extrabold">
                    &ldquo;{t}&rdquo;
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-soft-sand p-3.5 rounded-xl border border-soft-stone space-y-2">
              <span className="block text-[8px] uppercase tracking-wider font-extrabold text-copper">🤔 Curiosity Gap</span>
              <ul className="space-y-1.5 text-xs">
                {contentPackage.thumbnailText.curiosityBased.map((t, idx) => (
                  <li key={idx} className="bg-white border border-soft-stone p-2 rounded text-center text-charcoal font-bold italic">
                    &ldquo;{t}&rdquo;
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right: Pre-posting Checklist */}
        <div className="lg:col-span-5 bg-white border border-soft-stone rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal">Pre-flight Checklist</h3>
            <p className="text-[10px] text-slate-gray">Tick off checks to secure max initial watchtime retention.</p>
          </div>

          <div className="space-y-2.5">
            {checklistItems.map((item) => (
              <label
                key={item.id}
                className={`flex items-start gap-3 p-2.5 rounded-xl border transition duration-150 cursor-pointer ${
                  item.checked ? "bg-green-50/50 border-green-200" : "bg-soft-sand border-soft-stone hover:bg-[#eae5db]"
                }`}
              >
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => handleToggleCheck(item.id)}
                  className="w-4 h-4 text-copper border-soft-stone rounded focus:ring-copper shrink-0 mt-0.5 cursor-pointer"
                />
                <span className={`text-xs select-none ${item.checked ? "line-through text-slate-gray/85" : "text-charcoal font-medium"}`}>
                  {item.text}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Hashtag Deck & Keywords Registry */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-soft-stone rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal">Hashtag Registry</h3>
            <button
              onClick={() => handleRegenerateModule("hashtags")}
              className="text-[10px] text-copper font-bold cursor-pointer"
            >
              Refine Tags
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <span className="block text-[8px] uppercase font-bold text-slate-gray">Niche Focused Tags</span>
              <p className="text-xs font-mono text-charcoal mt-1 tracking-wide">
                {contentPackage.hashtags.niche.join(" ")}
              </p>
            </div>
            <div className="pt-2.5 border-t border-soft-sand">
              <span className="block text-[8px] uppercase font-bold text-slate-gray">Topic Focused Tags</span>
              <p className="text-xs font-mono text-charcoal mt-1 tracking-wide">
                {contentPackage.hashtags.topicSpecific.join(" ")}
              </p>
            </div>
            <div className="p-3 bg-soft-sand border border-soft-stone rounded-xl">
              <span className="block text-[8px] uppercase font-bold text-copper">⭐ Copyable Platform Ready Sets</span>
              {contentPackage.hashtags.platformFriendlySets.map((block, idx) => (
                <div key={idx} className="flex justify-between items-center py-1 mt-1 border-b border-soft-stone/10 last:border-none">
                  <span className="text-xs font-mono text-charcoal tracking-wide truncate pr-3">{block.join(" ")}</span>
                  <button
                    onClick={() => handleCopyToClipboard(block.join(" "), `hash-set-${idx}`)}
                    className="p-1 bg-white border border-soft-stone text-slate-gray hover:text-charcoal rounded cursor-pointer"
                  >
                    {copiedKey === `hash-set-${idx}` ? <Check className="w-3 h-3 text-forest-green" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white border border-soft-stone rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal">SEO Target Keywords</h3>
            <button
              onClick={() => handleRegenerateModule("keywords")}
              className="text-[10px] text-copper font-bold cursor-pointer"
            >
              Refine SEO
            </button>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <span className="block text-[8px] uppercase font-bold text-slate-gray">Primary Query Target</span>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {contentPackage.keywords.primary.map((k, idx) => (
                  <span key={idx} className="bg-soft-sand border border-soft-stone text-charcoal px-2.5 py-0.5 rounded-lg text-[10px] font-sans font-medium">
                    {k}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2.5 border-t border-soft-sand">
              <span className="block text-[8px] uppercase font-bold text-slate-gray">Long-Tail Audience Hooks</span>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {contentPackage.keywords.longTail.map((k, idx) => (
                  <span key={idx} className="bg-copper/5 border border-copper/10 text-copper px-2.5 py-0.5 rounded-lg text-[10px] font-sans font-medium">
                    {k}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 bg-soft-sand border border-soft-stone rounded-xl">
              <span className="block text-[8px] uppercase font-bold text-slate-gray">High-Volume Search Phrases</span>
              <ul className="list-disc pl-4 mt-1.5 text-charcoal space-y-1">
                {contentPackage.keywords.searchPhrases.map((p, idx) => (
                  <li key={idx} className="text-[11px] leading-relaxed">{p}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Director Notes feedback loop */}
      {contentPackage.notes && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-xs italic text-green-800 flex items-start gap-3 font-sans shadow-sm">
          <Sparkles className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
          <span>
            <strong>Post Director Feedback Loop:</strong> {contentPackage.notes}
          </span>
        </div>
      )}
    </motion.div>
  );
}
