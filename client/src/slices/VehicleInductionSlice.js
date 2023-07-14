import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "vehicleInduction",
  initialState: {
    loading: false,
    isVehicleListCreated: false,
    isVehicleListDeleted: false,
    isVehicleListUpdated: false,
    vehiclelist: [],
  },
  reducers: {
    getVehicleListRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    getVehicleListSuccess(state, action) {
      return {
        loading: false,
        vehiclelist: action.payload,
      };
    },
    getVehicleListFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    addVehicleRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    addVehicleSuccess(state, action) {
      return {
        ...state,
        loading: false,
        vehiclelist: action.payload.addvehicle,
        isVehicleListCreated: true,
      };
    },
    addVehicleFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
        isVehicleListCreated: false,
      };
    },
    clearAddVehicleCreated(state, action) {
      return {
        ...state,
        isVehicleListCreated: false,
      };
    },

    updateVehicleListRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    updateVehicleListSuccess(state, action) {
      return {
        loading: false,
        vehiclelist: action.payload.vehicleList,
        isVehicleListUpdated: true,
      };
    },
    updateVehicleListFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    clearUpdateVehicleListCreated(state, action) {
      return {
        ...state,
        isVehicleListUpdated: false,
      };
    },
    clearError(state, action) {
      return { ...state, error: null };
    },
  },
});

const { actions, reducer } = authSlice;

export const {
  addVehicleRequest,
  addVehicleSuccess,
  addVehicleFail,
  getVehicleListRequest,
  getVehicleListSuccess,
  getVehicleListFail,
  updateVehicleListRequest,
  updateVehicleListSuccess,
  updateVehicleListFail,
  clearAddVehicleCreated,
  clearUpdateVehicleListCreated,
  clearError,
} = actions;

export default reducer;
