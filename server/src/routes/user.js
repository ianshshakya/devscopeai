import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { getProfile, getRepositories, getStats } from '../services/userService.js';

const router = express.Router();

// GET /api/user/profile
router.get('/profile', authenticate, async (req, res, next) => {
  try {
    const profile = await getProfile(req.user.userId);
    res.json(profile);
  } catch (err) { next(err); }
});

// GET /api/user/repos
router.get('/repos', authenticate, async (req, res, next) => {
  try {
    const repos = await getRepositories(req.user.userId);
    res.json(repos);
  } catch (err) { next(err); }
});

// GET /api/user/stats
router.get('/stats', authenticate, async (req, res, next) => {
  try {
    const stats = await getStats(req.user.userId);
    res.json(stats);
  } catch (err) { next(err); }
});

export default router;
