import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();

// ─── GitHub OAuth Login ───────────────────────────────────────
router.get('/github', passport.authenticate('github', {
  scope: ['user:email', 'read:user', 'public_repo'],
}));

// ─── GitHub OAuth Callback ────────────────────────────────────
router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:5173'}/?error=auth_failed` }),
  (req, res) => {
    const token = jwt.sign(
      { userId: req.user._id, username: req.user.username },
      process.env.JWT_SECRET || 'devscope_secret',
      { expiresIn: '7d' }
    );
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/auth/callback?token=${token}`);
  }
);

// ─── Logout ───────────────────────────────────────────────────
router.post('/logout', (req, res) => {
  req.logout(() => {
    res.json({ message: 'Logged out successfully' });
  });
});

export default router;
