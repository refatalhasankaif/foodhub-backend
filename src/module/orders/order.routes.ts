import { Router } from "express";
import authMiddleware, { UserRole } from "../../middlewares/authMiddleware";
import { orderController } from "./order.controller";

const router = Router();

router.get(
    "/provider/orders",
    authMiddleware(UserRole.PROVIDER),
    orderController.getProviderOrders
);

router.post(
    "/",
    authMiddleware(UserRole.CUSTOMER),
    orderController.createOrder
);

router.get(
    "/",
    authMiddleware(UserRole.CUSTOMER),
    orderController.getMyOrders
);

router.get(
    "/:id",
    authMiddleware(UserRole.CUSTOMER, UserRole.PROVIDER, UserRole.ADMIN),
    orderController.getOrderById
);

router.patch(
    "/:id",
    authMiddleware(UserRole.PROVIDER),
    orderController.updateOrderStatus
);

export const orderRoutes = router;