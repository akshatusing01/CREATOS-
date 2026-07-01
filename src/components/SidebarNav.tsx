import React from "react";
import { Sparkles, Brain, TrendingUp, BookOpen, Share2, Cpu } from "lucide-react";
import { motion } from "motion/react";

interface SidebarNavProps {
  activeWorkspace: "script-studio" | "content-advisor" | "opportunity-hub" | "creator-library" | "publish-kit" | string;
  setWorkspace: (ws: any) => void;
  savedCount: number;
  intelCount: number;
  onOpenSettings: () => void;
  showProfile: boolean;
}

export default function SidebarNav({
  activeWorkspace,
  setWorkspace,
  savedCount
}: SidebarNavProps) {
  const workspaces = [
    {
      key: "script-studio",
      label: "Script Studio",
      subtitle: "Content generation engine",
      icon: Sparkles,
      count: null
    },
    {
      key: "content-advisor",
      label: "Content Advisor",
      subtitle: "Intelligent coaching & advice",
      icon: Brain,
      count: null
    },
    {
      key: "opportunity-hub",
      label: "Opportunity Hub",
      subtitle: "Trending topics & ideas",
      icon: TrendingUp,
      count: null
    },
    {
      key: "creator-library",
      label: "Creator Library",
      subtitle: "Saved scripts & drafts",
      icon: BookOpen,
      count: savedCount
    },
    {
      key: "publish-kit",
      label: "Publish Kit",
      subtitle: "Caption, tags & checklist",
      icon: Share2,
      count: null
    }
  ];

  return (
    <aside className="w-full bg-white border border-soft-stone rounded-2xl p-5 flex flex-col gap-6 shadow-sm relative overflow-hidden">
      {/* Subtle branding layer */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-copper/5 to-transparent blur-xl pointer-events-none" />

      {/* Launcher Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-soft-stone">
        <div className="h-9 w-9 rounded-lg bg-copper flex items-center justify-center shadow-sm">
          <Cpu className="w-4.5 h-4.5 text-white" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-charcoal tracking-tight leading-none font-display">CreatorOS</h3>
          <span className="text-[9px] text-copper font-sans font-bold tracking-wider uppercase">Workspace Hub</span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 flex-1">
        <span className="text-[9px] uppercase tracking-widest text-slate-gray font-bold px-2.5 mb-1.5 select-none">
          Primary Workspaces
        </span>

        {workspaces.map((ws) => {
          const Icon = ws.icon;
          const isActive = activeWorkspace === ws.key;
          return (
            <button
              key={ws.key}
              onClick={() => setWorkspace(ws.key)}
              className={`group flex items-center justify-between w-full px-3 py-3 rounded-xl text-xs font-semibold select-none cursor-pointer transition-all duration-200 relative ${
                isActive
                  ? "bg-copper/8 text-copper border border-copper/20 shadow-sm"
                  : "text-slate-gray hover:bg-soft-sand hover:text-charcoal border border-transparent"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeWorkspaceBubble"
                  className="absolute inset-0 bg-copper/5 border border-copper/10 rounded-xl pointer-events-none"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <div className="flex items-center gap-3 z-10">
                <Icon className={`w-4 h-4 transition-transform duration-300 ${isActive ? "text-copper rotate-6" : "text-slate-gray group-hover:rotate-6 group-hover:text-copper"}`} />
                <div className="text-left">
                  <span className="block font-semibold">{ws.label}</span>
                  <span className={`block text-[9px] font-normal leading-none mt-0.5 ${isActive ? "text-copper/80" : "text-slate-gray/80"}`}>{ws.subtitle}</span>
                </div>
              </div>
              {ws.count !== null && (
                <span className={`text-[10px] font-sans font-bold px-2 py-0.5 rounded-full border z-10 ${
                  isActive
                    ? "bg-copper/15 border-copper/30 text-copper"
                    : "bg-soft-sand border-soft-stone text-slate-gray"
                }`}>
                  {ws.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Mini Helper Text */}
      <div className="pt-4 border-t border-soft-stone text-center">
        <p className="text-[10px] text-slate-gray leading-relaxed font-sans">
          India-first creator intelligence model. Think. Create. Publish.
        </p>
      </div>
    </aside>
  );
}
