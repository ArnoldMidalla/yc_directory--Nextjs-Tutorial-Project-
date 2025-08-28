import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

import { client } from "@/sanity/lib/client";
import { AUTHOR_BY_GITHUB_ID_QUERY } from "@/sanity/lib/queries";
import { writeClient } from "@/sanity/lib/write-client";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({
      user: { name, email, image },
      profile: { id, login, bio },
    }) {
      const existingUser = await client.withConfig({useCdn: false}).fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
        id,
      });

      if (!existingUser) {
        await writeClient.create({
          _type: "author",
          id, // 👈 custom field
          name,
          username: login,
          email,
          image,
          bio: bio || "",
        });
      }

      return true; // ✅ always return true if sign-in is successful
    },

    async jwt({ token, account, profile }) {
      if (account && profile) {
        const user = await client.withConfig({useCdn: false}).fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
          id: profile.id,
        });
        if (user) {
          token.id = user?._id;
        }
      }
      return token; // ✅ always return token
    },

    async session({ session, token }) {
      if (token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
