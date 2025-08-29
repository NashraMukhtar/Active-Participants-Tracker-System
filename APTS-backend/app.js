import express from 'express';
import dotenv from 'dotenv';
import router from './src/routes/hello.js';
import AuthRoutes from './src/routes/AuthRoutes.js';
import cookieParser from 'cookie-parser';


const app = express();
dotenv.config();

app.use(express.json());
app.use('/hello',router);
app.use('/user',AuthRoutes);
app.use(cookieParser());

export default app;