import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

export class UserRepository {
    private prismaClient: PrismaClient;

    constructor() {
        this.prismaClient = new PrismaClient();
    }

    async findByEmail(email: string) {
        return this.prismaClient.user.findUnique({
            where: { email },
        });
    }

    async create(data: { name: string; email: string; password: string }) {
        return this.prismaClient.user.create({
            data,
        });
    }

    async findAll() {
        return this.prismaClient.user.findMany();
    }

    async findById(id: number) {
        return this.prismaClient.user.findUnique({
            where: { id },
        });
    }

    async update(id: number, data: { name?: string; email?: string }) {
        return this.prismaClient.user.update({
            where: { id },
            data,
        });
    }

    async delete(id: number) {
        return this.prismaClient.user.delete({
            where: { id },
        });
    }

    async findUserWithTasks(id: number) {
        return this.prismaClient.user.findUnique({
            where: { id },
            include: {
                tasks: {
                    orderBy: {
                        dueDate: 'asc',
                    },
                },
            },
        });
    }

    async hashPassword(password: string) {
        return bcrypt.hash(password, 10);
    }
}
