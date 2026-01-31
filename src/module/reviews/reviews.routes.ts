import { Router } from "express";
import authMiddleware, { UserRole } from "../../middlewares/authMiddleware";
import { reviewController } from "./reviews.controller";

const router = Router();


router.post(
    "/", authMiddleware(UserRole.CUSTOMER), 
    reviewController.createReview
);

router.get(
    "/meal/:mealId", 
    reviewController.getReviewsByMeal
);

router.get(
    "/user/:userId", 
    reviewController.getReviewsByUser
);

export const reviewRoutes = router;
