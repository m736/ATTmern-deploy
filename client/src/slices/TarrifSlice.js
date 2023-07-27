import { createSlice } from "@reduxjs/toolkit";

const TarrifSlice = createSlice({
  name: "Tarrif",
  initialState: {
    loading: false,
    isTarrifCreated: false,
    isTarrifUpdated: false,
    isTarrifDeleted: false,
    tarrifData: [],
  },
  reducers: {
    getTarrifListRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    getTarrifListSuccess(state, action) {
      return {
        loading: false,
        tarrifData: action.payload,
      };
    },
    getTarrifListFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
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
    updateTarrifListRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    updateTarrifListSuccess(state, action) {
      return {
        loading: false,
        tarrifData: action.payload.createTarrif,
        isTarrifUpdated: true,
      };
    },
    updateTarrifListFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    clearUpdateTarrifListCreated(state, action) {
      return {
        ...state,
        isTarrifUpdated: false,
      };
    },
    deleteTarrifRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    deleteTarrifSuccess(state, action) {
      return {
        ...state,
        loading: false,
        isTarrifDeleted: true,
      };
    },
    deleteTarrifFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    clearTarrifDeleted(state, action) {
      return {
        ...state,
        isTarrifDeleted: false,
      };
    },
  },
});

const { actions, reducer } = TarrifSlice;

export const {
  createTarrifRequest,
  createTarrifSuccess,
  createTarrifFail,
  getTarrifListRequest,
  getTarrifListSuccess,
  getTarrifListFail,
  updateTarrifListRequest,
  updateTarrifListSuccess,
  updateTarrifListFail,
  deleteTarrifRequest,
  deleteTarrifSuccess,
  deleteTarrifFail,
  clearTarrifDeleted,
  clearCreateTarrif,
  clearUpdateTarrifListCreated,
  clearTarrifError,
} = actions;

export default reducer;
