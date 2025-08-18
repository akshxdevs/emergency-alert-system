"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

type ThreatLevel = "high" | "medium" | "low";

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
  medium: {
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

const levelOrder: ThreatLevel[] = ["low", "medium", "high"];
interface AlertLevelSelectorProps {
  onLevelChange?: (category: string | null) => void;
}
export const AlertLevelSetter:React.FC<AlertLevelSelectorProps> = ({onLevelChange}) => {
  const [levelSelected, setLevelSelected] = useState<ThreatLevel>("medium");
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(()=>{
    if (onLevelChange) {
      onLevelChange(levelSelected)
    }
  },[levelSelected,onLevelChange])

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
    <div className="flex flex-col justify-center items-center py-3">
      <div className="text-center mb-3">
        <h2 className="text-base font-semibold text-gray-800 mb-1">Threat Level</h2>
        <p className="text-xs text-gray-600">Click the siren to change level</p>
      </div>
      
      {/* Single Clickable Image */}
      <div className="mb-3">
        <button
          onClick={handleImageClick}
          className={`
            relative p-4 rounded-full transition-all duration-500 ease-in-out
            ${currentConfig.bgColor} shadow-lg hover:shadow-xl
            ${isAnimating ? 'animate-pulse scale-95' : 'hover:scale-105'}
            transform transition-transform duration-300
          `}
        >
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <Image 
              width={24} 
              height={24} 
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
        flex items-center justify-center gap-2 px-3 py-1 rounded-full
        ${currentConfig.bgColor} bg-opacity-10 ${currentConfig.borderColor} border
        transition-all duration-500
      `}>
        <div className={`w-2 h-2 rounded-full ${currentConfig.bgColor}`}></div>
        <span className={`text-xs font-medium ${currentConfig.textColor}`}>
          Level: {levelSelected.charAt(0).toUpperCase() + levelSelected.slice(1)}
        </span>
      </div>

      {/* Level Progress */}
      <div className="flex gap-1 mt-2">
        {levelOrder.map((level, index) => {
          const isActive = level === levelSelected;
          const config = threatLevels[level];
          
          return (
            <div
              key={level}
              className={`
                w-1.5 h-1.5 rounded-full transition-all duration-300
                ${isActive ? config.bgColor : 'bg-gray-300'}
              `}
            />
          );
        })}
      </div>
    </div>
  );
};