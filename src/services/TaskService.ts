import { PrismaClient } from '@prisma/client';

export class TaskService {
    private prismaClient: PrismaClient;

    constructor() {
        this.prismaClient = new PrismaClient();
    }

    async createTask(data: { title: string; description?: string; userId: number }) {
        return this.prismaClient.task.create({ data });
    }

    async getAllTasks() {
        return this.prismaClient.task.findMany();
    }

    async getTaskById(id: number) {
        return this.prismaClient.task.findUnique({ where: { id } });
    }

    async updateTask(id: number, data: { title?: string; description?: string }) {
        return this.prismaClient.task.update({
            where: { id },
            data,
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
