import axios from "axios";
import {
  BackDatedInvoiceGenerateFail,
  BackDatedInvoiceGenerateRequest,
  BackDatedInvoiceGenerateSuccess,
  MergeInvoiceGenerateFail,
  MergeInvoiceGenerateRequest,
  MergeInvoiceGenerateSuccess,
  deleteExcelDataFail,
  deleteExcelDataRequest,
  deleteExcelDataSuccess,
  deleteInvoiceListFail,
  deleteInvoiceListRequest,
  deleteInvoiceListSuccess,
  getInvoiceNoFail,
  getInvoiceNoRequest,
  getInvoiceNoSuccess,
  invoiceListFail,
  invoiceListRequest,
  invoiceListSuccess,
  updateInvoiceNoFail,
  updateInvoiceNoRequest,
  updateInvoiceNoSuccess,
} from "../slices/BackDatedInvoSlice";
import { getIndividualClientSuccess } from "../slices/ClientMasterSlice";

export const BackDatedInvoiceInputGenerateAction =
  (formData) => async (dispatch) => {
    try {
      dispatch(BackDatedInvoiceGenerateRequest());
      const { data } = await axios.post(`/invoice/backdated_invoice`, formData);
      dispatch(BackDatedInvoiceGenerateSuccess(data));
    } catch (error) {
      console.log(error);
      dispatch(BackDatedInvoiceGenerateFail(error?.response?.data?.message));
    }
  };
export const MergeInvoiceInputGenerateAction =
  (formData) => async (dispatch) => {
    try {
      dispatch(MergeInvoiceGenerateRequest());
      const { data } = await axios.post(`/invoice/merge_invoice_api`, formData);
      dispatch(MergeInvoiceGenerateSuccess(data));
    } catch (error) {
      dispatch(MergeInvoiceGenerateFail(error));
    }
  };
export const getInvoiceListAction = async (dispatch) => {
  try {
    dispatch(invoiceListRequest());
    const { data } = await axios.get("/invoice/invoice_list_api");
    dispatch(invoiceListSuccess(data));
  } catch (error) {
    //handle error
    dispatch(invoiceListFail(error));
  }
};
export const deleteInvoiceListAction = (formData) => async (dispatch) => {
  try {
    dispatch(deleteInvoiceListRequest());
    await axios.delete(`/invoice/delete_invoice`, {
      data: formData,
    });
    dispatch(deleteInvoiceListSuccess());
    setTimeout(() => {
      dispatch(getInvoiceListAction);
    }, [1000]);
  } catch (error) {
    //handle error
    dispatch(deleteInvoiceListFail(error?.response?.data?.message));
  }
};
export const deleteTripsExcelDataAction = (formData) => async (dispatch) => {
  try {
    dispatch(deleteExcelDataRequest());
    await axios.delete(`/invoice/delete_trips_exceldata`, {
      data: formData,
    });
    dispatch(deleteExcelDataSuccess());
  } catch (error) {
    //handle error
    dispatch(deleteExcelDataFail(error?.response?.data?.message));
  }
};

export const getInvoiceNumberAction = async (dispatch) => {
  try {
    dispatch(getInvoiceNoRequest());
    const { data } = await axios.get("/invoice/invoice_no_api");
    dispatch(getInvoiceNoSuccess(data));
  } catch (error) {
    //handle error
    dispatch(getInvoiceNoFail(error));
  }
};
export const updateInvoiceNumberAction = (formData) => async (dispatch) => {
  try {
    dispatch(updateInvoiceNoRequest());
    const { data } = await axios.put(
      "/invoice/update_invoice_no_api",
      formData
    );
    dispatch(updateInvoiceNoSuccess(data));
    setTimeout(() => {
      dispatch(getInvoiceNumberAction);
    }, 1000);
  } catch (error) {
    //handle error
    dispatch(updateInvoiceNoFail(error));
  }
};
