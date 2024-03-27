import { mongoDBConnection } from "@/lib/mongodb";
import { WeatherUsers } from "@/models/weatherUsers";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider, { GithubProfile } from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

export const options: NextAuthOptions = {
  providers: [
    GithubProvider({
      profile(profile: GithubProfile): any {
        return {
          ...profile,
          name: profile?.name ?? "",
          role: profile.role ?? "",
          employmentType: profile.employmentType ?? "",
          id: profile.id.toString(),
          image: profile.avatar_url,
        };
      },
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials: any, req) {
        return credentials;
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/weather",
  },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "credentials") {
        return true;
      }
      if (account?.provider === "github" || account?.provider === "google") {
        await mongoDBConnection();
        try {
          const existingUser = await WeatherUsers.findOne({
            email: user.email,
          });

          if (!existingUser) {
            await WeatherUsers.create({
              name: user?.name,
              email: user?.email,
              emailVerified: new Date(),
            });
            return true;
          }
        } catch (error) {
          return false;
        }
      }
      return true;
    },
    // async redirect({ url, baseUrl }) {
    //   console.log("url", url);
    //   console.log("base url", baseUrl)
    //   const isRelativeUrl = url.startsWith("/");
    //   if (isRelativeUrl) {
    //     return `${baseUrl}${url}`;
    //   }
    //   const isSameOriginUrl = new URL(url).origin === baseUrl;
    //   const alreadyRedirected = url.includes("callbackUrl=");
    //   console.log("already", alreadyRedirected);
    //   if (isSameOriginUrl && alreadyRedirected) {
    //     const originalCallbackUrl = decodeURIComponent(
    //       url.split("callbackUrl=")[1]
    //     );
    //     return originalCallbackUrl;
    //   }
    //   if (isSameOriginUrl) {
    //     return url;
    //   }
    //   return baseUrl;
    // },
  },
};
