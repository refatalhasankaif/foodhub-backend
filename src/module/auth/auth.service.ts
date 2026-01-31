import { prisma } from "../../lib/prisma";

const getCurrentUser = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            phone: true,
            address: true,
            emailVerified: true,
            createdAt: true,
        },
    });

    if (!user) {
        throw new Error("User not found");
    }

    return user;
};

const updateProfile = async (
    userId: string,
    data: { name?: string; phone?: string; address?: string }
) => {
    const user = await prisma.user.update({
        where: { id: userId },
        data,
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            phone: true,
            address: true,
        },
    });

    return user;
};

export const AuthService = {
    getCurrentUser,
    updateProfile,
};