"use client";
import React, { useEffect, useState } from "react";

interface AlertAddMoreDetailsProps {
  onAddingMoreDetails?: (moreDetails: string | null) => void;
}

export const OtherOptions:React.FC<AlertAddMoreDetailsProps> = ({onAddingMoreDetails}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [description, setDescription] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(()=>{
    if (onAddingMoreDetails) {
      onAddingMoreDetails(description);
    }
  },[description,onAddingMoreDetails])

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      // Focus the textarea when expanding
      setTimeout(() => {
        const textarea = document.getElementById("emergency-description");
        if (textarea) textarea.focus();
      }, 100);
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const characterCount = description.length;
  const maxCharacters = 300; // Reduced from 500
  const isNearLimit = characterCount > maxCharacters * 0.8;

  return (
    <div className="space-y-3">
      <div className="text-center">
        <h3 className="text-base font-semibold text-gray-800 mb-1">Additional Details</h3>
        <p className="text-xs text-gray-600">Provide more information about the emergency</p>
      </div>

      {/* Toggle Button */}
      <button
        onClick={handleToggle}
        className={`
          w-full p-3 rounded-lg border-2 transition-all duration-300 ease-in-out
          ${isExpanded 
            ? 'bg-blue-50 border-blue-300 text-blue-700' 
            : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          }
          transform transition-transform duration-200 hover:scale-[1.02]
        `}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
              ${isExpanded ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}
            `}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="currentColor" 
                className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
            <div className="text-left">
              <h4 className="text-sm font-semibold">Emergency Description</h4>
              <p className="text-xs text-gray-500">
                {isExpanded ? 'Click to collapse' : 'Click to add details'}
              </p>
            </div>
          </div>
          
          {/* Character Count Badge */}
          {isExpanded && (
            <div className={`
              px-2 py-1 rounded-full text-xs font-medium transition-all duration-300
              ${isNearLimit ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'}
            `}>
              {characterCount}/{maxCharacters}
            </div>
          )}
        </div>
      </button>

      {/* Expandable Description Input */}
      <div className={`
        overflow-hidden transition-all duration-500 ease-in-out
        ${isExpanded ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}
      `}>
        <div className={`
          p-3 rounded-lg border-2 transition-all duration-300
          ${isFocused ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white'}
        `}>
          <div className="space-y-2">
            {/* Label */}
            <div className="flex items-center justify-between">
              <label htmlFor="emergency-description" className="text-xs font-medium text-gray-700">
                Describe the emergency in detail
              </label>
              <span className="text-xs text-gray-500">
                {characterCount}/{maxCharacters} characters
              </span>
            </div>

            {/* Textarea */}
            <textarea
              id="emergency-description"
              value={description}
              onChange={handleDescriptionChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Please provide detailed information about the emergency situation..."
              className={`
                w-full p-2 rounded-lg border transition-all duration-300 resize-none
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                ${isFocused ? 'border-blue-400' : 'border-gray-300'}
                ${isNearLimit ? 'border-orange-300' : ''}
              `}
              rows={4}
              maxLength={maxCharacters}
            />

            {/* Character Count Progress */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className={isNearLimit ? 'text-orange-600' : 'text-gray-500'}>
                  {characterCount} characters used
                </span>
                <span className={isNearLimit ? 'text-orange-600' : 'text-gray-500'}>
                  {maxCharacters - characterCount} remaining
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className={`
                    h-1.5 rounded-full transition-all duration-300
                    ${isNearLimit ? 'bg-orange-500' : 'bg-blue-500'}
                  `}
                  style={{ width: `${(characterCount / maxCharacters) * 100}%` }}
                />
              </div>
            </div>

            {/* Help Text */}
            <div className="text-xs text-gray-500 space-y-1">
              <p>💡 <strong>Tips:</strong></p>
              <ul className="list-disc list-inside space-y-0.5 ml-2">
                <li>Include location details</li>
                <li>Mention people involved</li>
                <li>Describe injuries/conditions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {isExpanded && (
        <div className="flex gap-2">
          <button
            onClick={() => setDescription("")}
            className="px-2 py-1 text-xs text-gray-600 hover:text-red-600 transition-colors duration-200"
          >
            Clear
          </button>
          <button
            onClick={() => {
              // You can add save functionality here
              setIsExpanded(false);
            }}
            className="px-2 py-1 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            Save Details
          </button>
        </div>
      )}
    </div>
  );
};