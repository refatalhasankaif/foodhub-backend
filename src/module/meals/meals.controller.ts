import { Request, Response } from "express";
import { mealService } from "./meals.service";

type MealParams = {
  id: string;
};

const createMeal = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const meal = await mealService.createMeal(req.user.id, req.body);
    res.status(201).json(meal);
  } catch (error: any) {
    res.status(400).json({
      error: "Meal creation failed",
      message: error.message || "Unknown error",
    });
  }
};

const getAllMeals = async (_req: Request, res: Response) => {
  try {
    const meals = await mealService.getAllMeals();
    res.status(200).json(meals);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch meals" });
  }
};

const getMealById = async (req: Request<MealParams>, res: Response) => {
  try {
    const meal = await mealService.getMealById(req.params.id);
    if (!meal) {
      return res.status(404).json({ message: "Meal not found" });
    }
    res.status(200).json(meal);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch meal" });
  }
};

const updateMeal = async (req: Request<MealParams>, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const meal = await mealService.updateMeal(
      req.params.id,
      req.user.id,
      req.body
    );

    res.status(200).json(meal);
  } catch (error: any) {
    res.status(400).json({
      error: "Meal update failed",
      message: error.message || "Unknown error",
    });
  }
};

const deleteMeal = async (req: Request<MealParams>, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await mealService.deleteMeal(req.params.id, req.user.id);
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({
      message: "Meal delete failed",
      error: error.message || "Unknown error",
    });
  }
};

const getMyMeals = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const meals = await mealService.getMealsByProviderUserId(req.user.id);
    res.status(200).json(meals);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch your meals",
      error: error.message || "Unknown error",
    });
  }
};

export const mealController = {
  createMeal,
  getAllMeals,
  getMealById,
  updateMeal,
  deleteMeal,
  getMyMeals,
};