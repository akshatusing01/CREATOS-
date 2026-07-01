import React, { useState } from "react";
import { MessageSquare, ArrowRight, Copy, Check, Info, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface GeneratedCta {
  text: string;
  type: string;
  explanation: string;
}

export default function CtaLab() {
  const [goal, setGoal] = useState<string>("comment");
  const [tone, setTone] = useState<string>("friendly");
  const [platform, setPlatform] = useState<string>("instagram");
  const [generating, setGenerating] = useState<boolean>(false);
  const [generatedCtas, setGeneratedCtas] = useState<GeneratedCta[] | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleGenerate = async () => {
    setGenerating(true);
    // Simulating call or quick generation structure
    setTimeout(() => {
      let results: GeneratedCta[] = [];
      if (goal === "comment") {
        results = [
          {
            text: "💬 'Agar tumne kabhi aisi situation face ki hai, toh comment mein apni story batao, let's discuss!'",
            type: "Friendly Discussion",
            explanation: "Drives real-world commenting by inviting personal stories rather than simple yes/no responses."
          },
          {
            text: "💬 'Mujhe niche comment karke batao: Option A ya Option B? Let's see kiske answers sahi hain!'",
            type: "Engagement Poll",
            explanation: "Low friction choice prompt to force fast keyboard hits and algorithm boosts."
          },
          {
            text: "💬 'Comment mein LINK likho, aur mera custom checklist direct tumhare DM mein automatic drop ho jayega!'",
            type: "Automated DM Magnet",
            explanation: "Extremely viral pattern capitalizing on automation keywords (e.g., ManyChat)."
          }
        ];
      } else if (goal === "dm") {
        results = [
          {
            text: "✉️ 'DM me the word \"SECRET\" and I'll send you my exact framework with a detailed 10-step Notion doc!'",
            type: "High-Value Lead Magnet",
            explanation: "Establishes a direct peer-to-peer messaging connection to build absolute high trust."
          },
          {
            text: "✉️ 'Agar koi doubt hai toh direct DM karo, let's resolve it together!'",
            type: "Elder Brother Guidance",
            explanation: "Draws authentic interactions by displaying high vulnerability and willingness to support."
          }
        ];
      } else if (goal === "save") {
        results = [
          {
            text: "💾 'Is reel ko save karlo, kyunki placements/interview se pehle ye checklists pakka kaam aayegi!'",
            type: "Time-Sensitive Utility",
            explanation: "Explains EXACTLY why they should save (future reference right before a stressful event)."
          },
          {
            text: "💾 'Don't scroll past! Is code snippet ko abhi save karlo taaki kal dubara dhundhna na pade.'",
            type: "Frictionless Capture",
            explanation: "Strong urgent reminder highlighting potential future inconvenience (losing the clip)."
          }
        ];
      } else {
        results = [
          {
            text: "🔄 'Is information ko apne un dosto ke sath share karo jo abhi bhi college mein time waste kar rahe hain!'",
            type: "National Accountability",
            explanation: "Triggers peer protective instincts to drive massive direct messaging and sharing shares."
          },
          {
            text: "🔄 'Apne us developer group mein ye abhi share karo taaki sabki help ho jaye!'",
            type: "Community Booster",
            explanation: "Drives high group sharing rates by offering common interest value."
          }
        ];
      }

      setGeneratedCtas(results);
      setGenerating(false);
    }, 800);
  };

  return (
    <div className="space-y-6" id="cta-lab-root">
      {/* Scope Clarifier */}
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100 rounded-2xl p-5 shadow-sm">
        <div className="flex gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-700 h-10 w-10 flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">CTA Lab • Closing Statements</h2>
            <p className="text-xs text-slate-600 mt-1">
              <strong>What is this?</strong> A lightweight call-to-action optimization engine.<br />
              <strong>Why care?</strong> Generic 'Follow for more' decreases conversion by 80%. Tailoring CTA to your specific goal drives high action rates.<br />
              <strong>What to do next?</strong> Choose your engagement goal, delivery tone, and platform, then generate 3 targeted CTAs.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left configurations card */}
        <div className="md:col-span-5 bg-white border border-slate-200 p-5 rounded-3xl shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">CTA Configurations</h3>
          </div>

          {/* Goal Selector */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Engagement Goal</label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            >
              <option value="comment">Drive Comments (Algo Boost)</option>
              <option value="dm">Initiate DM Automation (High Trust)</option>
              <option value="save">Force Saves (High Value Reference)</option>
              <option value="share">Trigger Group Shares (Virality)</option>
            </select>
          </div>

          {/* Tone Selector */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Delivery Tone</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            >
              <option value="friendly">Friendly & Supportive (Sachi baat)</option>
              <option value="bold">Contrarian & Urgent</option>
              <option value="mentor">Elder Brother Guidance</option>
            </select>
          </div>

          {/* Platform Selector */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Target Platform</label>
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

          <button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full bg-[#cf7051] hover:bg-[#c06041] disabled:bg-slate-300 text-white font-bold py-3 px-6 rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer"
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Formulating closing statements...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate CTAs</span>
              </>
            )}
          </button>
        </div>

        {/* Right Output Side */}
        <div className="md:col-span-7 space-y-4">
          <AnimatePresence mode="wait">
            {generatedCtas ? (
              <motion.div
                key="ctas-visible"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                {generatedCtas.map((cta, index) => (
                  <div key={index} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3 relative group">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                      <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                        {cta.type}
                      </span>
                      <button
                        onClick={() => handleCopyToClipboard(cta.text, index)}
                        className="text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        {copiedIndex === index ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>

                    <p className="text-xs font-extrabold text-slate-800 leading-relaxed italic">
                      &ldquo;{cta.text}&rdquo;
                    </p>

                    <p className="text-[10px] text-slate-400 font-sans flex items-center gap-1.5 pt-1.5">
                      <Info className="w-3.5 h-3.5" />
                      <span>{cta.explanation}</span>
                    </p>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-slate-50 border border-slate-200 border-dashed rounded-3xl p-12 text-center"
              >
                <p className="text-xs text-slate-500">Choose configurations on the left and click Generate CTAs to optimize your closing lines!</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
