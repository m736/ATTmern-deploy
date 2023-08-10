import { createSlice } from "@reduxjs/toolkit";
const OnCallMisSlice = createSlice({
  name: "mis_vehicle",
  initialState: {
    loading: false,
    oncall_mis_uploadlist: [],
    searchOnCallDetail: [],
  },
  reducers: {
    onCallMisUploadRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    onCallMisUploadSuccess(state, action) {
      return {
        ...state,
        loading: false,
        oncall_mis_uploadlist: action.payload,
      };
    },
    onCallMisUploadFail(state, action) {
      return {
        loading: false,
        error: action.payload,
      };
    },
    searchOnCallMisDataRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    searchOnCallMisDataSuccess(state, action) {
      return {
        ...state,
        loading: false,
        searchOnCallDetail: action.payload,
      };
    },
    searchOnCallMisDataFail(state, action) {
      return {
        loading: false,
        error: action.payload,
      };
    },
  },
});

const { actions, reducer } = OnCallMisSlice;

export const {
  onCallMisUploadRequest,
  onCallMisUploadSuccess,
  onCallMisUploadFail,
  searchOnCallMisDataRequest,
  searchOnCallMisDataSuccess,
  searchOnCallMisDataFail,
} = actions;

export default reducer;
