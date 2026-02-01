import { Request, Response } from "express";
import { providerService } from "./providers.service";

type ProviderParams = { id: string };

const getDashboardStats = async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    try {
        const stats = await providerService.getProviderDashboardStats(req.user.id);
        res.status(200).json(stats);
    } catch (error: any) {
        res.status(500).json({ error: "Failed to fetch dashboard stats", details: error });
    }
};

const getAllProviders = async (req: Request, res: Response) => {
    try {
        const providers = await providerService.getAllProviders();
        res.status(200).json(providers);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch providers", details: error });
    }
};

const createProviderProfile = async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    try {
        const provider = await providerService.createProviderProfile(req.user.id, req.body);
        res.status(201).json(provider);
    } catch (error) {
        res.status(400).json({ error: "Provider creation failed", details: error });
    }
};

const getMyProviderProfile = async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    try {
        const provider = await providerService.getProviderByUserId(req.user.id);
        if (!provider) return res.status(404).json({ message: "Provider profile not found" });
        res.status(200).json(provider);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch provider profile", details: error });
    }
};

const getProviderProfileById = async (req: Request<ProviderParams>, res: Response) => {
    try {
        const provider = await providerService.getProviderById(req.params.id);
        if (!provider) return res.status(404).json({ message: "Provider not found" });
        res.status(200).json(provider);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch provider profile", details: error });
    }
};

const updateProviderProfile = async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const { restaurantName, address, phone } = req.body;
    if (!restaurantName && !address && !phone)
        return res.status(400).json({ message: "No fields provided to update" });

    try {
        const provider = await providerService.updateProviderProfile(req.user.id, { restaurantName, address, phone });
        res.status(200).json(provider);
    } catch (error: any) {
        if (error.message === "Provider profile not found") return res.status(404).json({ message: error.message });
        res.status(400).json({ error: "Provider update failed", details: error });
    }
};

const deleteProviderProfile = async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    try {
        await providerService.deleteProviderProfile(req.user.id);
        res.status(200).json({
            message: "Provider deleted successfully"
        });
    } catch (error: any) {
        if (error.message === "Provider profile not found") return res.status(404).json({ message: error.message });
        res.status(400).json({ error: "Provider delete failed", details: error });
    }
};

export const providerController = {
    getDashboardStats,
    getAllProviders,
    createProviderProfile,
    getMyProviderProfile,
    getProviderProfileById,
    updateProviderProfile,
    deleteProviderProfile,
};