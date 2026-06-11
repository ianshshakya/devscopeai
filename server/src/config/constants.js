export const SCORE_WEIGHTS = {
  codeQuality: 0.20,
  architecture: 0.18,
  maintainability: 0.15,
  scalability: 0.12,
  documentation: 0.15,
  testing: 0.12,
  security: 0.08,
};

export const ROLE_THRESHOLDS = {
  juniorFrontend: { frontend: 55, overall: 50 },
  midFrontend: { frontend: 72, overall: 68 },
  seniorFrontend: { frontend: 85, overall: 82 },
  juniorBackend: { backend: 55, overall: 50 },
  midBackend: { backend: 72, overall: 68 },
  fullStack: { frontend: 65, backend: 65, overall: 70 },
  devOps: { architecture: 70, security: 65 },
  mobileFlutter: { mobile: 60, overall: 55 },
};

export const PLAN_LIMITS = {
  free: { analyses: 1, aiReviews: false, roadmaps: false, pdfReports: false },
  pro: { analyses: Infinity, aiReviews: true, roadmaps: true, pdfReports: false },
  premium: { analyses: Infinity, aiReviews: true, roadmaps: true, pdfReports: true },
};

export const CACHE_TTL = {
  repos: 300,       // 5 minutes
  analysis: 3600,   // 1 hour
  userProfile: 600, // 10 minutes
};

export const AI_MODELS = {
  deepseek: 'deepseek-chat',
  openai: 'gpt-4o-mini',
};
