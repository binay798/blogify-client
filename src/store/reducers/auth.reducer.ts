import * as Actions from './../actions/index';
import { AuthPayload } from '../actionCreators';

export interface User {
  _id?: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  permanentAddress?: string;
  temporaryAddress?: string;
  mobile?: number;
  highSchool?: string;
  college?: string;
  photo?: string;
}

export interface UserAction {
  type: string;
  payload: AuthPayload;
}

type ActionType = UserAction;

export interface InitialState {
  user: User | null;
  token: string | undefined;
}

const initialState: InitialState = {
  user: null,
  token: undefined,
};

const reducer = (state = initialState, action: ActionType) => {
  switch (action.type) {
    case Actions.AuthAction.SIGNUP:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
      };
    case Actions.AuthAction.LOGIN:
      return {
        ...state,
        user: { ...action.payload.user },
        token: action.payload.token,
      };
    case Actions.AuthAction.UPDATE_USER:
      return {
        ...state,
        user: { ...action.payload.user },
      };
    case Actions.AuthAction.LOGOUT:
      return {
        user: null,
        token: undefined,
      };
    default:
      return state;
  }
};

export default reducer;
