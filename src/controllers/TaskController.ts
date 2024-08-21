import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

export class TaskController {
    private prismaClient: PrismaClient;

    constructor() {
        this.prismaClient = new PrismaClient();
    }

    async create(request: Request, response: Response) {
        const { title, description, userId } = request.body;

        const task = await this.prismaClient.task.create({
            data: {
                title,
                description,
                userId,
            },
        });

        return response.status(201).json(task);
    }

    async getAll(request: Request, response: Response) {
        const tasks = await this.prismaClient.task.findMany();
        return response.json(tasks);
    }

    async getById(request: Request, response: Response) {
        const { id } = request.params;

        const task = await this.prismaClient.task.findUnique({
            where: { id: parseInt(id) },
        });

        if (!task) {
            return response.status(404).json({ message: 'Task not found' });
        }

        return response.json(task);
    }

    async update(request: Request, response: Response) {
        const { id } = request.params;
        const { title, description, completed } = request.body;

        const task = await this.prismaClient.task.findUnique({
            where: { id: parseInt(id) },
        });

        if (!task) {
            return response.status(404).json({ message: 'Task not found' });
        }

        const updatedTask = await this.prismaClient.task.update({
            where: { id: parseInt(id) },
            data: {
                title,
                description,
                completed,
            },
        });

        return response.json(updatedTask);
    }

    async delete(request: Request, response: Response) {
        const { id } = request.params;

        const task = await this.prismaClient.task.findUnique({
            where: { id: parseInt(id) },
        });

        if (!task) {
            return response.status(404).json({ message: 'Task not found' });
        }

        await this.prismaClient.task.delete({
            where: { id: parseInt(id) },
        });

        return response.status(204).send();
    }

    async markAsCompleted(request: Request, response: Response) {
        const { id } = request.params;

        const task = await this.prismaClient.task.findUnique({
            where: { id: parseInt(id) },
        });

        if (!task) {
            return response.status(404).json({ message: 'Task not found' });
        }

        const updatedTask = await this.prismaClient.task.update({
            where: { id: parseInt(id) },
            data: { completed: true },
        });

        return response.json(updatedTask);
    }

    async getCompletedTasks(request: Request, response: Response) {
        const completedTasks = await this.prismaClient.task.findMany({
            where: { completed: true },
        });
        return response.json(completedTasks);
    }

    async getIncompleteTasks(request: Request, response: Response) {
        const incompleteTasks = await this.prismaClient.task.findMany({
            where: { completed: false },
        });
        return response.json(incompleteTasks);
    }
    
}
