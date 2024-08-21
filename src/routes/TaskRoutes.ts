import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';

const taskController = new TaskController();
const router = Router();

router.post('/task/create', (req, res) => taskController.create(req, res));
router.get('/tasks', (req, res) => taskController.getAll(req, res));
router.get('/task/:id', (req, res) => taskController.getById(req, res));
router.put('/updateTask/:id', (req, res) => taskController.update(req, res));
router.delete('/deleteTask/:id', (req, res) => taskController.delete(req, res));
router.patch('/task/:id/complete', (req, res) => taskController.markAsCompleted(req, res));
router.get('/tasks/completed', (req, res) => taskController.getCompletedTasks(req, res));
router.get('/tasks/pending', (req, res) => taskController.getIncompleteTasks(req, res));

export default router;
