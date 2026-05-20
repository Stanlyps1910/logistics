import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Loader({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) {
        setTimeout(onComplete, 500); // Allow exit animation to finish
      }
    }, 2200); // 2.2s show time

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
        >
          <div className="relative flex flex-col items-center">
            {/* Animated Logo SVG */}
            <svg
              width="120"
              height="120"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mb-6"
            >
              {/* Outer Hexagon */}
              <motion.polygon
                points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5"
                stroke="#0047cc"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: 1,
                  opacity: 1,
                  transition: { duration: 1.5, ease: "easeInOut" },
                }}
              />
              
              {/* Inner Node Network Connections */}
              <motion.path
                d="M50,5 L50,95 M10,27.5 L90,72.5 M10,72.5 L90,27.5"
                stroke="rgba(0, 180, 216, 0.4)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { delay: 0.6, duration: 0.8 },
                }}
              />

              {/* Central Cube / Hub */}
              <motion.polygon
                points="50,25 72,37.5 72,62.5 50,75 28,62.5 28,37.5"
                fill="none"
                stroke="#00b4d8"
                strokeWidth="2.5"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  transition: { delay: 0.8, type: "spring", stiffness: 100 },
                }}
              />

              {/* Core Pulse Point */}
              <motion.circle
                cx="50"
                cy="50"
                r="6"
                fill="#0047cc"
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.7, 1, 0.7],
                  filter: ["drop-shadow(0 0 2px rgba(0,71,204,0.5))", "drop-shadow(0 0 8px rgba(0,212,255,0.8))", "drop-shadow(0 0 2px rgba(0,71,204,0.5))"],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </svg>

            {/* Pulsing Brand Name */}
            <motion.h1
              className="text-3xl font-black tracking-widest text-[#0a1628] font-display"
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { delay: 0.5, duration: 0.8 },
              }}
            >
              NEXA<span className="text-[#0047cc]">FREIGHT</span>
            </motion.h1>

            {/* Tagline */}
            <motion.p
              className="mt-2 text-xs font-semibold tracking-[0.25em] text-slate-400 font-display uppercase"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { delay: 1, duration: 0.8 },
              }}
            >
              Delivering Tomorrow, Today
            </motion.p>

            {/* Loading Indicator Line */}
            <div className="w-48 h-[2px] bg-slate-100 rounded-full mt-6 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#0047cc] to-[#00b4d8]"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
