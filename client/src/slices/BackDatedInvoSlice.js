import { createSlice } from "@reduxjs/toolkit";

const TarrifSlice = createSlice({
  name: "BackDatedInvoice",
  initialState: {
    invoiceLoading: false,
    isInvoiceCreated: false,
    isInvoiceDeleted: false,
    isExcelDataDeleted: false,
    isMergeInvoiceCreated: false,
    invoice_list: [],
    invoice_no: {},
    isInvoiceNoUpdated: false,
    single_invoice: {},
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
        isInvoiceCreated: true,
      };
    },
    BackDatedInvoiceGenerateFail(state, action) {
      console.log(action.payload);
      return {
        ...state,
        invoiceLoading: false,
        error: action.payload,
        isInvoiceCreated: false,
      };
    },
    clearBackDatedInvoiceGenerateInput(state, action) {
      return {
        ...state,
        isInvoiceCreated: false,
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
        isMergeInvoiceCreated: false,
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
    getSingleInvoiceRequest(state, action) {
      return {
        ...state,
        invoiceLoading: true,
      };
    },
    getSingleInvoiceSuccess(state, action) {
      return {
        ...state,
        invoiceLoading: false,
        single_invoice: action.payload.singleInvoice,
      };
    },
    getSingleInvoiceFail(state, action) {
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
    clearInvoiceError(state, action) {
      return { ...state, error: null };
    },
  },
});

const { actions, reducer } = TarrifSlice;

export const {
  BackDatedInvoiceGenerateRequest,
  BackDatedInvoiceGenerateSuccess,
  BackDatedInvoiceGenerateFail,
  clearInvoiceError,
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
  getSingleInvoiceRequest,
  getSingleInvoiceSuccess,
  getSingleInvoiceFail,
} = actions;

export default reducer;
