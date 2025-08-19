"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useTheme } from "@/app/contexts/ThemeContext";
import { useEffect, useState } from "react";
import Image from "next/image";

export const AppBarLP = () => {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const safeTheme = mounted ? theme : 'light';

  return (
    <motion.div 
      className={`w-full py-3 backdrop-blur-sm border-b z-40 transition-all duration-300 ${
        safeTheme === 'dark' 
          ? 'bg-black border-gray-600' 
          : 'bg-white/95 border-slate-200/40'
      }`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative">
              <Image
                width={32}
                height={32}
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
                src="https://img.icons8.com/color-pixels/32/siren.png"
                alt="siren"
              />
            </div>
            <span className={`font-BricolageGrotesque text-base sm:text-lg md:text-xl font-semibold transition-colors duration-300 ${
              safeTheme === 'dark' ? 'text-gray-100' : 'text-slate-800'
            } hidden md:block`}>
              Emergency Alert
            </span>
          </motion.div>

          {/* Right Section */}
          <div className="flex gap-3 sm:gap-4 md:gap-6 items-center">
            {/* Theme Toggle Button */}
            <motion.button
              onClick={toggleTheme}
              className={`p-2 sm:p-2.5 rounded-xl border transition-all duration-200 group ${
                safeTheme === 'dark'
                  ? 'bg-gray-800/80 hover:bg-gray-700/80 border-gray-600/60'
                  : 'bg-slate-100/80 hover:bg-slate-200/80 border-slate-200/60'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {safeTheme === 'dark' ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white-100  group-hover:text-yellow-300 transition-colors duration-200"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v2.25m6.364 1.636l-.707.707M21 12h-2.25m-.707 6.364l-.707-.707M12 18.75V21m-6.364-1.636l.707-.707M3 12h2.25m.707-6.364l.707.707"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-slate-600 group-hover:text-slate-700 transition-colors duration-200"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                  />
                </svg>
              )}
            </motion.button>

            {/* Begin Setup Button */}
            <motion.button
              onClick={() => router.push("/login")}
              className="font-BricolageGrotesque px-4 sm:px-6 md:px-6 py-2 sm:py-2.5 md:py-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-200 text-sm sm:text-base md:text-lg whitespace-nowrap"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Login
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
