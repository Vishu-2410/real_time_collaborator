import express from 'express';
import authRoutes from './authRoutes.js';
import documentRoutes from './documentRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/documents', documentRoutes);

export default router;
