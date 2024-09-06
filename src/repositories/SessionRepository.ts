import { PrismaClient } from '@prisma/client';

export class SessionRepository {
    private prismaClient: PrismaClient;

    constructor() {
        this.prismaClient = new PrismaClient();
    }

    async createSession(data: { token: string; userId: number; expiresAt: Date }) {
        return this.prismaClient.session.create({ data });
    }

    async findSessionByToken(token: string) {
        return this.prismaClient.session.findUnique({ where: { token } });
    }

    async deleteSession(token: string) {
        return this.prismaClient.session.delete({ where: { token } });
    }

    async listSessions() {
        return this.prismaClient.session.findMany();
    }

    async listUserSessions(userId: number) {
        return this.prismaClient.session.findMany({
            where: {
                userId: userId,
            },
        });
    }
}
