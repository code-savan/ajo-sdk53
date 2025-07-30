import express from 'express';
import {
  register,
  login,
  getMe,
  updateDetails,
  updatePassword
} from '../controllers/authController';
import { protect } from '../middleware/auth';
import {
  validateRegister,
  validateLogin,
  validateUpdatePassword,
  validate
} from '../utils/validation';

const router = express.Router();

router.post('/register', validateRegister, validate, register);
router.post('/login', validateLogin, validate, login);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, validateUpdatePassword, validate, updatePassword);

export default router;
