import express from 'express';
import {register, login, logout, makeMeAdmin, allUsers, deleteUser, requestPasswordReset, resetPassword, getUser} from '../controllers/AuthController.js';
import { proofSubmission, getAllProofs, deleteProof } from '../controllers/proofController.js';
import { isLogin, isAdmin } from '../middleware/protect.js';
import {upload} from '../middleware/multer.js';
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout',isLogin, logout);
router.get('/get-all-users', isAdmin, allUsers);
router.get('/get-user', getUser);
router.delete('/delete/:id', isAdmin, deleteUser);
router.post('/make-admin', isLogin, makeMeAdmin);
router.post('/submit-proof', isLogin, upload.single('image'), proofSubmission);
router.get('/get-all-proofs', isAdmin, getAllProofs);
router.delete('/delete/proof/:id', isAdmin, deleteProof);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password/:token', resetPassword);


export default router;