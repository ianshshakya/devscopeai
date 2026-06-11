import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { planGuard } from '../middleware/planGuard.js';
import { analysisRateLimiter } from '../middleware/rateLimiter.js';
import {
  startAnalysis,
  getAnalysis,
  getAnalysisHistory,
  deleteAnalysis,
} from '../services/analysisService.js';

const router = express.Router();

// POST /api/analysis/start
router.post('/start', authenticate, analysisRateLimiter, planGuard('analyses'), async (req, res, next) => {
  try {
    const { repoFullName } = req.body;
    if (!repoFullName) return res.status(400).json({ error: 'repoFullName is required' });
    const analysis = await startAnalysis(req.user.userId, repoFullName);
    res.json(analysis);
  } catch (err) { next(err); }
});

// GET /api/analysis/:id
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const analysis = await getAnalysis(req.params.id, req.user.userId);
    if (!analysis) return res.status(404).json({ error: 'Analysis not found' });
    res.json(analysis);
  } catch (err) { next(err); }
});

// GET /api/analysis/history
router.get('/', authenticate, async (req, res, next) => {
  try {
    const history = await getAnalysisHistory(req.user.userId);
    res.json(history);
  } catch (err) { next(err); }
});

// DELETE /api/analysis/:id
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    await deleteAnalysis(req.params.id, req.user.userId);
    res.json({ message: 'Analysis deleted' });
  } catch (err) { next(err); }
});

export default router;
