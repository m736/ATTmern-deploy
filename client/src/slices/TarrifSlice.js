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
        tarrifData: action.payload.getTarrifData,
        // alltarrifData: action.payload.getAllTarrifData,
        // page_count: action.payload.count,
        // resPerPage: action.payload.resPerPage,
      };
    },
    getTarrifListFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    getIndividualTarrifRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    getIndividualTarrifSuccess(state, action) {
      return {
        loading: false,
        tarrifData: action.payload.getSingleTarrifMaster,
      };
    },
    getIndividualTarrifFail(state, action) {
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
    clearUpdateTarrifList(state, action) {
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
    uniqueTarrifDataRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    uniqueTarrifDataSuccess(state, action) {
      return {
        ...state,
        loading: false,
        tarrifUniqueData: {
          company: action.payload.getTarrrifCompanyDetails,
          vehicle: action.payload.getTarrrifVehicleDetails,
          rental: action.payload.getTarrrifSelectedRental,
          segment: action.payload.getTarrrifSelectedSegment,
        },
      };
    },
    uniqueTarrifDataFail(state, action) {
      return {
        loading: false,
        error: action.payload,
      };
    },
    searchTarrifDataRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    searchTarrifDataSuccess(state, action) {
      return {
        ...state,
        loading: false,
        tarrifData: action.payload.getTarrrifDetails,
        page_count: action.payload.count,
        resPerPage: action.payload.resPerPage,
      };
    },
    searchTarrifDataFail(state, action) {
      return {
        loading: false,
        error: action.payload,
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
  clearUpdateTarrifList,
  clearTarrifError,
  searchTarrifDataRequest,
  searchTarrifDataSuccess,
  searchTarrifDataFail,
  uniqueTarrifDataRequest,
  uniqueTarrifDataSuccess,
  uniqueTarrifDataFail,
  getIndividualTarrifRequest,
  getIndividualTarrifSuccess,
  getIndividualTarrifFail,
} = actions;

export default reducer;
