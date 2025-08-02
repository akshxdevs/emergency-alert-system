"use client";
import React, { useState, useEffect } from "react";

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  available: boolean;
}

interface AlertCategorySelectorProps {
  onCategoryChange?: (category: string | null) => void;
}

const categories: Category[] = [
  {
    id: "police",
    name: "Police",
    icon: "🚔",
    color: "#1e40af",
    bgColor: "bg-blue-600",
    borderColor: "border-blue-600",
    available: true
  },
  {
    id: "fire",
    name: "Fire",
    icon: "🚒",
    color: "#dc2626",
    bgColor: "bg-red-600",
    borderColor: "border-red-600",
    available: true
  },
  {
    id: "medical",
    name: "Medical",
    icon: "🚑",
    color: "#059669",
    bgColor: "bg-emerald-600",
    borderColor: "border-emerald-600",
    available: true
  },
  {
    id: "blood",
    name: "Blood Donate",
    icon: "🩸",
    color: "#7c3aed",
    bgColor: "bg-violet-600",
    borderColor: "border-violet-600",
    available: false
  }
];

export const AlertCategorySelector: React.FC<AlertCategorySelectorProps> = ({ onCategoryChange }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // Call onCategoryChange when selectedCategory changes
  useEffect(() => {
    if (onCategoryChange) {
      onCategoryChange(selectedCategory);
    }
  }, [selectedCategory, onCategoryChange]);

  const handleCategoryClick = (categoryId: string) => {
    if (!categories.find(cat => cat.id === categoryId)?.available) return;
    setSelectedCategory(categoryId);
  };

  return (
    <div className="space-y-3">
      <div className="text-center">
        <h3 className="text-base font-semibold text-gray-800 mb-1">Select Category</h3>
        <p className="text-xs text-gray-600">Choose the type of emergency</p>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {categories.map((category) => {
          const isSelected = selectedCategory === category.id;
          const isHovered = hoveredCategory === category.id;
          const isAvailable = category.available;
          
          return (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
              disabled={!isAvailable}
              className={`
                relative group p-3 rounded-lg border-2 transition-all duration-300 ease-in-out
                ${isSelected 
                  ? `${category.bgColor} text-white shadow-lg scale-105` 
                  : isAvailable 
                    ? 'bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300 hover:scale-105' 
                    : 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-60'
                }
                ${isHovered && isAvailable ? 'shadow-md' : ''}
                transform transition-transform duration-200
              `}
            >
              {/* Coming Soon Badge */}
              {!isAvailable && (
                <div className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
                  Coming Soon
                </div>
              )}
              
              {/* Icon */}
              <div className={`
                text-2xl mb-2 transition-all duration-300
                ${isSelected ? 'animate-bounce' : isHovered && isAvailable ? 'animate-pulse' : ''}
              `}>
                {category.icon}
              </div>
              
              {/* Category Name */}
              <div className="text-center">
                <h4 className={`
                  text-sm font-semibold transition-colors duration-300
                  ${isSelected ? 'text-white' : isAvailable ? 'text-gray-800' : 'text-gray-500'}
                `}>
                  {category.name}
                </h4>
                
                {/* Status Text */}
                {!isAvailable && (
                  <p className="text-xs text-gray-500 mt-0.5">Available Soon</p>
                )}
              </div>
              
              {/* Selection Indicator */}
              {isSelected && (
                <div className={`
                  absolute -top-1 -right-1 w-5 h-5 rounded-full ${category.bgColor}
                  flex items-center justify-center text-white text-xs font-bold
                  animate-pulse
                `}>
                  ✓
                </div>
              )}
              
              {/* Hover Effect */}
              {isHovered && isAvailable && !isSelected && (
                <div className={`
                  absolute inset-0 rounded-lg border-2 ${category.borderColor}
                  opacity-50 transition-opacity duration-300
                `} />
              )}
            </button>
          );
        })}
      </div>
      
      {/* Selected Category Info */}
      {selectedCategory && (
        <div className={`
          mt-3 p-2 rounded-lg border-l-4 transition-all duration-300
          ${categories.find(cat => cat.id === selectedCategory)?.bgColor} bg-opacity-10
          ${categories.find(cat => cat.id === selectedCategory)?.borderColor}
        `}>
          <p className="text-xs font-medium text-gray-700">
            Selected: <span className="font-bold">{categories.find(cat => cat.id === selectedCategory)?.name}</span>
          </p>
        </div>
      )}
    </div>
  );
};