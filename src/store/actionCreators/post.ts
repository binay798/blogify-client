import { Dispatch } from 'redux';
import axios from '../../axiosInstance';
import { Post } from './../reducers/post.reducer';
import * as Actions from './../actions/index';

interface CreatePostData {
  title: string;
  description: string;
  photo: File;
}
export const createPost = (
  data: CreatePostData,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  return async (dispatch: Dispatch) => {
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append('title', data.title);
      fd.append('description', data.description);
      fd.append('image', data.photo);

      let res = await axios.post<{ post: Post }>('/api/v1/posts', fd);
      dispatch({
        type: Actions.PostAction.CREATE_POST,
        payload: { posts: [res.data.post] },
      });
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };
};

export const likePost = (
  data: string,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  return async (dispatch: Dispatch) => {
    setLoading(true);
    try {
      let res = await axios.patch<{ post: Post }>(
        `api/v1/posts/${data}/modify-like/like`
      );
      dispatch({
        type: Actions.PostAction.LIKE_POST,
        payload: { posts: [res.data.post] },
      });
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };
};

export const disLikePost = (
  data: string,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  return async (dispatch: Dispatch) => {
    setLoading(true);
    try {
      let res = await axios.patch<{ post: Post }>(
        `api/v1/posts/${data}/modify-like/dislike`
      );
      dispatch({
        type: Actions.PostAction.DISLIKE_POST,
        payload: { posts: [res.data.post] },
      });
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };
};
