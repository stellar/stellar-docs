import { AxiosResponse } from "axios";
import {
  Challenge,
  UserChallengeData,
  UpdateProgressData,
  UserProgress,
} from "../interfaces/challenge";
import { httpClient } from "./http-client";

export const fetchInitialChallenges = async () => {
  return await httpClient.get<Challenge[]>("/challenges");
};

export const fetchUserProgress = async (userId: string) => {
  return await httpClient.get<UserProgress>("/users", {
    validateStatus: (status) => {
      return (status >= 200 && status < 300) || status === 404;
    },
    params: { userId },
  });
};

export const updateUserProgress = async (challenge: UpdateProgressData) => {
  return await httpClient.post<
    Partial<UpdateProgressData>,
    AxiosResponse<UserChallengeData>
  >("/", challenge);
};
