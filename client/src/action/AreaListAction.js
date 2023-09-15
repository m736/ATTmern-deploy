import axios from "axios";
import {
  createAreaListFail,
  createAreaListRequest,
  createAreaListSuccess,
  deleteAreaListFail,
  deleteAreaListRequest,
  deleteAreaListSuccess,
  getAreaListFail,
  getAreaListRequest,
  getAreaListSuccess,
  updateAreaListFail,
  updateAreaListRequest,
  updateAreaListSuccess,
} from "../slices/AreaListSlice";
export const createAreaListAction = (formData) => async (dispatch) => {
  try {
    dispatch(createAreaListRequest());
    const { data } = await axios.post(
      `https://creo-8w4j.onrender.com/api/v1/area_list_api`,
      formData
    );
    console.log(data);

    dispatch(createAreaListSuccess(data));
  } catch (error) {
    dispatch(createAreaListFail(error));
  }
};
export const getAreaListAction = async (dispatch) => {
  try {
    dispatch(getAreaListRequest());

    const { data } = await axios.get(
      "https://creo-8w4j.onrender.com/api/v1/area_list_api"
    );

    dispatch(getAreaListSuccess(data));
  } catch (error) {
    //handle error
    dispatch(getAreaListFail(error.response.data.message));
  }
};

export const editAreaAction = (id, updatedAreaData) => async (dispatch) => {
  try {
    console.log(updatedAreaData);
    dispatch(updateAreaListRequest());
    const { data } = await axios.put(
      `https://creo-8w4j.onrender.com/api/v1/area_list_api/${id}`,
      updatedAreaData
    );
    console.log(data);
    dispatch(updateAreaListSuccess(data));
  } catch (error) {
    //handle error
    dispatch(updateAreaListFail(error.response.data.message));
  }
};
export const deleteAreaListAction = (id) => async (dispatch) => {
  try {
    dispatch(deleteAreaListRequest());
    await axios.delete(
      `https://creo-8w4j.onrender.com/api/v1/area_list_api/${id}`
    );
    dispatch(deleteAreaListSuccess());
  } catch (error) {
    //handle error
    dispatch(deleteAreaListFail(error.response.data.message));
  }
};
