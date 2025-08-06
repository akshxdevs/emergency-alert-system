"use client";

import { motion } from "framer-motion";
import { LandingPage } from "./Components/LandingPage/LandingPage";

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <LandingPage/>
    </motion.div>
  );
}
