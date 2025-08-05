import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BottomNavigationProps {
  showAlertModel: boolean;
  isNotificationAvailable: boolean;
  lat: number | null;
  lng: number | null;
  isMapDragging: boolean;
  onLocationButtonClick: () => void;
  onClearMarker: () => void;
  onClearLocation: () => void;
}

const BottomNavigation = memo(({
  showAlertModel,
  isNotificationAvailable,
  lat,
  lng,
  isMapDragging,
  onLocationButtonClick,
  onClearMarker,
  onClearLocation
}: BottomNavigationProps) => {
  return (
    <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-[300px] bg-white/20 backdrop-blur-md text-zinc-900 shadow-lg border border-gray-200 rounded-full z-40">
      {showAlertModel && (
        <div className="px-6 py-1">
          <div className="flex justify-between items-center">
            {/* Notification Button */}
            <button className="group relative p-3 rounded-full bg-white/50 hover:bg-blue-50/80 transition-all duration-300 transform hover:scale-105 hover:shadow-md border border-gray-200/50">
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors duration-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                </svg>
                {isNotificationAvailable &&(
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                )}
              </div>
            </button>

            {/* Home Button */}
            <button className="group relative p-3 rounded-full bg-blue-50/80 hover:bg-blue-100/90 transition-all duration-300 transform hover:scale-105 hover:shadow-md border border-blue-200/50">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-600 group-hover:text-blue-700 transition-colors duration-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
            </button>

            {/* Location/Relocate Button */}
            <button 
              onClick={onLocationButtonClick}
              className="group relative p-3 rounded-full bg-blue-500 hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 hover:shadow-md border border-blue-400 shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white group-hover:text-white transition-colors duration-300">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                <circle cx="12" cy="12" r="3" fill="currentColor"/>
                <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>

            {/* Clear Marker Button */}
            {(lat || lng) && (
              <button
                onClick={onClearMarker}
                className={`group relative p-3 rounded-full bg-gray-50/80 hover:bg-gray-100/90 transition-all duration-300 transform hover:scale-105 hover:shadow-md border border-gray-200/50 ${
                  isMapDragging ? 'animate-shake' : ''
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            
            {/* Clear Location Button */}
            {(lat || lng) && (
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClearLocation}
                className="group relative p-3 rounded-full bg-red-50/80 hover:bg-red-100/90 transition-all duration-300 transform hover:scale-105 hover:shadow-md border border-red-200/50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-600 group-hover:text-red-700 transition-colors duration-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </motion.button>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

BottomNavigation.displayName = 'BottomNavigation';

export default BottomNavigation; 