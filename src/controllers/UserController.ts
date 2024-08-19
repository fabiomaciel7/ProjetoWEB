import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { AuthController } from './AuthController';

export class UserController {
    private prismaClient: PrismaClient;
    private authController: AuthController;

    constructor() {
        this.prismaClient = new PrismaClient();
        this.authController = new AuthController();
    }

    async create(request: Request, response: Response) {
        const { name, email, password } = request.body;

        const existingUser = await this.prismaClient.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return response.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await this.prismaClient.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        return response.status(201).json(user);
    }

    async getAll(request: Request, response: Response) {
        const users = await this.prismaClient.user.findMany();
        return response.json(users);
    }

    async getById(request: Request, response: Response) {
        const { id } = request.params;

        const user = await this.prismaClient.user.findUnique({
            where: { id: parseInt(id) },
        });

        if (!user) {
            return response.status(404).json({ message: 'User not found' });
        }

        return response.json(user);
    }

    async update(request: Request, response: Response) {
        const { id } = request.params;
        const { name, email } = request.body;

        const user = await this.prismaClient.user.findUnique({
            where: { id: parseInt(id) },
        });

        if (!user) {
            return response.status(404).json({ message: 'User not found' });
        }

        const updatedUser = await this.prismaClient.user.update({
            where: { id: parseInt(id) },
            data: {
                name,
                email,
            },
        });

        return response.json(updatedUser);
    }

    async delete(request: Request, response: Response) {
        const { id } = request.params;

        const user = await this.prismaClient.user.findUnique({
            where: { id: parseInt(id) },
        });

        if (!user) {
            return response.status(404).json({ message: 'User not found' });
        }

        await this.prismaClient.user.delete({
            where: { id: parseInt(id) },
        });

        return response.status(204).send();
    }
}
