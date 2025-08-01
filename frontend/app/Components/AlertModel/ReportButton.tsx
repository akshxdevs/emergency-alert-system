"use client";
import { useState, useRef, useEffect } from "react";

export const ReportButton = () => {
  const [isSliding, setIsSliding] = useState(false);
  const [slideProgress, setSlideProgress] = useState(0);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const currentX = useRef(0);
  const resetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isConfirmed) return;
    e.preventDefault();
    isDragging.current = true;
    startX.current = e.clientX;
    currentX.current = e.clientX;
    setIsSliding(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || isConfirmed) return;
    e.preventDefault();
    
    currentX.current = e.clientX;
    const deltaX = currentX.current - startX.current;
    const maxSlide = sliderRef.current?.offsetWidth ? sliderRef.current.offsetWidth - 60 : 200;
    const progress = Math.max(0, Math.min(100, (deltaX / maxSlide) * 100));
    
    setSlideProgress(progress);
  };

  const handleMouseUp = () => {
    if (!isDragging.current) return;
    
    isDragging.current = false;
    setIsSliding(false);
    
    if (slideProgress >= 85) {
      // Success animation
      setIsAnimating(true);
      setTimeout(() => {
        setIsConfirmed(true);
        setIsAnimating(false);
        setShowSuccess(true);
        // Trigger the emergency report
        console.log("Emergency reported successfully!");
        
        // Auto reset after 10 seconds
        resetTimeoutRef.current = setTimeout(() => {
          resetToInitial();
        }, 10000);
      }, 500);
    } else {
      // Reset to start
      setSlideProgress(0);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isConfirmed) return;
    isDragging.current = true;
    startX.current = e.touches[0].clientX;
    currentX.current = e.touches[0].clientX;
    setIsSliding(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || isConfirmed) return;
    e.preventDefault();
    
    currentX.current = e.touches[0].clientX;
    const deltaX = currentX.current - startX.current;
    const maxSlide = sliderRef.current?.offsetWidth ? sliderRef.current.offsetWidth - 60 : 200;
    const progress = Math.max(0, Math.min(100, (deltaX / maxSlide) * 100));
    
    setSlideProgress(progress);
  };

  const handleTouchEnd = () => {
    handleMouseUp();
  };

  const resetToInitial = () => {
    setIsConfirmed(false);
    setSlideProgress(0);
    setIsAnimating(false);
    setIsSliding(false);
    setShowSuccess(false);
    isDragging.current = false;
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
      resetTimeoutRef.current = null;
    }
  };

  // Reset on component mount
  useEffect(() => {
    setSlideProgress(0);
    setIsConfirmed(false);
    setShowSuccess(false);
    
    // Cleanup timeout on unmount
    return () => {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-3">
      <div className="text-center">
        <h3 className="text-base font-semibold text-gray-800 mb-1">Report Emergency</h3>
        <p className="text-xs text-gray-600">Slide to confirm and send alert</p>
      </div>

      {/* Enhanced Slider Container */}
      <div className="relative">
        <div
          ref={sliderRef}
          className={`
            relative w-full h-14 bg-gray-100 rounded-xl border-2 transition-all duration-300
            ${isConfirmed ? 'bg-green-50 border-green-300' : 'border-gray-200'}
            ${isSliding ? 'shadow-lg' : 'shadow-md'}
          `}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Progress Bar */}
          <div className="absolute inset-0 rounded-xl overflow-hidden">
            <div 
              className={`
                h-full transition-all duration-300 ease-out
                ${isConfirmed ? 'bg-green-500' : 'bg-gradient-to-r from-red-500 via-orange-500 to-green-500'}
              `}
              style={{ width: `${slideProgress}%` }}
            />
          </div>

          {/* Slider Handle */}
          <div
            className={`
              absolute top-1 left-1 w-12 h-12 rounded-xl transition-all duration-300 ease-out
              flex items-center justify-center cursor-pointer select-none z-10
              ${isConfirmed 
                ? 'bg-green-500 text-white shadow-lg scale-110' 
                : 'bg-white text-gray-600 shadow-lg hover:shadow-xl'
              }
              ${isSliding ? 'scale-105' : ''}
              ${isAnimating ? 'animate-bounce' : ''}
            `}
            style={{ 
              transform: `translateX(${slideProgress * 2.5}px)`,
            }}
          >
            {isConfirmed ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            )}
          </div>

          {/* Text Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-5">
            <span className={`
              text-sm font-semibold transition-all duration-300
              ${isConfirmed ? 'text-green-700' : 'text-gray-600'}
            `}>
              {isConfirmed ? 'Emergency Reported!' : 'Slide to Report Emergency'}
            </span>
          </div>

          {/* Success Animation */}
          {showSuccess && (
            <div className="absolute inset-0 flex items-center justify-center z-15">
              <div className="animate-ping absolute w-16 h-16 bg-green-400 rounded-full opacity-75"></div>
              <div className="relative w-12 h-12 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Progress Indicator */}
        {!isConfirmed && slideProgress > 0 && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-blue-700">Progress</span>
              <span className="text-xs text-blue-600">{Math.round(slideProgress)}%</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${slideProgress}%` }}
              />
            </div>
            <div className="mt-2 text-center">
              <span className={`text-xs font-medium ${slideProgress >= 85 ? 'text-green-600' : 'text-blue-600'}`}>
                {slideProgress >= 85 ? 'Release to confirm!' : 'Keep sliding...'}
              </span>
            </div>
          </div>
        )}

        {/* Enhanced Success Message */}
        {showSuccess && (
          <div className="mt-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <span className="text-sm font-semibold text-green-700">Emergency alert sent successfully!</span>
                <div className="text-xs text-green-600 mt-1">Response team has been notified</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Auto-resetting in 10 seconds...</span>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Reset Button */}
      {showSuccess && (
        <button
          onClick={resetToInitial}
          className="w-full px-4 py-3 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
        >
          Report Another Emergency Now
        </button>
      )}
    </div>
  );
};