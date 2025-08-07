import cron from 'node-cron';
import { demoteUsers } from '../controllers/AuthController.js';

export const startDemotion = ()=>{
    cron.schedule('* * * * *', async()=>{
        console.log('running demotion cron job');
        await demoteUsers();
    });
};
