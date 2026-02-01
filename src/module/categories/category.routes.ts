import { Router } from "express";
import { categoryController } from "./category.controller";

const router = Router();

router.get(
    "/",
    categoryController.getAllCategories
);

router.get(
    "/:id",
    categoryController.getCategoryById
);

export const categoryRoutes = router;