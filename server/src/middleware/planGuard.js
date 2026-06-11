import User from '../models/User.js';
import { PLAN_LIMITS } from '../config/constants.js';

export const planGuard = (feature) => async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const limits = PLAN_LIMITS[user.plan] || PLAN_LIMITS.free;

    if (feature === 'analyses') {
      if (limits.analyses !== Infinity && user.analysisCount >= limits.analyses) {
        return res.status(403).json({
          error: 'Analysis limit reached',
          message: `Your ${user.plan} plan allows ${limits.analyses} analysis. Upgrade to Pro for unlimited analyses.`,
          upgradeRequired: true,
        });
      }
    }

    if (feature === 'aiReviews' && !limits.aiReviews) {
      return res.status(403).json({
        error: 'AI Reviews require Pro plan',
        upgradeRequired: true,
      });
    }

    if (feature === 'roadmaps' && !limits.roadmaps) {
      return res.status(403).json({
        error: 'Roadmaps require Pro plan',
        upgradeRequired: true,
      });
    }

    req.userPlan = user.plan;
    req.planLimits = limits;
    next();
  } catch (err) {
    next(err);
  }
};
