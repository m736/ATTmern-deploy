import axios from "axios";
import {
  createDriverListFail,
  createDriverListRequest,
  createDriverListSuccess,
  deleteDriverListFail,
  deleteDriverListRequest,
  deleteDriverListSuccess,
  getDriverListFail,
  getDriverListRequest,
  getDriverListSuccess,
  updateDriverListFail,
  updateDriverListRequest,
  updateDriverListSuccess,
} from "../slices/DriverSlice";

export const createDriverAction = (formData) => async (dispatch) => {
  try {
    dispatch(createDriverListRequest());
    const { data } = await axios.post(
      `/api/v1/drivers/driver_list_api`,
      formData,
      {
        headers: {
          "Content-type": "multipart/form-data",
        },
      }
    );
    console.log(data);
    dispatch(createDriverListSuccess(data));
  } catch (error) {
    dispatch(createDriverListFail(error.response.data.message));
  }
};

export const getDriverListAction = async (dispatch) => {
  try {
    dispatch(getDriverListRequest());
    const { data } = await axios.get("/api/v1/drivers/driver_list_api");
    dispatch(getDriverListSuccess(data));
  } catch (error) {
    dispatch(getDriverListFail(error.response.data.message));
  }
};
export const updateDriverListAction =
  (id, vehicleListData) => async (dispatch) => {
    try {
      dispatch(updateDriverListRequest());
      const { data } = await axios.put(
        `/api/v1/drivers/edit_driver_list_api/${id}`,
        vehicleListData
      );
      setTimeout(() => {
        dispatch(getDriverListAction);
      }, [1000]);
      dispatch(updateDriverListSuccess(data));
    } catch (error) {
      //handle error
      dispatch(updateDriverListFail(error.response.data.message));
    }
  };

export const deleteDriverListAction = (id) => async (dispatch) => {
  try {
    dispatch(deleteDriverListRequest());
    await axios.delete(`/api/v1/drivers/delete_driver_list_api/${id}`);
    setTimeout(() => {
      dispatch(getDriverListAction);
    }, [1000]);
    dispatch(deleteDriverListSuccess());
  } catch (error) {
    //handle error
    dispatch(deleteDriverListFail(error.response.data.message));
  }
};
