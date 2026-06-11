import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { getRoadmap, generateRoadmap } from '../services/roadmapService.js';

const router = express.Router();

// GET /api/roadmap
router.get('/', authenticate, async (req, res, next) => {
  try {
    const roadmap = await getRoadmap(req.user.userId);
    res.json(roadmap);
  } catch (err) { next(err); }
});

// POST /api/roadmap/generate
router.post('/generate', authenticate, async (req, res, next) => {
  try {
    const roadmap = await generateRoadmap(req.user.userId);
    res.json(roadmap);
  } catch (err) { next(err); }
});

export default router;
