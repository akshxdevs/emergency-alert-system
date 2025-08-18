"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Image from "next/image";
import { BACKEND_URL } from "../../../config";

const roles = [
  {
    id: "CIVILIAN",
    name: "Civilian",
    description: "Report emergencies and get alerts",
    icon: "👤",
    color: "bg-blue-500",
    hoverColor: "hover:bg-blue-600",
  },
  {
    id: "POLICE",
    name: "Police Officer",
    description: "Respond to crime and security emergencies",
    icon: "👮",
    color: "bg-blue-600",
    hoverColor: "hover:bg-blue-700",
  },
  {
    id: "FIRE",
    name: "Firefighter",
    description: "Respond to fire and rescue emergencies",
    icon: "🚒",
    color: "bg-red-500",
    hoverColor: "hover:bg-red-600",
  },
  {
    id: "MEDICAL",
    name: "Medical Staff",
    description: "Respond to medical emergencies",
    icon: "🏥",
    color: "bg-green-500",
    hoverColor: "hover:bg-green-600",
  },
];

export default function RoleSelectionPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const email = searchParams.get("email");
  const name = searchParams.get("name");
  const image = searchParams.get("image");

  const handleRoleSelection = async () => {
    if (!selectedRole || !email || !name) {
      setError("Please select a role");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${BACKEND_URL}/user/google-signup`, {
        email,
        name,
        image,
        role: selectedRole,
      });

      if (response.data.user) {
        // Redirect based on role
        if (selectedRole === "CIVILIAN") {
          router.push(`/home/${response.data.user.id}`);
        } else {
          router.push(`/dashboard/${response.data.user.id}`);
        }
      }
    } catch (error: unknown) {
      console.error("Role selection error:", error);
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (!email || !name) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f1117] px-4">
        <div className="bg-[#151922] p-8 rounded-3xl shadow-md w-full max-w-md text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Invalid Access</h1>
          <p className="text-gray-400">Please sign in with Google to continue.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1117] px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-[#151922] p-8 rounded-3xl shadow-md w-full max-w-2xl text-white"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            {image && (
              <Image
                src={image}
                alt="Profile"
                width={64}
                height={64}
                className="w-16 h-16 rounded-full mr-4"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold">Welcome, {name}!</h1>
              <p className="text-gray-400">Choose your role to continue</p>
            </div>
          </div>
        </div>

        {/* Role Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {roles.map((role) => (
            <motion.div
              key={role.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                selectedRole === role.id
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-gray-600 hover:border-gray-500"
              }`}
              onClick={() => setSelectedRole(role.id)}
            >
              <div className="flex items-center space-x-4">
                <div className="text-3xl">{role.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{role.name}</h3>
                  <p className="text-gray-400 text-sm">{role.description}</p>
                </div>
                {selectedRole === role.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-center"
          >
            {error}
          </motion.div>
        )}

        {/* Continue Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={!selectedRole || isLoading}
          onClick={handleRoleSelection}
          className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
            selectedRole && !isLoading
              ? "bg-blue-500 hover:bg-blue-600 text-white"
              : "bg-gray-600 text-gray-400 cursor-not-allowed"
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Creating Account...
            </div>
          ) : (
            "Continue"
          )}
        </motion.button>

        {/* Back to Login */}
        <div className="text-center mt-6">
          <button
            onClick={() => router.push("/login/user")}
            className="text-gray-400 hover:text-white transition-colors duration-300"
          >
            ← Back to Login
          </button>
        </div>
      </motion.div>
    </div>
  );
} 