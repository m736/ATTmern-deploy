import { createSlice } from "@reduxjs/toolkit";
const VechicleDetailSlice = createSlice({
  name: "mis_vehicle",
  initialState: {
    loading: false,
    requiredFields: [
      "ID",
      "Vehicle No",
      "Company",
      "Date",
      "Slip No",
      "Trip",
      "Time",
      "P_D",
      "Distance",
      "Start Location",
      "End Location",
    ],
    misvehicle_list: [],
  },
  reducers: {
    vechicleRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    vechicleSuccess(state, action) {
      return {
        ...state,
        loading: false,
        misvehicle_list: action.payload,
      };
    },
    vechicleFail(state, action) {
      return {
        loading: false,
        error: action.payload,
      };
    },
  },
});

const { actions, reducer } = VechicleDetailSlice;

export const { vechicleRequest, vechicleSuccess, vechicleFail } = actions;

export default reducer;
