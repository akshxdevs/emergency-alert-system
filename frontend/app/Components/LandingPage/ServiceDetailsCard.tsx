"use client";
import { motion } from "framer-motion";
import { useState } from "react";

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
            className="font-martianmono relative w-full py-16 md:py-20 lg:py-24 bg-slate-50"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
        >
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                <div className="flex flex-col justify-center items-center text-center gap-8 md:gap-12">
                    <motion.h1 
                        className="text-2xl md:text-3xl lg:text-4xl font-semibold text-slate-800"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        whileHover={{ scale: 1.02 }}
                    >
                        Why Fire, Medical, and Police Alerts in One System?
                    </motion.h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 w-full">
                        {cards.map((card, idx) => (
                            <motion.div
                                key={idx}
                                className="flex flex-col justify-start items-center p-6 rounded-lg bg-white w-full h-auto min-h-[320px] text-left overflow-hidden shadow-sm hover:shadow-md relative group cursor-pointer transition-all duration-300"
                                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.6 + idx * 0.1 }}
                                whileHover={{ 
                                    scale: 1.02,
                                    y: -5,
                                    boxShadow: "0 10px 30px rgba(16, 185, 129, 0.15)"
                                }}
                                onMouseEnter={() => setHoveredCard(idx)}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                {/* Subtle Background */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                />
                                
                                {/* Subtle Border */}
                                <motion.div
                                    className="absolute inset-0 rounded-lg"
                                    style={{
                                        background: `linear-gradient(45deg, #fed7aa, #fdba74, #fed7aa)`,
                                        backgroundSize: "400% 400%",
                                    }}
                                    animate={{
                                        backgroundPosition: hoveredCard === idx ? ["0% 0%", "100% 100%", "0% 0%"] : ["0% 0%"],
                                    }}
                                    transition={{
                                        duration: hoveredCard === idx ? 2 : 0,
                                        repeat: hoveredCard === idx ? Infinity : 0,
                                        ease: "linear",
                                    }}
                                />
                                
                                <div className="flex flex-col justify-start items-center relative z-10 h-full">
                                    <motion.div
                                        className="mb-4"
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
                                            className="object-cover rounded-full drop-shadow-sm"
                                            whileHover={{ filter: "brightness(1.1)" }}
                                        />
                                    </motion.div>
                                    
                                    <motion.h1 
                                        className="text-lg font-semibold mb-3 text-center text-slate-800"
                                        animate={{ y: hoveredCard === idx ? -2 : 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {card.title}
                                    </motion.h1>
                                    
                                    <motion.p 
                                        className="text-sm text-center leading-relaxed text-slate-600 flex-1"
                                        animate={{ 
                                            y: hoveredCard === idx ? -2 : 0,
                                            color: hoveredCard === idx ? "#475569" : "#64748b"
                                        }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {card.desc}
                                    </motion.p>
                                </div>
                                
                                {/* Subtle Particle Effect on Hover */}
                                {hoveredCard === idx && (
                                    <div className="absolute inset-0 pointer-events-none">
                                        {[...Array(4)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                className="absolute w-1 h-1 bg-emerald-400 rounded-full"
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
                                    className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-teal-400/10 rounded-lg blur-lg opacity-0"
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
