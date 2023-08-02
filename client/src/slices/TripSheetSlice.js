import { createSlice } from "@reduxjs/toolkit";

const TripSheetEntry = createSlice({
  name: "Tarrif",
  initialState: {
    tripSheetLoading: false,
    isTripSheetCreated: false,

    tripSheetData: [],
  },
  reducers: {
    getTripSheetListRequest(state, action) {
      return {
        ...state,
        tripSheetLoading: true,
      };
    },
    getTripSheetListSuccess(state, action) {
      return {
        tripSheetLoading: false,
        tripSheetData: action.payload,
      };
    },
    getTripSheetListFail(state, action) {
      return {
        ...state,
        tripSheetLoading: false,
        error: action.payload,
      };
    },
    createTripSheetRequest(state, action) {
      return {
        ...state,
        tripSheetLoading: true,
      };
    },
    createTripSheetSuccess(state, action) {
      return {
        ...state,
        tripSheetLoading: false,
        tripSheetData: action.payload,
        isTripSheetCreated: true,
      };
    },
    createTripSheetFail(state, action) {
      return {
        ...state,
        tripSheetLoading: false,
        error: action.payload,
        isTripSheetCreated: false,
      };
    },
    clearCreateTripSheet(state, action) {
      return {
        ...state,
        isTripSheetCreated: false,
      };
    },

    clearTripSheetError(state, action) {
      return { ...state, error: null };
    },
  },
});

const { actions, reducer } = TripSheetEntry;

export const {
  getTripSheetListRequest,
  getTripSheetListSuccess,
  getTripSheetListFail,
  createTripSheetRequest,
  createTripSheetSuccess,
  createTripSheetFail,
  clearCreateTripSheet,
  clearTripSheetError,
  //   updateTarrifListRequest,
  //   updateTarrifListSuccess,
  //   updateTarrifListFail,
  //   deleteTarrifRequest,
  //   deleteTarrifSuccess,
  //   deleteTarrifFail,
  //   clearTarrifDeleted,
  //   clearCreateTarrif,
  //   clearUpdateTarrifListCreated,
  //   clearTarrifError,
} = actions;

export default reducer;
