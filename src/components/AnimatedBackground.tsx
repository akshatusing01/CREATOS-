import React from "react";
import { motion } from "motion/react";

interface AnimatedBackgroundProps {
  children?: React.ReactNode;
}

export default function AnimatedBackground({ children }: AnimatedBackgroundProps) {
  return (
    <div className="relative min-h-screen bg-[#09090b] text-[#e8dfd8] overflow-hidden font-sans">
      {/* Dynamic Grid Overlay with a subtle drift */}
      <motion.div
        initial={{ backgroundPosition: "0px 0px" }}
        animate={{ backgroundPosition: ["0px 0px", "40px 40px"] }}
        transition={{ duration: 25, ease: "linear", repeat: Infinity }}
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #cca972 1px, transparent 1px),
            linear-gradient(to bottom, #cca972 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Broad Luminous Ambient Globs with luxury copper/amber glow */}
      <div className="absolute top-[-15%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#cf7051]/5 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#cca972]/4 blur-[160px] pointer-events-none" />
      <div className="absolute top-[40%] left-[30%] w-[45%] h-[45%] rounded-full bg-[#cf7051]/3 blur-[140px] pointer-events-none" />

      {/* Decorative vertical light seam */}
      <div className="absolute left-[3%] top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#cca972]/8 to-transparent pointer-events-none" />
      <div className="absolute right-[3%] top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#cf7051]/8 to-transparent pointer-events-none" />

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
