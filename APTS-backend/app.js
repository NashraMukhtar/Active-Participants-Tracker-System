import express from 'express';
import dotenv from 'dotenv';
import router from './src/routes/hello.js';
import AuthRoutes from './src/routes/AuthRoutes.js';
import cookieParser from 'cookie-parser';
import cors from "cors";


const app = express();
dotenv.config();

app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());
app.use('/hello',router);
app.use('/user',AuthRoutes);

export default app;