import express from 'express';
import * as authController from '../controllers/auth.controller';
import { validate } from '../middlewares/validate';
import {
  loginUserSchema,
  registerUserSchema,
} from '../validators/user.validator';
import { authMiddleware } from '../middlewares/auth.middleware';
const router = express.Router();

router.post(
  '/register',
  validate(registerUserSchema),
  authController.registerUser,
);
router.post('/login', validate(loginUserSchema), authController.loginUser);
router.post('/logout', authMiddleware, authController.logoutUser);

export default router;
