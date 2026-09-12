import express from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// 1. Authenticate user session for all user management routes
router.use(authenticateUser);

// 2. Restrict all user management routes to ADMIN role only
router.use(authorizeRoles('ADMIN'));

// Route definitions
router.route('/')
  .get(getUsers);

router.route('/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

export default router;