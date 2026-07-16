import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HeroLanding = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Cloudflare-style splash holds for 2.5 seconds before fading out
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 800); // Wait for the fade out animation to finish
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f1729] overflow-hidden"
        >
          {/* Animated Background Gradients (Cloudflare aesthetic) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.5, scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-blue-600 rounded-full blur-[120px] mix-blend-screen"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.5, scale: 1 }}
            transition={{ duration: 2, delay: 0.2, ease: "easeOut" }}
            className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-teal-500 rounded-full blur-[120px] mix-blend-screen"
          />

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="relative z-10 flex flex-col items-center"
          >
            {/* The Logo from user */}
            <motion.img 
              src="/logo.png" 
              alt="ProCare Logo"
              className="w-48 h-auto md:w-64 dark:brightness-0 dark:invert transition-all duration-500"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                repeatType: "reverse", 
                ease: "easeInOut" 
              }}
            />
            
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="text-white text-3xl md:text-4xl font-light tracking-widest mt-8 font-sans"
            >
              PROCARE <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
                not just a pharmacy but a family for all needs<br/>ليست مجرد صيدليه لكنها عائله لكل احتياجاتك
              </span>
            </motion.h1>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HeroLanding;
