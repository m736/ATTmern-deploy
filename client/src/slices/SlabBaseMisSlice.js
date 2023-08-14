import { createSlice } from "@reduxjs/toolkit";
const SlabBaseMisSlice = createSlice({
  name: "mis_vehicle",
  initialState: {
    loading: false,
    slab_base_mis_uploadlist: [],
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
  },
});

const { actions, reducer } = SlabBaseMisSlice;

export const {
  slabBaseMisUploadRequest,
  slabBaseMisUploadSuccess,
  slabBaseMisUploadFail,
} = actions;

export default reducer;
