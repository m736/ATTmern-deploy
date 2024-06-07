import axios from "axios";
import {
  createProMemoListFail,
  createProMemoListRequest,
  createProMemoListSuccess,
  deleteProMemoListFail,
  deleteProMemoListRequest,
  deleteProMemoListSuccess,
  getProMemoListFail,
  getProMemoListRequest,
  getProMemoListSuccess,
} from "../slices/PurchaseMemoSlice";

export const createProMemoAction = (formData) => async (dispatch) => {
  try {
    dispatch(createProMemoListRequest());
    const { data } = await axios.post(
      `/api/v1/purchase/create_purchase_memo_api`,
      formData
    );
    console.log(data);

    dispatch(createProMemoListSuccess(data));
  } catch (error) {
    dispatch(createProMemoListFail(error.response.data.message));
  }
};
export const getProMemoListAction = async (dispatch) => {
  try {
    dispatch(getProMemoListRequest());

    const { data } = await axios.get("/api/v1/purchase/get_purchase_memo_list");

    dispatch(getProMemoListSuccess(data));
  } catch (error) {
    //handle error
    dispatch(getProMemoListFail(error.response.data.message));
  }
};
export const deleteProMemoListAction = (formData) => async (dispatch) => {
  try {
    dispatch(deleteProMemoListRequest());
    await axios.delete(`/api/v1/purchase/delete_purchase_memo_list`, {
      data: formData,
    });
    dispatch(getProMemoListAction);
    dispatch(deleteProMemoListSuccess());
  } catch (error) {
    //handle error
    dispatch(deleteProMemoListFail(error.response.data.message));
  }
};
