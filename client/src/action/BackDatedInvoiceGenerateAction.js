import axios from "axios";
import {
  BackDatedInvoiceGenerateRequest,
  BackDatedInvoiceGenerateSuccess,
  deleteInvoiceListFail,
  deleteInvoiceListRequest,
  deleteInvoiceListSuccess,
  invoiceListFail,
  invoiceListRequest,
  invoiceListSuccess,
} from "../slices/BackDatedInvoSlice";

export const BackDatedInvoiceInputGenerateAction =
  (formData) => async (dispatch) => {
    try {
      dispatch(BackDatedInvoiceGenerateRequest());
      const { data } = await axios.post(`/invoice/backdated_invoice`, formData);
      dispatch(BackDatedInvoiceGenerateSuccess(data));
    } catch (error) {
      dispatch(BackDatedInvoiceGenerateRequest(error));
    }
  };
export const getInvoiceListAction = async (dispatch) => {
  try {
    dispatch(invoiceListRequest());

    const { data } = await axios.get("/api/v1/invoice_list_api");

    dispatch(invoiceListSuccess(data));
  } catch (error) {
    //handle error
    dispatch(invoiceListFail(error.response.data.message));
  }
};
export const deleteInvoiceListAction = (id) => async (dispatch) => {
  try {
    dispatch(deleteInvoiceListRequest());
    await axios.delete(`/invoice/delete_invoice/${id}`);
    dispatch(deleteInvoiceListSuccess());
  } catch (error) {
    //handle error
    dispatch(deleteInvoiceListFail(error.response.data.message));
  }
};
