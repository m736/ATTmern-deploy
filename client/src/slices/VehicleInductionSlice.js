import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "vehicleInduction",
  initialState: {
    vehicleListLoading: false,
    isVehicleListCreated: false,
    isVehicleListDeleted: false,
    isVehicleListUpdated: false,
    vehicle_list: [],
    single_vehicle_list: {},
    update_vehicle_list: {},
  },
  reducers: {
    getVehicleListRequest(state, action) {
      return {
        ...state,
        vehicleListLoading: true,
      };
    },
    getVehicleListSuccess(state, action) {
      return {
        vehicleListLoading: false,
        vehicle_list: action.payload.getVehicleList,
      };
    },
    getVehicleListFail(state, action) {
      return {
        ...state,
        vehicleListLoading: false,
        error: action.payload,
      };
    },
    getIndividualVehicleListRequest(state, action) {
      return {
        ...state,
        vehicleListLoading: true,
      };
    },
    getIndividualVehicleListSuccess(state, action) {
      return {
        vehicleListLoading: false,
        single_vehicle_list: action.payload.getIndividualVehicleList,
      };
    },
    geIndividualVehicleListFail(state, action) {
      return {
        ...state,
        vehicleListLoading: false,
        error: action.payload,
      };
    },
    addVehicleRequest(state, action) {
      return {
        ...state,
        vehicleListLoading: true,
      };
    },
    addVehicleSuccess(state, action) {
      return {
        ...state,
        vehicleListLoading: false,
        vehicle_list: action.payload.addvehicle,
        isVehicleListCreated: true,
      };
    },
    addVehicleFail(state, action) {
      return {
        ...state,
        vehicleListLoading: false,
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
        vehicleListLoading: true,
      };
    },
    updateVehicleListSuccess(state, action) {
      return {
        vehicleListLoading: false,
        update_vehicle_list: action.payload.updateVehicleData,
        isVehicleListUpdated: true,
      };
    },
    updateVehicleListFail(state, action) {
      return {
        ...state,
        vehicleListLoading: false,
        error: action.payload,
      };
    },
    clearUpdateVehicleListCreated(state, action) {
      return {
        ...state,
        isVehicleListUpdated: false,
      };
    },
    deleteVehicleListRequest(state, action) {
      return {
        ...state,
        ownerListLoading: true,
      };
    },
    deleteVehicleListSuccess(state, action) {
      return {
        ...state,
        ownerListLoading: false,
        isOwnerListDeleted: true,
      };
    },
    deleteVehicleListFail(state, action) {
      return {
        ...state,
        ownerListLoading: false,
        error: action.payload,
      };
    },
    clearVehicleListDeleted(state, action) {
      return {
        ...state,
        isOwnerListDeleted: false,
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
  getIndividualVehicleListRequest,
  getIndividualVehicleListSuccess,
  geIndividualVehicleListFail,
  deleteVehicleListRequest,
  deleteVehicleListSuccess,
  deleteVehicleListFail,
  clearVehicleListDeleted,
} = actions;

export default reducer;
