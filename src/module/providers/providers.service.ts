import { prisma } from "../../lib/prisma";

const getProviderDashboardStats = async (userId: string) => {
    const provider = await prisma.providerProfile.findUnique({
        where: { userId },
    });

    if (!provider) {
        return {
            totalMenuItems: 0,
            totalOrders: 0,
            totalRevenue: 0,
            orderStatusBreakdown: {
                PLACED: 0,
                PREPARING: 0,
                READY: 0,
                DELIVERED: 0,
                CANCELLED: 0,
            },
        };
    }

    const totalMenuItems = await prisma.meal.count({
        where: { providerId: provider.id },
    });

    const ordersWithProviderMeals = await prisma.order.findMany({
        where: {
            orderItems: {
                some: {
                    meal: {
                        providerId: provider.id,
                    },
                },
            },
        },
        include: {
            orderItems: {
                where: {
                    meal: {
                        providerId: provider.id,
                    },
                },
            },
        },
    });

    const totalOrders = ordersWithProviderMeals.length;

    const totalRevenue = ordersWithProviderMeals.reduce((sum, order) => {
        const orderRevenue = order.orderItems.reduce((itemSum, item) => {
            return itemSum + item.price * item.quantity;
        }, 0);
        return sum + orderRevenue;
    }, 0);

    const orderStatusBreakdown = {
        PLACED: 0,
        PREPARING: 0,
        READY: 0,
        DELIVERED: 0,
        CANCELLED: 0,
    };

    ordersWithProviderMeals.forEach((order) => {
        orderStatusBreakdown[order.status]++;
    });

    return {
        totalMenuItems,
        totalOrders,
        totalRevenue,
        orderStatusBreakdown,
    };
};

const getAllProviders = async () => {
    return prisma.providerProfile.findMany({
        select: {
            id: true,
            restaurantName: true,
            address: true,
            phone: true,
            createdAt: true,
            user: {
                select: {
                    name: true,
                    email: true,
                },
            },
        },
    });
};

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
    getProviderDashboardStats,
    getAllProviders,
    createProviderProfile,
    getProviderByUserId,
    getProviderById,
    updateProviderProfile,
    deleteProviderProfile,
};