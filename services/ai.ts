export class AIService {
  static generateSummary(stats: any, userData: any) {
    const totalCommits = stats.activity.reduce((acc: number, a: any) => acc + a.count, 0);
    const avgCommits = totalCommits / 7;
    const topLanguage = stats.languages[0]?.name || "various technologies";

    let mood = "steady";
    if (avgCommits > 5) mood = "highly productive";
    if (avgCommits < 1) mood = "in a deep focus/planning phase";

    const statements = [
      `You've been ${mood} this week, with a total of ${totalCommits} commits detected.`,
      `Your primary focus has been on ${topLanguage}, which accounts for ${stats.languages[0]?.percent || 0}% of your recent work.`,
      stats.stars > 0 ? `Your projects have earned ${stats.stars} stars in total—keep building in public!` : "Continue pushing consistently to build your digital footprint.",
      avgCommits > 3 ? "Your PR velocity is looking strong. You're moving at a mid-to-senior level pace." : "Focus on breaking down tasks into smaller, more frequent commits to increase velocity."
    ];

    return statements.join(" ");
  }

  static calculateProductivityScore(stats: any) {
    const totalCommits = stats.activity.reduce((acc: number, a: any) => acc + a.count, 0);
    const repoBonus = Math.min(stats.totalRepos * 2, 20);
    const commitScore = Math.min(totalCommits * 5, 60);
    const starBonus = Math.min(stats.stars * 5, 20);
    
    return Math.min(repoBonus + commitScore + starBonus, 100);
  }
}
