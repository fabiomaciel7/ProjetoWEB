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
const TaskService_1 = require("../services/TaskService");
class TaskController {
    constructor() {
        this.taskService = new TaskService_1.TaskService();
    }
    create(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, description, userId, dueDate } = request.body;
            const task = yield this.taskService.createTask({ title, description, userId, dueDate });
            return response.status(201).json(task);
        });
    }
    getAll(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const tasks = yield this.taskService.getAllTasks();
            return response.json(tasks);
        });
    }
    getById(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            const task = yield this.taskService.getTaskById(parseInt(id));
            if (!task) {
                return response.status(404).json({ message: 'Task not found' });
            }
            return response.json(task);
        });
    }
    update(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            const { title, description, dueDate } = request.body;
            const task = yield this.taskService.updateTask(parseInt(id), { title, description, dueDate });
            return response.json(task);
        });
    }
    delete(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            yield this.taskService.deleteTask(parseInt(id));
            return response.status(204).send();
        });
    }
    markAsCompleted(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            const task = yield this.taskService.markTaskAsCompleted(parseInt(id));
            return response.json(task);
        });
    }
    getCompletedTasks(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const tasks = yield this.taskService.getCompletedTasks();
            return response.json(tasks);
        });
    }
    getIncompleteTasks(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const tasks = yield this.taskService.getIncompleteTasks();
            return response.json(tasks);
        });
    }
}
exports.TaskController = TaskController;
