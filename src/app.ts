import express from 'express';
import path from 'path';
import cors from 'cors';
import userRoutes from './routes/UserRoutes';
import taskRoutes from './routes/TaskRoutes';
import authRoutes from './routes/AuthRoutes';

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'], 
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api', userRoutes);
app.use('/api', taskRoutes);
app.use('/api', authRoutes);

app.get('/hello', (req, res) => {
  res.send('Hello, world!');
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

export default app;