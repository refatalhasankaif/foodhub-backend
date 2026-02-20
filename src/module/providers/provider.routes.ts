import { Router } from "express";
import authMiddleware, { UserRole } from "../../middlewares/authMiddleware";
import { providerController } from "./providers.controller";

const router = Router();

router.get("/", providerController.getAllProviders);

router.get(
  "/dashboard",
  authMiddleware(UserRole.PROVIDER),
  providerController.getDashboardStats
);

router.get(
  "/me",
  authMiddleware(UserRole.PROVIDER, UserRole.ADMIN),
  providerController.getMyProviderProfile
);

router.get(
  "/mymeals",
  authMiddleware(UserRole.PROVIDER),
  providerController.getMyMeals
);

router.post(
  "/create",
  authMiddleware(UserRole.PROVIDER, UserRole.ADMIN),
  providerController.createProviderProfile
);

router.patch(
  "/update",
  authMiddleware(UserRole.PROVIDER, UserRole.ADMIN),
  providerController.updateProviderProfile
);

router.delete(
  "/delete",
  authMiddleware(UserRole.PROVIDER, UserRole.ADMIN),
  providerController.deleteProviderProfile
);

router.get("/:id", providerController.getProviderProfileById);


export const providerRoutes: Router = router;