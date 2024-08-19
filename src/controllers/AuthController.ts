import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';

export class AuthController {
    private prismaClient: PrismaClient;

    constructor() {
        this.prismaClient = new PrismaClient();
    }

    async login(request: Request, response: Response) {
        const { email, password } = request.body;

        const user = await this.prismaClient.user.findUnique({
            where: { email },
        });

        if (user && await bcrypt.compare(password, user.password)) {
            const token = uuidv4();

            await this.prismaClient.session.create({
                data: {
                    token,
                    userId: user.id,
                    expiresAt: new Date(Date.now() + 3600 * 1000), // Expira em 1 hora
                },
            });

            return response.json({ message: 'Login successful', token });
        } else {
            return response.status(401).json({ message: 'Invalid credentials' });
        }
    }

    async validateToken(request: Request, response: Response) {
        const token = request.headers['authorization']?.split(' ')[1];

        if (!token) {
            return response.status(401).json({ message: 'Token is missing' });
        }

        try {
            const session = await this.prismaClient.session.findUnique({
                where: { token },
            });

            if (session && session.expiresAt > new Date()) {
                return response.status(200).json({ message: 'Token is valid' });
            } else {
                return response.status(401).json({ message: 'Invalid or expired token' });
            }
        } catch (error) {
            return response.status(500).json({ message: 'Internal Server Error' });
        }
    }
}
