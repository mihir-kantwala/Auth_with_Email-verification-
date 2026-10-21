import { Router } from 'express';

const router = Router();

import {
  register,
  verifyEmail,
  login,
} from '../controllers/auth.Controller.js';

router.post('/register', register);
router.post('/verify-email', verifyEmail);
router.post('/login', login);

export default router;
