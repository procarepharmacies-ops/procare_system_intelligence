import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HeroLanding = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hold splash screen for 4.5 seconds to let the rich animations play out
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 1000); // Wait for the fade out animation to finish
    }, 4500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f1729] overflow-hidden"
        >
          {/* Animated Background Gradients */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.5, scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-problue rounded-full blur-[120px] mix-blend-screen"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.5, scale: 1 }}
            transition={{ duration: 2, delay: 0.2, ease: "easeOut" }}
            className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-progreen rounded-full blur-[120px] mix-blend-screen"
          />

          <div className="relative z-10 flex flex-col items-center justify-center">
            
            {/* LOGO ASSEMBLY CONTAINER */}
            <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
              
              {/* Pestle (يد الهون) */}
              <motion.svg 
                viewBox="0 0 24 24" 
                className="absolute w-20 h-20 text-blue-300 z-10 -ml-4 -mt-10 drop-shadow-xl"
                initial={{ opacity: 0, x: -100, y: -100, rotate: -90 }}
                animate={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
                transition={{ duration: 1.2, type: "spring", bounce: 0.5 }}
              >
                <path d="M17 3 L10 16" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                <circle cx="17" cy="3" r="3" fill="currentColor" />
              </motion.svg>
              
              {/* Mortar (الهون) */}
              <motion.svg 
                viewBox="0 0 24 24" 
                className="absolute w-28 h-28 text-problue z-20 mt-4 drop-shadow-2xl"
                initial={{ opacity: 0, y: 100, scale: 0.2 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.3, type: "spring", bounce: 0.6 }}
              >
                <path d="M4 10 H20 L17 20 C17 21 15 22 12 22 C9 22 7 21 7 20 L4 10 Z" fill="currentColor" />
                <path d="M2 10 H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                {/* Plus sign in the middle representing healthcare */}
                <path d="M12 13 V19 M9 16 H15" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </motion.svg>

              {/* Leaf (ورقة الشجر) */}
              <motion.svg 
                viewBox="0 0 24 24" 
                className="absolute w-16 h-16 text-progreen z-30 ml-16 -mt-8 drop-shadow-lg"
                initial={{ opacity: 0, x: 100, y: -50, rotate: 90, scale: 0 }}
                animate={{ opacity: 1, x: 0, y: 0, rotate: 15, scale: 1 }}
                transition={{ duration: 1, delay: 0.8, type: "spring", bounce: 0.5 }}
              >
                <path d="M12 2 C18 2 22 6 22 12 C22 18 12 22 12 22 C12 22 2 18 2 12 C2 6 6 2 12 2 Z" fill="currentColor" />
                {/* Leaf vein */}
                <path d="M12 22 L12 12" stroke="#0f1729" strokeWidth="1" strokeLinecap="round" />
              </motion.svg>

            </div>

            {/* Word "PROCARE" */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="text-5xl md:text-6xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400 font-sans mb-6 drop-shadow-sm"
            >
              PROCARE
            </motion.div>
            
            {/* Tagline centered and smaller, fading in words */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 2 }}
              className="flex flex-col items-center justify-center text-center space-y-3"
            >
              <h2 className="text-xl md:text-2xl text-blue-50 font-light tracking-wide max-w-md mx-auto leading-relaxed" dir="rtl">
                ليست مجرد صيدلية،<br/>
                <motion.span 
                  initial={{ opacity: 0, filter: "blur(4px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  transition={{ duration: 1, delay: 2.5 }}
                  className="font-semibold text-teal-300 drop-shadow-md text-2xl md:text-3xl mt-2 block"
                >
                  لكنها عائلة لكل احتياجاتك
                </motion.span>
              </h2>
            </motion.div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HeroLanding;
