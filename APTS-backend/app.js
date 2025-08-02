import express from 'express';
import dotenv from 'dotenv';
import router from './src/routes/hello.js';
import AuthRoutes from './src/routes/AuthRoutes.js';

const app = express();
dotenv.config();

app.use(express.json());
app.use('/hello',router);
app.use('/user',AuthRoutes);

export default app;