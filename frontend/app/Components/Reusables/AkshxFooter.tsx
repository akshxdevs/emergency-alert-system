"use client";
import { motion } from "framer-motion";
import { useTheme } from "@/app/contexts/ThemeContext";
import { useEffect, useState } from "react";
import Image from "next/image";

export const AkshxFooter = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use a safe theme value that won't cause hydration issues
  const safeTheme = mounted ? theme : 'light';

  return (
    <motion.footer 
      className={`w-full py-4 transition-all duration-500 ${
        safeTheme === 'dark' 
          ? 'bg-gradient-to-r from-zinc-800 via-zinc-950 to-zinc-800' 
          : 'bg-gradient-to-r from-slate-50 to-blue-50/50'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
          {/* Logo Section */}
          <motion.div 
            className="flex items-center flex-1 md:flex-none"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative">
              <Image
                width={18}
                height={18}
                className="w-12 h-12 md:w-14 md:h-14 lg:w-12 lg:h-12 drop-shadow-lg"
                src="https://img.icons8.com/color-pixels/32/siren.png"
                alt="siren"
              />
            </div>
            <span className={`font-BricolageGrotesque text-lg md:text-xl font-semibold transition-colors duration-300 ${
              safeTheme === 'dark' ? 'text-white' : 'text-slate-800'
            } hidden md:block`}>
              Emergency Alert
            </span>
          </motion.div>

          {/* Developer Credit */}
          <motion.div 
            className={`flex flex-col items-center font-BricolageGrotesque text-base md:text-lg text-center flex-1 ${
              safeTheme === 'dark' ? 'text-gray-200' : 'text-slate-700'
            }`}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <span>Designed and developed by 
            <a 
              href="" 
              className="ml-1 text-orange-300 underline hover:text-orange-600 font-semibold transition-colors duration-300"
            >
              akshxdevs
            </a></span>
            <div className={`border-t pt-1 transition-colors duration-300 ${
              safeTheme === 'dark' ? 'border-gray-600/40' : 'border-slate-200/40'
            }`}>
              <p className={`text-center text-xs font-medium transition-colors duration-300 ${
                safeTheme === 'dark' ? 'text-gray-400' : 'text-slate-400'
              }`}>
                © 2024 Emergency Alert System. All rights reserved.
              </p>
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div 
            className="flex items-center gap-4 flex-1 md:flex-none justify-center md:justify-end"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.a 
              href="https://github.com/akshxdevs/emergency-alert-system"
              className={`p-2 rounded-lg border shadow-sm hover:shadow-md hover:scale-110 transition-all duration-300 backdrop-blur-sm ${
                safeTheme === 'dark' 
                  ? 'bg-gray-800/80 border-gray-600/60' 
                  : 'bg-white/80 border-slate-200/60'
              }`}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image 
                src="/github-logo.png" 
                alt="GitHub" 
                width={16}
                height={16}
                className={`h-4 w-4 md:h-4 md:w-4 transition-all duration-300 ${
                  safeTheme === 'dark' ? 'brightness-0 invert' : ''
                }`}
              />
            </motion.a>
            <motion.a 
              href="https://x.com/akshxdevs"
              className={`p-2 rounded-lg border shadow-sm hover:shadow-md hover:scale-110 transition-all duration-300 backdrop-blur-sm ${
                safeTheme === 'dark' 
                  ? 'bg-gray-800/80 border-gray-600/60' 
                  : 'bg-white/80 border-slate-200/60'
              }`}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image 
                src="/twitter.png" 
                alt="Twitter" 
                width={16}
                height={16}
                className={`h-4 w-4 md:h-4 md:w-4 transition-all duration-300 ${
                  safeTheme === 'dark' ? 'brightness-0 invert' : ''
                }`}
              />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </motion.footer>
  );
};
