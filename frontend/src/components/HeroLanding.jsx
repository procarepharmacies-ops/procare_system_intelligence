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
            
            {/* LOGO AND TEXT */}
            <motion.div 
              className="flex items-center justify-center gap-4 md:gap-6 mb-8"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.2, type: "spring", bounce: 0.5, delay: 0.5 }}
            >
              {/* The P Logo (favicon.svg) */}
              <motion.img 
                src="/favicon.svg" 
                alt="ProCare Icon"
                className="w-24 h-24 md:w-32 md:h-32 drop-shadow-2xl"
                initial={{ rotate: -45, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, type: "spring", bounce: 0.6 }}
              />
              
              {/* Word "PROCARE" */}
              <div className="text-5xl md:text-7xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400 font-sans drop-shadow-sm">
                PROCARE
              </div>
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
