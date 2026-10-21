import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.Routes.js';

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }),
);

app.use('/api/auth', authRoutes);

export default app;
