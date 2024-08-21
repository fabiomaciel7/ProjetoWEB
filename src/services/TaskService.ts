import { PrismaClient } from '@prisma/client';

export class TaskService {
    private prismaClient: PrismaClient;

    constructor() {
        this.prismaClient = new PrismaClient();
    }

    async createTask(data: { title: string; description?: string; userId: number; dueDate?: Date }) {
        return this.prismaClient.task.create({
            data: {
                title: data.title,
                description: data.description,
                userId: data.userId,
                dueDate: data.dueDate,
            },
        });
    }

    async getAllTasks() {
        return this.prismaClient.task.findMany();
    }

    async getTaskById(id: number) {
        return this.prismaClient.task.findUnique({ where: { id } });
    }

    async updateTask(id: number, data: { title?: string; description?: string; dueDate?: Date }) {
        return this.prismaClient.task.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description,
                dueDate: data.dueDate,
            },
        });
    }

    async deleteTask(id: number) {
        return this.prismaClient.task.delete({ where: { id } });
    }

    async markTaskAsCompleted(id: number) {
        return this.prismaClient.task.update({
            where: { id },
            data: { completed: true },
        });
    }

    async getCompletedTasks() {
        return this.prismaClient.task.findMany({ where: { completed: true } });
    }

    async getIncompleteTasks() {
        return this.prismaClient.task.findMany({ where: { completed: false } });
    }

    async getTasksByUserId(userId: number) {
        return this.prismaClient.task.findMany({ where: { userId } });
    }
}
