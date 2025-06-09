import express from 'express';
import { PrismaClient } from '@prisma/client';
import path from 'path';

const app = express();
const prisma = new PrismaClient();
const port = 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const newContact = await prisma.contact.create({
      data: {
        name,
        email,
        message,
      },
    });
    res.status(201).json({ message: 'Message sent successfully!', contact: newContact });
  } catch (error) {
    console.error('Error saving contact form:', error);
    res.status(500).json({ message: 'Failed to send message.' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});