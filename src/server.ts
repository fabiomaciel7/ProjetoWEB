import { UserController } from './controllers/UserController';
import express, { Request, Response } from 'express';
import {AuthController} from "./controllers/AuthController";
import path from 'path';


const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

const userController = new UserController();
const authController = new AuthController()

app.post('/user/create', (req, res) => userController.create(req, res));

app.post('/user/login', (req, res) => authController.login(req, res));

app.get('/validate-token', (req,res) => authController.validateToken(req, res));


app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.get('/hello', (req: Request, res: Response) => {
  res.send('Hello, world!');
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
