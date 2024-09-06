import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';
import { verifyToken, isAdmin } from '../middlewares/AuthMiddleware';

const taskController = new TaskController();
const router = Router();

router.post('/task/create', verifyToken,  (req, res) => taskController.create(req, res));
router.get('/tasks', verifyToken,  (req, res) => taskController.getAll(req, res));
router.get('/task/:id', verifyToken,  (req, res) => taskController.getById(req, res));
router.put('/task/update/:id', verifyToken,  (req, res) => taskController.update(req, res));
router.delete('/task/delete/:id', verifyToken,  (req, res) => taskController.delete(req, res));
router.patch('/task/:id/complete', verifyToken,  (req, res) => taskController.markAsCompleted(req, res));
router.get('/tasks/completed', verifyToken,  (req, res) => taskController.getCompletedTasks(req, res));
router.get('/tasks/pending', verifyToken,  (req, res) => taskController.getIncompleteTasks(req, res));
router.get('/tasks/byuser',verifyToken,  isAdmin, (req, res) => taskController.getAllTasksGroupedByUser(req, res));

export default router;