"use client";
import { motion } from "framer-motion";

export const AkshxFooter = () => {
    return (
        <motion.div 
            className="font-martianmono relative w-full py-8 md:py-12 bg-white border-t border-slate-100"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
        >
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                <div className="flex flex-col justify-center items-center text-center gap-6">
                    <motion.footer 
                        className="w-full"
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex flex-col justify-between items-center gap-6">
                            <motion.div 
                                className="flex flex-wrap justify-center gap-6 md:gap-8 text-sm md:text-base"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                            >
                                {[
                                    { text: "Privacy Policy", href: "#" },
                                    { text: "Terms of Use", href: "#" },
                                    { text: "Contact", href: "#" }
                                ].map((link, idx) => (
                                    <motion.a 
                                        key={link.text}
                                        href={link.href} 
                                        className="hover:text-emerald-600 transition-colors relative group text-slate-600"
                                        whileHover={{ scale: 1.02 }}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.4, delay: 0.6 + idx * 0.1 }}
                                    >
                                        {link.text}
                                        <motion.div
                                            className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 group-hover:w-full transition-all duration-300"
                                        />
                                    </motion.a>
                                ))}
                            </motion.div>
                            <motion.div 
                                className="text-xs md:text-sm text-slate-500 text-center"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.8 }}
                            >
                                © {new Date().getFullYear()}{" "}
                                <motion.a 
                                    href="https://x.com/akshxdevs" 
                                    className="text-slate-700 font-medium hover:text-emerald-600 hover:underline relative group"
                                    whileHover={{ scale: 1.02 }}
                                >
                                    akshxdevs
                                    <motion.div
                                        className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 group-hover:w-full transition-all duration-300"
                                    />
                                </motion.a>
                                . All rights reserved.
                            </motion.div>
                        </div>
                    </motion.footer>
                </div>
            </div>
        </motion.div>
    );
}