import { ChallengeInfo } from "../interfaces/challenge";

export const getActiveChallenge = (
  data: ChallengeInfo[],
  challengeId: number,
): ChallengeInfo | undefined => {
  return data.find((item: ChallengeInfo) => item.id === challengeId);
};
