import { Request, Response } from "express";
import { adminService } from "./admin.service";
import { UserStatus } from "../../../generated/prisma/client";

const getAllUsers = async (req: Request, res: Response) => {
    const users = await adminService.getAllUsers();
    res.status(200).json(users);
};

const updateUserStatus = async (req: Request, res: Response) => {
    const userId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { status } = req.body;

    const user = await adminService.updateUserStatus(userId, status as UserStatus);
    res.status(200).json(user);
};

const getAllCategories = async (req: Request, res: Response) => {
    const categories = await adminService.getAllCategories();
    res.status(200).json(categories);
};

const createCategory = async (req: Request, res: Response) => {
    const { name } = req.body;
    const category = await adminService.createCategory(name);
    res.status(201).json(category);
};

const updateCategory = async (req: Request, res: Response) => {
    const categoryId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { name } = req.body;

    const category = await adminService.updateCategory(categoryId, name);
    res.status(200).json(category);
};

const deleteCategory = async (req: Request, res: Response) => {
    const categoryId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    await adminService.deleteCategory(categoryId);
    res.status(204).send();
};

const getAllOrders = async (req: Request, res: Response) => {
    const orders = await adminService.getAllOrders();
    res.status(200).json(orders);
};

export const adminController = {
    getAllUsers,
    updateUserStatus,
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getAllOrders,
};
