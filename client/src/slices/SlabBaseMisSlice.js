import { createSlice } from "@reduxjs/toolkit";
const SlabBaseMisSlice = createSlice({
  name: "mis_vehicle",
  initialState: {
    loading: false,
    slab_base_mis_uploadlist: [],
    search_slabBase_detail: [],
  },
  reducers: {
    slabBaseMisUploadRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    slabBaseMisUploadSuccess(state, action) {
      return {
        ...state,
        loading: false,
        slab_base_mis_uploadlist: action.payload,
      };
    },
    slabBaseMisUploadFail(state, action) {
      return {
        loading: false,
        error: action.payload,
      };
    },
    searchSlabBaseMisDataRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    searchSlabBaseMisDataSuccess(state, action) {
      return {
        ...state,
        loading: false,
        search_slabBase_detail: action.payload,
      };
    },
    searchSlabBaseMisDataFail(state, action) {
      return {
        loading: false,
        error: action.payload,
      };
    },
  },
});

const { actions, reducer } = SlabBaseMisSlice;

export const {
  slabBaseMisUploadRequest,
  slabBaseMisUploadSuccess,
  slabBaseMisUploadFail,
  searchSlabBaseMisDataRequest,
  searchSlabBaseMisDataSuccess,
  searchSlabBaseMisDataFail,
} = actions;

export default reducer;
