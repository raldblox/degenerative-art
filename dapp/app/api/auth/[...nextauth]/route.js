import nextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";

const authOptions = {
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
      version: "2.0",
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub;
      console.log("New user signed in", token.name, token.sub);
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = nextAuth(authOptions);

module.exports = {
  handler,
  GET: handler,
  POST: handler,
};
