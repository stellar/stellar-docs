import React from "react";
import { ChallengeInfo } from "../interfaces/challenge";

export type UserChallengesContextProps = {
  data: ChallengeInfo[];
  address: string;
  setData: (data: ChallengeInfo[]) => void;
  updateProgress: (item: ChallengeInfo) => void;
  setAddress: (address: string) => void;
};

const UserChallengesContext = React.createContext<UserChallengesContextProps>({
  data: [],
  address: "",
  setData: () => {},
  updateProgress: () => {},
  setAddress: () => {},
});

export default UserChallengesContext;
