import { Request, Response } from 'express';
import { TaskService } from '../services/TaskService';
import { TaskDto } from '../dtos/TaskDto';

export class TaskController {
    private taskService: TaskService;

    constructor() {
        this.taskService = new TaskService();
    }

    async create(request: Request, response: Response) {
        try {
            const taskData: Omit<TaskDto, 'id' | 'completed' | 'createdAt' | 'updatedAt'> = request.body;
            const task = await this.taskService.createTask(taskData);
            return response.status(201).json(task);
        } catch (error) {
            console.error('Error creating task:', error);
            return response.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async getAll(request: Request, response: Response) {
        try {
            const tasks = await this.taskService.getAllTasks();
            return response.json(tasks);
        } catch (error) {
            console.error('Error getting tasks:', error);
            return response.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async getAllTasksGroupedByUser(request: Request, response: Response) {
        try {
            const tasksGrouped = await this.taskService.findAllGroupedByUser();
            return response.json(tasksGrouped);
        } catch (error) {
            console.error('Error getting tasks grouped by user:', error);
            return response.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async getById(request: Request, response: Response) {
        try {
            const { id } = request.params;
            const task = await this.taskService.getTaskById(parseInt(id));
            if (!task) {
                return response.status(404).json({ message: 'Task not found' });
            }
            return response.json(task);
        } catch (error) {
            console.error('Error getting task by ID:', error);
            return response.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async update(request: Request, response: Response) {
        try {
            const { id } = request.params;
            const taskData: Partial<Omit<TaskDto, 'id' | 'completed' | 'createdAt' | 'updatedAt'>> = request.body;
            const task = await this.taskService.updateTask(parseInt(id), taskData);
            return response.json(task);
        } catch (error) {
            console.error('Error updating task:', error);
            return response.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async delete(request: Request, response: Response) {
        try {
            const { id } = request.params;
            await this.taskService.deleteTask(parseInt(id));
            return response.status(204).send();
        } catch (error) {
            console.error('Error deleting task:', error);
            return response.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async markAsCompleted(request: Request, response: Response) {
        try {
            const { id } = request.params;
            const task = await this.taskService.markTaskAsCompleted(parseInt(id));
            return response.json(task);
        } catch (error) {
            console.error('Error marking task as completed:', error);
            return response.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async getCompletedTasks(request: Request, response: Response) {
        try {
            const tasks = await this.taskService.getCompletedTasks();
            return response.json(tasks);
        } catch (error) {
            console.error('Error getting completed tasks:', error);
            return response.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async getIncompleteTasks(request: Request, response: Response) {
        try {
            const tasks = await this.taskService.getIncompleteTasks();
            return response.json(tasks);
        } catch (error) {
            console.error('Error getting incomplete tasks:', error);
            return response.status(500).json({ message: 'Internal Server Error' });
        }
    }
}
