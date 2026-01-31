import { Router } from "express";
import { AuthController } from "./auth.controller";
import authMiddleware from "../../middlewares/authMiddleware";

const router = Router();

router.get("/me",
    authMiddleware(),
    AuthController.getMe
);

router.patch("/profile",
    authMiddleware(),
    AuthController.updateProfile
);

export const authRouter: Router = router;