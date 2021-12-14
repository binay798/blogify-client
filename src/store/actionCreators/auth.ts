import { Dispatch } from 'redux';
import axios from './../../axiosInstance';
import React from 'react';
import * as Actions from './../actions/index';
import { User } from './../reducers/auth.reducer';
import { NavigateFunction } from 'react-router-dom';

interface SignupData {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}
interface LoginData {
  email: string;
  password: string;
}
export interface AuthPayload {
  token?: string;
  user: User;
}

export const signup = (
  data: SignupData,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  navigate: NavigateFunction
) => {
  return async (dispatch: Dispatch) => {
    setLoading(true);
    try {
      const res = await axios.post<AuthPayload>('/api/v1/users/signup', data);
      setLoading(false);
      dispatch({ type: Actions.AuthAction.SIGNUP, payload: res.data });
      navigate('/');
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };
};

export const login = (
  data: LoginData,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  navigate: NavigateFunction
) => {
  return async (dispatch: Dispatch) => {
    setLoading(true);
    try {
      const res = await axios.post<AuthPayload>('/api/v1/users/login', data);
      setLoading(false);
      dispatch({ type: Actions.AuthAction.LOGIN, payload: res.data });
      navigate('/');
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };
};

export const updateUser = (
  data: User,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  return async (dispatch: Dispatch) => {
    setLoading(true);
    try {
      let res = await axios.patch<AuthPayload>('/api/v1/users', data);

      dispatch({ type: Actions.AuthAction.UPDATE_USER, payload: res.data });
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };
};

export const updateProfilePic = (
  data: File,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  return async (dispatch: Dispatch) => {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('image', data);
      const res = await axios.patch<AuthPayload>(
        '/api/v1/users/update-pic',
        fd
      );
      dispatch({ type: Actions.AuthAction.UPDATE_USER, payload: res.data });
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };
};
