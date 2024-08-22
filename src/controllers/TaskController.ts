import { Request, Response } from 'express';
import { TaskService } from '../services/TaskService';
import { TaskDto } from '../dtos/TaskDto';

export class TaskController {
    private taskService: TaskService;

    constructor() {
        this.taskService = new TaskService();
    }

    async create(request: Request, response: Response) {
        const taskData: Omit<TaskDto, 'id' | 'completed' | 'createdAt' | 'updatedAt'> = request.body;
        const task = await this.taskService.createTask(taskData);
        return response.status(201).json(task);
    }

    async getAll(request: Request, response: Response) {
        const tasks = await this.taskService.getAllTasks();
        return response.json(tasks);
    }

    async getById(request: Request, response: Response) {
        const { id } = request.params;
        const task = await this.taskService.getTaskById(parseInt(id));
        if (!task) {
            return response.status(404).json({ message: 'Task not found' });
        }
        return response.json(task);
    }

    async update(request: Request, response: Response) {
        const { id } = request.params;
        const taskData: Partial<Omit<TaskDto, 'id' | 'completed' | 'createdAt' | 'updatedAt'>> = request.body;
        const task = await this.taskService.updateTask(parseInt(id), taskData);
        return response.json(task);
    }

    async delete(request: Request, response: Response) {
        const { id } = request.params;
        await this.taskService.deleteTask(parseInt(id));
        return response.status(204).send();
    }

    async markAsCompleted(request: Request, response: Response) {
        const { id } = request.params;
        const task = await this.taskService.markTaskAsCompleted(parseInt(id));
        return response.json(task);
    }

    async getCompletedTasks(request: Request, response: Response) {
        const tasks = await this.taskService.getCompletedTasks();
        return response.json(tasks);
    }

    async getIncompleteTasks(request: Request, response: Response) {
        const tasks = await this.taskService.getIncompleteTasks();
        return response.json(tasks);
    }
}
