"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskRepository = void 0;
const client_1 = require("@prisma/client");
class TaskRepository {
    constructor() {
        this.prismaClient = new client_1.PrismaClient();
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaClient.task.create({
                data: {
                    title: data.title,
                    description: data.description,
                    userId: data.userId,
                    dueDate: data.dueDate,
                },
            });
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaClient.task.findMany();
        });
    }
    findAllGroupedByUser() {
        return __awaiter(this, void 0, void 0, function* () {
            const tasks = yield this.prismaClient.task.findMany({
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
            }, {});
            return groupedTasks;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaClient.task.findUnique({ where: { id } });
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaClient.task.update({
                where: { id },
                data: {
                    title: data.title,
                    description: data.description,
                    dueDate: data.dueDate,
                },
            });
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaClient.task.delete({ where: { id } });
        });
    }
    markAsCompleted(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaClient.task.update({
                where: { id },
                data: { completed: true },
            });
        });
    }
    findCompleted() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaClient.task.findMany({ where: { completed: true } });
        });
    }
    findIncomplete() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaClient.task.findMany({ where: { completed: false } });
        });
    }
    findByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaClient.task.findMany({ where: { userId } });
        });
    }
    findCompletedByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaClient.task.findMany({
                where: {
                    userId,
                    completed: true,
                },
            });
        });
    }
    findIncompleteByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaClient.task.findMany({
                where: {
                    userId,
                    completed: false,
                },
            });
        });
    }
}
exports.TaskRepository = TaskRepository;
