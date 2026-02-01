import { Request, Response } from "express";
import { categoryService } from "./category.service";


const getAllCategories = async (req: Request, res: Response) => {
    try {
        const categories = await categoryService.getAllCategories();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch categories", details: error });
    }
};

const getCategoryById = async (req: Request, res: Response) => {
    try {
        const categoryId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const category = await categoryService.getCategoryById(categoryId);
        
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch category", details: error });
    }
};

export const categoryController = {
    getAllCategories,
    getCategoryById,
};