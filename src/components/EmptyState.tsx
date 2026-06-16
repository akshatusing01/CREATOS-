import React from "react";
import { Sparkles, ClipboardList, PenTool, BrainCircuit } from "lucide-react";
import { motion } from "motion/react";
import { soundManager } from "../utils/sound";

interface EmptyStateProps {
  type: "no-input" | "no-saved" | "no-profile";
  onAction?: () => void;
  actionText?: string;
}

export default function EmptyState({ type, onAction, actionText }: EmptyStateProps) {
  const content = {
    "no-input": {
      title: "No Content Processed Yet",
      description: "Paste a raw script, rough idea, or simple topic in the control deck to activate CreatorOS Refactoring Engine.",
      icon: PenTool,
      accent: "from-[#cf7051] to-[#cca972]",
    },
    "no-saved": {
      title: "No Saved Projects Found",
      description: "Your transformed content packages will appear here once you click \"Save Project\" in the result deck.",
      icon: ClipboardList,
      accent: "from-[#cca972] to-[#9ca69b]",
    },
    "no-profile": {
      title: "Profile Memory Is Empty",
      description: "Configure your unique Creator Blueprint so CreatorOS can permanently tailor every script rewrite to your natural speaking voice.",
      icon: BrainCircuit,
      accent: "from-[#cf7051] to-[#cf7051]/60",
    },
  };

  const current = content[type];
  const Icon = current.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center p-8 text-center bg-[#141416]/95 backdrop-blur-md rounded-2xl border border-[#232225] max-w-lg mx-auto shadow-2xl"
    >
      <div className={`p-4 rounded-2xl bg-gradient-to-br ${current.accent} bg-opacity-10 text-white mb-4 shadow-lg shadow-[#cf7051]/10`}>
        <Icon className="w-8 h-8 text-[#cca972]" />
      </div>
      <h3 className="text-md font-semibold text-[#e8dfd8] mb-2">{current.title}</h3>
      <p className="text-xs text-[#9ca69b] leading-relaxed mb-6">{current.description}</p>
      {onAction && actionText && (
        <button
          onClick={() => {
            soundManager.playClick();
            onAction();
          }}
          onMouseEnter={() => soundManager.playHover()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#202022] hover:bg-[#2c2c2f] text-[#cca972] hover:text-white border border-[#2e2c2a] transition cursor-pointer active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#cf7051] animate-pulse" />
          {actionText}
        </button>
      )}
    </motion.div>
  );
}
