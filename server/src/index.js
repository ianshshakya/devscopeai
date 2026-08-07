import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { configurePassport } from './config/passport.js';

// Routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import analysisRoutes from './routes/analysis.js';
import reportRoutes from './routes/report.js';
import roadmapRoutes from './routes/roadmap.js';
import comparisonRoutes from './routes/comparison.js';
import publicRoutes from './routes/public.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Connect Database ─────────────────────────────────────────
connectDB();

// ─── Middleware ───────────────────────────────────────────────
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'https://devscopeai-teal.vercel.app'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.JWT_SECRET || 'devscope_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
}));

// ─── Passport ─────────────────────────────────────────────────
configurePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

// ─── Routes ───────────────────────────────────────────────────
app.use('/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/comparison', comparisonRoutes);
app.use('/api/public', publicRoutes);

// ─── Health Check ─────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Global Error Handler ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

app.listen(PORT, () => {
  console.log(`🚀 DevScope AI Server running on http://localhost:${PORT}`);
});
