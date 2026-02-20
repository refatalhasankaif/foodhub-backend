import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { UserRole, UserStatus } from "../../generated/prisma/client";
import { APIError } from "better-auth/api";

const ALLOWED_ROLES: UserRole[] = [UserRole.CUSTOMER, UserRole.PROVIDER];

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),

  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:5000",
    "https://foodhub-backend-3poi.onrender.com",
    "https://foodhub-frontend-xi.vercel.app"
  ],

  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,

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
        required: true,
        input: true,
      },
    },
  },

  
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",

    defaultCookieAttributes: {
      sameSite: "lax",         
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      path: "/",
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

      if (!role || role === "" || role === null || role === undefined) {
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