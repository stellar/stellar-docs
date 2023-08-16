import React from "react";
import { ChallengeInfo } from "../interfaces/challenge";

export type UserChallengesContextProps = {
  data: ChallengeInfo[];
  setData: (data: ChallengeInfo[]) => void;
  updateProgress: (item: ChallengeInfo) => void;
};

const UserChallengesContext = React.createContext<UserChallengesContextProps>({
  data: [],
  setData: () => {},
  updateProgress: () => {},
});

export default UserChallengesContext;
