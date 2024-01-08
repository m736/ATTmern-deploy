import axios from "axios";
import {
  clearError,
  loadUserFail,
  loadUserRequest,
  loadUserSuccess,
  loginFail,
  loginRequest,
  loginSuccess,
  logoutFail,
  logoutSuccess,
} from "../slices/authSlice";

export const login = (formData) => async (dispatch) => {
  try {
    dispatch(loginRequest());
    const { data } = await axios.post(`/auth/login_api`, { formData });
    dispatch(loginSuccess(data));
  } catch (error) {
    dispatch(loginFail(error.response.data.message));
  }
};
export const logout = async (dispatch) => {
  try {
    await axios.get(`/auth/logout`);
    dispatch(logoutSuccess());
  } catch (error) {
    dispatch(logoutFail);
  }
};

export const clearAuthError = (dispatch) => {
  dispatch(clearError());
};
export const loadUser = async (dispatch) => {
  try {
    dispatch(loadUserRequest());

    const { data } = await axios.get(`/auth/myprofile`);
    dispatch(loadUserSuccess(data));
  } catch (error) {
    dispatch(loadUserFail(error.response.data.message));
  }
};
