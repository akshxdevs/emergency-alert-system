import React, { useEffect, useState } from "react";
type ThreatAvailable = {
  threat:boolean
}
export const AlertIndicator:React.FC<ThreatAvailable> = ({threat}) => {
  const [isThreatAvailable, setThreatAvailable] = useState(false);
  useEffect(()=>{
    if (threat) {
      setThreatAvailable(threat)
    }
  },[threat,isThreatAvailable])
  return (
    <div>
      <div className="flex justify-center items-center py-10">
        <button className="group relative p-3 rounded-full bg-red-50/80 hover:bg-red-100/90 transition-all duration-300 transform hover:scale-105 hover:shadow-md border border-red-200/50">
          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-32 h-32 text-red-600 group-hover:text-red-700 transition-colors duration-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
            {isThreatAvailable ? 
                (
                    <div className="absolute inset-0 w-32 h-32 border-2 border-red-400 rounded-full animate-ping opacity-75"></div>

                ) : (
                    <div className="absolute"></div>
            )}
          </div>
        </button>
      </div>
    </div>
  );
};
