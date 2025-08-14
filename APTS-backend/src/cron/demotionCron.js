import cron from 'node-cron';
import { demoteUsers } from '../controllers/AuthController.js';

export const startDemotion = ()=>{
    cron.schedule('0 0 * * *', async()=>{
        console.log('running demotion cron job');
        await demoteUsers();
    });
};
