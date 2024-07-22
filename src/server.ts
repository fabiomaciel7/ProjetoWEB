import express, { Request, Response } from 'express';
import path from 'path';


const app = express();
const port = 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, '..', 'public')));

let users: { id: number, name: string, email: string }[] = [
  { id: 1, name: 'Fabio', email: 'fabio@email.com' },
  { id: 2, name: 'Augusto', email: 'augusto@email.com' }
];

app.get('/users', (req: Request, res: Response) => {
  res.json(users);
});

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, world!');
});

app.get('/user/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const user = users.find(user => user.id === id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).send('User not found');
  }
});

app.post('/register', (req: Request, res: Response) => {
  const new_user = {
    id: users.length + 1,
    name: req.body.name,
    email: req.body.email
  };
  users.push(new_user);
  res.status(201).json(new_user);
});

app.delete('/users/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  users = users.filter(user => user.id !== id);
  res.status(204).send();
});

app.put('/users/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex(user => user.id === id);
  if (userIndex !== -1) {
    users[userIndex] = {
      id: id,
      name: req.body.nome,
      email: users[userIndex].email
    };
    res.json(users[userIndex]);
  } else {
    res.status(404).send('User not found');
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
