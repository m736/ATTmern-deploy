import { createSlice } from "@reduxjs/toolkit";

const TarrifSlice = createSlice({
  name: "BackDatedInvoice",
  initialState: {
    invoiceLoading: false,
    isBackDatedInvoiceCreated: false,
    isInvoiceDeleted: false,
    isExcelDataDeleted: false,
    isMergeInvoiceCreated: false,
    invoice_list: [],
    invoice_no: [],
    isInvoiceNoUpdated: false,
  },
  reducers: {
    invoiceListRequest(state, action) {
      return {
        ...state,
        invoiceLoading: true,
      };
    },
    invoiceListSuccess(state, action) {
      return {
        ...state,
        invoiceLoading: false,
        invoice_list: action.payload.getInvoiceList,
      };
    },
    invoiceListFail(state, action) {
      return {
        invoiceLoading: false,
        error: action.payload,
      };
    },
    BackDatedInvoiceGenerateRequest(state, action) {
      return {
        ...state,
        invoiceLoading: true,
      };
    },
    BackDatedInvoiceGenerateSuccess(state, action) {
      return {
        ...state,
        invoiceLoading: false,
        invoice_list: action.payload,
        isBackDatedInvoiceCreated: true,
      };
    },
    BackDatedInvoiceGenerateFail(state, action) {
      return {
        ...state,
        invoiceLoading: false,
        error: action.payload,
        isBackDatedInvoiceCreated: false,
      };
    },
    clearBackDatedInvoiceGenerateInput(state, action) {
      return {
        ...state,
        isBackDatedInvoiceCreated: false,
      };
    },
    MergeInvoiceGenerateRequest(state, action) {
      return {
        ...state,
        invoiceLoading: true,
      };
    },
    MergeInvoiceGenerateSuccess(state, action) {
      return {
        ...state,
        invoiceLoading: false,
        invoice_list: action.payload,
        isMergeInvoiceCreated: true,
      };
    },
    MergeInvoiceGenerateFail(state, action) {
      return {
        ...state,
        invoiceLoading: false,
        error: action.payload,
        isMergeInvoiceCreated: false,
      };
    },
    clearMergeInvoiceGenerateInput(state, action) {
      return {
        ...state,
        isBackDatedInvoiceCreated: false,
      };
    },
    deleteInvoiceListRequest(state, action) {
      return {
        ...state,
        invoiceLoading: true,
      };
    },
    deleteInvoiceListSuccess(state, action) {
      return {
        ...state,
        invoiceLoading: false,
        isInvoiceDeleted: true,
      };
    },
    deleteInvoiceListFail(state, action) {
      return {
        ...state,
        invoiceLoading: false,
        error: action.payload,
      };
    },
    clearInvoiceListDeleted(state, action) {
      return {
        ...state,
        isInvoiceDeleted: false,
      };
    },
    deleteExcelDataRequest(state, action) {
      return {
        ...state,
        invoiceLoading: true,
      };
    },
    deleteExcelDataSuccess(state, action) {
      return {
        ...state,
        invoiceLoading: false,
        isExcelDataDeleted: true,
      };
    },
    deleteExcelDataFail(state, action) {
      return {
        ...state,
        invoiceLoading: false,
        error: action.payload,
      };
    },
    clearExcelDataDeleted(state, action) {
      return {
        ...state,
        isExcelDataDeleted: false,
      };
    },
    getInvoiceNoRequest(state, action) {
      return {
        ...state,
        invoiceLoading: true,
      };
    },
    getInvoiceNoSuccess(state, action) {
      return {
        ...state,
        invoiceLoading: false,
        invoice_no: action.payload.getInvoiceNumber,
      };
    },
    getInvoiceNoFail(state, action) {
      return {
        invoiceLoading: false,
        error: action.payload,
      };
    },
    updateInvoiceNoRequest(state, action) {
      return {
        ...state,
        invoiceLoading: true,
      };
    },
    updateInvoiceNoSuccess(state, action) {
      return {
        ...state,
        invoiceLoading: false,
        invoice_no: action.payload.updateInvoiceNumber,
        isInvoiceNoUpdated: true,
      };
    },
    updateInvoiceNoFail(state, action) {
      return {
        invoiceLoading: false,
        error: action.payload,
      };
    },
    clearUpdateInvoiceNoDeleted(state, action) {
      return {
        ...state,
        isInvoiceNoUpdated: false,
      };
    },
    clearBackDatedInvoiceError(state, action) {
      return { ...state, error: null };
    },
  },
});

const { actions, reducer } = TarrifSlice;

export const {
  BackDatedInvoiceGenerateRequest,
  BackDatedInvoiceGenerateSuccess,
  BackDatedInvoiceGenerateFail,
  clearBackDatedInvoiceError,
  clearBackDatedInvoiceGenerateInput,
  invoiceListRequest,
  invoiceListSuccess,
  invoiceListFail,
  deleteInvoiceListRequest,
  deleteInvoiceListSuccess,
  deleteInvoiceListFail,
  clearInvoiceListDeleted,
  deleteExcelDataRequest,
  deleteExcelDataSuccess,
  deleteExcelDataFail,
  clearExcelDataDeleted,
  getInvoiceNoRequest,
  getInvoiceNoSuccess,
  getInvoiceNoFail,
  updateInvoiceNoRequest,
  updateInvoiceNoSuccess,
  updateInvoiceNoFail,
  clearUpdateInvoiceNoDeleted,
  MergeInvoiceGenerateRequest,
  MergeInvoiceGenerateSuccess,
  MergeInvoiceGenerateFail,
  clearMergeInvoiceGenerateInput,
} = actions;

export default reducer;
