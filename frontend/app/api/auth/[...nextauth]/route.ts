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
            image: null, // Add image field for consistency
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

          if (existingUserResponse.data.exists) {
            // User exists - allow sign in
            console.log("Existing user signing in:", user.email);
            return true;
          } else {
            // New user - redirect to role selection
            console.log("New user needs role selection:", user.email);
            return `/login/role-selection?email=${encodeURIComponent(
              user.email
            )}&name=${encodeURIComponent(
              user.name || ""
            )}&image=${encodeURIComponent(user.image || "")}`;
          }
        } catch (error) {
          console.error("Error checking user existence:", error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      if (account?.provider === "google" && user) {
        try {
          // Get user data from our database
          const userResponse = await axios.get(
            `http://localhost:5000/api/v1/user/by-email?email=${user.email}`
          );

          if (userResponse.data.user) {
            const dbUser = userResponse.data.user;
            token.id = dbUser.id;
            token.email = dbUser.email;
            token.name = dbUser.username || user.name;
            token.username = dbUser.username;
            token.role = dbUser.role;
            token.picture = user.image;
          } else {
            // For new users who haven't selected role yet
            token.id = user.id;
            token.email = user.email;
            token.name = user.name;
            token.picture = user.image;
            token.role = null;
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else if (user) {
        // Credentials login
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.username = user.username;
        token.role = user.role;
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
        session.user.image = token.picture as string;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      // Handle role selection redirect
      if (url.startsWith("/login/role-selection")) {
        return url;
      }

      // Handle dashboard redirects based on role
      if (url.startsWith("/dashboard")) {
        return url;
      }

      // Default redirect
      if (url.startsWith(baseUrl)) {
        return url;
      }

      return baseUrl;
    },
  },
});

export { handler as GET, handler as POST };
