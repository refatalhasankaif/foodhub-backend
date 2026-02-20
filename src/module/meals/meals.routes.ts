import { Router } from "express";
import authMiddleware, { UserRole } from "../../middlewares/authMiddleware";
import { mealController } from "./meals.controller";

const router = Router();

router.get(
    "/", mealController.getAllMeals

);
router.get(
    "/:id", mealController.getMealById

);

router.post(
    "/create",
    authMiddleware(UserRole.PROVIDER, UserRole.ADMIN),
    mealController.createMeal
);

router.patch(
    "/:id",
    authMiddleware(UserRole.PROVIDER, UserRole.ADMIN),
    mealController.updateMeal
);

router.delete(
    "/:id",
    authMiddleware(UserRole.PROVIDER, UserRole.ADMIN),
    mealController.deleteMeal
);

export const mealRoutes: Router = router;