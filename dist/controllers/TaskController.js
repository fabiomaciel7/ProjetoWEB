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
            try {
                const taskData = request.body;
                const task = yield this.taskService.createTask(taskData);
                return response.status(201).json(task);
            }
            catch (error) {
                console.error('Error creating task:', error);
                return response.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }
    getAll(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tasks = yield this.taskService.getAllTasks();
                return response.json(tasks);
            }
            catch (error) {
                console.error('Error getting tasks:', error);
                return response.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }
    getAllTasksGroupedByUser(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tasksGrouped = yield this.taskService.findAllGroupedByUser();
                return response.json(tasksGrouped);
            }
            catch (error) {
                console.error('Error getting tasks grouped by user:', error);
                return response.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }
    getById(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = request.params;
                const task = yield this.taskService.getTaskById(parseInt(id));
                if (!task) {
                    return response.status(404).json({ message: 'Task not found' });
                }
                return response.json(task);
            }
            catch (error) {
                console.error('Error getting task by ID:', error);
                return response.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }
    update(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = request.params;
                const taskData = request.body;
                const task = yield this.taskService.updateTask(parseInt(id), taskData);
                return response.json(task);
            }
            catch (error) {
                console.error('Error updating task:', error);
                return response.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }
    delete(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = request.params;
                yield this.taskService.deleteTask(parseInt(id));
                return response.status(204).send();
            }
            catch (error) {
                console.error('Error deleting task:', error);
                return response.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }
    markAsCompleted(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = request.params;
                const task = yield this.taskService.markTaskAsCompleted(parseInt(id));
                return response.json(task);
            }
            catch (error) {
                console.error('Error marking task as completed:', error);
                return response.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }
    getCompletedTasks(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tasks = yield this.taskService.getCompletedTasks();
                return response.json(tasks);
            }
            catch (error) {
                console.error('Error getting completed tasks:', error);
                return response.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }
    getIncompleteTasks(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tasks = yield this.taskService.getIncompleteTasks();
                return response.json(tasks);
            }
            catch (error) {
                console.error('Error getting incomplete tasks:', error);
                return response.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }
}
exports.TaskController = TaskController;
