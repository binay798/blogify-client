import produce from 'immer';
import * as Actions from './../actions/index';

export interface Post {
  _id: string;
  title: string;
  author: {
    firstname: string;
    lastname: string;
    photo: string;
    _id: string;
  };
  photo: string;
  description: string;
  likes: string[];
  createdAt: string;
}
export interface InitialState {
  posts: Post[];
}

export interface PostAction {
  type: string;
  payload: {
    posts: Post[];
  };
}

type MainAction = PostAction;

const initialState = {
  posts: [],
};

const reducer = (state: InitialState = initialState, action: MainAction) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case Actions.PostAction.CREATE_POST:
        draft.posts.unshift(action.payload.posts[0]);
        break;
      case Actions.PostAction.GET_POSTS:
        draft.posts = action.payload.posts;
        break;
      case Actions.PostAction.LIKE_POST:
        const id = draft.posts.findIndex(
          (el) => el._id === action.payload.posts[0]._id
        );
        draft.posts[id].likes = action.payload.posts[0].likes;
        break;
      case Actions.PostAction.DISLIKE_POST:
        const id1 = draft.posts.findIndex(
          (el) => el._id === action.payload.posts[0]._id
        );
        draft.posts[id1].likes = action.payload.posts[0].likes;
        break;
      default:
        return state;
    }
  });
};

export default reducer;
