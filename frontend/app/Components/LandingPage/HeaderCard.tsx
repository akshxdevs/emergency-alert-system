"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const HeaderCard = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '/libs/lib.js';
    script.async = true;

    script.onload = () => {
      if (typeof window !== 'undefined' && (window as unknown as { FinisherHeader?: new (config: unknown) => void }).FinisherHeader) {
        new ((window as unknown as { FinisherHeader: new (config: unknown) => void }).FinisherHeader)({
          count: 100,
          size: { min: 2, max: 8, pulse: 0 },
          speed: {
            x: { min: 0, max: 1.2 },
            y: { min: 0, max: 1.8 },
          },
          colors: {
            background: '#0000',
            particles: ['#fbfcca', '#d7f3fe', '#ffd0a7', '#fffc00', '#ff005c'],
          },
          blending: 'screen',
          opacity: { center: 1, edge: 0 },
          skew: 0.1,
          shapes: ['c', 's'],
        });
      } else {
      }
    };

    document.body.appendChild(script);
  }, []);

  return (
    <motion.div
      className="finisher-header relative w-full min-h-[120px] sm:min-h-[200px] md:min-h-[400px] lg:min-h-[500px] xl:min-h-[600px]"
      id="finisher-header"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div 
          className="flex flex-col justify-center items-center text-center gap-3 sm:gap-4 md:gap-6 px-4 sm:px-6 md:px-8 lg:px-12 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Animated Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.5, type: "spring", bounce: 0.4 }}
            whileHover={{ 
              scale: 1.05, 
              rotate: [0, -5, 5, 0],
              transition: { duration: 0.6 }
            }}
            className="relative mb-2 sm:mb-4"
          >
            {/* Subtle Glow Effect */}
            <motion.div
              className="absolute inset-0 bg-orange-200/20 rounded-full blur-lg opacity-0"
              animate={{ opacity: isHovered ? 0.2 : 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>

          {/* Animated Title */}
            <motion.h1 
                className="font-BricolageGrotesque text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold leading-tight text-slate-900 px-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                whileHover={{ scale: 1.01 }}
            >
                <motion.span
                    className="bg-gradient-to-r from-orange-300 to-amber-900 bg-clip-text text-transparent font-bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                >
                    Stay Safe and Informed
                </motion.span>
                <br />
                <motion.span
                    className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text text-transparent font-bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.0 }}
                >
                    With Real-Time Emergency Alerts
                </motion.span>
                <br />
                <motion.span
                    className="bg-gradient-to-r from-orange-300 to-amber-900 bg-clip-text text-transparent font-bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.2 }}
                >
                    Always Reliable
                </motion.span>
            </motion.h1>

          {/* Animated Subtitle */}
          <motion.p 
            className="font-gilroyLight text-sm sm:text-base md:text-lg lg:text-xl text-slate-200 max-w-xs sm:max-w-sm md:max-w-2xl font-lightSD px-4 mt-2 sm:mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            Built to protect. Designed to alert. Trusted in every crisis.
          </motion.p>

          {/* Enhanced Button */}
          <motion.button 
            onClick={() => router.push("/login")} 
            className="flex font-BricolageGrotesque gap-2 mt-4 sm:mt-6 md:mt-8 text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 px-6 sm:px-8 md:px-12 lg:px-16 py-2.5 sm:py-3 md:py-4 rounded-full shadow-lg relative overflow-hidden group transition-all duration-300"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 10px 25px rgba(249, 115, 22, 0.3)"
            }}
            whileTap={{ scale: 0.98 }}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
          >
            {/* Animated Background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
            
            {/* Button Content */}
            <motion.span 
              className="relative z-10 flex items-center gap-2 text-sm sm:text-base md:text-lg"
              animate={{ x: isButtonHovered ? 3 : 0 }}
              transition={{ duration: 0.3 }}
            >
              Begin Setup
              <motion.svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth="1.5" 
                stroke="currentColor" 
                className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5 lg:w-6 lg:h-6"
                animate={{ x: isButtonHovered ? 4 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
              </motion.svg>
            </motion.span>

            {/* Subtle Ripple Effect */}
            <AnimatePresence>
              {isButtonHovered && (
                <motion.div
                  className="absolute inset-0 bg-white/10 rounded-full"
                  initial={{ scale: 0, opacity: 0.5 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                />
              )}
            </AnimatePresence>
          </motion.button>

          {/* Subtle Floating Elements - Hidden on mobile for better performance */}
          <motion.div
            className="absolute top-10 left-4 sm:left-10 text-xl sm:text-2xl md:text-3xl opacity-10 hidden sm:block"
            animate={{ 
              y: [0, -8, 0],
              rotate: [0, 3, 0]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            🚨
          </motion.div>
          <motion.div
            className="absolute top-20 right-4 sm:right-10 text-lg sm:text-xl md:text-2xl opacity-10 hidden sm:block"
            animate={{ 
              x: [0, 8, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            🚔
          </motion.div>
          <motion.div
            className="absolute bottom-20 left-4 sm:left-10 text-lg sm:text-xl md:text-2xl opacity-10 hidden sm:block"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, -3, 0]
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            🚑
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}