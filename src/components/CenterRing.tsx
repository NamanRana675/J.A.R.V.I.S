
import { motion } from "motion/react";

export function CenterRing() {
  return (
    <div className="relative w-[320px] h-[320px] mx-auto flex items-center justify-center pointer-events-none rounded-full border border-jarvis-border">
      {/* Outer rotating dashed ring */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute w-[280px] h-[280px] rounded-full border border-dashed border-jarvis-border/40"
      />
      
      {/* Middle rotating ring (reverse) */}
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute w-[240px] h-[240px] rounded-full border-2 border-jarvis-primary/20 border-t-jarvis-primary/60"
      />

      {/* Inner glowing core */}
      <div className="absolute w-[120px] h-[120px] rounded-full flex items-center justify-center rounded-full bg-[radial-gradient(circle,var(--color-jarvis-primary)_0%,transparent_70%)] shadow-[0_0_40px_rgba(14,165,233,0.4)]">
         <div className="text-[14px] font-bold tracking-[0.2em] text-white">
           JARVIS
         </div>
      </div>

      {/* Pulsing rings */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[120px] h-[120px] rounded-full border border-jarvis-cyan"
      />
    </div>
  );
}
