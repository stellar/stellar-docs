import { Leaderboard } from "../interfaces/challenge";
import { httpClient } from "./http-client";

export enum LeaderboardColumn {
  ChallengesCompleted = "challengesCompleted",
  MinutesSpent = "minutesSpent",
  TotalValueLocked = "totalValueLocked",
}

export type LeaderboardParams = {
  colName?: LeaderboardColumn;
  direction?: "asc" | "desc";
  pageNumber?: number;
};

export const fetchLeaderboard = async ({
  colName,
  direction = "asc",
  pageNumber,
}: LeaderboardParams) => {
  return await httpClient.get<Leaderboard[]>("/leaderboard", {
    params: {
      ...(colName
        ? {
            sort: `${colName},${direction}`,
          }
        : {}),
      ...(pageNumber ? { pageNumber } : {}),
    },
  });
};
