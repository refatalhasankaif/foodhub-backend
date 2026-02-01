import { prisma } from "../../lib/prisma";

const getAllCategories = async () => {
    return prisma.category.findMany({
        select: {
            id: true,
            name: true,
            createdAt: true,
        },
        orderBy: {
            name: "asc",
        },
    });
};

const getCategoryById = async (id: string) => {
    return prisma.category.findUnique({
        where: { id },
        include: {
            meals: {
                select: {
                    id: true,
                    name: true,
                    description: true,
                    price: true,
                    imageUrl: true,
                    isAvailable: true,
                },
            },
        },
    });
};

export const categoryService = {
    getAllCategories,
    getCategoryById,
};