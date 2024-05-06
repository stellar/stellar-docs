export interface UserChallengeData {
  userId: string;
  challenge: ChallengeInfo;
}

export interface UpdateProgressData {
  userId: string;
  challengeId: number;
  challengeProgress: number;
  url?: string;
  startDate?: number;
  completedAt?: number;
  contractId?: string;
  totalValueLocked?: number;
}

export interface Ranking {
  current: number;
  total: number;
}

export interface Leaderboard {
  userId: string;
  ranking: Ranking;
  totalValueLocked: number;
  minutesSpent: number;
  challengesCompleted: number;
}

export interface Challenge {
  id: number;
  name: string;
  milestonesAmount: number;
  isPullRequestRequired: boolean;
}

export interface ChallengeInfo extends Challenge {
  progress?: number;
  url?: string;
  contractId?: string;
  startDate?: number;
  completedAt?: number;
  isCompleted?: boolean;
  totalValueLocked?: number;
}

export interface UserProgress {
  userId: string;
  completedChallenges: number;
  ranking: Ranking;
  challenges: ChallengeInfo[];
}
