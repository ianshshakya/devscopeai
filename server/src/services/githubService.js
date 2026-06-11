import axios from 'axios';
import NodeCache from 'node-cache';
import { CACHE_TTL } from '../config/constants.js';
import User from '../models/User.js';

const cache = new NodeCache({ stdTTL: CACHE_TTL.repos });

const getGitHubHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
});

const getUserToken = async (userId) => {
  const user = await User.findById(userId).select('+accessToken');
  if (!user?.accessToken) throw new Error('GitHub access token not found');
  return user.accessToken;
};

export const getUserRepos = async (userId) => {
  const cacheKey = `repos_${userId}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const token = await getUserToken(userId);
  let repos = [];
  let page = 1;

  while (true) {
    const { data } = await axios.get('https://api.github.com/user/repos', {
      headers: getGitHubHeaders(token),
      params: { per_page: 100, page, sort: 'updated', type: 'owner' },
    });
    repos = repos.concat(data);
    if (data.length < 100) break;
    page++;
  }

  const formatted = repos.map((r) => ({
    id: r.id,
    fullName: r.full_name,
    name: r.name,
    description: r.description || '',
    language: r.language || 'Unknown',
    stars: r.stargazers_count,
    forks: r.forks_count,
    isPrivate: r.private,
    updatedAt: r.updated_at,
    url: r.html_url,
    topics: r.topics || [],
    size: r.size,
    defaultBranch: r.default_branch,
  }));

  cache.set(cacheKey, formatted, CACHE_TTL.repos);
  return formatted;
};

export const getRepoDetails = async (userId, repoFullName) => {
  const cacheKey = `repo_${repoFullName}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const token = await getUserToken(userId);
  const [owner, repo] = repoFullName.split('/');

  const [repoData, contributors, commits, languages, tree] = await Promise.allSettled([
    axios.get(`https://api.github.com/repos/${repoFullName}`, { headers: getGitHubHeaders(token) }),
    axios.get(`https://api.github.com/repos/${repoFullName}/contributors`, {
      headers: getGitHubHeaders(token),
      params: { per_page: 10 },
    }),
    axios.get(`https://api.github.com/repos/${repoFullName}/commits`, {
      headers: getGitHubHeaders(token),
      params: { per_page: 1 },
    }),
    axios.get(`https://api.github.com/repos/${repoFullName}/languages`, { headers: getGitHubHeaders(token) }),
    axios.get(`https://api.github.com/repos/${repoFullName}/git/trees/${(await axios.get(`https://api.github.com/repos/${repoFullName}`, { headers: getGitHubHeaders(token) })).data.default_branch}`, {
      headers: getGitHubHeaders(token),
      params: { recursive: 1 },
    }),
  ]);

  const result = {
    repo: repoData.status === 'fulfilled' ? repoData.value.data : null,
    contributors: contributors.status === 'fulfilled' ? contributors.value.data : [],
    languages: languages.status === 'fulfilled' ? languages.value.data : {},
    fileTree: tree.status === 'fulfilled' ? tree.value.data.tree || [] : [],
    totalCommits: 0,
  };

  // Get total commit count from Link header
  if (commits.status === 'fulfilled') {
    const linkHeader = commits.value.headers?.link || '';
    const match = linkHeader.match(/page=(\d+)>; rel="last"/);
    result.totalCommits = match ? parseInt(match[1]) : 1;
  }

  cache.set(cacheKey, result, CACHE_TTL.repos);
  return result;
};

export const getReadmeContent = async (userId, repoFullName) => {
  const cacheKey = `readme_${repoFullName}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    const token = await getUserToken(userId);
    const { data } = await axios.get(`https://api.github.com/repos/${repoFullName}/readme`, {
      headers: { ...getGitHubHeaders(token), Accept: 'application/vnd.github.raw' },
    });
    const content = typeof data === 'string' ? data : Buffer.from(data.content || '', 'base64').toString();
    cache.set(cacheKey, content, CACHE_TTL.repos);
    return content;
  } catch {
    return '';
  }
};
