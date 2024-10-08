import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import {isAdmin, verifyToken} from '../middlewares/AuthMiddleware';

const authController = new AuthController();
const router = Router();

router.post('/login', (req, res) => authController.login(req, res));
router.post('/logout', (req, res) => authController.logout(req, res));
router.get('/sessions',verifyToken, (req, res) => authController.listSessions(req, res));

export default router;
