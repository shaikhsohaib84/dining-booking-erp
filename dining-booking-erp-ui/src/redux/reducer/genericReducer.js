import { ActionTypes } from "../constant/actionType";

export const genericReducer = (state = {}, action) => {
  const { type, payload } = action;
  switch (type) {
    case ActionTypes?.SET_GENERIC:
      return { ...state, ...payload };
    default:
      return state;
  }
};