import { Octokit } from "@octokit/rest";

export class GitHubService {
  private octokit: Octokit;

  constructor(accessToken: string) {
    this.octokit = new Octokit({
      auth: accessToken,
    });
  }

  async getUserData() {
    const { data } = await this.octokit.users.getAuthenticated();
    return data;
  }

  async getRepositories() {
    const { data } = await this.octokit.repos.listForAuthenticatedUser({
      sort: "updated",
      per_page: 100,
    });
    return data;
  }

  async getWeeklyActivity(username: string) {
    const { data } = await this.octokit.activity.listPublicEventsForUser({
      username,
      per_page: 100,
    });
    
    const activityMap: Record<string, number> = {};
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const dateKey = d.toISOString().split('T')[0];
      activityMap[dateKey] = 0;
    }

    data.forEach(event => {
      if (event.type === 'PushEvent' && event.created_at) {
        const dateKey = event.created_at.split('T')[0];
        if (activityMap[dateKey] !== undefined) {
           const commitsCount = (event.payload as any).commits?.length || 1;
           activityMap[dateKey] += commitsCount;
        }
      }
    });

    return Object.entries(activityMap).map(([date, count]) => ({ date, count }));
  }

  async getComprehensiveLanguages() {
    const repos = await this.getRepositories();
    const languageMap: Record<string, number> = {};
    const topRepos = repos.slice(0, 5);
    
    for (const repo of topRepos) {
      const langs = await this.getRepoLanguages(repo.owner.login, repo.name);
      for (const [lang, bytes] of Object.entries(langs)) {
        languageMap[lang] = (languageMap[lang] || 0) + (bytes as number);
      }
    }

    const totalBytes = Object.values(languageMap).reduce((a, b) => a + b, 0);
    if (totalBytes === 0) return [];

    return Object.entries(languageMap)
      .map(([name, bytes]) => ({
        name,
        percent: Math.round((bytes / totalBytes) * 100)
      }))
      .sort((a, b) => b.percent - a.percent);
  }

  async getDetailedActivity(username: string) {
    const { data } = await this.octokit.activity.listPublicEventsForUser({
      username,
      per_page: 100,
    });

    return data.map(event => ({
      id: event.id,
      type: event.type,
      repo: event.repo.name,
      createdAt: event.created_at,
      payload: event.payload
    }));
  }

  async getRepoLanguages(owner: string, repo: string) {
    const { data } = await this.octokit.repos.listLanguages({
      owner,
      repo,
    });
    return data;
  }
}
