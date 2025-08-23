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
          const res = await axios.post(
            "https://emergency-alert-system-bffp.onrender.com/api/v1/user/signin",
            {
              email: credentials?.email,
              password: credentials?.password,
            }
          );

          const user = res.data?.user;

          if (!user) {
            return null;
          }

          const userForNextAuth = {
            id: user.id,
            email: user.email,
            name: user.name || user.username,
            username: user.username,
            role: user.role,
            image: user.image || null,
          };

          return userForNextAuth;
        } catch {
          return null;
        }
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET || "akshxsceret@@#@#",

  session: {
    strategy: "jwt",
  },

  debug: process.env.NODE_ENV === "development",

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const existingUserResponse = await axios.get(
            `https://emergency-alert-system-bffp.onrender.com/api/v1/user/check-email?email=${user.email}`
          );

          const { exists } = existingUserResponse.data;

          if (exists) {
            const userResponse = await axios.get(
              `https://emergency-alert-system-bffp.onrender.com/api/v1/user/by-email?email=${user.email}`
            );

            const existingUser = userResponse.data.user;
            
            user.id = existingUser.id;
            user.username = existingUser.username;
            user.role = existingUser.role;
            
            return true;
          } else {
            return "/signup/google-callback";
          }
        } catch {
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
      
      if (account?.provider === "google") {
        token.provider = "google";
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
    error: "/login",
  },
});

export { handler as GET, handler as POST };
