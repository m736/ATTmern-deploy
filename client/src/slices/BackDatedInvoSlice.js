import { createSlice } from "@reduxjs/toolkit";

const TarrifSlice = createSlice({
  name: "BackDatedInvoice",
  initialState: {
    invoiceLoading: false,
    isBackDatedInvoiceCreated: false,
    isInvoiceDeleted: false,
    BackDatedInvoiceInput: [],
    invoice_list: [],
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
        invoice_list: action.payload,
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
        BackDatedInvoiceInput: action.payload.createTarrif,
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
} = actions;

export default reducer;
