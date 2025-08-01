import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const handler = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
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
            "http://localhost:5000/api/v1/user/login",
            {
              email: credentials?.email,
              password: credentials?.password,
            }
          );

          if (res.data && res.data.user) {
            return res.data.user;
          }
          return null;
        } catch (error: any) {
          console.error(
            "Authorize error:",
            error?.response?.data || error.message
          );
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7,
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 7,
  },
  callbacks: {
    async redirect({ baseUrl }) {
      return `${baseUrl}`;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.username = user.username;
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.name = token.name;
      session.user.username = token.username;

      console.log(token);
      console.log(session);
      return session;
    },
  },
});

export { handler as GET, handler as POST };
