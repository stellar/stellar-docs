export interface UserChallengeData {
  userId: string;
  challenge: ChallengeInfo;
}

export interface UpdateProgressData {
  userId: string;
  challengeId: number;
  challengeProgress: number;
  url?: string;
  startDate: number;
  completedAt?: number;
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
  startDate?: number;
  completedAt?: number;
  isCompleted?: boolean;
}

export interface UserProgress {
  userId: string;
  completedChallenges: number;
  challenges: ChallengeInfo[];
}
