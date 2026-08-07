import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Award, CheckCircle, AlertCircle, RefreshCw, BarChart2, BookOpen, ArrowRight, Zap, Target } from 'lucide-react'
import Navbar from '../components/layout/Navbar'

const QUESTIONS = [
  // --- JAVASCRIPT ---
  {
    category: 'javascript',
    q: 'What is the output of: console.log(typeof NaN)?',
    options: [
      { text: '"number"', isCorrect: true },
      { text: '"nan"', isCorrect: false },
      { text: '"undefined"', isCorrect: false },
      { text: '"object"', isCorrect: false },
    ],
    explanation: 'In JavaScript, NaN (Not-a-Number) is technically a numeric data type, so typeof NaN returns "number".',
  },
  {
    category: 'javascript',
    q: 'Which of the following describes JavaScript closures?',
    options: [
      { text: 'A function combined with its lexical environment references', isCorrect: true },
      { text: 'A way to close browser windows programmatically', isCorrect: false },
      { text: 'An object property that cannot be deleted', isCorrect: false },
      { text: 'A function that only executes once', isCorrect: false },
    ],
    explanation: 'A closure is the combination of a function bundled together with references to its surrounding state (the lexical environment).',
  },
  {
    category: 'javascript',
    q: 'What does the Event Loop do in JavaScript?',
    options: [
      { text: 'Monitors the Call Stack and moves tasks from the Callback Queue when the stack is empty', isCorrect: true },
      { text: 'Loops through array elements asynchronously', isCorrect: false },
      { text: 'Executes all setTimeout functions in parallel threads', isCorrect: false },
      { text: 'Prevents variables from leaking into the global scope', isCorrect: false },
    ],
    explanation: 'JavaScript is single-threaded. The Event Loop continually checks if the call stack is empty; if it is, it pushes tasks from the callback queue onto the stack.',
  },

  // --- REACT ---
  {
    category: 'react',
    q: 'Why should you avoid using array indexes as "key" props in React lists?',
    options: [
      { text: 'It can cause rendering bugs and performance issues when items are reordered/filtered', isCorrect: true },
      { text: 'React will throw a compile-time syntax error', isCorrect: false },
      { text: 'Array indexes are not unique enough for inline CSS', isCorrect: false },
      { text: 'It prevents the list from being sorted', isCorrect: false },
    ],
    explanation: 'Using indexes as keys can negatively impact performance and cause component state issues if the list order changes, as React uses keys to identify which elements changed, were added, or removed.',
  },
  {
    category: 'react',
    q: 'What is the primary purpose of the useMemo hook?',
    options: [
      { text: 'To cache the computed value of an expensive calculation between renders', isCorrect: true },
      { text: 'To memorize the entire component state history', isCorrect: false },
      { text: 'To perform side effects after rendering', isCorrect: false },
      { text: 'To store global mutable variables across page loads', isCorrect: false },
    ],
    explanation: 'useMemo returns a memoized value, recomputing it only when one of its dependencies changes. This optimizes performance by avoiding expensive calculations on every render.',
  },
  {
    category: 'react',
    q: 'When does React trigger a re-render of a component?',
    options: [
      { text: 'When state changes or props change', isCorrect: true },
      { text: 'Only when the parent component makes an API call', isCorrect: false },
      { text: 'On every mouse movement or scroll event', isCorrect: false },
      { text: 'When local variables inside the function change', isCorrect: false },
    ],
    explanation: 'React components automatically re-render whenever their local state values change, or when they receive new props from their parent component.',
  },

  // --- BACKEND ---
  {
    category: 'backend',
    q: 'What is the purpose of CORS (Cross-Origin Resource Sharing)?',
    options: [
      { text: 'A security mechanism that restricts resources on a web page from being requested from another domain', isCorrect: true },
      { text: 'An encryption protocol for database communication', isCorrect: false },
      { text: 'A method to compress API payloads', isCorrect: false },
      { text: 'A load balancing algorithm for web servers', isCorrect: false },
    ],
    explanation: 'CORS is a browser-enforced security mechanism that allows or restricts web applications running at one origin to access selected resources from a different origin.',
  },
  {
    category: 'backend',
    q: 'What does a 401 Unauthorized HTTP status code indicate?',
    options: [
      { text: 'The request requires authentication (or client credentials are invalid)', isCorrect: true },
      { text: 'The server understood the request but refuses to authorize it', isCorrect: false },
      { text: 'The requested resource was not found on the server', isCorrect: false },
      { text: 'The request is syntactically malformed', isCorrect: false },
    ],
    explanation: 'HTTP 401 indicates that the request has not been applied because it lacks valid authentication credentials for the target resource.',
  },
  {
    category: 'backend',
    q: 'In Node.js, what is the main benefit of using streams?',
    options: [
      { text: 'It allows reading/writing files in small chunks without loading the entire file into memory', isCorrect: true },
      { text: 'It automatically encrypts data during transmission', isCorrect: false },
      { text: 'It speeds up CPU-intensive algorithms using multi-threading', isCorrect: false },
      { text: 'It creates a direct websocket connection with the client', isCorrect: false },
    ],
    explanation: 'Streams allow you to process data chunk by chunk, which is highly memory-efficient when handling large files or real-time network packets.',
  },

  // --- SQL / DATABASE ---
  {
    category: 'database',
    q: 'What is the difference between INNER JOIN and LEFT JOIN in SQL?',
    options: [
      { text: 'INNER JOIN returns only matching rows; LEFT JOIN returns all rows from the left table and matched rows from the right', isCorrect: true },
      { text: 'INNER JOIN is for NoSQL; LEFT JOIN is for relational databases', isCorrect: false },
      { text: 'LEFT JOIN is faster because it does not validate foreign key constraints', isCorrect: false },
      { text: 'There is no difference; they are aliases for the same operation', isCorrect: false },
    ],
    explanation: 'INNER JOIN returns rows when there is a match in both tables. LEFT JOIN returns all rows from the left table, and matching rows from the right table (with NULLs for non-matches).',
  },
  {
    category: 'database',
    q: 'What is database indexing primarily used for?',
    options: [
      { text: 'To speed up data retrieval queries at the cost of slower write operations', isCorrect: true },
      { text: 'To compress database files and save hard disk space', isCorrect: false },
      { text: 'To enforce absolute data integrity between tables', isCorrect: false },
      { text: 'To automatically backup the database in real-time', isCorrect: false },
    ],
    explanation: 'An index is a data structure (like a B-Tree) that makes searching for rows much faster, though it introduces slight overhead on insertions, updates, and deletions.',
  },
  {
    category: 'database',
    q: 'What does ACID stand for in database transactions?',
    options: [
      { text: 'Atomicity, Consistency, Isolation, Durability', isCorrect: true },
      { text: 'Async, Cache, Index, Distributed', isCorrect: false },
      { text: 'Authentication, Cryptography, Integrity, Decryption', isCorrect: false },
      { text: 'Access, Connection, Instance, Driver', isCorrect: false },
    ],
    explanation: 'ACID is a set of properties (Atomicity, Consistency, Isolation, Durability) that guarantee database transactions are processed reliably.',
  },

  // --- SYSTEM DESIGN ---
  {
    category: 'systemDesign',
    q: 'What is the main purpose of a Content Delivery Network (CDN)?',
    options: [
      { text: 'To cache static assets closer to users to reduce latency', isCorrect: true },
      { text: 'To balance HTTP traffic across backend database clusters', isCorrect: false },
      { text: 'To dynamically generate HTML templates on the fly', isCorrect: false },
      { text: 'To scan code repositories for security vulnerabilities', isCorrect: false },
    ],
    explanation: 'A CDN is a geographically distributed group of servers that work together to provide fast delivery of static assets like images, scripts, stylesheet files, and videos.',
  },
  {
    category: 'systemDesign',
    q: 'What is horizontal scaling?',
    options: [
      { text: 'Adding more server nodes/machines to the system pool', isCorrect: true },
      { text: 'Upgrading the CPU or RAM of an existing single machine', isCorrect: false },
      { text: 'Splitting database tables into columns instead of rows', isCorrect: false },
      { text: 'Writing code that runs concurrently on a single CPU core', isCorrect: false },
    ],
    explanation: 'Horizontal scaling (scaling out) means adding more machines/instances to your resource pool, whereas vertical scaling (scaling up) means adding more power (CPU, RAM) to an existing machine.',
  },
  {
    category: 'systemDesign',
    q: 'What problem does a load balancer solve?',
    options: [
      { text: 'Distributes incoming network traffic across multiple backend servers', isCorrect: true },
      { text: 'Encrypts communication between frontend and databases', isCorrect: false },
      { text: 'Speeds up SQL queries using intelligent queries caching', isCorrect: false },
      { text: 'Ensures the server has backup electrical power', isCorrect: false },
    ],
    explanation: 'A load balancer acts as a traffic cop sitting in front of your servers, routing client requests across all servers capable of fulfilling them to maximize speed and capacity utilization.',
  },
]

export default function JobReadinessQuiz() {
  const [step, setStep] = useState('intro') // intro | quiz | results
  const [qIdx, setQIdx] = useState(0)
  const [selectedOpt, setSelectedOpt] = useState(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [answers, setAnswers] = useState([]) // array of boolean indicating correct or incorrect

  const currentQ = QUESTIONS[qIdx]

  const handleSelectOption = (idx) => {
    if (isAnswered) return
    setSelectedOpt(idx)
  }

  const handleConfirmAnswer = () => {
    if (selectedOpt === null || isAnswered) return
    setIsAnswered(true)
    const newAnswers = [...answers]
    newAnswers[qIdx] = currentQ.options[selectedOpt].isCorrect
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    setSelectedOpt(null)
    setIsAnswered(false)
    if (qIdx < QUESTIONS.length - 1) {
      setQIdx(qIdx + 1)
    } else {
      setStep('results')
    }
  }

  const handleRestart = () => {
    setQIdx(0)
    setSelectedOpt(null)
    setIsAnswered(false)
    setAnswers([])
    setStep('intro')
  }

  // Calculate scores
  const totalCorrect = answers.filter(Boolean).length
  const overallPct = Math.round((totalCorrect / QUESTIONS.length) * 100)

  // Category wise breakdown
  const categories = {
    javascript: { label: 'JavaScript', correct: 0, total: 0 },
    react: { label: 'React / Frontend', correct: 0, total: 0 },
    backend: { label: 'Backend / APIs', correct: 0, total: 0 },
    database: { label: 'SQL & Database', correct: 0, total: 0 },
    systemDesign: { label: 'System Design', correct: 0, total: 0 },
  }

  QUESTIONS.forEach((q, idx) => {
    categories[q.category].total += 1
    if (answers[idx]) {
      categories[q.category].correct += 1
    }
  })

  // Role recommendations
  let recommendation = 'Junior Developer'
  let roleDesc = 'Great start! Focus on deepening your understanding of core technologies, database joins, and async programming to be interview ready.'
  if (overallPct >= 85) {
    recommendation = 'Mid-Level Full Stack Developer'
    roleDesc = 'Outstanding! You demonstrate solid command of both frontend and backend concepts, database indexing, and scaling architectures.'
  } else if (overallPct >= 65) {
    if (categories.javascript.correct + categories.react.correct >= 5) {
      recommendation = 'Junior React Developer'
      roleDesc = 'Strong Frontend foundation! You have solid React and JS skills. Continue learning backend integration and database basics.'
    } else if (categories.backend.correct + categories.database.correct >= 5) {
      recommendation = 'Junior Backend Developer'
      roleDesc = 'Solid Backend foundation! You understand database concepts and APIs. Brush up on frontend layout frameworks to become full-stack.'
    } else {
      recommendation = 'Junior Full Stack Developer'
      roleDesc = 'Well rounded! You have a balanced grasp of frontend and backend. Keep practicing building real-world projects.'
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden' }}>
      <Navbar />

      {/* ── Ambient background glows ────────────────────────────── */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse 80% 60% at 50% -10%, var(--border) 0%, transparent 70%)',
      }} />

      <main style={{ position: 'relative', zIndex: 1, maxWidth: 680, margin: '0 auto', padding: '100px 24px 80px' }}>

        {/* --- INTRO STEP --- */}
        {step === 'intro' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center' }}
          >
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px',
              background: 'var(--border)', border: '1px solid var(--border)',
              borderRadius: 20, marginBottom: 20,
            }}>
              <Target size={14} style={{ color: 'var(--text-primary)' }} />
              <span style={{ fontSize: 13, color: '#69F0AE', fontWeight: 600 }}>15 Questions • 8 Mins • Free</span>
            </div>

            <h1 style={{
              fontSize: 'clamp(36px, 6vw, 52px)', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 16, lineHeight: 1.1,
              background: 'linear-gradient(135deg, #fff 0%, #69F0AE 50%, var(--text-primary) 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Job Readiness Test
            </h1>
            <p style={{ fontSize: 18, color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto 40px', lineHeight: 1.6 }}>
              Validate your technical stack knowledge. Find out if your developer skills match entry or mid-level industry expectations.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 40 }}>
              {Object.values(categories).map((cat, i) => (
                <div key={i} className="glass-card" style={{ padding: '16px 12px', textAlign: 'center' }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{cat.label}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Core Assessment</p>
                </div>
              ))}
            </div>

            <button
              className="btn-primary"
              onClick={() => setStep('quiz')}
              style={{
                padding: '14px 42px', fontSize: 16, fontWeight: 700,
                background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--text-primary) 100%)',
                boxShadow: "none",
                color: 'var(--bg-primary)'
              }}
            >
              Start Assessment →
            </button>
          </motion.div>
        )}

        {/* --- QUIZ STEP --- */}
        {step === 'quiz' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Progress */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13, color: 'var(--text-muted)' }}>
                <span>Question {qIdx + 1} of {QUESTIONS.length}</span>
                <span>Category: <strong style={{ color: '#69F0AE', textTransform: 'capitalize' }}>{currentQ.category}</strong></span>
              </div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--text-primary), #3B82F6)',
                  width: `${((qIdx) / QUESTIONS.length) * 100}%`,
                  transition: 'width 0.3s ease-in-out',
                }} />
              </div>
            </div>

            {/* Question Card */}
            <div className="glass-card" style={{ padding: 32, marginBottom: 20 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 28, lineHeight: 1.4 }}>
                {currentQ.q}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {currentQ.options.map((opt, oIdx) => {
                  let border = '1px solid var(--border)'
                  let bg = 'rgba(15,23,42,0.3)'
                  let textColor = 'var(--text-secondary)'

                  if (selectedOpt === oIdx) {
                    border = '2px solid var(--text-primary)'
                    bg = 'var(--border)'
                    textColor = 'var(--text-primary)'
                  }

                  if (isAnswered) {
                    if (opt.isCorrect) {
                      border = '2px solid #10b981'
                      bg = 'rgba(16,185,129,0.08)'
                      textColor = '#10b981'
                    } else if (selectedOpt === oIdx) {
                      border = '2px solid #ef4444'
                      bg = 'rgba(239,68,68,0.08)'
                      textColor = '#ef4444'
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelectOption(oIdx)}
                      disabled={isAnswered}
                      style={{
                        padding: '16px 20px', borderRadius: 12, textAlign: 'left', cursor: isAnswered ? 'default' : 'pointer',
                        border, background: bg, color: textColor, fontSize: 15, fontWeight: 500,
                        transition: 'all 0.15s',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      }}
                    >
                      <span>{opt.text}</span>
                      {isAnswered && opt.isCorrect && <CheckCircle size={18} style={{ color: '#10b981' }} />}
                      {isAnswered && selectedOpt === oIdx && !opt.isCorrect && <AlertCircle size={18} style={{ color: '#ef4444' }} />}
                    </button>
                  )
                })}
              </div>

              {/* Confirm / Next Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 28 }}>
                {!isAnswered ? (
                  <button
                    onClick={handleConfirmAnswer}
                    disabled={selectedOpt === null}
                    className="btn-primary"
                    style={{
                      background: selectedOpt === null ? 'rgba(255,255,255,0.04)' : 'linear-gradient(135deg, var(--text-primary) 0%, var(--text-primary) 100%)',
                      color: selectedOpt === null ? 'var(--text-muted)' : 'var(--bg-primary)',
                      border: 'none',
                      cursor: selectedOpt === null ? 'not-allowed' : 'pointer',
                    }}
                  >
                    Confirm Answer
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="btn-primary"
                    style={{ background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--text-primary) 100%)', color: 'var(--bg-primary)' }}
                  >
                    Next Question <ArrowRight size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Explanation box */}
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card"
                style={{ padding: 20, borderLeft: '4px solid var(--text-primary)' }}
              >
                <h4 style={{ fontWeight: 700, color: '#69F0AE', fontSize: 14, marginBottom: 6 }}>💡 Explanation</h4>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{currentQ.explanation}</p>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* --- RESULTS STEP --- */}
        {step === 'results' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ textAlign: 'center', marginBottom: 36 }}>
              <Award size={48} style={{ color: 'var(--text-primary)', marginBottom: 12 }} />
              <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 8 }}>Test Completed!</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>Here is your job readiness snapshot</p>
            </div>

            {/* Score Summary */}
            <div className="glass-card" style={{ padding: 28, display: 'flex', alignItems: 'center', gap: 28, marginBottom: 24 }}>
              <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width={120} height={120} style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx={60} cy={60} r={50} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={8} />
                  <motion.circle
                    cx={60} cy={60} r={50}
                    fill="none" stroke="var(--text-primary)" strokeWidth={8}
                    strokeDasharray={2 * Math.PI * 50}
                    initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 50 - (overallPct / 100) * 2 * Math.PI * 50 }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    strokeLinecap="round"
                  />
                </svg>
                <div style={{ position: 'absolute', fontSize: 28, fontWeight: 900, color: '#69F0AE' }}>{overallPct}%</div>
              </div>
              <div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>Suggested Role</p>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>{recommendation}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{roleDesc}</p>
              </div>
            </div>

            {/* Category Breakdown */}
            <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>Category Performance</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
              {Object.entries(categories).map(([key, cat]) => {
                const pct = Math.round((cat.correct / cat.total) * 100)
                let color = '#ef4444'
                if (pct >= 80) color = '#10b981'
                else if (pct >= 50) color = '#f59e0b'

                return (
                  <div key={key} className="glass-card" style={{ padding: 18 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontWeight: 700, fontSize: 14 }}>{cat.label}</span>
                      <span style={{ fontSize: 14, fontWeight: 800, color }}>{cat.correct}/{cat.total} ({pct}%)</span>
                    </div>
                    <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8 }}
                        style={{ height: '100%', background: color, borderRadius: 3 }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                className="btn-primary"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href)
                  alert('Link copied!')
                }}
                style={{ background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--text-primary) 100%)', color: 'var(--bg-primary)' }}
              >
                Share Results
              </button>
              <button className="btn-secondary" onClick={handleRestart}>
                <RefreshCw size={15} /> Retake Assessment
              </button>
            </div>
          </motion.div>
        )}

      </main>
    </div>
  )
}
