import { prisma } from "../lib/prisma";
import { auth } from "../lib/auth";

async function seedAdmin() {
    try {
        const adminEmail    = "admin@foodhub.com";
        const adminPassword = "Admin@123";

        const existing = await prisma.user.findUnique({
            where: { email: adminEmail },
        });

        if (existing) {
            console.log("Admin already exists:", existing.email);
            return;
        }

        await auth.api.signUpEmail({
            body: {
                name:     "Admin User",
                email:    adminEmail,
                password: adminPassword,
                address:  "HQ - FoodHub, Mirpur - 10, Bangladesh",
            },
        });

        await prisma.user.update({
            where: { email: adminEmail },
            data: {
                role:          "ADMIN",
                emailVerified: true,
            },
        });

        console.log("✓ Admin seeded successfully");
        console.log("  Email:   ", adminEmail);
        console.log("  Password:", adminPassword);

    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

seedAdmin();