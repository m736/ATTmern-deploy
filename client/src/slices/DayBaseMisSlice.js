import { createSlice } from "@reduxjs/toolkit";
const DayBaseMisSlice = createSlice({
  name: "day_base_mis",
  initialState: {
    dayLoading: false,
    day_base_mis_uploadlist: [],
    search_dayBase_detail: [],
  },
  reducers: {
    dayBaseMisUploadRequest(state, action) {
      return {
        ...state,
        dayLoading: true,
      };
    },
    dayBaseMisUploadSuccess(state, action) {
      return {
        ...state,
        dayLoading: false,
        day_base_mis_uploadlist: action.payload,
      };
    },
    dayBaseMisUploadFail(state, action) {
      return {
        dayLoading: false,
        error: action.payload,
      };
    },
    searchDayBaseMisDataRequest(state, action) {
      return {
        ...state,
        dayLoading: true,
      };
    },
    searchDayBaseMisDataSuccess(state, action) {
      return {
        ...state,
        dayLoading: false,
        search_dayBase_detail: action.payload,
      };
    },
    searchDayBaseMisDataFail(state, action) {
      return {
        dayLoading: false,
        error: action.payload,
      };
    },
  },
});

const { actions, reducer } = DayBaseMisSlice;

export const {
  dayBaseMisUploadRequest,
  dayBaseMisUploadSuccess,
  dayBaseMisUploadFail,
  searchDayBaseMisDataRequest,
  searchDayBaseMisDataSuccess,
  searchDayBaseMisDataFail,
} = actions;

export default reducer;
