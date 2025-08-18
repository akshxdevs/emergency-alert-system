"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { BACKEND_URL } from "../../../config";

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

export default function GoogleCallbackPage() {
  const { data: session, status } = useSession();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/signup");
      return;
    }

    // Check if user already has a role
    if (session.user?.role) {
      const userId = session.user.id;
      const userRole = session.user.role;
      
      if (userRole === "CIVILIAN") {
        router.push(`/home/${userId}`);
      } else {
        router.push(`/dashboard/${userRole.toLowerCase()}/${userId}`);
      }
      return;
    }
  }, [session, status, router]);

  const handleRoleSelection = async (roleId: string) => {
    if (!session?.user?.email) {
      setError("Session not found");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BACKEND_URL}/user/google-signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session.user.email,
          name: session.user.name || session.user.email,
          image: session.user.image,
          role: roleId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to complete registration");
        return;
      }

      // Redirect based on role
      const userId = data.user.id;
      const userRole = data.user.role;
      
      if (userRole === "CIVILIAN") {
        router.push(`/home/${userId}`);
      } else {
        router.push(`/dashboard/${userRole.toLowerCase()}/${userId}`);
      }
    } catch (error) {
      console.error("Google signup error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/30"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-4">
            {session.user?.image && (
              <Image
                src={session.user.image}
                alt="Profile"
                width={64}
                height={64}
                className="w-16 h-16 rounded-full mx-auto border-4 border-blue-200"
              />
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome, {session.user?.name || session.user?.email}!
          </h1>
          <p className="text-gray-600">
            Please select your role to complete your registration
          </p>
        </div>

        {/* Role Selection */}
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

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Loading State */}
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
              <span className="text-blue-600">Completing registration...</span>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
} 