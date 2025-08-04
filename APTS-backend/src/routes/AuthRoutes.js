import express from 'express';
import {register, login, makeMeAdmin, allUsers, deleteUser} from '../controllers/AuthController.js';
import { proofSubmission, proofApproval, getAllProofs, deleteProof } from '../controllers/proofController.js';
import { isLogin, isAdmin } from '../middleware/protect.js';
import {upload} from '../middleware/multer.js';
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/get-all-users', isAdmin, allUsers);
router.delete('/delete/:id', isAdmin, deleteUser);
router.post('/make-admin', isLogin, makeMeAdmin);
router.post('/submit-proof', isLogin, upload.single('image') ,proofSubmission);
router.get('/get-all-proofs', isAdmin, getAllProofs);
router.delete('/delete/proof/:id', isAdmin, deleteProof);
router.post('/approve/:id', isAdmin, proofApproval);

export default router;