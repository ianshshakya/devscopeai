import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import {
  GitBranch,
  ArrowRight,
  Plus,
  Clock,
  Sparkles,
  TrendingUp,
  Target,
  Shield,
  TestTube,
  Code2,
  Rocket,
} from "lucide-react";

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import Sidebar from "../components/layout/Sidebar";
import { api } from "../lib/api";
import {
  getScoreColor,
  getScoreLabel,
  timeAgo,
} from "../lib/utils";

import { useAuth } from "../lib/authContext";


/* ==============================================
   Animation Variants
============================================== */

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 25,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};


/* ==============================================
   Premium Glass Card
============================================== */

/* ==============================================
   Premium Glass Card
============================================== */

const GlassCard = ({
  children,
  className = "",
  style = {},
  delay = 0,
}) => (
  <motion.div
    variants={fadeUp}
    initial="hidden"
    animate="show"
    transition={{
      delay,
    }}
    className={`minimal-card minimal-card-hover scanline-container grid-pattern ${className}`}
    style={{
      padding: "22px",
      ...style,
    }}
  >
    {/* Cybernetic Corner Highlights */}
    <div className="cyber-corner cyber-corner-tl" />
    <div className="cyber-corner cyber-corner-tr" />
    <div className="cyber-corner cyber-corner-bl" />
    <div className="cyber-corner cyber-corner-br" />

    {/* Content Area */}
    <div style={{ position: "relative", zIndex: 2 }}>
      {children}
    </div>
  </motion.div>
);


/* ==============================================
   Animated Engineering Score Ring
============================================== */

const ScoreRing = ({
  score,
  size = 150,
}) => {
  const radius = 54;
  const stroke = 8;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (score / 100) * circumference;

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        width={size}
        height={size}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        {/* Outer Rotating Cyber Grid Ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius + 12}
          fill="none"
          stroke="var(--border)"
          strokeWidth={1}
          strokeDasharray="4 6"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          style={{ transformOrigin: "center" }}
        />

        {/* Outer Static Tick Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius + 8}
          fill="none"
          stroke="rgba(255,255,255,0.03)"
          strokeWidth={1.5}
          strokeDasharray="2 12"
        />

        {/* Base Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={stroke}
        />

        {/* Glowing Progress Arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getScoreColor(score)}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          initial={{
            strokeDashoffset: circumference,
          }}
          animate={{
            strokeDashoffset: progress,
          }}
          transition={{
            duration: 1.5,
            ease: "easeOut",
          }}
          style={{
            filter: `drop-shadow(0 0 10px ${getScoreColor(score)}80)`,
          }}
        />
      </svg>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
        }}
      >
        <div
          className="metric-value mono"
          style={{
            fontSize: 34,
            fontWeight: 800,
            color: getScoreColor(score),
            letterSpacing: "-0.03em",
            textShadow: `0 0 16px ${getScoreColor(score)}40`,
          }}
        >
          {score}
        </div>

        <div
          style={{
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "var(--text-secondary)",
            marginTop: -2,
            fontWeight: 700,
          }}
        >
          readiness
        </div>
      </div>
    </div>
  );
};


/* ==============================================
   Engineering Pillar
============================================== */

const SkillPillar = ({
  title,
  score,
  icon,
}) => (
  <div
    style={{
      marginBottom: 16,
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 6,
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          color: "var(--text-secondary)",
          fontSize: 13,
          fontWeight: 500,
        }}
      >
        <span style={{ opacity: 0.7, display: "inline-flex", color: getScoreColor(score) }}>{icon}</span>
        <span>{title}</span>
      </div>

      <span
        className="mono"
        style={{
          fontSize: 13,
          color: getScoreColor(score),
          textShadow: `0 0 8px ${getScoreColor(score)}30`,
        }}
      >
        {score}%
      </span>
    </div>

    <div
      style={{
        height: 6,
        borderRadius: 999,
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.05)",
        position: "relative",
      }}
    >
      <motion.div
        initial={{
          width: 0,
        }}
        animate={{
          width: `${score}%`,
        }}
        transition={{
          duration: 1.0,
          ease: "easeOut",
        }}
        style={{
          height: "100%",
          borderRadius: 999,
          background: `linear-gradient(90deg, ${getScoreColor(score)}40, ${getScoreColor(score)})`,
          boxShadow: `0 0 10px ${getScoreColor(score)}60`,
          position: "relative",
        }}
      />
    </div>
  </div>
);


/* ==============================================
   AI Engineer Insight Card
============================================== */

const Insight = ({
  text,
  type = "success",
}) => {
  const colors = {
    success: "var(--text-primary)",
    warning: "#F59E0B",
    info: "#3B82F6",
  };

  const glows = {
    success: "var(--border)",
    warning: "rgba(245, 158, 11, 0.04)",
    info: "rgba(59, 130, 246, 0.04)",
  };

  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        padding: "10px 14px",
        borderRadius: 8,
        background: "rgba(255, 255, 255, 0.01)",
        borderLeft: `3px solid ${colors[type]}`,
        marginBottom: 8,
        transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        boxShadow: `inset 2px 0 10px ${glows[type]}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
        e.currentTarget.style.transform = "translateX(4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(255, 255, 255, 0.01)";
        e.currentTarget.style.transform = "translateX(0)";
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Sparkles
          size={14}
          color={colors[type]}
          style={{ filter: `drop-shadow(0 0 6px ${colors[type]})` }}
        />
      </div>
      <p
        style={{
          fontSize: 13,
          color: "var(--text-secondary)",
          lineHeight: 1.5,
        }}
      >
        {text}
      </p>
    </div>
  );
};

/* ==============================================
   Dashboard Component
============================================== */

export default function Dashboard() {
  const { user } = useAuth();


  /* ==========================================
     Fetch Dashboard Data
  ========================================== */

  const {
    data: stats,
    isLoading,
  } = useQuery({
    queryKey: ["user-stats"],
    queryFn: () =>
      api
        .get("/api/user/stats")
        .then((res) => res.data),

    staleTime: 1000 * 60 * 2,
  });


  /* ==========================================
     Prepare Chart Data
  ========================================== */

  const radarData = stats
    ? [
        {
          dimension: "Code",
          score: stats.avgScores?.codeQuality || 0,
        },
        {
          dimension: "Architecture",
          score: stats.avgScores?.architecture || 0,
        },
        {
          dimension: "Testing",
          score: stats.avgScores?.testing || 0,
        },
        {
          dimension: "Security",
          score: stats.avgScores?.security || 0,
        },
        {
          dimension: "Docs",
          score: stats.avgScores?.documentation || 0,
        },
      ]
    : [];


  const timelineData =
    stats?.scoreHistory
      ?.slice(-6)
      .reverse()
      .map((item, index) => ({
        name:
          item.repoName?.slice(0, 10) ||
          `Repo ${index + 1}`,
        score: item.score,
      })) || [];


  const overallScore =
    stats?.avgScores?.overall || 0;



  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: `
          radial-gradient(
            circle at top right,
            var(--border),
            transparent 40%
          ),
          radial-gradient(
            circle at bottom left,
            rgba(59, 130, 246, 0.07),
            transparent 40%
          ),
          #060813
        `,
      }}
    >
      <Sidebar />

      <main
        style={{
          flex: 1,
          marginLeft: 240,
          padding: "32px 40px",
          minWidth: 0,
        }}
      >
        {/* ===============================
            Hero Header
        ================================ */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          style={{
            marginBottom: 32,
            borderBottom: "1px dashed rgba(255, 255, 255, 0.08)",
            paddingBottom: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span className="badge badge-green animate-pulse-glow" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '3px 8px' }}>
                <span className="status-dot status-dot-green" style={{ marginRight: 6, display: 'inline-block' }} />
                DevScope Engine v2.4
              </span>
              <span className="mono" style={{ fontSize: 10, color: 'var(--text-muted)' }}>SYSTEM_STATE // SECURE_ACTIVE</span>
            </div>

            <h1
              className="gradient-text"
              style={{
                fontSize: 42,
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 1.1,
              }}
            >
              {user?.displayName || user?.username}
            </h1>

            <p
              style={{
                color: "var(--text-secondary)",
                marginTop: 8,
                maxWidth: 620,
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
              Your AI Engineer has reviewed your development journey and generated insights to help you become a stronger software engineer.
            </p>
          </div>

          <div
            className="mono"
            style={{
              padding: "10px 18px",
              background: "rgba(255, 255, 255, 0.01)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              fontSize: 11,
              color: "var(--text-muted)",
              display: "flex",
              flexDirection: "column",
              gap: 4,
              textAlign: "right",
            }}
          >
            <div>UTC_TIME: <span style={{ color: "var(--accent)" }}>{new Date().toISOString().slice(11, 19)}</span></div>
            <div>STATUS: <span style={{ color: "#3B82F6" }}>ONLINE</span></div>
          </div>
        </motion.div>

        {/* ===============================
            Command Center
        ================================ */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gap: 20,
            marginBottom: 24,
          }}
        >
          {/* Engineering Score Card */}
          <GlassCard>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 20,
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    marginBottom: 12,
                    color: "var(--accent)",
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    fontWeight: 700,
                  }}
                >
                  <Rocket size={14} className="" />
                  <span>Hiring Intelligence Command</span>
                </div>

                <h2
                  style={{
                    fontSize: 28,
                    fontWeight: 800,
                    color: "var(--text-primary)",
                    marginBottom: 8,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Your Hiring Readiness
                </h2>

                <p
                  style={{
                    color: "var(--text-secondary)",
                    maxWidth: 380,
                    lineHeight: 1.5,
                    fontSize: 14,
                  }}
                >
                  AI evaluated your repositories, architecture patterns, security, testing practices and code quality.
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    marginTop: 24,
                  }}
                >
                  <Link to="/analysis" className="btn-primary">
                    <Plus size={15} />
                    Analyze Repository
                  </Link>

                  <Link to="/roadmap" className="btn-secondary">
                    <Target size={15} />
                    Career Roadmap
                  </Link>
                </div>
              </div>

              <div
                style={{
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingRight: 10,
                }}
              >
                <ScoreRing score={overallScore} />

                <p
                  className="mono"
                  style={{
                    marginTop: 14,
                    fontWeight: 800,
                    fontSize: 15,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: getScoreColor(overallScore),
                    textShadow: `0 0 10px ${getScoreColor(overallScore)}30`,
                  }}
                >
                  {getScoreLabel(overallScore)}
                </p>

                <span
                  className="mono"
                  style={{
                    color: "var(--text-muted)",
                    fontSize: 11,
                    marginTop: 4,
                  }}
                >
                  {stats?.analysisCount || 0} REPOS EVALUATED
                </span>
              </div>
            </div>
          </GlassCard>

          {/* AI Engineer Insights */}
          <GlassCard>
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <Sparkles
                size={15}
                color="var(--text-primary)"
                style={{ filter: "drop-shadow(0 0 4px var(--accent))" }}
              />
              <h3
                style={{
                  color: "var(--text-primary)",
                  fontSize: 14,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  fontWeight: 700,
                }}
              >
                AI Diagnosis Notes
              </h3>
            </div>

            <Insight
              type="success"
              text="Strong modern development practices and clean project organization."
            />

            <Insight
              type="warning"
              text="Increase automated testing coverage to reach the next engineering level."
            />

            <Insight
              type="info"
              text="Learning Docker and CI/CD can significantly improve your production readiness."
            />

            <div
              style={{
                marginTop: 18,
                padding: 12,
                borderRadius: 12,
                background: "linear-gradient(135deg, rgba(0,230,118,.05), rgba(59,130,246,.03))",
                border: "1px dashed rgba(0,230,118,.2)",
              }}
            >
              <div
                className="mono"
                style={{
                  fontSize: 10,
                  color: "var(--text-primary)",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                }}
              >
                // NEXT MILESTONE TARGET
              </div>

              <p
                style={{
                  color: "var(--text-primary)",
                  marginTop: 6,
                  fontSize: 13,
                  lineHeight: 1.5,
                }}
              >
                Improve your testing score by <strong style={{ color: "var(--text-primary)" }}>15%</strong> to unlock Senior Engineer readiness.
              </p>
            </div>
          </GlassCard>
        </div>

        {/* ===============================
            Engineering Analytics Grid
        ================================ */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
            marginBottom: 24,
          }}
        >
          {/* Engineering Pillars */}
          <GlassCard>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 22,
              }}
            >
              <Code2 size={16} color="var(--accent)" />
              <h3
                style={{
                  fontSize: 14,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                }}
              >
                Engineering Pillars
              </h3>
            </div>

            <SkillPillar
              title="Frontend"
              score={stats?.avgScores?.frontend || 0}
              icon={<Code2 size={15} />}
            />

            <SkillPillar
              title="Backend"
              score={stats?.avgScores?.backend || 0}
              icon={<Rocket size={15} />}
            />

            <SkillPillar
              title="Security"
              score={stats?.avgScores?.security || 0}
              icon={<Shield size={15} />}
            />

            <SkillPillar
              title="Testing"
              score={stats?.avgScores?.testing || 0}
              icon={<TestTube size={15} />}
            />

            <div
              style={{
                marginTop: 20,
                padding: "12px 16px",
                borderRadius: 12,
                background: "rgba(59,130,246,0.04)",
                border: "1px solid rgba(59,130,246,0.12)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <p
                className="mono"
                style={{
                  fontSize: 11,
                  color: "#60A5FA",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                }}
              >
                SYSTEM DIAGNOSIS:
              </p>

              <h4
                className="mono"
                style={{
                  color: "var(--text-primary)",
                  fontSize: 14,
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                {overallScore >= 85
                  ? "Senior Engineer"
                  : overallScore >= 70
                  ? "Mid-Level Engineer"
                  : "Junior Engineer"}
              </h4>
            </div>
          </GlassCard>

          {/* Career Journey */}
          <GlassCard>
            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                marginBottom: 22,
              }}
            >
              <TrendingUp size={16} color="var(--accent)" />
              <h3
                style={{
                  color: "var(--text-primary)",
                  fontSize: 14,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  fontWeight: 700,
                }}
              >
                Career Progress Map
              </h3>
            </div>

            <div
              style={{
                marginTop: 10,
                position: "relative",
                paddingLeft: 8,
              }}
            >
              {/* Vertical timeline track line */}
              <div
                style={{
                  position: "absolute",
                  left: 15,
                  top: 8,
                  bottom: 24,
                  width: 2,
                  background: "linear-gradient(180deg, var(--text-primary) 40%, rgba(255,255,255,0.06) 80%)",
                  zIndex: 0,
                }}
              />

              {[
                "Junior Engineer",
                "Mid-Level Engineer",
                "Senior Engineer",
              ].map((level, index) => {
                const active =
                  (overallScore >= 40 && index === 0) ||
                  (overallScore >= 70 && index === 1) ||
                  (overallScore >= 85 && index === 2);

                return (
                  <div
                    key={level}
                    style={{
                      display: "flex",
                      gap: 20,
                      marginBottom: 20,
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    {/* Glowing Node dot */}
                    <div style={{ flexShrink: 0, width: 16, height: 16, marginTop: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {active ? (
                        <div className="pulse-ring-container" style={{ width: 12, height: 12 }}>
                          <div className="pulse-ring-outer" />
                          <div
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              background: "var(--text-primary)",
                              boxShadow: "none",
                              position: "relative",
                              zIndex: 3,
                            }}
                          />
                        </div>
                      ) : (
                        <div
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: "rgba(255,255,255,0.12)",
                            border: "1px solid rgba(255,255,255,0.2)",
                          }}
                        />
                      )}
                    </div>

                    <div>
                      <h4
                        style={{
                          color: active ? "var(--text-primary)" : "var(--text-secondary)",
                          fontSize: 14,
                          fontWeight: 600,
                        }}
                      >
                        {level}
                      </h4>

                      <p
                        style={{
                          color: active ? "var(--text-secondary)" : "var(--text-muted)",
                          fontSize: 12,
                          marginTop: 4,
                          lineHeight: 1.4,
                        }}
                      >
                        {index === 0 &&
                          "Build fundamentals, clean code and project experience."}

                        {index === 1 &&
                          "Master architecture, scalability and production systems."}

                        {index === 2 &&
                          "Lead engineering decisions and design complex systems."}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>

        {/* ===============================
            Charts & Intelligence Map
        ================================ */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
            marginBottom: 24,
          }}
        >
          {/* Skill Radar */}
          <GlassCard>
            <h3
              style={{
                color: "var(--text-primary)",
                marginBottom: 18,
                fontSize: 14,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontWeight: 700,
              }}
            >
              Skill Intelligence Map
            </h3>

            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.04)" />
                <PolarAngleAxis
                  dataKey="dimension"
                  tick={{
                    fill: "var(--text-secondary)",
                    fontSize: 11,
                    fontFamily: "monospace",
                  }}
                />
                <Radar
                  dataKey="score"
                  stroke="var(--text-primary)"
                  fill="var(--text-primary)"
                  fillOpacity={0.08}
                  strokeWidth={2}
                  style={{
                    filter: "drop-shadow(0 0 8px var(--border))",
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </GlassCard>

          {/* Growth Timeline */}
          <GlassCard>
            <h3
              style={{
                color: "var(--text-primary)",
                marginBottom: 18,
                fontSize: 14,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontWeight: 700,
              }}
            >
              Engineering Growth Timeline
            </h3>

            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--text-primary)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="var(--text-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.03)" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{
                    fill: "var(--text-secondary)",
                    fontSize: 11,
                    fontFamily: "monospace",
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{
                    fill: "var(--text-secondary)",
                    fontSize: 11,
                    fontFamily: "monospace",
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(10, 15, 30, 0.9)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    color: "var(--text-primary)",
                    boxShadow: "none",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="var(--text-primary)"
                  strokeWidth={2.5}
                  fill="url(#scoreFill)"
                  dot={{
                    fill: "var(--text-primary)",
                    r: 4,
                    strokeWidth: 0,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </GlassCard>
        </div>

        {/* ===============================
            Repository Intelligence
        ================================ */}
        <GlassCard>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 24,
              borderBottom: "1px dashed rgba(255,255,255,0.06)",
              paddingBottom: 16,
            }}
          >
            <div>
              <h3
                style={{
                  color: "var(--text-primary)",
                  fontSize: 16,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  fontWeight: 700,
                }}
              >
                Repository Intelligence Reports
              </h3>

              <p
                style={{
                  color: "var(--text-muted)",
                  marginTop: 4,
                  fontSize: 13,
                }}
              >
                AI-powered engineering reports from your latest repositories.
              </p>
            </div>

            <Link to="/analysis" className="btn-primary">
              <Plus size={15} />
              Analyze Repository
            </Link>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div style={{ display: "grid", gap: 16 }}>
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  style={{
                    height: 80,
                    borderRadius: 16,
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid var(--border)",
                    animation: "shimmer 1.5s infinite",
                  }}
                />
              ))}
            </div>
          ) : !stats?.recentAnalyses?.length ? (
            /* Empty State */
            <div style={{ padding: "60px 20px", textAlign: "center" }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  margin: "0 auto",
                  borderRadius: 16,
                  background: "var(--border)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "none",
                }}
              >
                <GitBranch size={28} color="var(--accent)" />
              </div>

              <h3
                style={{
                  marginTop: 20,
                  color: "var(--text-primary)",
                  fontSize: 18,
                  fontWeight: 700,
                }}
              >
                No repositories analyzed yet
              </h3>

              <p
                style={{
                  marginTop: 8,
                  color: "var(--text-muted)",
                  maxWidth: 400,
                  marginInline: "auto",
                  lineHeight: 1.6,
                  fontSize: 14,
                }}
              >
                Connect your GitHub repositories and let AI evaluate your code quality, architecture, security, and engineering readiness.
              </p>

              <Link
                to="/analysis"
                className="btn-primary"
                style={{
                  marginTop: 20,
                  display: "inline-flex",
                }}
              >
                <Plus size={15} />
                Start Your First Analysis
              </Link>
            </div>
          ) : (
            /* Repository Cards */
            <div style={{ display: "grid", gap: 12 }}>
              {stats.recentAnalyses.map((repo, index) => (
                <motion.div
                  key={repo._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={`/analysis/${repo._id}`}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "16px 20px",
                      borderRadius: 14,
                      textDecoration: "none",
                      border: "1px solid var(--border)",
                      background: "rgba(255,255,255,0.01)",
                      transition: "all .25s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.borderColor = "var(--border)";
                      e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                      e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.04)";
                      e.currentTarget.style.background = "rgba(255,255,255,0.01)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    {/* Left Side */}
                    <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 10,
                          background: "var(--border)",
                          border: "1px solid var(--border)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "none",
                        }}
                      >
                        <GitBranch size={16} color="var(--accent)" />
                      </div>

                      <div>
                        <h4 style={{ color: "var(--text-primary)", fontWeight: 700, fontSize: 15 }}>
                          {repo.repoName}
                        </h4>

                        <div style={{ display: "flex", gap: 10, marginTop: 4, alignItems: "center" }}>
                          <Clock size={11} color="var(--text-muted)" />
                          <span className="mono" style={{ color: "var(--text-muted)", fontSize: 11 }}>
                            {timeAgo(repo.createdAt)}
                          </span>

                          {repo.language && (
                            <span
                              className="mono"
                              style={{
                                padding: "2px 8px",
                                borderRadius: 4,
                                fontSize: 10,
                                background: "rgba(59,130,246,0.08)",
                                border: "1px solid rgba(59,130,246,0.15)",
                                color: "#60A5FA",
                              }}
                            >
                              {repo.language}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Side */}
                    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                      <div style={{ textAlign: "right" }}>
                        <div
                          className="mono"
                          style={{
                            fontSize: 22,
                            fontWeight: 800,
                            color: getScoreColor(repo.scores?.overall || 0),
                            textShadow: `0 0 10px ${getScoreColor(repo.scores?.overall || 0)}20`,
                          }}
                        >
                          {repo.scores?.overall || 0}
                        </div>
                        <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                          readiness
                        </div>
                      </div>
                      <ArrowRight size={16} color="var(--text-muted)" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </GlassCard>
      </main>
    </div>
  );

}