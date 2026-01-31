import { prisma } from "../../lib/prisma";

const createMeal = async (
    userId: string,
    data: {
        name: string;
        description: string;
        price: number;
        categoryId: string;
    }
) => {
    const provider = await prisma.providerProfile.findUnique({
        where: { userId },
    });

    if (!provider) {
        throw new Error("Provider profile not found");
    }

    return prisma.meal.create({
        data: {
            name: data.name,
            description: data.description,
            price: data.price,
            categoryId: data.categoryId,
            providerId: provider.id,
        },
    });
};

const getAllMeals = async () => {
    return prisma.meal.findMany({
        where: { isAvailable: true },
        include: {
            category: true,
            provider: true,
        },
    });
};

const getMealById = async (id: string) => {
    return prisma.meal.findUnique({
        where: { id },
        include: {
            category: true,
            provider: true,
            reviews: true,
        },
    });
};

const updateMeal = async (
    mealId: string,
    userId: string,
    data: {
        name?: string;
        description?: string;
        price?: number;
        isAvailable?: boolean;
        categoryId?: string;
    }
) => {
    const provider = await prisma.providerProfile.findUnique({
        where: { userId },
    });

    if (!provider) {
        throw new Error("Provider not found");
    }

    return prisma.meal.update({
        where: {
            id: mealId,
            providerId: provider.id,
        },
        data,
    });
};

const deleteMeal = async (mealId: string, userId: string) => {
    const provider = await prisma.providerProfile.findUnique({
        where: { userId },
    });

    if (!provider) {
        throw new Error("Provider not found");
    }

    return prisma.meal.delete({
        where: {
            id: mealId,
            providerId: provider.id,
        },
    });
};

export const mealService = {
    createMeal,
    getAllMeals,
    getMealById,
    updateMeal,
    deleteMeal,
};
