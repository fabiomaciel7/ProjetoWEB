import { PrismaClient, Task } from '@prisma/client';

export class TaskRepository {
    private prismaClient: PrismaClient;

    constructor() {
        this.prismaClient = new PrismaClient();
    }

    async create(data: { title: string; description?: string; userId: number; dueDate?: Date }): Promise<Task> {
        return this.prismaClient.task.create({
            data: {
                title: data.title,
                description: data.description,
                userId: data.userId,
                dueDate: data.dueDate,
            },
        });
    }

    async findAll(): Promise<Task[]> {
        return this.prismaClient.task.findMany();
    }

    async findAllGroupedByUser(): Promise<{ [key: number]: Task[] }> {
        const tasks = await this.prismaClient.task.findMany({
            include: {
                user: true,
            },
            orderBy: {
                userId: 'asc',
            },
        });

        const groupedTasks = tasks.reduce((grouped, task) => {
            const { userId } = task;
            if (!grouped[userId]) {
                grouped[userId] = [];
            }
            grouped[userId].push(task);
            return grouped;
        }, {} as { [key: number]: Task[] });

        return groupedTasks;
    }

    async findById(id: number): Promise<Task | null> {
        return this.prismaClient.task.findUnique({ where: { id } });
    }

    async update(id: number, data: { title?: string; description?: string; dueDate?: Date }): Promise<Task> {
        return this.prismaClient.task.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description,
                dueDate: data.dueDate,
            },
        });
    }

    async delete(id: number): Promise<Task> {
        return this.prismaClient.task.delete({ where: { id } });
    }

    async markAsCompleted(id: number): Promise<Task> {
        return this.prismaClient.task.update({
            where: { id },
            data: { completed: true },
        });
    }

    async findCompleted(): Promise<Task[]> {
        return this.prismaClient.task.findMany({ where: { completed: true } });
    }

    async findIncomplete(): Promise<Task[]> {
        return this.prismaClient.task.findMany({ where: { completed: false } });
    }

    async findByUserId(userId: number): Promise<Task[]> {
        return this.prismaClient.task.findMany({ where: { userId } });
    }
}
