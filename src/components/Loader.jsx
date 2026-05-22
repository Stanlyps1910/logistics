import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";

export default function Loader({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onCompleteRef.current) {
        setTimeout(onCompleteRef.current, 500);
      }
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

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
            {/* Rebranded Animated Logo */}
            <div className="scale-90 sm:scale-100 transform origin-center transition-all">
              <Logo animated={true} className="h-44 sm:h-64 w-auto" />
            </div>

            {/* Loading Indicator Line */}
            <div className="w-56 h-[3px] bg-slate-100 rounded-full mt-8 overflow-hidden">
              <motion.div
                className="h-full bg-[#004c29]"
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
