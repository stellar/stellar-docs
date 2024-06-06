import { ChallengeInfo } from "../interfaces/challenge";

export const getActiveChallenge = (
  data: ChallengeInfo[],
  challengeId: number,
): ChallengeInfo | undefined => data.find((item: ChallengeInfo) => item.id === challengeId);
