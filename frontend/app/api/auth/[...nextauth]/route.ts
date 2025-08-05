import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          console.log("Attempting credentials login for:", credentials?.email);
          
          const res = await axios.post(
            "http://localhost:5000/api/v1/user/signin",
            {
              email: credentials?.email,
              password: credentials?.password,
            }
          );

          const user = res.data?.user;
          console.log("Backend response:", res.data);
          console.log("User object:", user);

          if (!user) {
            console.log("No user returned from backend");
            return null;
          }

          // Ensure all required fields are present
          const userForNextAuth = {
            id: user.id,
            email: user.email,
            name: user.name || user.username,
            username: user.username,
            role: user.role,
            image: user.image || null,
          };

          console.log("User for NextAuth:", userForNextAuth);
          return userForNextAuth;
        } catch (err: any) {
          console.error("Credentials login error details:", {
            message: err?.message,
            response: err?.response?.data,
            status: err?.response?.status,
          });
          return null;
        }
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-key-for-development",

  session: {
    strategy: "jwt",
  },

  debug: process.env.NODE_ENV === "development",

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          // Check if user exists in our database
          const existingUserResponse = await axios.get(
            `http://localhost:5000/api/v1/user/check-email?email=${user.email}`
          );

          const { exists } = existingUserResponse.data;

          if (exists) {
            // User exists, get their data
            const userResponse = await axios.get(
              `http://localhost:5000/api/v1/user/by-email?email=${user.email}`
            );

            const existingUser = userResponse.data.user;
            
            // Update user object with existing user data
            user.id = existingUser.id;
            user.username = existingUser.username;
            user.role = existingUser.role;
            
            return true;
          } else {
            // User doesn't exist, redirect to role selection
            return "/signup/google-callback";
          }
        } catch (error) {
          console.error("Error checking user existence:", error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.username = user.username;
        token.role = user.role;
        token.image = user.image;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.username = token.username as string;
        session.user.role = token.role as string;
        session.user.image = token.image as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
