import express from 'express';
import {register, login} from '../controllers/AuthController.js';
import { proofSubmission } from '../controllers/proofController.js';
import { protect } from '../middleware/protect.js';
import {upload} from '../middleware/multer.js';
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/submit-proof', protect, upload.single('image') ,proofSubmission);

export default router;