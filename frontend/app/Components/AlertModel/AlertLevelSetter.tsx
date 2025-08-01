"use client";
import { useState } from "react";

type ThreatLevel = "high" | "moderate" | "low";

interface ThreatLevelConfig {
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
}

const threatLevels: Record<ThreatLevel, ThreatLevelConfig> = {
  high: {
    color: "#ef4444", // red-500
    bgColor: "bg-red-500",
    borderColor: "border-red-500",
    textColor: "text-red-500"
  },
  moderate: {
    color: "#f59e0b", // amber-500
    bgColor: "bg-amber-500",
    borderColor: "border-amber-500",
    textColor: "text-amber-500"
  },
  low: {
    color: "#10b981", // emerald-500
    bgColor: "bg-emerald-500",
    borderColor: "border-emerald-500",
    textColor: "text-emerald-500"
  }
};

const levelOrder: ThreatLevel[] = ["low", "moderate", "high"];

export const AlertLevelSetter = () => {
  const [levelSelected, setLevelSelected] = useState<ThreatLevel>("moderate");
  const [isAnimating, setIsAnimating] = useState(false);

  const handleImageClick = () => {
    setIsAnimating(true);
    
    // Find current index and move to next level
    const currentIndex = levelOrder.indexOf(levelSelected);
    const nextIndex = (currentIndex + 1) % levelOrder.length;
    const nextLevel = levelOrder[nextIndex];
    
    setTimeout(() => {
      setLevelSelected(nextLevel);
      setIsAnimating(false);
    }, 200);
  };

  const currentConfig = threatLevels[levelSelected];

  return (
    <div className="flex flex-col justify-center items-center py-6">
      <div className="text-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Threat Level</h2>
        <p className="text-sm text-gray-600">Click the siren to change level</p>
      </div>
      
      {/* Single Clickable Image */}
      <div className="mb-6">
        <button
          onClick={handleImageClick}
          className={`
            relative p-6 rounded-full transition-all duration-500 ease-in-out
            ${currentConfig.bgColor} shadow-lg hover:shadow-xl
            ${isAnimating ? 'animate-pulse scale-95' : 'hover:scale-105'}
            transform transition-transform duration-300
          `}
        >
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            <img 
              width="32" 
              height="32" 
              src="https://img.icons8.com/color/48/siren.png" 
              alt={`${levelSelected} threat level`}
              className={`transition-all duration-500 filter brightness-0 invert ${
                isAnimating ? 'animate-spin' : ''
              }`}
            />
          </div>
        </button>
      </div>

      {/* Level Indicator */}
      <div className={`
        flex items-center justify-center gap-2 px-4 py-2 rounded-full
        ${currentConfig.bgColor} bg-opacity-10 ${currentConfig.borderColor} border
        transition-all duration-500
      `}>
        <div className={`w-3 h-3 rounded-full ${currentConfig.bgColor}`}></div>
        <span className={`text-sm font-medium ${currentConfig.textColor}`}>
          Level: {levelSelected.charAt(0).toUpperCase() + levelSelected.slice(1)}
        </span>
      </div>

      {/* Level Progress */}
      <div className="flex gap-2 mt-4">
        {levelOrder.map((level, index) => {
          const isActive = level === levelSelected;
          const config = threatLevels[level];
          
          return (
            <div
              key={level}
              className={`
                w-2 h-2 rounded-full transition-all duration-300
                ${isActive ? config.bgColor : 'bg-gray-300'}
              `}
            />
          );
        })}
      </div>
    </div>
  );
};