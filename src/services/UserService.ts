import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

export class UserService {
    private prismaClient: PrismaClient;

    constructor() {
        this.prismaClient = new PrismaClient();
    }

    async createUser(data: { name: string; email: string; password: string }) {
        const existingUser = await this.prismaClient.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        
        return this.prismaClient.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
            },
        });
    }

    async getAllUsers() {
        return this.prismaClient.user.findMany();
    }

    async getUserById(id: number) {
        return this.prismaClient.user.findUnique({
            where: { id },
        });
    }

    async updateUser(id: number, data: { name?: string; email?: string }) {
        return this.prismaClient.user.update({
            where: { id },
            data,
        });
    }

    async deleteUser(id: number) {
        return this.prismaClient.user.delete({
            where: { id },
        });
    }

    async getUserTasks(id: number) {
        return this.prismaClient.user.findUnique({
            where: { id },
            include: { tasks: true },
        });
    }
}
