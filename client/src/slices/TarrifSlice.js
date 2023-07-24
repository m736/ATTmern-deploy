import { createSlice } from "@reduxjs/toolkit";

const TarrifSlice = createSlice({
  name: "Tarrif",
  initialState: {
    loading: false,
    isTarrifCreated: false,
    tarrifData: [],
  },
  reducers: {
    createTarrifRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    createTarrifSuccess(state, action) {
      return {
        ...state,
        loading: false,
        tarrifData: action.payload.createTarrif,
        isTarrifCreated: true,
      };
    },
    createTarrifFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
        isTarrifCreated: false,
      };
    },
    clearCreateTarrif(state, action) {
      return {
        ...state,
        isTarrifCreated: false,
      };
    },

    clearTarrifError(state, action) {
      return { ...state, error: null };
    },
  },
});

const { actions, reducer } = TarrifSlice;

export const {
  createTarrifRequest,
  createTarrifSuccess,
  createTarrifFail,
  clearCreateTarrif,
  clearTarrifError,
} = actions;

export default reducer;
