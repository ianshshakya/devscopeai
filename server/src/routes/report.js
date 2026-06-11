import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { getReport, generateReport } from '../services/reportService.js';

const router = express.Router();

// GET /api/report — get current user's report
router.get('/', authenticate, async (req, res, next) => {
  try {
    const report = await getReport(req.user.userId);
    res.json(report);
  } catch (err) { next(err); }
});

// POST /api/report/generate — regenerate report from all analyses
router.post('/generate', authenticate, async (req, res, next) => {
  try {
    const report = await generateReport(req.user.userId);
    res.json(report);
  } catch (err) { next(err); }
});

export default router;
