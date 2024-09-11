import { Request, Response } from 'express';
import { TaskService } from '../services/TaskService';
import { TaskDto } from '../dtos/TaskDto';
import { createTaskSchema } from '../validation/TaskCreateValidation';
import { updateTaskSchema } from '../validation/TaskUpdateValidation';

export class TaskController {
    private taskService: TaskService;

    constructor() {
        this.taskService = new TaskService();
    }

    async create(request: Request, response: Response) {
        try {

            if (!request.userId) {
                return response.status(400).json({ message: 'User ID is required' });
            }

            const { error,value } = createTaskSchema.validate(request.body, { abortEarly: false });

            if (error) {
                return response.status(400).json({ 
                    message: 'Erro de validação',
                    details: error.details.map(detail => detail.message),
                });
            }

            const taskData: Omit<TaskDto, 'id' | 'completed' | 'createdAt' | 'updatedAt'> = value;
            taskData.userId = request.userId;

            const task = await this.taskService.createTask(taskData);
            return response.status(201).json(task);
        } catch (error) {
            console.error('Error creating task:', error);
            return response.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async getAll(request: Request, response: Response) {
        try {
            if (typeof request.userId === 'undefined' || typeof request.isAdmin === 'undefined') {
                return response.status(400).json({ message: 'User ID and admin status are required' });
            }

            const tasks = await this.taskService.getAllTasks(request.isAdmin, request.userId);
            return response.json(tasks);
        } catch (error) {
            console.error('Error getting tasks:', error);
            return response.status(500).json({ message: 'Internal Server Error' });
        }
    }
    
    async getAllTasksGroupedByUser(request: Request, response: Response) {
        try {
            if (!request.isAdmin) {
                return response.status(403).json({ message: 'Access denied' });
            }

            const tasksGrouped = await this.taskService.findAllGroupedByUser();
            return response.json(tasksGrouped);
        } catch (error) {
            console.error('Error getting tasks grouped by user:', error);
            return response.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async getById(request: Request, response: Response) {
        try {
            if (typeof request.userId === 'undefined' || typeof request.isAdmin === 'undefined') {
                return response.status(400).json({ message: 'User ID and admin status are required' });
            }

            const { id } = request.params;
            const task = await this.taskService.getTaskById(parseInt(id), request.userId, request.isAdmin);

            if (!task) {
                return response.status(404).json({ message: 'Task not found or access denied' });
            }

            return response.json(task);
        } catch (error) {
            console.error('Error getting task by ID:', error);
            return response.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async update(request: Request, response: Response) {
        try {
            if (typeof request.userId === 'undefined' || typeof request.isAdmin === 'undefined') {
                return response.status(400).json({ message: 'User ID and admin status are required' });
            }

            const { error,value } = updateTaskSchema.validate(request.body, { abortEarly: false });

            if (error) {
                return response.status(400).json({ 
                    message: 'Erro de validação',
                    details: error.details.map(detail => detail.message),
                });
            }

            const { id } = request.params;
            const taskData: Partial<Omit<TaskDto, 'id' | 'completed' | 'createdAt' | 'updatedAt'>> = value;
            const task = await this.taskService.updateTask(parseInt(id), taskData, request.userId, request.isAdmin);

            return response.json(task);
        } catch (error) {
            console.error('Error updating task:', error);
            return response.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async delete(request: Request, response: Response) {
        try {
            if (typeof request.userId === 'undefined' || typeof request.isAdmin === 'undefined') {
                return response.status(400).json({ message: 'User ID and admin status are required' });
            }

            const { id } = request.params;
            await this.taskService.deleteTask(parseInt(id), request.userId, request.isAdmin);

            return response.status(204).send();
        } catch (error) {
            console.error('Error deleting task:', error);
            return response.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async markAsCompleted(request: Request, response: Response) {
        try {
            if (typeof request.userId === 'undefined' || typeof request.isAdmin === 'undefined') {
                return response.status(400).json({ message: 'User ID and admin status are required' });
            }

            const { id } = request.params;
            const task = await this.taskService.markTaskAsCompleted(parseInt(id), request.userId, request.isAdmin);

            return response.json(task);
        } catch (error) {
            console.error('Error marking task as completed:', error);
            return response.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async getCompletedTasks(request: Request, response: Response) {
        try {
            if (typeof request.userId === 'undefined' || typeof request.isAdmin === 'undefined') {
                return response.status(400).json({ message: 'User ID and admin status are required' });
            }

            const tasks = await this.taskService.getCompletedTasks(request.isAdmin, request.userId);
            return response.json(tasks);
        } catch (error) {
            console.error('Error getting completed tasks:', error);
            return response.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async getIncompleteTasks(request: Request, response: Response) {
        try {
            if (typeof request.userId === 'undefined' || typeof request.isAdmin === 'undefined') {
                return response.status(400).json({ message: 'User ID and admin status are required' });
            }

            const tasks = await this.taskService.getIncompleteTasks(request.isAdmin, request.userId);
            return response.json(tasks);
        } catch (error) {
            console.error('Error getting incomplete tasks:', error);
            return response.status(500).json({ message: 'Internal Server Error' });
        }
    }
}
