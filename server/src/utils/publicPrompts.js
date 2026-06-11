export const buildRoastPrompt = (username, metrics, topRepos, profile) => {
  const repoNames = topRepos.map(r => r.name).join(', ');
  const languages = Object.entries(metrics.languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([lang, count]) => `${lang}(${count})`)
    .join(', ');

  return `You are a funny but kind senior developer doing a GitHub profile roast. 
Your style: think "Simon Cowell meets a supportive mentor". Honest, sharp, witty — but always ends with genuine encouragement and actionable advice.

Never be mean-spirited. Always motivate at the end.

## Developer: @${username}
## Stats:
- Public repos: ${metrics.totalRepos}
- Total stars: ${metrics.totalStars}
- Total forks: ${metrics.totalForks}
- Active repos (last 90 days): ${metrics.activeRecentRepos}
- Repos with descriptions: ${metrics.reposWithDescription}/${metrics.totalRepos}
- Bio: "${profile.bio || 'empty — they left this blank'}"
- Followers: ${profile.followers}
- Languages used: ${languages || 'Unknown'}
- Top repos: ${repoNames || 'None with stars'}

Generate a roast response as JSON with EXACTLY this structure:
{
  "headline": "One punchy 1-line roast headline (funny, not cruel)",
  "roastLines": [
    "Roast point 1 about their stats/repos (funny observation)",
    "Roast point 2 about a weakness (e.g. no descriptions, dead repos)",
    "Roast point 3 about their profile (bio, activity, etc.)"
  ],
  "verdict": "Would a recruiter shortlist them? One sentence, honest.",
  "recruitmentChance": <number 0-100 representing hiring probability>,
  "glowUps": [
    "Actionable improvement 1",
    "Actionable improvement 2", 
    "Actionable improvement 3"
  ],
  "encouragement": "One genuinely motivating sentence to end on a high note",
  "badge": "Give them a funny badge title like 'The Serial Starter', 'The README Avoider', 'The Quiet Grinder'"
}

Return ONLY the JSON. Be funny. Be kind. Be useful.`;
};

export const buildPublicRoadmapPrompt = (currentRole, targetRole) => {
  return `You are a senior engineering career coach. Generate a career roadmap from "${currentRole}" to "${targetRole}".

Return JSON with EXACTLY this structure:
{
  "currentRole": "${currentRole}",
  "targetRole": "${targetRole}",
  "totalMonths": <number>,
  "milestones": [
    {
      "month": 1,
      "title": "Learn X",
      "description": "Brief description",
      "skills": ["skill1", "skill2"],
      "resources": [
        { "title": "Resource name", "url": "https://...", "type": "course|article|project" }
      ]
    }
  ],
  "salaryImpact": {
    "india": { "from": "₹XL", "to": "₹YL" },
    "global": { "from": "$X", "to": "$Y" }
  },
  "keyProjects": [
    { "title": "Project name", "description": "Build this to prove the skill", "techStack": ["tech1"] }
  ]
}

Return ONLY the JSON.`;
};

export const buildProjectIdeasPrompt = (skillLevel, targetRole, techStack) => {
  return `You are a senior developer mentor. Suggest 6 portfolio projects for a developer.

Developer Profile:
- Skill Level: ${skillLevel}
- Target Role: ${targetRole}  
- Tech Stack: ${techStack}

Return JSON with EXACTLY this structure:
{
  "projects": [
    {
      "title": "Project name",
      "description": "What it does in 2 sentences",
      "whyItMatters": "Why recruiters love this type of project",
      "techStack": ["tech1", "tech2"],
      "difficulty": "beginner|intermediate|advanced",
      "estimatedDays": <number>,
      "uniqueTwist": "One idea to make it stand out from generic versions",
      "keyFeatures": ["Feature 1", "Feature 2", "Feature 3"]
    }
  ]
}

Return ONLY the JSON. Make projects genuinely impressive for the target role.`;
};
