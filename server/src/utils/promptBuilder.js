/**
 * Builds structured prompts for AI analysis from repo data.
 */

export const buildAnalysisPrompt = (repoName, metrics, languages, readmeExcerpt, fileTreeSummary) => {
  const languageList = Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([lang, pct]) => `${lang} (${pct}%)`)
    .join(', ');

  return `You are a senior software engineer and technical recruiter evaluating a GitHub repository for job readiness assessment.

## Repository: ${repoName}
## Languages: ${languageList || 'Unknown'}

## Project Metrics:
- Total files: ${metrics.totalFiles}
- Has README: ${metrics.hasReadme} (${metrics.readmeLength} chars)
- Has Tests: ${metrics.hasTests} (${metrics.testFileCount} test files, ${(metrics.testRatio * 100).toFixed(1)}% ratio)
- Has CI/CD: ${metrics.hasCICD}
- Has Dockerfile: ${metrics.hasDockerfile}
- Total Commits: ${metrics.commitCount}
- Contributors: ${metrics.contributorCount}
- Last commit: ${metrics.lastCommitDaysAgo} days ago
- Has src/ folder: ${metrics.hasSrcFolder}
- Has components/ folder: ${metrics.hasComponentsFolder}
- Suspicious security patterns: ${metrics.suspiciousFileCount}

## File Structure Sample:
${fileTreeSummary}

## README Excerpt (first 1000 chars):
${readmeExcerpt.substring(0, 1000) || 'No README found'}

---

Evaluate this repository and return a JSON object with EXACTLY this structure:
{
  "scores": {
    "codeQuality": <number 0-100>,
    "architecture": <number 0-100>,
    "maintainability": <number 0-100>,
    "scalability": <number 0-100>,
    "documentation": <number 0-100>,
    "testing": <number 0-100>,
    "security": <number 0-100>
  },
  "juniorReadiness": <number 0-100>,
  "midLevelReadiness": <number 0-100>,
  "portfolioQuality": <number 0-100>,
  "industryRelevance": <number 0-100>,
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2", "weakness3"],
  "missingSkills": ["skill1", "skill2", "skill3"],
  "suggestedProjects": ["project idea 1", "project idea 2"],
  "categoryExplanations": {
    "codeQuality": { "explanation": "...", "suggestions": ["...", "..."] },
    "architecture": { "explanation": "...", "suggestions": ["...", "..."] },
    "maintainability": { "explanation": "...", "suggestions": ["...", "..."] },
    "scalability": { "explanation": "...", "suggestions": ["...", "..."] },
    "documentation": { "explanation": "...", "suggestions": ["...", "..."] },
    "testing": { "explanation": "...", "suggestions": ["...", "..."] },
    "security": { "explanation": "...", "suggestions": ["...", "..."] }
  }
}

Be honest and critical. Return ONLY the JSON object, no markdown, no explanation.`;
};

export const buildRoadmapPrompt = (userProfile, report) => {
  return `You are a senior engineering career coach. Based on this developer's profile, generate a personalized learning roadmap.

## Developer Profile:
- Overall Score: ${report.overallScore}/100
- Frontend Score: ${report.scores?.frontend || 0}/100
- Backend Score: ${report.scores?.backend || 0}/100
- Testing Score: ${report.scores?.testing || 0}/100
- Security Score: ${report.scores?.security || 0}/100
- Architecture Score: ${report.scores?.architecture || 0}/100

## Technical Gaps: ${report.technicalGaps?.map((g) => g.skill).join(', ') || 'None identified'}
## Current Strengths: ${report.strengths?.join(', ') || 'None identified'}

Generate a personalized roadmap as JSON with EXACTLY this structure:
{
  "currentLevel": "Junior Frontend Developer",
  "targetRole": "Mid-Level Full Stack Developer",
  "estimatedTotalWeeks": 12,
  "milestones": [
    {
      "order": 1,
      "title": "Learn Testing Fundamentals",
      "description": "Master unit and integration testing",
      "skills": ["Jest", "React Testing Library", "TDD"],
      "estimatedWeeks": 2,
      "resources": [
        { "title": "Testing JavaScript", "url": "https://testingjavascript.com", "type": "course" },
        { "title": "Jest Docs", "url": "https://jestjs.io/docs/getting-started", "type": "article" }
      ]
    }
  ],
  "suggestedProjects": [
    {
      "title": "Full-Stack Todo App with Tests",
      "description": "Build with full test coverage",
      "techStack": ["React", "Node.js", "Jest"],
      "difficulty": "intermediate"
    }
  ]
}

Return ONLY the JSON, no markdown.`;
};
