"use client";
import { motion } from "framer-motion";
import { useState } from "react";

export const ServiceListCard = () => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const services = [
        {
            icon: "https://img.icons8.com/material-outlined/24/doctors-bag.png",
            text: "Receive alerts about accidents, injuries, and health-related crises in your area."
        },
        {
            icon: "https://img.icons8.com/ios/50/policeman-male.png",
            text: "Stay informed about law enforcement activity and public safety concerns."
        },
        {
            icon: "https://img.icons8.com/glyph-neue/64/fire-element.png",
            text: "Get instant notifications about nearby fire hazards and outbreaks."
        }
    ];

    return (
        <motion.div 
            className="font-martianmono relative w-full py-16 md:py-20 lg:py-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
        >
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                <div className="flex flex-col justify-center items-center text-center gap-8 md:gap-12">
                    <motion.h1 
                        className="text-2xl md:text-3xl lg:text-4xl font-semibold text-slate-900"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        whileHover={{ scale: 1.02 }}
                    >
                        Services
                    </motion.h1>
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-8 lg:gap-12 w-full">
                        <div className="flex flex-col gap-6 md:gap-8 w-full lg:w-1/2">
                            {services.map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    className="flex justify-start items-center gap-4 border border-slate-200 rounded-lg px-6 py-4 w-full bg-white shadow-sm hover:shadow-md relative overflow-hidden group cursor-pointer transition-all duration-300"
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 0.6 + idx * 0.1 }}
                                    whileHover={{ 
                                        scale: 1.01,
                                        boxShadow: "0 8px 25px rgba(254, 215, 170, 0.25)",
                                        y: -2
                                    }}
                                    onMouseEnter={() => setHoveredIndex(idx)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                >
                                    {/* Subtle Background */}
                                    <motion.div
                                        className="absolute inset-0 bg-orange-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    />
                                    
                                    {/* Subtle Border */}
                                    <motion.div
                                        className="absolute inset-0 rounded-lg bg-orange-200"
                                    />
                                    
                                    <div className="flex items-center gap-4 relative z-10">
                                        <motion.div
                                            animate={hoveredIndex === idx ? {
                                                scale: [1, 1.1, 1],
                                                rotate: [0, 5, -5, 0]
                                            } : {}}
                                            transition={{ duration: 0.6, repeat: hoveredIndex === idx ? Infinity : 0 }}
                                        >
                                            <img 
                                                width="24" 
                                                height="24" 
                                                src={item.icon} 
                                                alt="icon" 
                                                className="drop-shadow-sm"
                                            />
                                        </motion.div>
                                        <motion.h1 
                                            className="text-sm md:text-base text-left leading-relaxed font-medium text-slate-900"
                                            animate={{ x: hoveredIndex === idx ? 3 : 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {item.text}
                                        </motion.h1>
                                    </div>
                                    
                                    {/* Subtle Particle Effect on Hover */}
                                    {hoveredIndex === idx && (
                                        <div className="absolute inset-0 pointer-events-none">
                                            {[...Array(3)].map((_, i) => (
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
                                                        duration: 1.2,
                                                        delay: i * 0.1,
                                                        repeat: Infinity,
                                                        repeatDelay: 1.5
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                        <motion.div
                            className="w-full lg:w-1/2 flex justify-center"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                            whileHover={{ scale: 1.02 }}
                        >
                            <motion.img
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbwHUpZhMHkZMp2rrx8VScgYlqMkjh3jEEXw&s"
                                alt="service"
                                className="h-64 md:h-80 lg:h-96 w-full max-w-md object-cover rounded-lg shadow-lg"
                                whileHover={{ 
                                    boxShadow: "0 15px 35px rgba(0, 0, 0, 0.2)",
                                    filter: "brightness(1.05)"
                                }}
                                transition={{ duration: 0.3 }}
                            />
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
