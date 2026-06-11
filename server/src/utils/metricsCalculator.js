/**
 * Calculates engineering metrics from raw GitHub repo data.
 * Pure functions — no external calls.
 */

const FRONTEND_LANGS = ['JavaScript', 'TypeScript', 'CSS', 'HTML', 'Vue', 'Svelte'];
const BACKEND_LANGS = ['Python', 'Java', 'Go', 'Rust', 'PHP', 'Ruby', 'C#', 'C++', 'Kotlin'];
const TEST_PATTERNS = [/\.test\.[jt]sx?$/, /\.spec\.[jt]sx?$/, /test_.*\.py$/, /.*_test\.go$/];
const CI_FILES = ['.github/workflows', '.travis.yml', 'Jenkinsfile', '.circleci', '.gitlab-ci.yml', 'azure-pipelines.yml'];
const SECURITY_BAD_PATTERNS = ['password=', 'api_key=', 'secret=', 'private_key=', 'token='];

export const calculateMetrics = (repoDetails, readmeContent, fileTree) => {
  const files = fileTree.filter((f) => f.type === 'blob');
  const filePaths = files.map((f) => f.path.toLowerCase());

  // README
  const hasReadme = readmeContent.length > 0;
  const readmeLength = readmeContent.length;

  // Tests
  const testFiles = files.filter((f) => TEST_PATTERNS.some((p) => p.test(f.path)));
  const hasTests = testFiles.length > 0;
  const testRatio = files.length > 0 ? testFiles.length / files.length : 0;

  // CI/CD
  const hasCICD = CI_FILES.some((ci) => filePaths.some((fp) => fp.includes(ci.toLowerCase())));

  // Docker
  const hasDockerfile = filePaths.some((fp) => fp.includes('dockerfile') || fp.includes('docker-compose'));

  // Dependencies
  const hasPkgJson = filePaths.includes('package.json');
  const hasRequirements = filePaths.includes('requirements.txt') || filePaths.includes('pyproject.toml');
  const hasGradle = filePaths.some((fp) => fp.includes('build.gradle'));
  const dependencyCount = repoDetails.repo?.open_issues_count || 0;

  // Language split
  const languages = repoDetails.languages || {};
  const totalBytes = Object.values(languages).reduce((s, v) => s + v, 0);
  const languagePercentages = {};
  for (const [lang, bytes] of Object.entries(languages)) {
    languagePercentages[lang] = totalBytes > 0 ? Math.round((bytes / totalBytes) * 100) : 0;
  }

  // Frontend / Backend detection
  const isFrontend = FRONTEND_LANGS.some((l) => languages[l]);
  const isBackend = BACKEND_LANGS.some((l) => languages[l]) || filePaths.some((fp) => fp.includes('server') || fp.includes('api'));

  // Folder structure quality
  const hasSrcFolder = filePaths.some((fp) => fp.startsWith('src/'));
  const hasComponentsFolder = filePaths.some((fp) => fp.includes('components/'));
  const hasConfigFolder = filePaths.some((fp) => fp.includes('config/'));

  // Security heuristic — check for potential hardcoded secrets in file names
  const suspiciousFiles = filePaths.filter((fp) =>
    SECURITY_BAD_PATTERNS.some((p) => fp.includes(p.replace('=', '')))
  );

  // Commit frequency
  const repo = repoDetails.repo;
  const createdAt = repo ? new Date(repo.created_at) : new Date();
  const lastPushAt = repo ? new Date(repo.pushed_at) : new Date();
  const daysSinceCreation = Math.max(1, (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
  const lastCommitDaysAgo = Math.floor((Date.now() - lastPushAt.getTime()) / (1000 * 60 * 60 * 24));
  const commitFrequency = repoDetails.totalCommits / daysSinceCreation; // commits per day

  return {
    totalFiles: files.length,
    hasReadme,
    readmeLength,
    hasTests,
    testFileCount: testFiles.length,
    testRatio,
    hasCICD,
    hasDockerfile,
    dependencyCount,
    commitCount: repoDetails.totalCommits,
    contributorCount: repoDetails.contributors?.length || 1,
    lastCommitDaysAgo,
    commitFrequency,
    languages: languagePercentages,
    isFrontend,
    isBackend,
    hasSrcFolder,
    hasComponentsFolder,
    hasConfigFolder,
    hasPkgJson,
    hasRequirements,
    suspiciousFileCount: suspiciousFiles.length,
    stars: repo?.stargazers_count || 0,
    forks: repo?.forks_count || 0,
  };
};

export const scoreMetrics = (metrics) => {
  // Documentation score (0-100)
  let documentation = 0;
  if (metrics.hasReadme) documentation += 40;
  if (metrics.readmeLength > 500) documentation += 20;
  if (metrics.readmeLength > 2000) documentation += 20;
  if (metrics.readmeLength > 5000) documentation += 20;
  documentation = Math.min(100, documentation);

  // Testing score
  let testing = 0;
  if (metrics.hasTests) testing += 30;
  if (metrics.testRatio > 0.05) testing += 20;
  if (metrics.testRatio > 0.15) testing += 20;
  if (metrics.testRatio > 0.30) testing += 30;
  testing = Math.min(100, testing);

  // Architecture score
  let architecture = 30;
  if (metrics.hasSrcFolder) architecture += 15;
  if (metrics.hasComponentsFolder) architecture += 15;
  if (metrics.hasConfigFolder) architecture += 10;
  if (metrics.hasCICD) architecture += 15;
  if (metrics.hasDockerfile) architecture += 15;
  architecture = Math.min(100, architecture);

  // Security score
  let security = 70;
  security -= metrics.suspiciousFileCount * 15;
  if (metrics.hasCICD) security += 10;
  if (metrics.hasDockerfile) security += 10;
  security = Math.max(10, Math.min(100, security));

  // Maintainability score
  let maintainability = 30;
  if (metrics.commitFrequency > 0.1) maintainability += 15;
  if (metrics.commitFrequency > 0.5) maintainability += 15;
  if (metrics.lastCommitDaysAgo < 30) maintainability += 15;
  if (metrics.lastCommitDaysAgo < 7) maintainability += 10;
  if (metrics.contributorCount > 1) maintainability += 15;
  maintainability = Math.min(100, maintainability);

  // Code quality base (will be refined by AI)
  let codeQuality = 40;
  if (metrics.hasSrcFolder) codeQuality += 10;
  if (metrics.totalFiles > 5) codeQuality += 10;
  if (metrics.hasTests) codeQuality += 20;
  if (metrics.commitCount > 20) codeQuality += 20;
  codeQuality = Math.min(100, codeQuality);

  // Scalability base
  let scalability = 30;
  if (metrics.hasDockerfile) scalability += 20;
  if (metrics.hasCICD) scalability += 15;
  if (metrics.hasConfigFolder) scalability += 15;
  if (metrics.isBackend) scalability += 10;
  if (metrics.contributorCount > 2) scalability += 10;
  scalability = Math.min(100, scalability);

  // Frontend/backend scores
  const frontend = metrics.isFrontend ? Math.round((codeQuality + architecture + maintainability) / 3) : 0;
  const backend = metrics.isBackend ? Math.round((codeQuality + architecture + security) / 3) : 0;

  return { documentation, testing, architecture, security, maintainability, codeQuality, scalability, frontend, backend };
};
