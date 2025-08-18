import cron from 'node-cron';
import { demoteUsers } from '../controllers/AuthController.js';
import { deleteExpiredProofs } from '../controllers/proofController.js';

export const startDemotionAndDeletion = ()=>{
    cron.schedule('* * * * *', async()=>{
        console.log('running cron job for User Demotion and Proof Deletion');
        await demoteUsers();
        await deleteExpiredProofs();
    });
};
