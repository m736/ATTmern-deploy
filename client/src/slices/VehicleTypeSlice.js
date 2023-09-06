import { createSlice } from "@reduxjs/toolkit";

const VehicleTypeSlice = createSlice({
  name: "Vehicle_Type",
  initialState: {
    vehicleTypeLoading: false,
    isVehicleTypeCreated: false,
    isVehicleTypeUpdated: false,
    isVehicleTypeDeleted: false,
    vehicle_types: [],
  },
  reducers: {
    getVehicleTypeRequest(state, action) {
      return {
        ...state,
        vehicleTypeLoading: true,
      };
    },
    getVehicleTypeSuccess(state, action) {
      return {
        vehicleTypeLoading: false,
        vehicle_types: action.payload.map((item) => {
          return {
            ...item,
            value: item.VehicleType,
            text: item.VehicleType,
          };
        }),
        // page_count: action.payload.count,
        // resPerPage: action.payload.resPerPage,
      };
    },
    getVehicleTypeFail(state, action) {
      return {
        ...state,
        vehicleTypeLoading: false,
        error: action.payload,
      };
    },

    createVehicleTypeRequest(state, action) {
      return {
        ...state,
        vehicleTypeLoading: true,
      };
    },
    createVehicleTypeSuccess(state, action) {
      return {
        ...state,
        vehicleTypeLoading: false,
        vehicle_types: action.payload,
        isVehicleTypeCreated: true,
      };
    },
    createVehicleTypeFail(state, action) {
      return {
        ...state,
        vehicleTypeLoading: false,
        error: action.payload,
      };
    },
    clearVehicleTypeCreated(state, action) {
      return {
        ...state,
        isVehicleTypeCreated: false,
      };
    },

    clearVehicleTypeError(state, action) {
      return { ...state, error: null };
    },
    updateVehicleTypeRequest(state, action) {
      return {
        ...state,
        vehicleTypeLoading: true,
      };
    },
    updateVehicleTypeSuccess(state, action) {
      return {
        vehicleTypeLoading: false,
        vehicle_types: action.payload,
        isVehicleTypeUpdated: true,
      };
    },
    updateVehicleTypeFail(state, action) {
      return {
        ...state,
        vehicleTypeLoading: false,
        error: action.payload,
      };
    },
    clearVehicleTypeUpdated(state, action) {
      return {
        ...state,
        isVehicleTypeUpdated: false,
      };
    },
    deleteVehicleTypeRequest(state, action) {
      return {
        ...state,
        vehicleTypeLoading: true,
      };
    },
    deleteVehicleTypeSuccess(state, action) {
      return {
        ...state,
        vehicleTypeLoading: false,
        isVehicleTypeDeleted: true,
      };
    },
    deleteVehicleTypeFail(state, action) {
      return {
        ...state,
        vehicleTypeLoading: false,
        error: action.payload,
      };
    },
    clearVehicleTypeDeleted(state, action) {
      return {
        ...state,
        isVehicleTypeDeleted: false,
      };
    },
  },
});

const { actions, reducer } = VehicleTypeSlice;

export const {
  getVehicleTypeRequest,
  getVehicleTypeSuccess,
  getVehicleTypeFail,
  createVehicleTypeRequest,
  createVehicleTypeSuccess,
  createVehicleTypeFail,
  clearVehicleTypeCreated,
  clearVehicleTypeDeleted,
  clearVehicleTypeUpdated,
  clearVehicleTypeError,
  updateVehicleTypeRequest,
  updateVehicleTypeSuccess,
  updateVehicleTypeFail,
  deleteVehicleTypeRequest,
  deleteVehicleTypeSuccess,
  deleteVehicleTypeFail,
} = actions;

export default reducer;
