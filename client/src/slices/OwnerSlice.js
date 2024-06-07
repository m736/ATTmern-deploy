import { createSlice } from "@reduxjs/toolkit";

const OwnerListSlice = createSlice({
  name: "OwnerList",
  initialState: {
    ownerListLoading: false,
    isOwnerListCreated: false,
    isOwnerListUpdated: false,
    isOwnerListDeleted: false,
    owner_detail: [],
  },
  reducers: {
    getOwnerListRequest(state, action) {
      return {
        ...state,
        ownerListLoading: true,
      };
    },
    getOwnerListSuccess(state, action) {
      return {
        ownerListLoading: false,
        owner_detail: action.payload.getOwnerList,
        // page_count: action.payload.count,
        // resPerPage: action.payload.resPerPage,
      };
    },
    getOwnerListFail(state, action) {
      return {
        ...state,
        ownerListLoading: false,
        error: action.payload,
      };
    },

    getIndividualOwnerListRequest(state, action) {
      return {
        ...state,
        ownerListLoading: true,
      };
    },
    getIndividualOwnerListSuccess(state, action) {
      return {
        ownerListLoading: false,
        owner_detail: action.payload.getIndividualOwnerList,
      };
    },
    getIndividualOwnerListFail(state, action) {
      return {
        ...state,
        ownerListLoading: false,
        error: action.payload,
      };
    },
    createOwnerListRequest(state, action) {
      return {
        ...state,
        ownerListLoading: true,
      };
    },
    createOwnerListSuccess(state, action) {
      return {
        ...state,
        ownerListLoading: false,
        owner_detail: action.payload.createOwnerList,
        isOwnerListCreated: true,
      };
    },
    createOwnerListFail(state, action) {
      return {
        ...state,
        ownerListLoading: false,
        error: action.payload,
        isOwnerListCreated: false,
      };
    },
    clearOwnerListCreated(state, action) {
      return {
        ...state,
        isOwnerListCreated: false,
      };
    },

    clearOwnerListError(state, action) {
      return { ...state, error: null };
    },
    updateOwnerListRequest(state, action) {
      return {
        ...state,
        ownerListLoading: true,
      };
    },
    updateOwnerListSuccess(state, action) {
      return {
        ownerListLoading: false,
        owner_detail: action.payload.updateOwnerList,
        isOwnerListUpdated: true,
      };
    },
    updateOwnerListFail(state, action) {
      return {
        ...state,
        ownerListLoading: false,
        error: action.payload,
      };
    },
    clearOwnerListUpdated(state, action) {
      return {
        ...state,
        isOwnerListUpdated: false,
      };
    },
    deleteOwnerListRequest(state, action) {
      return {
        ...state,
        ownerListLoading: true,
      };
    },
    deleteOwnerListSuccess(state, action) {
      return {
        ...state,
        ownerListLoading: false,
        isOwnerListDeleted: true,
      };
    },
    deleteOwnerListFail(state, action) {
      return {
        ...state,
        ownerListLoading: false,
        error: action.payload,
      };
    },
    clearOwnerListDeleted(state, action) {
      return {
        ...state,
        isOwnerListDeleted: false,
      };
    },
  },
});

const { actions, reducer } = OwnerListSlice;

export const {
  getOwnerListRequest,
  getOwnerListSuccess,
  getOwnerListFail,
  getIndividualOwnerListRequest,
  getIndividualOwnerListSuccess,
  getIndividualOwnerListFail,
  createOwnerListRequest,
  createOwnerListSuccess,
  createOwnerListFail,
  clearOwnerListCreated,
  clearOwnerListError,
  updateOwnerListRequest,
  updateOwnerListSuccess,
  updateOwnerListFail,
  clearOwnerListUpdated,
  deleteOwnerListRequest,
  deleteOwnerListSuccess,
  deleteOwnerListFail,
  clearOwnerListDeleted,
} = actions;

export default reducer;
