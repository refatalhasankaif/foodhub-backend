import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";

const getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await AuthService.getCurrentUser(req.user!.id);

        res.status(200).json(user)
    } catch (error) {
        res.status(400).json({
            error: "User fetched failed",
            details: error
        })
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
        res.status(400).json({
            error: "Profile update failed",
            details: error
        })
    }
};

export const AuthController = {
    getMe,
    updateProfile,
};