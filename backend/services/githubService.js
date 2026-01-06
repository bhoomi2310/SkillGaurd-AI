import axios from 'axios';

/**
 * GitHub Service for fetching repository metadata
 */
class GitHubService {
  constructor() {
    this.token = process.env.GITHUB_TOKEN;
    this.baseURL = 'https://api.github.com';
  }

  /**
   * Parse GitHub URL and extract owner/repo
   */
  parseGitHubUrl(url) {
    try {
      const regex = /github\.com\/([^\/]+)\/([^\/]+)(?:\/tree\/([^\/]+))?/;
      const match = url.match(regex);
      if (!match) {
        throw new Error('Invalid GitHub URL format');
      }
      return {
        owner: match[1],
        repo: match[2],
        branch: match[3] || 'main',
      };
    } catch (error) {
      throw new Error(`Failed to parse GitHub URL: ${error.message}`);
    }
  }

  /**
   * Fetch repository metadata
   */
  async fetchRepoMetadata(owner, repo, branch = 'main') {
    try {
      const headers = {};
      if (this.token) {
        headers.Authorization = `token ${this.token}`;
      }

      // Fetch repo info
      const repoResponse = await axios.get(
        `${this.baseURL}/repos/${owner}/${repo}`,
        { headers }
      );

      // Fetch README if available
      let readme = '';
      try {
        const readmeResponse = await axios.get(
          `${this.baseURL}/repos/${owner}/${repo}/readme`,
          { headers }
        );
        const readmeContent = Buffer.from(
          readmeResponse.data.content,
          'base64'
        ).toString('utf-8');
        readme = readmeContent.substring(0, 5000); // Limit size
      } catch (error) {
        // README not found, continue without it
        console.log('README not found for repository');
      }

      // Fetch latest commit
      let commitHash = '';
      try {
        const commitResponse = await axios.get(
          `${this.baseURL}/repos/${owner}/${repo}/commits/${branch}`,
          { headers }
        );
        commitHash = commitResponse.data.sha;
      } catch (error) {
        console.log('Could not fetch commit hash');
      }

      return {
        language: repoResponse.data.language || 'Unknown',
        stars: repoResponse.data.stargazers_count || 0,
        forks: repoResponse.data.forks_count || 0,
        size: repoResponse.data.size || 0,
        description: repoResponse.data.description || '',
        readme: readme,
        commitHash: commitHash,
      };
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Repository not found or is private');
      }
      throw new Error(`Failed to fetch GitHub metadata: ${error.message}`);
    }
  }

  /**
   * Fetch repository content (for code analysis)
   */
  async fetchRepoContent(owner, repo, branch = 'main', path = '') {
    try {
      const headers = {};
      if (this.token) {
        headers.Authorization = `token ${this.token}`;
      }

      const response = await axios.get(
        `${this.baseURL}/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
        { headers }
      );

      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch repository content: ${error.message}`);
    }
  }
}

export default new GitHubService();

