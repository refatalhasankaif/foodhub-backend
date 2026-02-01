import { Router } from "express";
import authMiddleware, { UserRole } from "../../middlewares/authMiddleware";
import { adminController } from "./admin.controller";

const router = Router();

router.get(
    "/dashboard", 
    authMiddleware(UserRole.ADMIN), 
    adminController.getDashboardStats
);

router.get(
    "/users", 
    authMiddleware(UserRole.ADMIN), 
    adminController.getAllUsers
);
router.patch(
    "/users/:id", 
    authMiddleware(UserRole.ADMIN), 
    adminController.updateUserStatus
);

router.get(
    "/categories",
    authMiddleware(UserRole.ADMIN),
    adminController.getAllCategories
);
router.post(
    "/categories",
    authMiddleware(UserRole.ADMIN),
    adminController.createCategory
);
router.patch(
    "/categories/:id",
    authMiddleware(UserRole.ADMIN),
    adminController.updateCategory
);
router.delete(
    "/categories/:id",
    authMiddleware(UserRole.ADMIN),
    adminController.deleteCategory
);

router.get(
    "/orders", 
    authMiddleware(UserRole.ADMIN), 
    adminController.getAllOrders
);

export const adminRoutes = router;