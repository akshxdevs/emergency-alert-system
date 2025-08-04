"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function LoginLandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1117] px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-[#151922] p-8 rounded-3xl shadow-md w-full max-w-md text-white text-center"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Emergency Alert System</h1>
          <p className="text-gray-400">Choose your login type</p>
        </div>

        {/* Login Options */}
        <div className="space-y-4">
          {/* Civilian Login */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/login/user")}
            className="w-full p-6 rounded-xl border-2 border-blue-500/30 hover:border-blue-500/50 transition-all duration-300 bg-blue-500/10 hover:bg-blue-500/20"
          >
            <div className="flex items-center justify-center space-x-3">
              <div className="text-2xl">👤</div>
              <div className="text-left">
                <h3 className="font-semibold text-lg">Civilian</h3>
                <p className="text-gray-400 text-sm">Report emergencies & get alerts</p>
              </div>
            </div>
          </motion.button>

          {/* Admin Login */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/login/admin")}
            className="w-full p-6 rounded-xl border-2 border-red-500/30 hover:border-red-500/50 transition-all duration-300 bg-red-500/10 hover:bg-red-500/20"
          >
            <div className="flex items-center justify-center space-x-3">
              <div className="text-2xl">🚨</div>
              <div className="text-left">
                <h3 className="font-semibold text-lg">Emergency Response</h3>
                <p className="text-gray-400 text-sm">Police, Fire, Medical Staff</p>
              </div>
            </div>
          </motion.button>
        </div>

        {/* Info */}
        <div className="mt-8 p-4 bg-gray-800/50 rounded-lg">
          <h3 className="font-semibold mb-2">About This System</h3>
          <p className="text-gray-400 text-sm">
            Report emergencies, track incidents, and coordinate emergency responses in real-time.
          </p>
        </div>
      </motion.div>
    </div>
  );
} 