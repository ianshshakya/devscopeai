import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { getComparison } from '../services/comparisonService.js';

const router = express.Router();

// GET /api/comparison
router.get('/', authenticate, async (req, res, next) => {
  try {
    const data = await getComparison(req.user.userId);
    res.json(data);
  } catch (err) { next(err); }
});

export default router;
