import { Dispatch } from 'redux';
import axios from '../../axiosInstance';
import * as Actions from '../actions/index';

export const getGroups = () => {
  return async (dispatch: Dispatch) => {
    try {
      let res = await axios.get('/api/v1/groups');
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };
};

interface CreateGroupData {
  name: string;
  description: string;
  status: string;
  location: string;
  photo: File;
}

export const createGroup = (
  data: CreateGroupData,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  return async (dispatch: Dispatch) => {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('name', data.name);
      fd.append('description', data.description);
      fd.append('status', data.status);
      fd.append('location', data.location);
      fd.append('image', data.photo);

      let res = await axios.post('/api/v1/groups', fd);
      dispatch({
        type: Actions.GroupAction.CREATE_GROUP,
        payload: { groups: [res.data.group] },
      });
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };
};

export const joinGroup = (
  data: { name: string },
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  return async (dispatch: Dispatch) => {
    setLoading(true);
    try {
      let res = await axios.post(`/api/v1/groups/${data.name}/join`);
      dispatch({
        type: Actions.GroupAction.SELECT_GROUP,
        payload: { groups: [res.data.group] },
      });
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };
};

export const leaveGroup = (
  data: { name: string },
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  return async (dispatch: Dispatch) => {
    setLoading(true);
    try {
      let res = await axios.post(`/api/v1/groups/${data.name}/leave`);
      dispatch({
        type: Actions.GroupAction.SELECT_GROUP,
        payload: { groups: [res.data.group] },
      });
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };
};

interface GroupPost {
  title: string;
  description: string;
  photo: File;
}
export const createGroupPost = (
  data: GroupPost,
  groupId: string,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  return async (dispatch: Dispatch) => {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('title', data.title);
      fd.append('description', data.description);
      fd.append('image', data.photo);
      const res = await axios.post(`/api/v1/groups/${groupId}/group-post`, fd);
      console.log(res);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };
};
