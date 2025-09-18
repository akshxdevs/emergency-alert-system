"use client";
import { motion } from "framer-motion";
import { AkshxFooter } from "../Reusables/AkshxFooter"
import { HeaderCard } from "./HeaderCard"
import { ServiceDetailsCard } from "./ServiceDetailsCard"
import { ServiceListCard } from "./ServiceListCard"
import ReportsDisplayBanner from "./ReportsDisplayBanner";
import { AppBarLP } from "./AppBarLP";

export const LandingPage = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative min-h-screen"
        >
            <AppBarLP/>
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
                    className="mt-10 sm:py-12 md:py-1"
                >
                    <ReportsDisplayBanner/>
                </motion.div>
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="py-8 sm:py-10 md:py-12"
                >
                    <ServiceListCard/>
                </motion.div>
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="py-2"
                >
                    <ServiceDetailsCard/>
                </motion.div>
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="mt-2"
                >
                    <AkshxFooter/>
                </motion.div>
            </div>
        </motion.div>
    );
}