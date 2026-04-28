import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { Role } from "../generated/prisma/enums";
import { prisma } from "./prisma";
// If your Prisma file is located elsewhere, you can change the path
export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: true,
                defaultValue: Role.CANDIDATE,
            },
        },
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
        github: {
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        },
    },
    callbacks: {
        session: async ({ user, session }) => {
            return {
                ...session,
                user: {
                    ...user,
                    role: user.role, // 👈 IMPORTANT
                },
            };
        },
    },
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    advanced: {
        disableOriginCheck: process.env.NODE_ENV !== "production",
    },
});
//# sourceMappingURL=auth.js.map