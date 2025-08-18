"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useTheme } from "@/app/contexts/ThemeContext";
import Image from "next/image";

export const ServiceListCard = () => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Use a safe theme value that won't cause hydration issues
    const safeTheme = mounted ? theme : 'light';

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

    const emergencyImages = [
        {
            src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbwHUpZhMHkZMp2rrx8VScgYlqMkjh3jEEXw&s",
            alt: "Emergency Services",
            title: "Emergency Response Team"
        },
        {
            src: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&h=400&fit=crop",
            alt: "Medical Emergency",
            title: "Medical Response"
        },
        {
            src: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&h=400&fit=crop",
            alt: "Fire Department",
            title: "Fire Safety"
        },
        {
            src: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=500&h=400&fit=crop",
            alt: "Police Department",
            title: "Law Enforcement"
        },
        {
            src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=400&fit=crop",
            alt: "Ambulance Service",
            title: "Emergency Transport"
        },
        {
            src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=400&fit=crop",
            alt: "Emergency Communication",
            title: "Alert System"
        }
    ];

    // Auto-rotate images every 4 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % emergencyImages.length);
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    // Container animation variants for stacking effect
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3, // Delay between each service
                delayChildren: 0.5,   // Initial delay before first service
            }
        }
    };

    // Individual service animation variants
    const serviceVariants = {
        hidden: { 
            opacity: 0, 
            x: -100, 
            y: 50,
            scale: 0.8,
            rotateY: -15
        },
        visible: { 
            opacity: 1, 
            x: 0, 
            y: 0,
            scale: 1,
            rotateY: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut" as const,
                type: "spring" as const,
                stiffness: 100,
                damping: 15
            }
        }
    };

    return (
        <motion.div 
            className={`font-martianmono relative w-full transition-colors duration-300 ${
                safeTheme === 'dark' ? 'bg-black' : 'bg-white'
            }`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
                <div className="flex flex-col justify-center items-center text-center gap-6 sm:gap-8 md:gap-12">
                    <motion.h1 
                        className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold transition-colors duration-300 ${
                            safeTheme === 'dark' ? 'text-white' : 'text-slate-900'
                        }`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        whileHover={{ scale: 1.02 }}
                    >
                        Services
                    </motion.h1>
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-8 sm:gap-10 lg:gap-12 w-full">
                        <motion.div 
                            className="flex flex-col gap-4 sm:gap-6 md:gap-8 w-full lg:w-fit"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {services.map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    className={`flex justify-start items-center gap-3 sm:gap-4 border rounded-lg px-4 sm:px-6 py-3 sm:py-4 w-full shadow-sm hover:shadow-md relative overflow-hidden group cursor-pointer transition-all duration-300 ${
                                        safeTheme === 'dark' 
                                            ? 'bg-gray-800 border-gray-600' 
                                            : 'bg-white border-slate-200'
                                    }`}
                                    variants={serviceVariants}
                                    whileHover={{ 
                                        scale: 1.02,
                                        y: -5,
                                        boxShadow: "0 8px 25px rgba(254, 215, 170, 0.25)",
                                        transition: { duration: 0.3 }
                                    }}
                                    onMouseEnter={() => setHoveredIndex(idx)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                >
                                    {/* Subtle Background */}
                                    <motion.div
                                        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                                            safeTheme === 'dark' 
                                                ? 'bg-orange-100'
                                                : 'bg-orange-100'
                                        }`}
                                    />
                                    
                                    {/* Subtle Border */}
                                    <motion.div
                                        className={`absolute inset-0 rounded-lg ${
                                            safeTheme === 'dark' 
                                                ? 'bg-orange-200' 
                                                : 'bg-orange-200'
                                        }`}
                                    />
                                    
                                    <div className="flex items-center gap-3 sm:gap-4 relative z-10">
                                        <motion.div
                                            animate={hoveredIndex === idx ? {
                                                scale: [1, 1.1, 1],
                                                rotate: [0, 5, -5, 0]
                                            } : {}}
                                            transition={{ duration: 0.6, repeat: hoveredIndex === idx ? Infinity : 0 }}
                                        >
                                            <Image 
                                                width={24} 
                                                height={24} 
                                                src={item.icon} 
                                                alt="icon" 
                                                className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 drop-shadow-sm"
                                            />
                                        </motion.div>
                                        <motion.h1 
                                            className={`text-xs sm:text-sm md:text-base lg:text-lg text-left leading-relaxed font-medium transition-colors duration-300 ${
                                                safeTheme === 'dark' ? 'text-gray-800' : 'text-slate-900'
                                            }`}
                                            animate={{ x: hoveredIndex === idx ? 3 : 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {item.text}
                                        </motion.h1>
                                    </div>
                                    
                                    {/* Subtle Particle Effect on Hover - Hidden on mobile for performance */}
                                    {hoveredIndex === idx && (
                                        <div className="absolute inset-0 pointer-events-none hidden sm:block">
                                            {[...Array(3)].map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    className={`absolute w-1 h-1 rounded-full ${
                                                        safeTheme === 'dark' 
                                                            ? 'bg-orange-600' 
                                                            : 'bg-orange-200'
                                                    }`}
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
                        </motion.div>
                        <motion.div
                            className="w-full lg:w-1/2 flex justify-center"
                            initial={{ opacity: 0, scale: 0.8, x: 100 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            transition={{ 
                                duration: 1.2, 
                                delay: 1.5, // Delay to start after services stack
                                ease: "easeOut",
                                type: "spring",
                                stiffness: 80,
                                damping: 20
                            }}
                            whileHover={{ scale: 1.02 }}
                        >
                            {/* Image Slider Container */}
                            <div className="relative h-48 sm:h-56 md:h-64 lg:h-80 xl:h-96 w-full max-w-sm sm:max-w-md overflow-hidden rounded-lg shadow-lg">
                                {/* Image Slides */}
                                {emergencyImages.map((image, index) => (
                                    <motion.div
                                        key={index}
                                        className="absolute inset-0 w-full h-full"
                                        initial={{ opacity: 0, scale: 1.1 }}
                                        animate={{ 
                                            opacity: currentImageIndex === index ? 1 : 0,
                                            scale: currentImageIndex === index ? 1 : 1.1
                                        }}
                                        transition={{ 
                                            duration: 0.8,
                                            ease: "easeInOut"
                                        }}
                                    >
                                        <Image
                                            src={image.src}
                                            alt={image.alt}
                                            width={500}
                                            height={400}
                                            className="w-full h-full object-cover"
                                        />
                                    </motion.div>
                                ))}
                                
                                {/* Navigation Dots */}
                                <div className="absolute bottom-3 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1.5 sm:gap-2">
                                    {emergencyImages.map((_, index) => (
                                        <motion.button
                                            key={index}
                                            className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${
                                                currentImageIndex === index 
                                                    ? 'bg-white scale-125' 
                                                    : 'bg-white/50 hover:bg-white/80'
                                            }`}
                                            onClick={() => setCurrentImageIndex(index)}
                                            whileHover={{ scale: 1.2 }}
                                            whileTap={{ scale: 0.9 }}
                                        />
                                    ))}
                                </div>
                                
                                {/* Progress Bar */}
                                <motion.div
                                    className="absolute bottom-0 left-0 h-0.5 bg-white/80"
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ 
                                        duration: 4,
                                        ease: "linear",
                                        repeat: Infinity
                                    }}
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
