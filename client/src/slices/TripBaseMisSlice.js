import { createSlice } from "@reduxjs/toolkit";
const TripBaseMisSlice = createSlice({
  name: "trip_base_mis",
  initialState: {
    tripLoading: false,
    trip_base_mis_uploadlist: [],
    search_tripBase_detail: [],
  },
  reducers: {
    tripBaseMisUploadRequest(state, action) {
      return {
        ...state,
        tripLoading: true,
      };
    },
    tripBaseMisUploadSuccess(state, action) {
      return {
        ...state,
        tripLoading: false,
        trip_base_mis_uploadlist: action.payload,
      };
    },
    tripBaseMisUploadFail(state, action) {
      return {
        tripLoading: false,
        error: action.payload,
      };
    },
    searchTripBaseMisDataRequest(state, action) {
      return {
        ...state,
        tripLoading: true,
      };
    },
    searchTripBaseMisDataSuccess(state, action) {
      return {
        ...state,
        tripLoading: false,
        search_tripBase_detail: action.payload,
      };
    },
    searchTripBaseMisDataFail(state, action) {
      return {
        tripLoading: false,
        error: action.payload,
      };
    },
  },
});

const { actions, reducer } = TripBaseMisSlice;

export const {
  tripBaseMisUploadRequest,
  tripBaseMisUploadSuccess,
  tripBaseMisUploadFail,
  searchTripBaseMisDataRequest,
  searchTripBaseMisDataSuccess,
  searchTripBaseMisDataFail,
} = actions;

export default reducer;
