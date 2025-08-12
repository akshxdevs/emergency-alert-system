"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

export const AppBarLP = () => {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <div className="fixed py-3 max-w-4xl w-full left-56">
      <div className="px-5 flex justify-between items-center">
        <div>
          <img
            width="18"
            height="18"
            className="w-12 h-12 md:w-16 md:h-16 lg:w-10 lg:h-10 drop-shadow-sm"
            src="https://img.icons8.com/color-pixels/32/siren.png"
            alt="siren"
          />
        </div>
        <div className="flex gap-8 items-center">
          <div>
            <button className="mt-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="size-8"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                />
              </svg>
            </button>
          </div>
          <div>
            <button
              onClick={() => router.push("/login")}
              className="flex font-BricolageGrotesque gap-2 text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 px-8 md:px-12 lg:px-8 py-3 md:py-2 rounded-full shadow-lg relative overflow-hidden group transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 flex items-center gap-2 text-sm md:text-base">
                Begin Setup
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
