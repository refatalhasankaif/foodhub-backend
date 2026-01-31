import { prisma } from "../../lib/prisma";

const createProviderProfile = async (
    userId: string,
    data: {
        restaurantName: string;
        address: string;
        phone: string;
    }
) => {
    const existing = await prisma.providerProfile.findUnique({ where: { userId } });
    if (existing) return existing;

    return prisma.providerProfile.create({
        data: {
            userId,
            restaurantName: data.restaurantName,
            address: data.address,
            phone: data.phone,
        },
    });
};

const getProviderByUserId = async (userId: string) => {
    return prisma.providerProfile.findUnique({
        where: { userId },
        include: { meals: true },
    });
};

const getProviderById = async (id: string) => {
    return prisma.providerProfile.findUnique({
        where: { id },
        include: { meals: true },
    });
};

const updateProviderProfile = async (
    userId: string,
    data: {
        restaurantName?: string;
        address?: string;
        phone?: string;
    }
) => {
    try {
        return prisma.providerProfile.update({
            where: { userId },
            data,
        });
    } catch (error: any) {
        if (error.code === "P2025") {
            throw new Error("Provider profile not found");
        }
        throw error;
    }
};

const deleteProviderProfile = async (userId: string) => {
    try {
        return prisma.providerProfile.delete({
            where: { userId },
        });
    } catch (error: any) {
        if (error.code === "P2025") {
            throw new Error("Provider profile not found");
        }
        throw error;
    }
};

export const providerService = {
    createProviderProfile,
    getProviderByUserId,
    getProviderById,
    updateProviderProfile,
    deleteProviderProfile,
};
