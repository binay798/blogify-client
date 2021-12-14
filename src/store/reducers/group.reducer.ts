import produce from 'immer';
import * as Actions from '../actions/index';
import { User } from './auth.reducer';

export interface Group {
  _id: string;
  name: string;
  description: string;
  status: string;
  location: string;
  admin?: User;
  users?: string[];
  photo?: string;
  slug?: string;
}

export interface InitialState {
  groups: Group[];
  selectedGroup: Group | null;
}

interface GroupAction {
  type: string;
  payload: {
    groups: Group[];
  };
}

const initialState = {
  groups: [],
  selectedGroup: null,
};

export const reducer = (
  state: InitialState = initialState,
  action: GroupAction
) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case Actions.GroupAction.CREATE_GROUP:
        draft.groups.unshift(action.payload.groups[0]);
        break;
      case Actions.GroupAction.GET_GROUPS:
        draft.groups = action.payload.groups;
        break;

      case Actions.GroupAction.SELECT_GROUP:
        draft.selectedGroup = action.payload.groups[0];
        break;
      default:
        break;
    }
  });
};

export default reducer;
