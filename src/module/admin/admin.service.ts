import { UserStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";


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
    getAllUsers,
    updateUserStatus,
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getAllOrders,
};
