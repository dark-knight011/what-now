// Better Auth Configuration

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./db/server";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
    trustedOrigins: [process.env.BETTER_AUTH_URL || "http://localhost:3000"],
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false, // Set to true in production
    },
    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // 1 day
    },
    advanced: {
        cookiePrefix: "whatnow",
    },
});

export type Session = typeof auth.$Infer.Session;
