import express from 'express';
import { signup, login } from '../../controllers/authController';
import validator from "./validator";
const router = express.Router();
router.post('/signup',validator.userSignupValidation, signup);
router.post('/login',validator.userSignInValidation, login);
export default router;
