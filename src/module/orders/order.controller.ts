import { Request, Response } from "express";
import { orderService } from "./order.service";
import { OrderStatus } from "../../../generated/prisma/client";

const createOrder = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const order = await orderService.createOrder(req.user.id, req.body);
    res.status(201).json(order);
  } catch (error: any) {
    res.status(400).json({ error: "Order creation failed", details: error.message });
  }
};

const getMyOrders = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const orders = await orderService.getOrdersByCustomer(req.user.id);
    res.status(200).json(orders);
  } catch (error: any) {
    res.status(400).json({ error: "Failed to fetch orders", details: error.message });
  }
};

const getProviderOrders = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const orders = await orderService.getOrdersByProvider(req.user.id);
    res.status(200).json(orders);
  } catch (error: any) {
    res.status(400).json({ error: "Failed to fetch provider orders", details: error.message });
  }
};

const getOrderById = async (req: Request, res: Response) => {
  try {
    const orderId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const order = await orderService.getOrderById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json(order);
  } catch (error: any) {
    res.status(400).json({ error: "Failed to fetch order", details: error.message });
  }
};

const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const orderId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { status } = req.body;
    const order = await orderService.updateOrderStatus(orderId, status as OrderStatus);
    res.status(200).json(order);
  } catch (error: any) {
    res.status(400).json({ error: "Failed to update order status", details: error.message });
  }
};

export const orderController = {
  createOrder,
  getMyOrders,
  getProviderOrders,
  getOrderById,
  updateOrderStatus,
};