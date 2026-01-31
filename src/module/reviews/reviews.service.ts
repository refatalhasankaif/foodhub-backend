import { prisma } from "../../lib/prisma";


const createReview = async (
    userId: string,
    data: {
        mealId: string;
        rating: number;
        comment?: string;
    }
) => {
    return prisma.review.create({
        data: {
            userId,
            mealId: data.mealId,
            rating: data.rating,
            comment: data.comment,
        },
        include: { meal: true }
    });
};

const getReviewsByMeal = async (mealId: string) => {
    return prisma.review.findMany({
        where: { mealId },
        include: { meal: true },
        orderBy: { createdAt: "desc" }
    });
};


const getReviewsByUser = async (userId: string) => {
    return prisma.review.findMany({
        where: { userId },
        include: { meal: true },
        orderBy: { createdAt: "desc" }
    });
};

export const reviewService = {
    createReview,
    getReviewsByMeal,
    getReviewsByUser,
};
