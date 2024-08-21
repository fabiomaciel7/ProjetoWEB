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
exports.TaskController = void 0;
const client_1 = require("@prisma/client");
class TaskController {
    constructor() {
        this.prismaClient = new client_1.PrismaClient();
    }
    create(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, description, userId } = request.body;
            const task = yield this.prismaClient.task.create({
                data: {
                    title,
                    description,
                    userId,
                },
            });
            return response.status(201).json(task);
        });
    }
    getAll(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const tasks = yield this.prismaClient.task.findMany();
            return response.json(tasks);
        });
    }
    getById(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            const task = yield this.prismaClient.task.findUnique({
                where: { id: parseInt(id) },
            });
            if (!task) {
                return response.status(404).json({ message: 'Task not found' });
            }
            return response.json(task);
        });
    }
    update(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            const { title, description, completed } = request.body;
            const task = yield this.prismaClient.task.findUnique({
                where: { id: parseInt(id) },
            });
            if (!task) {
                return response.status(404).json({ message: 'Task not found' });
            }
            const updatedTask = yield this.prismaClient.task.update({
                where: { id: parseInt(id) },
                data: {
                    title,
                    description,
                    completed,
                },
            });
            return response.json(updatedTask);
        });
    }
    delete(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            const task = yield this.prismaClient.task.findUnique({
                where: { id: parseInt(id) },
            });
            if (!task) {
                return response.status(404).json({ message: 'Task not found' });
            }
            yield this.prismaClient.task.delete({
                where: { id: parseInt(id) },
            });
            return response.status(204).send();
        });
    }
    markAsCompleted(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            const task = yield this.prismaClient.task.findUnique({
                where: { id: parseInt(id) },
            });
            if (!task) {
                return response.status(404).json({ message: 'Task not found' });
            }
            const updatedTask = yield this.prismaClient.task.update({
                where: { id: parseInt(id) },
                data: { completed: true },
            });
            return response.json(updatedTask);
        });
    }
    getCompletedTasks(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const completedTasks = yield this.prismaClient.task.findMany({
                where: { completed: true },
            });
            return response.json(completedTasks);
        });
    }
    getIncompleteTasks(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const incompleteTasks = yield this.prismaClient.task.findMany({
                where: { completed: false },
            });
            return response.json(incompleteTasks);
        });
    }
}
exports.TaskController = TaskController;
