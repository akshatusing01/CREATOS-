import React, { useState } from "react";
import { Sparkles, Copy, Check, FileText, Share2, Eye } from "lucide-react";
import { soundManager } from "../../utils/sound";

interface ProductionSuiteProps {
  originalText?: string;
  improvedVersion: string;
  shorterVersion: string;
  punchierVersion: string;
}

export const ProductionSuite: React.FC<ProductionSuiteProps> = ({
  originalText = "No original input paste scanned.",
  improvedVersion,
  shorterVersion,
  punchierVersion
}) => {
  const [activeTab, setActiveTab] = useState<"improved" | "shorter" | "punchier">("improved");
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    soundManager.playClick();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeContent =
    activeTab === "improved"
      ? improvedVersion
      : activeTab === "shorter"
      ? shorterVersion
      : punchierVersion;

  const tabClass = (tab: typeof activeTab) =>
    `px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border transition duration-200 ${
      activeTab === tab
        ? "bg-[#cca972] text-[#0b0a0c] border-[#cca972]"
        : "bg-[#141416] text-slate-400 border-[#232225] hover:text-[#cca972]"
    }`;

  return (
    <div id="ImprovedProductionSuite" className="bg-[#0b0a0c]/40 border border-[#1b1a1c] rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-3 border-b border-[#1b1a1c]">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-[#cca972] font-display flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#cca972] animate-pulse" />
            Improved Production Suite
          </h3>
          <p className="text-[10px] text-slate-500 mt-0.5">High-converting alternative copies optimized using CI algorithms.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side - Source Original */}
        <div className="space-y-3 flex flex-col justify-between">
          <div>
            <span className="block text-[10px] uppercase font-extrabold tracking-wider text-[#cf7051] font-sans">
              Source Original Content
            </span>
            <p className="text-[10px] text-slate-500 mt-0.5">The unoptimized baseline template submitted for evaluation.</p>
          </div>
          
          <div className="flex-1 bg-[#141416]/50 border border-[#232225] p-5 rounded-xl text-slate-400 text-xs font-mono h-[180px] overflow-y-auto leading-relaxed mt-2 whitespace-pre-wrap">
            {originalText || "No source script submitted. Defaulting to general optimization profile."}
          </div>
        </div>

        {/* Right Side - Interactive Alternative Versions */}
        <div className="space-y-3 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => { soundManager.playPop(); setActiveTab("improved"); }}
                className={tabClass("improved")}
              >
                ✦ Refined Strategic
              </button>
              <button
                type="button"
                onClick={() => { soundManager.playPop(); setActiveTab("shorter"); }}
                className={tabClass("shorter")}
              >
                ⏱ Shorter Focus
              </button>
              <button
                type="button"
                onClick={() => { soundManager.playPop(); setActiveTab("punchier")} }
                className={tabClass("punchier")}
              >
                ⚡ Punchy Disruptive
              </button>
            </div>

            <button
              onClick={() => handleCopy(activeContent)}
              className="flex items-center gap-1.5 text-[9px] uppercase font-bold text-[#cca972] border border-[#232225] hover:border-[#cca972]/40 px-3 py-1.5 rounded-lg bg-[#141416] transition duration-200 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Version</span>
                </>
              )}
            </button>
          </div>

          <div className="flex-1 bg-[#0b0a0c]/80 border border-[#cca972]/15 p-5 rounded-xl text-slate-100 text-xs font-mono h-[180px] overflow-y-auto leading-relaxed relative whitespace-pre-wrap">
            <div className="absolute top-3 right-3 opacity-10 pointer-events-none">
              <FileText className="w-16 h-16 text-[#cca972]" />
            </div>
            {activeContent || "Slight alternative latency. Processing optimization matrices..."}
          </div>
        </div>
      </div>
    </div>
  );
};
