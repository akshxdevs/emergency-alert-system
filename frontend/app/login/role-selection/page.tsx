"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface RoleOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

const roleOptions: RoleOption[] = [
  {
    id: "CIVILIAN",
    name: "Civilian",
    description: "Report emergencies and receive alerts",
    icon: "👤",
    color: "from-gray-500 to-gray-600"
  },
  {
    id: "POLICE",
    name: "Police Officer",
    description: "Respond to crime and accident reports",
    icon: "🚔",
    color: "from-blue-500 to-blue-600"
  },
  {
    id: "FIRE",
    name: "Firefighter",
    description: "Respond to fire emergencies",
    icon: "🚒",
    color: "from-red-500 to-red-600"
  },
  {
    id: "MEDICAL",
    name: "Medical Personnel",
    description: "Respond to medical emergencies",
    icon: "🚑",
    color: "from-emerald-500 to-emerald-600"
  }
];

export default function RoleSelectionPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRoleSelection = async (roleId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/role-selection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: roleId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to update role");
        return;
      }

      router.push(`/dashboard/${roleId.toLowerCase()}/${data.userId}`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br bg-black relative overflow-hidden">
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-6"
        >
          <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">
            Select Your Role
          </h1>
          <p className="text-gray-400 text-sm">
            Choose your role to continue
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl w-full max-w-md p-6"
        >
          <div className="space-y-4">
            {roleOptions.map((role) => (
              <motion.button
                key={role.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleRoleSelection(role.id)}
                disabled={isLoading}
                className={`w-full p-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 bg-gradient-to-r ${role.color} text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{role.icon}</span>
                  <div className="text-left">
                    <h3 className="font-semibold">{role.name}</h3>
                    <p className="text-sm opacity-90">{role.description}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-center"
            >
              <div className="flex items-center justify-center space-x-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"
                />
                <span className="text-blue-600">Updating role...</span>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
} 