import { AxiosResponse } from "axios";
import {
  Challenge,
  UserChallengeData,
  UpdateProgressData,
  UserProgress,
} from "../interfaces/challenge";
import { httpClient } from "./http-client";

export const fetchInitialChallenges = async () => await httpClient.get<Challenge[]>("/challenges");

export const fetchUserProgress = async (userId: string) => await httpClient.get<UserProgress>("/users", {
    validateStatus: (status) => (status >= 200 && status < 300) || status === 404,
    params: { userId },
  });

export const resetUserProgress = async (userId: string) => await httpClient.delete<UserProgress>("/users", {
    params: { userId },
  });

export const updateUserProgress = async (challenge: UpdateProgressData) => await httpClient.post<
    Partial<UpdateProgressData>,
    AxiosResponse<UserChallengeData>
  >("/", challenge);
