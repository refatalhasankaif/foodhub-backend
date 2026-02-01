import { prisma } from "../../lib/prisma";
import { OrderStatus } from "../../../generated/prisma/client";

type OrderItemInput = {
  mealId: string;
  quantity: number;
};

type CreateOrderInput = {
  deliveryAddress: string;
  deliveryPhone: string;
  orderItems: OrderItemInput[];
};

const createOrder = async (customerId: string, data: CreateOrderInput) => {
  if (!data.orderItems || data.orderItems.length === 0) {
    throw new Error("No order items provided");
  }

  const itemsWithPrice = await Promise.all(
    data.orderItems.map(async item => {
      const meal = await prisma.meal.findUnique({ where: { id: item.mealId } });
      if (!meal) throw new Error(`Meal not found: ${item.mealId}`);
      if (!meal.isAvailable) throw new Error(`Meal not available: ${meal.name}`);
      return {
        mealId: meal.id,
        quantity: item.quantity,
        price: meal.price,
      };
    })
  );

  const totalAmount = itemsWithPrice.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const order = await prisma.order.create({
    data: {
      customerId,
      orderNumber: `ORD-${Date.now()}`,
      totalAmount,
      deliveryAddress: data.deliveryAddress,
      deliveryPhone: data.deliveryPhone,
      orderItems: { create: itemsWithPrice },
    },
    include: { orderItems: { include: { meal: true } } },
  });

  return order;
};

const getOrdersByCustomer = async (customerId: string) => {
  return prisma.order.findMany({
    where: { customerId },
    include: { orderItems: { include: { meal: true } } },
    orderBy: { createdAt: "desc" },
  });
};

const getOrdersByProvider = async (userId: string) => {
  const provider = await prisma.providerProfile.findUnique({
    where: { userId },
  });

  if (!provider) {
    return []; 
  }


  const orders = await prisma.order.findMany({
    where: {
      orderItems: {
        some: {
          meal: {
            providerId: provider.id,
          },
        },
      },
    },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      orderItems: {
        where: {
          meal: {
            providerId: provider.id,
          },
        },
        include: {
          meal: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return orders;
};

const getOrderById = async (orderId: string) => {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: { orderItems: { include: { meal: true } } },
  });
};

const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
  return prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
};

export const orderService = {
  createOrder,
  getOrdersByCustomer,
  getOrdersByProvider,
  getOrderById,
  updateOrderStatus,
};