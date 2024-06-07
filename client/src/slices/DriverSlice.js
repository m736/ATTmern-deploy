import { createSlice } from "@reduxjs/toolkit";

const DriverListSlice = createSlice({
  name: "OwnerList",
  initialState: {
    driverListLoading: false,
    isDriverListCreated: false,
    isDriverListUpdated: false,
    isDriverListDeleted: false,
    driver_detail: [],
  },
  reducers: {
    getDriverListRequest(state, action) {
      return {
        ...state,
        driverListLoading: true,
      };
    },
    getDriverListSuccess(state, action) {
      return {
        driverListLoading: false,
        driver_detail: action.payload.getDriverList,
      };
    },
    getDriverListFail(state, action) {
      return {
        ...state,
        driverListLoading: false,
        error: action.payload,
      };
    },
    createDriverListRequest(state, action) {
      return {
        ...state,
        driverListLoading: true,
      };
    },
    createDriverListSuccess(state, action) {
      return {
        ...state,
        driverListLoading: false,
        driver_detail: action.payload.createDriverList,
        isDriverListCreated: true,
      };
    },
    createDriverListFail(state, action) {
      return {
        ...state,
        driverListLoading: false,
        error: action.payload,
        isDriverListCreated: false,
      };
    },
    clearDriverListCreated(state, action) {
      return {
        ...state,
        isDriverListCreated: false,
      };
    },
    updateDriverListRequest(state, action) {
      return {
        ...state,
        driverListLoading: true,
      };
    },
    updateDriverListSuccess(state, action) {
      return {
        driverListLoading: false,
        driver_detail: action.payload.updateOwnerList,
        isDriverListUpdated: true,
      };
    },
    updateDriverListFail(state, action) {
      return {
        ...state,
        driverListLoading: false,
        error: action.payload,
      };
    },
    clearDriverListUpdated(state, action) {
      return {
        ...state,
        isDriverListUpdated: false,
      };
    },
    deleteDriverListRequest(state, action) {
      return {
        ...state,
        driverListLoading: true,
      };
    },
    deleteDriverListSuccess(state, action) {
      return {
        ...state,
        driverListLoading: false,
        isDriverListDeleted: true,
      };
    },
    deleteDriverListFail(state, action) {
      return {
        ...state,
        driverListLoading: false,
        error: action.payload,
      };
    },
    clearDriverListDeleted(state, action) {
      return {
        ...state,
        isDriverListDeleted: false,
      };
    },
    clearDriverListError(state, action) {
      return { ...state, error: null };
    },
  },
});

const { actions, reducer } = DriverListSlice;

export const {
  createDriverListRequest,
  createDriverListSuccess,
  createDriverListFail,
  clearDriverListCreated,
  clearDriverListError,
  getDriverListRequest,
  getDriverListSuccess,
  getDriverListFail,
  updateDriverListRequest,
  updateDriverListSuccess,
  updateDriverListFail,
  clearDriverListUpdated,
  deleteDriverListRequest,
  deleteDriverListSuccess,
  deleteDriverListFail,
  clearDriverListDeleted,
} = actions;

export default reducer;
