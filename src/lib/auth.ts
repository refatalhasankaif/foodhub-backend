import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { UserRole, UserStatus } from "../../generated/prisma/client";
import { APIError } from "better-auth/api";

const ALLOWED_ROLES: UserRole[] = [UserRole.CUSTOMER, UserRole.PROVIDER];

const isProduction = process.env.NODE_ENV === "production";

// Frontend URL where the Better Auth client runs (Next.js app)
// e.g. http://localhost:3000 in dev, https://foodhub-frontend.com in prod
const FRONTEND_URL =
    process.env.APP_URL?.replace(/\/$/, "") || "http://localhost:3000";

// Public URL for the Better Auth endpoints as seen by the browser.
// In this setup the frontend proxies /api/auth/* to the backend,
// so we expose the auth endpoints on the frontend origin.
const BETTER_AUTH_BASE_URL =
    process.env.BETTER_AUTH_URL ||
    process.env.BETTER_AUTH_BASE_URL ||
    `${FRONTEND_URL.replace(/\/$/, "")}/api/auth`;

// Optional cookie domain for production (e.g. ".foodhub.com").
// Leave undefined in dev so cookies are host-only on localhost.
const COOKIE_DOMAIN = isProduction ? process.env.COOKIE_DOMAIN : undefined;

export const auth = betterAuth({
    database: prismaAdapter(prisma, { provider: "postgresql" }),

    // Must match the public URL where the frontend calls /api/auth/*
    baseURL: BETTER_AUTH_BASE_URL,

    // Allow the frontend origin(s) to talk to auth
    trustedOrigins: [
        FRONTEND_URL,
        process.env.FRONTEND_URL?.replace(/\/$/, "") || FRONTEND_URL,
        process.env.BACKEND_URL?.replace(/\/$/, "") ||
        "https://foodhub-backend-3poi.onrender.com",
        "http://localhost:3000",
    ].filter(Boolean),

    cookies: {
        // False in dev (http), true in prod (https).
        secure: isProduction,
        // Browsers require `Secure` when SameSite=None.
        // Use lax in dev so cookies work on http://localhost:3000,
        // and None in prod when you are on HTTPS.
        // However, since we are proxying, "lax" usually works better even on cross-origin proxies if the browser sees it as same-origin.
        sameSite: isProduction ? "none" : "lax",
        // In prod you can scope this via COOKIE_DOMAIN (e.g. ".foodhub.com").
        // If undefined, Better Auth will use a host-only cookie.
        domain: COOKIE_DOMAIN,
        // Ensure cookies are accessible across the proxy
        httpOnly: true,
    },

    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
    },

    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: UserRole.CUSTOMER,
                required: true,
                input: true,
            },
            status: {
                type: "string",
                defaultValue: UserStatus.ACTIVE,
                required: true,
                input: false,
            },
            phone: {
                type: "string",
                required: false,
                input: true,
            },
            address: {
                type: "string",
                required: false,
                input: true,

            },
        },
    },

    hooks: {
        before: async (context: any) => {
            const isSignup = context.path === "/sign-up/email";
            const isUpdate = context.path === "/user/update";

            if (!isSignup && !isUpdate) return;

            if (!context.body) context.body = {};
            if (!context.requestedData) context.requestedData = {};

            let role =
                context.body?.role ||
                context.requestedData?.role ||
                context.body?.data?.role;

            if (!role) {
                role = UserRole.CUSTOMER;
                context.body.role = UserRole.CUSTOMER;
                context.requestedData.role = UserRole.CUSTOMER;
                return;
            }

            if (!ALLOWED_ROLES.includes(role as UserRole)) {
                throw new APIError("FORBIDDEN", {
                    message: "You cannot assign yourself the ADMIN role.",
                });
            }
        },
    },
});
