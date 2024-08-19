import express, { Request, Response } from 'express';
import path from 'path';
import userRoutes from './routes/UserRoutes';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api', userRoutes);

app.get('/hello', (req: Request, res: Response) => {
  res.send('Hello, world!');
});

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
