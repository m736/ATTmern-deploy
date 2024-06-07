import { createSlice } from "@reduxjs/toolkit";

const PurchaseMemoSlice = createSlice({
  name: "Purchasememo",
  initialState: {
    proMemoLoading: false,
    isProMemoCreated: false,
    isProMemoDeleted: false,
    pro_memo_detail: [],
  },
  reducers: {
    getProMemoListRequest(state, action) {
      return {
        ...state,
        proMemoLoading: true,
      };
    },
    getProMemoListSuccess(state, action) {
      return {
        proMemoLoading: false,
        pro_memo_detail: action.payload.getPurchaseMemoList,
        // page_count: action.payload.count,
        // resPerPage: action.payload.resPerPage,
      };
    },
    getProMemoListFail(state, action) {
      return {
        ...state,
        proMemoLoading: false,
        error: action.payload,
      };
    },

    getIndividualProMemoRequest(state, action) {
      return {
        ...state,
        proMemoLoading: true,
      };
    },
    getIndividualProMemoSuccess(state, action) {
      return {
        proMemoLoading: false,
        pro_memo_detail: action.payload.getIndividualOwnerList,
      };
    },
    getIndividualProMemoFail(state, action) {
      return {
        ...state,
        proMemoLoading: false,
        error: action.payload,
      };
    },
    createProMemoListRequest(state, action) {
      return {
        ...state,
        proMemoLoading: true,
      };
    },
    createProMemoListSuccess(state, action) {
      return {
        ...state,
        proMemoLoading: false,
        pro_memo_detail: action.payload.createOwnerList,
        isProMemoCreated: true,
      };
    },
    createProMemoListFail(state, action) {
      return {
        ...state,
        proMemoLoading: false,
        error: action.payload,
        isProMemoCreated: false,
      };
    },
    clearProMemoListCreated(state, action) {
      return {
        ...state,
        isProMemoCreated: false,
      };
    },

    clearProMemoListError(state, action) {
      return { ...state, error: null };
    },

    deleteProMemoListRequest(state, action) {
      return {
        ...state,
        proMemoLoading: true,
      };
    },
    deleteProMemoListSuccess(state, action) {
      return {
        ...state,
        proMemoLoading: false,
        isProMemoDeleted: true,
      };
    },
    deleteProMemoListFail(state, action) {
      return {
        ...state,
        proMemoLoading: false,
        error: action.payload,
      };
    },
    clearProMemoListDeleted(state, action) {
      return {
        ...state,
        isProMemoDeleted: false,
      };
    },
  },
});

const { actions, reducer } = PurchaseMemoSlice;

export const {
  getProMemoListRequest,
  getProMemoListSuccess,
  getProMemoListFail,
  getIndividualProMemoRequest,
  getIndividualProMemoSuccess,
  getIndividualProMemoFail,
  createProMemoListRequest,
  createProMemoListSuccess,
  createProMemoListFail,
  clearProMemoListCreated,
  clearProMemoListError,
  clearProMemoListDeleted,
  deleteProMemoListRequest,
  deleteProMemoListSuccess,
  deleteProMemoListFail,
} = actions;

export default reducer;
