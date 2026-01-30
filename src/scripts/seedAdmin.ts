import { prisma } from "../lib/prisma"
import { UserRole, UserStatus } from "../../generated/prisma/client"

async function seedAdmin() {
    try {
        const adminEmail = "admin@foodhub.com";

        const existingUser = await prisma.user.findUnique({
            where: { email: adminEmail }
        });
        
        if (existingUser) {
            console.log("Admin already exists");
            return;
        }

        const signUpResponse = await fetch("http://localhost:5000/api/auth/sign-up/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Origin": "http://localhost:4000",
            },
            body: JSON.stringify({
                name: "Admin User",
                email: adminEmail,
                password: "Admin@123",
                role: UserRole.CUSTOMER,
            })
        });

        const responseData = await signUpResponse.json();

        if (!signUpResponse.ok) {
            console.log("Response:", responseData);
            throw new Error("Signup failed");
        }

        await prisma.user.update({
            where: { email: adminEmail },
            data: {
                role: UserRole.ADMIN,
                emailVerified: true
            }
        });

        console.log("Admin seeded successfully");
        
    } catch (error) {
        console.error("Seeding failed:", error);
    } finally {
        await prisma.$disconnect();
    }
}

seedAdmin();