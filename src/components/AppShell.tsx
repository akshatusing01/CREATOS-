import React from "react";
import AnimatedBackground from "./AnimatedBackground";
import { motion } from "motion/react";

interface AppShellProps {
  children?: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <AnimatedBackground>
      <div id="app-shell-root" className="min-h-screen relative py-6 px-4 md:px-8 flex flex-col justify-between pb-12 transition-all duration-300">
        <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col gap-6 z-10">
          {children}
        </div>
      </div>
    </AnimatedBackground>
  );
}
