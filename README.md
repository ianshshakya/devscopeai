# DevScope AI

> **Know If You're Actually Job Ready.**  
> Connect your GitHub. Get an AI-powered engineering review, career roadmap, and hiring readiness score.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- GitHub OAuth App
- DeepSeek or OpenAI API Key

### 1. Clone & Install
```bash
git clone <repo-url>
cd devscope-ai
npm install          # installs root + concurrently
cd server && npm install
cd ../client && npm install
```

### 2. Configure Environment
```bash
# Server
cp server/.env.example server/.env
# Edit server/.env with your credentials

# Client  
cp client/.env.example client/.env
```

### 3. Create GitHub OAuth App
1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Set **Homepage URL**: `http://localhost:5173`
4. Set **Callback URL**: `http://localhost:5000/auth/github/callback`
5. Copy `Client ID` and `Client Secret` to `server/.env`

### 4. Run Development
```bash
npm run dev          # starts both client (5173) and server (5000)
```

---

## 🏗 Project Structure

```
devscope-ai/
├── client/                   # React + Vite frontend
│   ├── src/
│   │   ├── pages/            # LandingPage, Dashboard, AnalysisPage, CareerReport, Roadmap, ComparisonEngine
│   │   ├── components/
│   │   │   └── layout/       # Navbar, Sidebar, Footer
│   │   ├── lib/              # api.js, authContext.jsx, utils.js
│   │   └── index.css         # Design system tokens + components
├── server/                   # Node.js + Express backend
│   ├── src/
│   │   ├── config/           # db.js, passport.js, constants.js
│   │   ├── models/           # User, Analysis, Report, Roadmap, Subscription
│   │   ├── routes/           # auth, user, analysis, report, roadmap, comparison
│   │   ├── services/         # githubService, analysisService, aiService, reportService, roadmapService
│   │   ├── middleware/        # auth.js, rateLimiter.js, planGuard.js
│   │   └── utils/            # metricsCalculator.js, promptBuilder.js
├── vercel.json               # Frontend deployment
├── render.yaml               # Backend deployment
└── .env.example              # Root env template
```

---

## 🔑 Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `GITHUB_CLIENT_ID` | GitHub OAuth App Client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App Client Secret |
| `GITHUB_CALLBACK_URL` | OAuth callback URL |
| `JWT_SECRET` | Random 64-char secret for JWT signing |
| `DEEPSEEK_API_KEY` | DeepSeek AI API key |
| `AI_PROVIDER` | `deepseek` or `openai` |

---

## 🤖 AI Analysis Pipeline

1. **GitHub Fetch** — repo metadata, file tree, languages, commit history, README
2. **Structural Analysis** — test detection, CI/CD, folder patterns, dependency audit
3. **Metric Scoring** — 7 categories scored algorithmically (docs, tests, security, etc.)
4. **AI Evaluation** — DeepSeek/GPT-4 refines scores with engineering judgment
5. **Report Generation** — role recommendations, salary estimates, roadmap

---

## 📊 Scoring Categories

| Category | Weight |
|----------|--------|
| Code Quality | 20% |
| Architecture | 18% |
| Documentation | 15% |
| Maintainability | 15% |
| Testing | 12% |
| Scalability | 12% |
| Security | 8% |

---

## 🚢 Deployment

**Frontend → Vercel**
```bash
cd client && npm run build
# Push to GitHub, connect to Vercel
```

**Backend → Render**
```bash
# Connect GitHub repo to Render
# Use render.yaml for service config
# Add env vars in Render dashboard
```

---

## 📋 Feature Roadmap

- [ ] Resume AI Review
- [ ] Portfolio Website Analyzer  
- [ ] Interview Question Predictor
- [ ] LinkedIn Integration
- [ ] LeetCode Score Integration
- [ ] PDF Report Export
- [ ] Recruiter Dashboard
- [ ] Team Hiring Analytics
