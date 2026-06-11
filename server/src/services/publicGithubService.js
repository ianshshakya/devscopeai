import axios from 'axios';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 300 });

// Server-side GitHub token for public API calls (no user auth needed)
const getPublicHeaders = () => {
  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
};

export const getPublicUserProfile = async (username) => {
  const cacheKey = `pub_user_${username}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const [userRes, reposRes] = await Promise.all([
    axios.get(`https://api.github.com/users/${username}`, { headers: getPublicHeaders() }),
    axios.get(`https://api.github.com/users/${username}/repos`, {
      headers: getPublicHeaders(),
      params: { per_page: 100, sort: 'updated', type: 'owner' },
    }),
  ]);

  const user = userRes.data;
  const repos = reposRes.data;

  // Calculate language distribution
  const langCount = {};
  repos.forEach(r => {
    if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1;
  });

  // Activity score
  const recentRepos = repos.filter(r => {
    const days = (Date.now() - new Date(r.pushed_at)) / (1000 * 60 * 60 * 24);
    return days < 90;
  });

  // Repo quality metrics
  const staredRepos = repos.filter(r => r.stargazers_count > 0);
  const reposWithDesc = repos.filter(r => r.description);
  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);
  const totalForks = repos.reduce((s, r) => s + r.forks_count, 0);

  // Top repos by stars
  const topRepos = [...repos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 6)
    .map(r => ({
      name: r.name,
      description: r.description || '',
      language: r.language || 'Unknown',
      stars: r.stargazers_count,
      forks: r.forks_count,
      url: r.html_url,
      updatedAt: r.pushed_at,
    }));

  const result = {
    profile: {
      username: user.login,
      displayName: user.name || user.login,
      avatar: user.avatar_url,
      avatarUrl: user.avatar_url,
      bio: user.bio || '',
      location: user.location || '',
      company: user.company || '',
      blog: user.blog || '',
      followers: user.followers,
      following: user.following,
      publicRepos: user.public_repos,
      createdAt: user.created_at,
      githubUrl: user.html_url,
    },
    metrics: {
      totalRepos: repos.length,
      totalStars,
      totalForks,
      activeRecentRepos: recentRepos.length,
      reposWithDescription: reposWithDesc.length,
      starredRepos: staredRepos.length,
      languages: langCount,
      topLanguage: Object.entries(langCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Unknown',
    },
    topRepos,
  };

  cache.set(cacheKey, result);
  return result;
};

export const calculatePublicScore = (metrics, profile) => {
  let score = 0;

  // Repo count (max 20)
  score += Math.min(20, metrics.totalRepos * 1.5);

  // Stars (max 20)
  score += Math.min(20, metrics.totalStars * 2);

  // Activity — recent commits (max 20)
  score += Math.min(20, metrics.activeRecentRepos * 3);

  // Profile completeness (max 15)
  if (profile.bio) score += 5;
  if (profile.location) score += 3;
  if (profile.blog) score += 4;
  if (profile.company) score += 3;

  // Repo quality (max 15)
  const descRatio = metrics.totalRepos > 0 ? metrics.reposWithDescription / metrics.totalRepos : 0;
  score += Math.round(descRatio * 15);

  // Community (max 10)
  score += Math.min(5, profile.followers / 10);
  score += Math.min(5, metrics.totalForks);

  return Math.min(100, Math.round(score));
};
