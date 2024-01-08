import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    authLoading: true,
    isAuthenticated: false,
  },
  reducers: {
    loginRequest(state, action) {
      return {
        ...state,
        authLoading: true,
      };
    },
    loginSuccess(state, action) {
      return {
        authLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
      };
    },
    loginFail(state, action) {
      return {
        ...state,
        authLoading: false,
        error: action.payload,
      };
    },
    clearError(state, action) {
      return {
        ...state,
        error: null,
      };
    },
    // registerRequest(state, action) {
    //   return {
    //     ...state,
    //     authLoading: true,
    //   };
    // },
    // registerSuccess(state, action) {
    //   return {
    //     authLoading: false,
    //     isAuthenticated: true,
    //     user: action.payload.user,
    //   };
    // },
    // registerFail(state, action) {
    //   return {
    //     ...state,
    //     authLoading: false,
    //     error: action.payload,
    //   };
    // },
    loadUserRequest(state, action) {
      return {
        ...state,
        isAuthenticated: false,
        authLoading: true,
      };
    },
    loadUserSuccess(state, action) {
      return {
        authLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
      };
    },
    loadUserFail(state, action) {
      return {
        ...state,
        authLoading: false,
        error: action.payload,
      };
    },
    logoutSuccess(state, action) {
      return {
        authLoading: false,
        isAuthenticated: false,
      };
    },
    logoutFail(state, action) {
      return {
        ...state,
        error: action.payload,
      };
    },
    updateProfileRequest(state, action) {
      return {
        ...state,
        authLoading: true,
        isUpdated: false,
      };
    },
    updateProfileSuccess(state, action) {
      return {
        ...state,
        authLoading: false,
        user: action.payload.user,
        isUpdated: true,
      };
    },
    updateProfileFail(state, action) {
      return {
        ...state,
        authLoading: false,
        error: action.payload,
      };
    },
    clearUpdateProfile(state, action) {
      return {
        ...state,
        isUpdated: false,
      };
    },

    updatePasswordRequest(state, action) {
      return {
        ...state,
        authLoading: true,
        isUpdated: false,
      };
    },
    updatePasswordSuccess(state, action) {
      return {
        ...state,
        authLoading: false,
        isUpdated: true,
      };
    },
    updatePasswordFail(state, action) {
      return {
        ...state,
        authLoading: false,
        error: action.payload,
      };
    },
    forgotPasswordRequest(state, action) {
      return {
        ...state,
        authLoading: true,
        message: null,
      };
    },
    forgotPasswordSuccess(state, action) {
      return {
        ...state,
        authLoading: false,
        message: action.payload.message,
      };
    },
    forgotPasswordFail(state, action) {
      return {
        ...state,
        authLoading: false,
        error: action.payload,
      };
    },
    resetPasswordRequest(state, action) {
      return {
        ...state,
        authLoading: true,
      };
    },
    resetPasswordSuccess(state, action) {
      return {
        ...state,
        authLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
      };
    },
    resetPasswordFail(state, action) {
      return {
        ...state,
        authLoading: false,
        error: action.payload,
      };
    },
  },
});

const { actions, reducer } = authSlice;

export const {
  loginRequest,
  loginSuccess,
  loginFail,
  clearError,
  registerRequest,
  registerSuccess,
  registerFail,
  loadUserRequest,
  loadUserSuccess,
  loadUserFail,
  logoutFail,
  logoutSuccess,
  updateProfileFail,
  updateProfileRequest,
  updateProfileSuccess,
  clearUpdateProfile,
  updatePasswordFail,
  updatePasswordSuccess,
  updatePasswordRequest,
  forgotPasswordFail,
  forgotPasswordSuccess,
  forgotPasswordRequest,
  resetPasswordFail,
  resetPasswordRequest,
  resetPasswordSuccess,
} = actions;

export default reducer;
