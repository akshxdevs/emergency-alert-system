"use client";
import { motion } from "framer-motion";
import { AkshxFooter } from "../Reusables/AkshxFooter"
import { AppBar } from "../Reusables/AppBar"
import { HeaderCard } from "./HeaderCard"
import { ServiceDetailsCard } from "./ServiceDetailsCard"
import { ServiceListCard } from "./ServiceListCard"

export const LandingPage = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative min-h-screen"
        >
            <AppBar/>
            <div className="relative">
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <HeaderCard/>
                </motion.div>
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    <ServiceListCard/>
                </motion.div>
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <ServiceDetailsCard/>
                </motion.div>
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                >
                    <AkshxFooter/>
                </motion.div>
            </div>
        </motion.div>
    );
}