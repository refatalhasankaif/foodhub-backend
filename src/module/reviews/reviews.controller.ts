import { Request, Response } from "express";
import { reviewService } from "./reviews.service";

const createReview = async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const review = await reviewService.createReview(req.user.id, req.body);
    res.status(201).json(review);
};


const getReviewsByMeal = async (req: Request, res: Response) => {
    const mealId = Array.isArray(req.params.mealId) ? req.params.mealId[0] : req.params.mealId;
    const reviews = await reviewService.getReviewsByMeal(mealId);
    res.status(200).json(reviews);
};


const getReviewsByUser = async (req: Request, res: Response) => {
    const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
    const reviews = await reviewService.getReviewsByUser(userId);
    res.status(200).json(reviews);
};

export const reviewController = {
    createReview,
    getReviewsByMeal,
    getReviewsByUser,
};
