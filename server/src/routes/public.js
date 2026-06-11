import express from 'express';
import rateLimit from 'express-rate-limit';
import { getPublicUserProfile, calculatePublicScore } from '../services/publicGithubService.js';
import { analyzeWithAI } from '../services/aiService.js';
import { buildRoastPrompt, buildPublicRoadmapPrompt, buildProjectIdeasPrompt } from '../utils/publicPrompts.js';

const router = express.Router();

// Rate limiter for public routes (no auth)
const publicLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { error: 'Too many requests, slow down!' },
  keyGenerator: (req) => req.ip,
});

// ─── GET /api/public/scan/:username ───────────────────────────
router.get('/scan/:username', publicLimiter, async (req, res, next) => {
  try {
    const { username } = req.params;
    if (!username || username.length > 39) {
      return res.status(400).json({ error: 'Invalid GitHub username' });
    }

    const data = await getPublicUserProfile(username);
    const score = calculatePublicScore(data.metrics, data.profile);

    // Determine tech stack category
    const langs = Object.keys(data.metrics.languages);
    const frontendLangs = ['JavaScript', 'TypeScript', 'HTML', 'CSS', 'Vue', 'Svelte'];
    const backendLangs = ['Python', 'Java', 'Go', 'Rust', 'PHP', 'Ruby', 'C#'];
    const isFrontend = langs.some(l => frontendLangs.includes(l));
    const isBackend = langs.some(l => backendLangs.includes(l));

    let techProfile = 'General Developer';
    if (isFrontend && isBackend) techProfile = 'Full Stack Developer';
    else if (isFrontend) techProfile = 'Frontend Developer';
    else if (isBackend) techProfile = 'Backend Developer';
    else if (langs.includes('Dart') || langs.includes('Swift') || langs.includes('Kotlin')) techProfile = 'Mobile Developer';

    res.json({ ...data, score, techProfile });
  } catch (err) {
    if (err.response?.status === 404) {
      return res.status(404).json({ error: 'GitHub user not found' });
    }
    next(err);
  }
});

// ─── GET /api/public/roast/:username ──────────────────────────
router.get('/roast/:username', publicLimiter, async (req, res, next) => {
  try {
    const { username } = req.params;
    const data = await getPublicUserProfile(username);
    const score = calculatePublicScore(data.metrics, data.profile);
    const prompt = buildRoastPrompt(username, data.metrics, data.topRepos, data.profile);
    const roast = await analyzeWithAI(prompt);
    res.json({ profile: data.profile, metrics: data.metrics, score, roast });
  } catch (err) {
    if (err.response?.status === 404) {
      return res.status(404).json({ error: 'GitHub user not found' });
    }
    next(err);
  }
});

// ─── POST /api/public/roadmap ──────────────────────────────────
router.post('/roadmap', publicLimiter, async (req, res, next) => {
  try {
    const { currentRole, targetRole } = req.body;
    if (!currentRole || !targetRole) {
      return res.status(400).json({ error: 'currentRole and targetRole are required' });
    }
    const prompt = buildPublicRoadmapPrompt(currentRole, targetRole);
    const roadmap = await analyzeWithAI(prompt);
    res.json(roadmap);
  } catch (err) { next(err); }
});

// ─── POST /api/public/project-ideas ───────────────────────────
router.post('/project-ideas', publicLimiter, async (req, res, next) => {
  try {
    const { skillLevel = 'beginner', targetRole = 'Frontend Developer', techStack = 'JavaScript, React' } = req.body;
    const prompt = buildProjectIdeasPrompt(skillLevel, targetRole, techStack);
    const ideas = await analyzeWithAI(prompt);
    res.json(ideas);
  } catch (err) { next(err); }
});

export default router;
