import mongoose from 'mongoose';
import app from "./app.js";
import { startDemotion } from './src/cron/demotionCron.js';

startDemotion();

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI).then(()=>{
    console.log('DATABASE CONNECTED!');
    app.listen(PORT, ()=>{console.log(`SERVER RUNNING ON ${PORT}`)});
}).catch((err)=>{console.error('mongodb connection error', err)});