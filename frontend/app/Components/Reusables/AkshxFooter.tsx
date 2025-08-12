"use client";
import { motion } from "framer-motion";

export const AkshxFooter = () => {
  return (
    <motion.footer 
      className="w-full bg-gradient-to-r from-slate-50 to-blue-50/50 py-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
          {/* Logo Section */}
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative">
              <img
                width="18"
                height="18"
                className="w-12 h-12 md:w-14 md:h-14 lg:w-12 lg:h-12 drop-shadow-lg"
                src="https://img.icons8.com/color-pixels/32/siren.png"
                alt="siren"
              />
              {/* Subtle glow effect */}
              <div className="absolute inset-0 w-12 h-12 md:w-14 md:h-14 lg:w-12 lg:h-12 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
            </div>
            <span className="font-BricolageGrotesque text-lg md:text-xl font-semibold text-slate-800 hidden md:block">
              Emergency Alert
            </span>
          </motion.div>

          {/* Developer Credit */}
          <motion.div 
            className="flex flex-col items-center font-BricolageGrotesque text-base md:text-lg text-slate-700 text-center"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <span>Designed and developed by 
            <a 
              href="" 
              className="ml-1 text-orange-500 hover:text-orange-600 font-semibold transition-colors duration-300"
            >
              akshxdevs
            </a></span>
            <div className="border-t border-slate-200/40 pt-1">
              <p className="text-center text-xs text-slate-400 font-medium">
                © 2024 Emergency Alert System. All rights reserved.
              </p>
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.a 
              href="https://github.com/akshxdevs/emergency-alert-system"
              className="p-2 rounded-lg bg-white/80 border border-slate-200/60 shadow-sm hover:shadow-md hover:scale-110 transition-all duration-300 backdrop-blur-sm"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <img src="./github-logo.png" alt="GitHub" className="h-6 w-6 md:h-7 md:w-7" />
            </motion.a>
            <motion.a 
              href="https://x.com/akshxdevs"
              className="p-2 rounded-lg bg-white/80 border border-slate-200/60 shadow-sm hover:shadow-md hover:scale-110 transition-all duration-300 backdrop-blur-sm"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <img src="./twitter.png" alt="Twitter" className="h-6 w-6 md:h-7 md:w-7" />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </motion.footer>
  );
};
