import { createSlice } from "@reduxjs/toolkit";

const AgencyListSlice = createSlice({
  name: "OwnerList",
  initialState: {
    agencyListLoading: false,
    isAgencyListCreated: false,
    isAgencyListUpdated: false,
    isAgencyListDeleted: false,
    agency_detail: [],
  },
  reducers: {
    getAgencyListRequest(state, action) {
      return {
        ...state,
        agencyListLoading: true,
      };
    },
    getAgencyListSuccess(state, action) {
      return {
        agencyListLoading: false,
        agency_detail: action.payload.getAgencyList,
        // page_count: action.payload.count,
        // resPerPage: action.payload.resPerPage,
      };
    },
    getAgencyListFail(state, action) {
      return {
        ...state,
        agencyListLoading: false,
        error: action.payload,
      };
    },

    createAgencyListRequest(state, action) {
      return {
        ...state,
        agencyListLoading: true,
      };
    },
    createAgencyListSuccess(state, action) {
      return {
        ...state,
        agencyListLoading: false,
        agency_detail: action.payload.createAgencyList,
        isAgencyListCreated: true,
      };
    },
    createAgencyListFail(state, action) {
      return {
        ...state,
        agencyListLoading: false,
        error: action.payload,
        isAgencyListCreated: false,
      };
    },
    clearAgencyListCreated(state, action) {
      return {
        ...state,
        isAgencyListCreated: false,
      };
    },

    clearAgencyListError(state, action) {
      return { ...state, error: null };
    },
    updateAgencyListRequest(state, action) {
      return {
        ...state,
        agencyListLoading: true,
      };
    },
    updateAgencyListSuccess(state, action) {
      return {
        agencyListLoading: false,
        agency_detail: action.payload.updateAgencyList,
        isAgencyListUpdated: true,
      };
    },
    updateAgencyListFail(state, action) {
      return {
        ...state,
        agencyListLoading: false,
        error: action.payload,
      };
    },
    clearAgencyListUpdated(state, action) {
      return {
        ...state,
        isAgencyListUpdated: false,
      };
    },
    deleteAgencyListRequest(state, action) {
      return {
        ...state,
        agencyListLoading: true,
      };
    },
    deleteAgencyListSuccess(state, action) {
      return {
        ...state,
        agencyListLoading: false,
        isAgencyListDeleted: true,
      };
    },
    deleteAgencyListFail(state, action) {
      return {
        ...state,
        agencyListLoading: false,
        error: action.payload,
      };
    },
    clearAgencyListDeleted(state, action) {
      return {
        ...state,
        isAgencyListDeleted: false,
      };
    },
  },
});

const { actions, reducer } = AgencyListSlice;

export const {
  getAgencyListRequest,
  getAgencyListSuccess,
  getAgencyListFail,
  createAgencyListRequest,
  createAgencyListSuccess,
  createAgencyListFail,
  clearAgencyListCreated,
  clearAgencyListError,
  updateAgencyListRequest,
  updateAgencyListSuccess,
  updateAgencyListFail,
  clearAgencyListUpdated,
  deleteAgencyListRequest,
  deleteAgencyListSuccess,
  deleteAgencyListFail,
  clearAgencyListDeleted,
} = actions;

export default reducer;
