import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './lib/authContext'

const LandingPage = lazy(() => import('./pages/LandingPage'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const AnalysisPage = lazy(() => import('./pages/AnalysisPage'))
const CareerReport = lazy(() => import('./pages/CareerReport'))
const Roadmap = lazy(() => import('./pages/Roadmap'))
const ComparisonEngine = lazy(() => import('./pages/ComparisonEngine'))
const AuthCallback = lazy(() => import('./pages/AuthCallback'))

// Public Pages
const RoastPage = lazy(() => import('./pages/RoastPage'))
const PublicScanner = lazy(() => import('./pages/PublicScanner'))
const RoadmapGenerator = lazy(() => import('./pages/RoadmapGenerator'))
const SkillDNA = lazy(() => import('./pages/SkillDNA'))
const JobReadinessQuiz = lazy(() => import('./pages/JobReadinessQuiz'))
const ProjectIdeas = lazy(() => import('./pages/ProjectIdeas'))

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <PageLoader />
  if (!user) return <Navigate to="/" replace />
  return children
}

const PageLoader = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#080b14' }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: 48, height: 48, border: '3px solid rgba(99,102,241,0.2)',
        borderTopColor: '#6366f1', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite', margin: '0 auto 16px'
      }} />
      <p style={{ color: '#8b9cc8', fontSize: 14 }}>Loading DevScope AI...</p>
    </div>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
)

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/analysis" element={
          <ProtectedRoute><AnalysisPage /></ProtectedRoute>
        } />
        <Route path="/analysis/:id" element={
          <ProtectedRoute><AnalysisPage /></ProtectedRoute>
        } />
        <Route path="/report" element={
          <ProtectedRoute><CareerReport /></ProtectedRoute>
        } />
        <Route path="/roadmap" element={
          <ProtectedRoute><Roadmap /></ProtectedRoute>
        } />
        <Route path="/compare" element={
          <ProtectedRoute><ComparisonEngine /></ProtectedRoute>
        } />

        {/* Public Routes */}
        <Route path="/roast" element={<RoastPage />} />
        <Route path="/scan" element={<PublicScanner />} />
        <Route path="/roadmap-gen" element={<RoadmapGenerator />} />
        <Route path="/skill-dna" element={<SkillDNA />} />
        <Route path="/quiz" element={<JobReadinessQuiz />} />
        <Route path="/project-ideas" element={<ProjectIdeas />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

