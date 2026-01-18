import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { prismaCli } from "@/lib/prisma-cli";

export const auth = betterAuth({
  database: prismaAdapter(prismaCli),

  emailAndPassword: {
    enabled: false,
  },

  emailVerification: {
    enabled: true,
    sendOnSignUp: true,
  },

  magicLink: {
    enabled: true,
  },
});
