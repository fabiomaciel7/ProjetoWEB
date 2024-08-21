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
exports.TaskService = void 0;
const client_1 = require("@prisma/client");
class TaskService {
    constructor() {
        this.prismaClient = new client_1.PrismaClient();
    }
    createTask(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaClient.task.create({ data });
        });
    }
    getAllTasks() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaClient.task.findMany();
        });
    }
    getTaskById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaClient.task.findUnique({ where: { id } });
        });
    }
    updateTask(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaClient.task.update({
                where: { id },
                data,
            });
        });
    }
    deleteTask(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaClient.task.delete({ where: { id } });
        });
    }
    markTaskAsCompleted(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaClient.task.update({
                where: { id },
                data: { completed: true },
            });
        });
    }
    getCompletedTasks() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaClient.task.findMany({ where: { completed: true } });
        });
    }
    getIncompleteTasks() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaClient.task.findMany({ where: { completed: false } });
        });
    }
    getTasksByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaClient.task.findMany({ where: { userId } });
        });
    }
}
exports.TaskService = TaskService;
