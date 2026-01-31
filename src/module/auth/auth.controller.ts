import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";

const getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await AuthService.getCurrentUser(req.user!.id);

        res.json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, phone, address } = req.body;

        const user = await AuthService.updateProfile(req.user!.id, {
            name,
            phone,
            address,
        });

        res.json({
            success: true,
            message: "Profile updated successfully",
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

export const AuthController = {
    getMe,
    updateProfile,
};