import express from 'express';
import {register, login, makeMeAdmin} from '../controllers/AuthController.js';
import { proofSubmission, proofApproval } from '../controllers/proofController.js';
import { isLogin, isAdmin } from '../middleware/protect.js';
import {upload} from '../middleware/multer.js';
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/make-admin', isLogin, makeMeAdmin);
router.post('/submit-proof', isLogin, upload.single('image') ,proofSubmission);
router.post('/approve/:id', isLogin, isAdmin, proofApproval);

export default router;