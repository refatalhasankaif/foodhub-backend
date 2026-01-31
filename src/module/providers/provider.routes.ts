import { Router } from "express";
import authMiddleware, { UserRole } from "../../middlewares/authMiddleware";
import { providerController } from "./providers.controller";

const router = Router();

router.post(
    "/create",
    authMiddleware(UserRole.PROVIDER, UserRole.ADMIN),
    providerController.createProviderProfile
);

router.get(
    "/me",
    authMiddleware(UserRole.PROVIDER, UserRole.ADMIN),
    providerController.getMyProviderProfile
);

router.get(
    "/:id",
    providerController.getProviderProfileById
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

export const providerRoutes: Router = router;
