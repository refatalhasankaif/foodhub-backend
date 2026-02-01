import { UserStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";


const getDashboardStats = async () => {

    const totalUsers = await prisma.user.count();

    const totalCustomers = await prisma.user.count({
        where: { role: "CUSTOMER" },
    });
    const totalProviders = await prisma.user.count({
        where: { role: "PROVIDER" },
    });
    const totalOrders = await prisma.order.count();

    const revenueData = await prisma.order.aggregate({
        _sum: {
            totalAmount: true,
        },
    });
    const totalRevenue = revenueData._sum.totalAmount || 0;

    return {
        totalUsers,
        totalCustomers,
        totalProviders,
        totalOrders,
        totalRevenue,
    };
};

const getAllUsers = async () => {
    return prisma.user.findMany();
};

const updateUserStatus = async (userId: string, status: UserStatus) => {
    return prisma.user.update({
        where: { id: userId },
        data: { status },
    });
};

const getAllCategories = async () => {
    return prisma.category.findMany();
};

const createCategory = async (name: string) => {
    return prisma.category.create({ data: { name } });
};

const updateCategory = async (id: string, name: string) => {
    return prisma.category.update({ where: { id }, data: { name } });
};

const deleteCategory = async (id: string) => {
    return prisma.category.delete({ where: { id } });
};

const getAllOrders = async () => {
    return prisma.order.findMany({
        include: { orderItems: { include: { meal: true } } },
    });
};

export const adminService = {
    getDashboardStats,
    getAllUsers,
    updateUserStatus,
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getAllOrders,
};