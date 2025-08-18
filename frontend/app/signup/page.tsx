"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import Image from "next/image";
import { BACKEND_URL } from "../../config";

interface RoleOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  hoverGradient: string;
}

const roleOptions: RoleOption[] = [
  {
    id: "CIVILIAN",
    name: "Civilian",
    description: "Report emergencies and receive alerts",
    icon: "👤",
    color: "from-gray-500 to-gray-600",
    gradient: "from-gray-400 to-gray-600",
    hoverGradient: "from-gray-300 to-gray-500",
  },
  {
    id: "POLICE",
    name: "Police Officer",
    description: "Respond to crime and accident reports",
    icon: "🚔",
    color: "from-blue-500 to-blue-600",
    gradient: "from-blue-400 to-blue-600",
    hoverGradient: "from-blue-300 to-blue-500",
  },
  {
    id: "FIRE",
    name: "Firefighter",
    description: "Respond to fire emergencies",
    icon: "🚒",
    color: "from-red-500 to-red-600",
    gradient: "from-red-400 to-red-600",
    hoverGradient: "from-red-300 to-red-500",
  },
  {
    id: "MEDICAL",
    name: "Medical Personnel",
    description: "Respond to medical emergencies",
    icon: "🚑",
    color: "from-emerald-500 to-emerald-600",
    gradient: "from-emerald-400 to-emerald-600",
    hoverGradient: "from-emerald-300 to-emerald-500",
  },
];

export default function SignupPage() {
  const [step, setStep] = useState<"role" | "signup">("role");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState<string | null>(null);
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);
  const router = useRouter();

  const handleRoleSelection = (roleId: string) => {
    setSelectedRole(roleId);
    setStep("signup");
  };

  const handleGoogleSignup = async () => {
    if (!selectedRole) {
      setError("Please select a role first");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Store selected role in localStorage for Google auth callback
      localStorage.setItem("selectedRole", selectedRole);

      await signIn("google", {
        callbackUrl: "/signup/google-callback",
        redirect: false,
      });
    } catch (error) {
      console.error("Google signup error:", error);
      setError("Failed to sign up with Google");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/user/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          role: selectedRole,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Signup failed");
        return;
      }

      // Auto login after successful signup
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Signup successful but login failed. Please try logging in.");
        return;
      }

      if (result?.ok) {
        setTimeout(async () => {
          const session = await getSession();
          const userId = session?.user?.id;
          const userRole = session?.user?.role;

          if (userId) {
            if (userRole === "CIVILIAN") {
              router.push(`/home/${userId}`);
            } else {
              router.push(
                `/dashboard/${String(userRole).toLowerCase()}/${userId}`
              );
            }
          } else {
            setError("User ID not found in session");
          }
        }, 1000);
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    if (step === "signup") {
      setStep("role");
      setSelectedRole("");
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-6"
        >
          <div className="w-12 h-12 mx-auto flex items-center justify-center shadow-lg">
            <Image
              width={32}
              height={32}
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
              src="https://img.icons8.com/color-pixels/32/siren.png"
              alt="siren"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">
            Emergency Response
          </h1>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl w-full max-w-sm p-6"
        >
          {/* Back Button */}
          {step === "signup" && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={goBack}
              className="mb-4 text-gray-300 hover:text-white text-xs font-medium flex items-center space-x-2 transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span>Back to role selection</span>
            </motion.button>
          )}

          {/* Role Selection Step */}
          {step === "role" && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-3 px-5"
            >
              <p className="text-gray-300 text-xs mb-4 text-center">
                Choose your role in the emergency response system
              </p>

              {roleOptions.map((role, index) => (
                <motion.button
                  key={role.id}
                  initial={{ opacity: 0, x: -20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ 
                    delay: index * 0.1,
                    duration: 0.6,
                    ease: [0.25, 0.46, 0.45, 0.94] // Custom easing curve
                  }}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
                    y: -2,
                    transition: {
                      duration: 0.3,
                      ease: "easeOut"
                    }
                  }}
                  whileTap={{ 
                    scale: 0.98,
                    transition: {
                      duration: 0.1,
                      ease: "easeIn"
                    }
                  }}
                  onHoverStart={() => setHoveredRole(role.id)}
                  onHoverEnd={() => setHoveredRole(null)}
                  onClick={() => handleRoleSelection(role.id)}
                  className={`w-full p-2 rounded-lg border border-white/20 bg-gradient-to-r ${role.gradient} text-white shadow-lg relative overflow-hidden group`}
                >
                  <div className="flex items-center space-x-3 relative z-10">
                    <motion.div
                      className="text-xl"
                      animate={
                        hoveredRole === role.id
                          ? {
                              scale: [1, 1.1, 1],
                              rotate: [0, 5, -5, 0],
                            }
                          : {}
                      }
                      transition={{
                        duration: 0.8,
                        repeat: hoveredRole === role.id ? Infinity : 0,
                        ease: "easeInOut"
                      }}
                    >
                      {role.icon}
                    </motion.div>
                    <div className="text-left flex-1">
                      <h3 className="font-semibold text-sm">{role.name}</h3>
                      <p className="text-xs opacity-90">{role.description}</p>
                    </div>
                    <motion.div
                      className="text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      animate={hoveredRole === role.id ? { x: [0, 6, 0] } : {}}
                      transition={{
                        duration: 1.2,
                        repeat: hoveredRole === role.id ? Infinity : 0,
                        ease: "easeInOut"
                      }}
                    >
                      →
                    </motion.div>
                  </div>

                  {/* Particle Effect on Hover */}
                  {hoveredRole === role.id && (
                    <div className="absolute inset-0 pointer-events-none">
                      {[...Array(6)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-white rounded-full"
                          initial={{
                            x: "50%",
                            y: "50%",
                            opacity: 0,
                            scale: 0,
                          }}
                          animate={{
                            x: `${20 + Math.random() * 60}%`,
                            y: `${20 + Math.random() * 60}%`,
                            opacity: [0, 0.8, 0],
                            scale: [0, 1.2, 0],
                          }}
                          transition={{
                            duration: 2,
                            delay: i * 0.15,
                            repeat: Infinity,
                            repeatDelay: 3,
                            ease: "easeOut"
                          }}
                        />
                      ))}
                    </div>
                  )}
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* Signup Form Step */}
          {step === "signup" && (
            <motion.form
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleEmailSignup}
              className="space-y-4"
            >
              {/* Selected Role Display */}
              <motion.div
                className="bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-400/30 rounded-lg p-3 mb-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center space-x-2">
                  <div className="text-lg">
                    {roleOptions.find((r) => r.id === selectedRole)?.icon}
                  </div>
                  <div>
                    <span className="font-medium text-red-200 text-sm">
                      {roleOptions.find((r) => r.id === selectedRole)?.name}
                    </span>
                    <p className="text-xs text-red-300">
                      {
                        roleOptions.find((r) => r.id === selectedRole)
                          ?.description
                      }
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-xs font-medium text-gray-200 mb-1">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setIsFocused("email")}
                    onBlur={() => setIsFocused(null)}
                    className={`w-full px-3 py-2 bg-white/10 border rounded-lg transition-all duration-300 text-white placeholder-gray-400 text-sm ${
                      isFocused === "email"
                        ? "border-red-400 ring-2 ring-red-400/20"
                        : "border-white/20 hover:border-white/30"
                    } focus:outline-none`}
                    placeholder="Enter your email"
                    required
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-xs font-medium text-gray-200 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setIsFocused("password")}
                    onBlur={() => setIsFocused(null)}
                    className={`w-full px-3 py-2 pr-10 bg-white/10 border rounded-lg transition-all duration-300 text-white placeholder-gray-400 text-sm ${
                      isFocused === "password"
                        ? "border-red-400 ring-2 ring-red-400/20"
                        : "border-white/20 hover:border-white/30"
                    } focus:outline-none`}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </motion.div>
              {/* Error Display */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="bg-red-500/20 border border-red-400/30 text-red-200 px-3 py-2 rounded-lg text-xs flex items-center space-x-2"
                  >
                    <svg
                      className="w-4 h-4 text-red-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Create Account Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-2.5 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group text-sm"
              >
                <motion.div className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                        />
                      </svg>
                      <span>Create Account</span>
                    </>
                  )}
                </span>
              </motion.button>

              {/* Divider */}
              <motion.div
                className="relative my-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-transparent text-gray-400 font-medium">
                    Or continue with
                  </span>
                </div>
              </motion.div>

              {/* Google Signup Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleGoogleSignup}
                disabled={isLoading}
                className="w-full bg-white/10 border border-white/20 text-white py-2.5 rounded-lg font-medium hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 group text-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Sign up with Google</span>
              </motion.button>

              {/* Login Link */}
              <motion.div
                className="text-center mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-gray-400 text-xs">
                  Already have an account?{" "}
                  <motion.a
                    href="/login"
                    className="text-red-400 hover:text-red-300 font-medium relative group transition-colors"
                    whileHover={{ scale: 1.05 }}
                  >
                    Sign in
                    <motion.div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-400 group-hover:w-full transition-all duration-300" />
                  </motion.a>
                </p>
              </motion.div>
            </motion.form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
