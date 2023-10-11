import React, { PropsWithChildren, useReducer } from "react";
import UserChallengesContext, {
  UserChallengesContextProps,
} from "./user-challenges-context";
import { ChallengeInfo } from "../interfaces/challenge";

interface ChallengesState {
  data: ChallengeInfo[];
  address: string;
}

interface Action {
  type: string;
  data?: ChallengeInfo[];
  item?: ChallengeInfo;
  payload?: string;
}

enum ActionType {
  SET_DATA = "SET_DATA",
  UPDATE_PROGRESS = "UPDATE_PROGRESS",
  SET_ADDRESS = "SET_ADDRESS",
}

const defaultState: ChallengesState = {
  data: [],
  address: "",
};

const challengesReducer = (state: ChallengesState, action: Action) => {
  if (action.type === ActionType.SET_DATA && action.data) {
    return {
      ...state,
      data: [...action.data],
    };
  }

  if (action.type === ActionType.UPDATE_PROGRESS && action.item) {
    const { id } = action.item;
    const existingItemIdx = state.data.findIndex(
      (item: ChallengeInfo) => item.id === id,
    );
    const updatedChallenges: ChallengeInfo[] = [...state.data];

    const existedItem = state.data[existingItemIdx];

    if (existedItem) {
      updatedChallenges[existingItemIdx] = action.item;
    } else {
      updatedChallenges.push(action.item);
    }

    return {
      ...state,
      data: updatedChallenges,
    };
  }

  if (action.type === ActionType.SET_ADDRESS && action.payload) {
    return {
      ...state,
      address: action.payload,
    };
  }

  return defaultState;
};

const UserChallengesContextProvider = (props: PropsWithChildren) => {
  const [state, dispatchAction] = useReducer(challengesReducer, defaultState);

  const setDataHandler = (data: ChallengeInfo[]) => {
    dispatchAction({
      type: ActionType.SET_DATA,
      data,
    });
  };

  const updateProgressHandler = (item: ChallengeInfo) => {
    dispatchAction({
      type: ActionType.UPDATE_PROGRESS,
      item,
    });
  };

  const setAddress = (address: string) => {
    dispatchAction({
      type: ActionType.SET_ADDRESS,
      payload: address,
    });
  };

  const challengesCtx: UserChallengesContextProps = {
    data: state.data,
    address: state.address,
    setAddress,
    setData: setDataHandler,
    updateProgress: updateProgressHandler,
  };

  return (
    <UserChallengesContext.Provider value={challengesCtx}>
      {props.children}
    </UserChallengesContext.Provider>
  );
};

export default UserChallengesContextProvider;
