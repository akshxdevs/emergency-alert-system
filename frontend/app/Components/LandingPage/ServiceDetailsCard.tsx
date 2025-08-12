"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

// Typing Animation Component
const TypewriterText = ({ text, className }: { text: string; className: string }) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 100); // Adjust speed here (lower = faster)

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return (
    <motion.h1 
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      whileHover={{ scale: 1.02 }}
    >
      {displayText}
      {currentIndex < text.length && (
        <motion.span
          className="inline-block w-0.5 h-6 md:h-8 lg:h-10 bg-orange-500 ml-1 animate-pulse"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 0.5 }}
        />
      )}
    </motion.h1>
  );
};

export const ServiceDetailsCard = () => {
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);

    const cards = [
        {
            img: "https://img.icons8.com/ios-filled/50/fire-alarm-button.png",
            title: "Fire Alerts",
            desc: "Fires escalate in seconds. Our system provides instant fire alerts sourced from trusted authorities and user reports, helping you act before it becomes uncontrollable. Integrated with live maps and evacuation guides for quick action."
        },
        {
            img: "https://img.icons8.com/dotty/80/tonometer.png",
            title: "Medical Alerts",
            desc: "Whether it's an accident, cardiac arrest, or health crisis, immediate response is critical. Our alerts connect you with nearby hospitals, emergency contacts, and ambulance services, ensuring you're never alone in a crisis."
        },
        {
            img: "https://img.icons8.com/external-line-icons-vinzence-studio/64/external-criminal-erotic-stuff-line-icons-vinzence-studio.png",
            title: "Police Alerts",
            desc: "From theft to civil unrest, being informed about nearby police activity helps you avoid danger. Our system filters verified alerts from law enforcement, enabling civilians to stay safe without spreading panic."
        },
        {
            img: "https://img.icons8.com/pulsar-line/50/--bloodbag.png",
            title: "Blood Donation",
            desc: "Connecting donors with patients in critical need, our upcoming blood donation alert system will make it easier to save lives through timely and location-based notifications. Coming Soon! Stay tuned as we prepare to launch this life-saving feature."
        }
    ];

    return (
        <motion.div 
            className="font-martianmono relative w-full py-12 sm:py-16 md:py-20 lg:py-24 bg-slate-50"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
                <div className="flex flex-col justify-center items-center text-center gap-6 sm:gap-8 md:gap-12">
                    <TypewriterText 
                        text="Why Fire, Medical, and Police Alerts in One System?"
                        className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold text-slate-900"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 w-full">
                        {cards.map((card, idx) => (
                            <motion.div
                                key={idx}
                                className="flex flex-col justify-start items-center p-4 sm:p-6 rounded-lg bg-white w-full h-auto min-h-[280px] sm:min-h-[320px] md:min-h-[350px] text-left overflow-hidden shadow-sm hover:shadow-md relative group cursor-pointer transition-all duration-300"
                                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.6 + idx * 0.1 }}
                                whileHover={{ 
                                    scale: 1.02,
                                    y: -5,
                                    boxShadow: "0 10px 30px rgba(254, 215, 170, 0.25)"
                                }}
                                onMouseEnter={() => setHoveredCard(idx)}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                {/* Subtle Background */}
                                <motion.div
                                    className="absolute inset-0 bg-orange-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                />
                                
                                {/* Subtle Border */}
                                <motion.div
                                    className="absolute inset-0 rounded-lg bg-orange-200"
                                />
                                
                                <div className="flex flex-col justify-start items-center relative z-10 h-full">
                                    <motion.div
                                        className="mb-3 sm:mb-4"
                                        animate={hoveredCard === idx ? {
                                            scale: [1, 1.2, 1],
                                            rotate: [0, 5, -5, 0]
                                        } : {}}
                                        transition={{ duration: 0.8, repeat: hoveredCard === idx ? Infinity : 0 }}
                                    >
                                        <motion.img
                                            width="40"
                                            height="40"
                                            src={card.img}
                                            alt={card.title}
                                            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-cover rounded-full drop-shadow-sm"
                                            whileHover={{ filter: "brightness(1.1)" }}
                                        />
                                    </motion.div>
                                    
                                    <motion.h1 
                                        className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3 text-center text-slate-900"
                                        animate={{ y: hoveredCard === idx ? -2 : 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {card.title}
                                    </motion.h1>
                                    
                                    <motion.p 
                                        className="text-xs sm:text-sm md:text-base text-center leading-relaxed text-slate-600 flex-1 px-2 sm:px-4"
                                        animate={{ 
                                            y: hoveredCard === idx ? -2 : 0,
                                            color: hoveredCard === idx ? "#475569" : "#64748b"
                                        }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {card.desc}
                                    </motion.p>
                                </div>
                                
                                {/* Subtle Particle Effect on Hover - Hidden on mobile for performance */}
                                {hoveredCard === idx && (
                                    <div className="absolute inset-0 pointer-events-none hidden sm:block">
                                        {[...Array(4)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                className="absolute w-1 h-1 bg-orange-200 rounded-full"
                                                initial={{ 
                                                    x: "50%", 
                                                    y: "50%", 
                                                    opacity: 0,
                                                    scale: 0
                                                }}
                                                animate={{ 
                                                    x: `${20 + Math.random() * 60}%`, 
                                                    y: `${20 + Math.random() * 60}%`, 
                                                    opacity: [0, 1, 0],
                                                    scale: [0, 1, 0]
                                                }}
                                                transition={{ 
                                                    duration: 1.5,
                                                    delay: i * 0.1,
                                                    repeat: Infinity,
                                                    repeatDelay: 2
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
                                
                                {/* Subtle Glow Effect */}
                                <motion.div
                                    className="absolute inset-0 bg-orange-200/20 rounded-lg blur-lg opacity-0"
                                    animate={{ opacity: hoveredCard === idx ? 0.1 : 0 }}
                                    transition={{ duration: 0.3 }}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
