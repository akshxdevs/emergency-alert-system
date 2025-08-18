"use client";
import { useState, useRef, useEffect } from "react";

interface ReportButtonProps {
  onConfirm?: () => void;
}

export const ReportButton = ({ onConfirm }: ReportButtonProps) => {
  const [isSliding, setIsSliding] = useState(false);
  const [slideProgress, setSlideProgress] = useState(0);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFullScreenSuccess, setShowFullScreenSuccess] = useState(false);
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
      setIsAnimating(true);
      setTimeout(() => {
        setIsConfirmed(true);
        setIsAnimating(false);
        setShowSuccess(true);
        setShowFullScreenSuccess(true);
        
        // Trigger the emergency report from parent component
        if (onConfirm) {
          onConfirm();
        }
        // Auto reset after 30 seconds
        resetTimeoutRef.current = setTimeout(() => {
          resetToInitial();
        }, 5000);
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
    setShowFullScreenSuccess(false);
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
    setShowFullScreenSuccess(false);
    
    // Cleanup timeout on unmount
    return () => {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Full Screen Success Animation */}
      {showFullScreenSuccess && (
        <div className="fixed top-[-15px] left-0 right-0 bottom-0 bg-black/80 backdrop-blur-md z-[9999] flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4 text-center animate-in slide-in-from-bottom-4 duration-500">
            <div className="relative mb-6">
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="absolute left-[103px] inset-0 w-24 h-24 border-4 border-green-400 rounded-full animate-ping opacity-75"></div>
              <div className="absolute left-[103px] inset-0 w-24 h-24 border-2 border-green-300 rounded-full animate-ping opacity-50" style={{ animationDelay: '0.5s' }}></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Emergency Reported!</h2>
            <p className="text-gray-600 mb-4">Response team has been notified and is on the way.</p>
          </div>
        </div>
      )}

      {/* Normal Alert Components (Hidden during success) */}
      <div className={`space-y-3 ${showFullScreenSuccess ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
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
            {/* Progress Bar - Behind everything */}
            <div className="absolute inset-0 rounded-xl overflow-hidden z-0">
              <div 
                className={`
                  h-full transition-all duration-150 ease-out
                  ${isConfirmed ? 'bg-green-500' : 'bg-gradient-to-r from-red-500 via-orange-500 to-green-500'}
                `}
                style={{ width: `${slideProgress}%` }}
              />
            </div>

            {/* Text Overlay - Middle layer */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-5">
              <span className={`
                text-sm font-semibold transition-all duration-300
                ${isConfirmed ? 'text-green-700' : 'text-gray-600'}
              `}>
                {isConfirmed ? 'Emergency Reported!' : 'Slide to Report Emergency'}
              </span>
            </div>

            {/* Slider Handle - Front layer */}
            <div
              className={`
                absolute top-1 left-1 w-12 h-12 rounded-xl transition-all duration-150 ease-out
                flex items-center justify-center cursor-pointer select-none z-20
                ${isConfirmed 
                  ? 'bg-green-500 text-white shadow-lg scale-110' 
                  : 'bg-white text-gray-600 shadow-lg hover:shadow-xl'
                }
                ${isSliding ? 'scale-105' : ''}
                ${isAnimating ? 'animate-bounce' : ''}
              `}
              style={{ 
                transform: `translateX(${slideProgress * 3.7}px)`,
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

            {/* Success Animation - Top layer */}
            {showSuccess && (
              <div className="absolute inset-0 flex items-center justify-center z-30">
                <div className="animate-ping absolute w-16 h-16 bg-green-400 rounded-full opacity-75"></div>
                <div className="relative w-12 h-12 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            )}
          </div>

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
                <span>Auto-resetting in 30 seconds...</span>
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
    </>
  );
};