import axios from "axios";

import {
  createOwnerListFail,
  createOwnerListRequest,
  createOwnerListSuccess,
  deleteOwnerListFail,
  deleteOwnerListRequest,
  deleteOwnerListSuccess,
  getOwnerListFail,
  getOwnerListRequest,
  getOwnerListSuccess,
  updateOwnerListFail,
  updateOwnerListRequest,
  updateOwnerListSuccess,
} from "../slices/OwnerSlice";

export const createOwnerAction = (formData) => async (dispatch) => {
  try {
    dispatch(createOwnerListRequest());
    const { data } = await axios.post(
      `/api/v1/owners/owner_list_api`,
      formData
    );

    dispatch(createOwnerListSuccess(data));
  } catch (error) {
    dispatch(createOwnerListFail(error.response.data.message));
  }
};
export const getOwnerListAction = async (dispatch) => {
  try {
    dispatch(getOwnerListRequest());

    const { data } = await axios.get("/api/v1/owners/owner_list_api");

    dispatch(getOwnerListSuccess(data));
  } catch (error) {
    dispatch(getOwnerListFail(error.response.data.message));
  }
};

export const editOwnerListAction =
  (id, updatedOwnerListData) => async (dispatch) => {
    console.log(updatedOwnerListData);
    try {
      dispatch(updateOwnerListRequest());
      const { data } = await axios.put(
        `/api/v1/owners/owner_list_api/${id}`,
        updatedOwnerListData
      );
      setTimeout(() => {
        dispatch(getOwnerListAction);
      }, [1000]);

      dispatch(updateOwnerListSuccess(data));
    } catch (error) {
      //handle error
      dispatch(updateOwnerListFail(error.response.data.message));
    }
  };
export const deleteOwnerListAction = (id) => async (dispatch) => {
  try {
    dispatch(deleteOwnerListRequest());
    await axios.delete(`/api/v1/owners/owner_list_api/${id}`);
    setTimeout(() => {
      dispatch(getOwnerListAction);
    }, [1000]);
    dispatch(deleteOwnerListSuccess());
  } catch (error) {
    //handle error
    dispatch(deleteOwnerListFail(error.response.data.message));
  }
};
