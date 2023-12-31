import axios from "axios";
import {
  createVehicleTypeFail,
  createVehicleTypeRequest,
  createVehicleTypeSuccess,
  deleteVehicleTypeFail,
  deleteVehicleTypeRequest,
  deleteVehicleTypeSuccess,
  getVehicleTypeFail,
  getVehicleTypeRequest,
  getVehicleTypeSuccess,
  updateVehicleTypeFail,
  updateVehicleTypeRequest,
  updateVehicleTypeSuccess,
} from "../slices/VehicleTypeSlice";

export const createVehicleTypeAction = (formData) => async (dispatch) => {
  try {
    dispatch(createVehicleTypeRequest());
    const { data } = await axios.post(`/api/v1/vehicle_type_api`, formData);

    dispatch(createVehicleTypeSuccess(data));
  } catch (error) {
    dispatch(createVehicleTypeFail(error));
  }
};
export const getVehicleTypeAction = async (dispatch) => {
  try {
    dispatch(getVehicleTypeRequest());

    const { data } = await axios.get("/api/v1/vehicle_type_api");

    dispatch(getVehicleTypeSuccess(data));
  } catch (error) {
    //handle error
    dispatch(getVehicleTypeFail(error.response.data.message));
  }
};

export const editVehicleTypeAction =
  (id, updatedVehicleTypeData) => async (dispatch) => {
    try {
      dispatch(updateVehicleTypeRequest());
      const { data } = await axios.put(
        `/api/v1/vehicle_type_api/${id}`,
        updatedVehicleTypeData
      );
      dispatch(updateVehicleTypeSuccess(data));
      setTimeout(() => {
        dispatch(getVehicleTypeAction);
      }, 1000);
    } catch (error) {
      //handle error
      dispatch(updateVehicleTypeFail(error.response.data.message));
    }
  };
export const deleteVehicleTypeAction = (id) => async (dispatch) => {
  try {
    dispatch(deleteVehicleTypeRequest());
    await axios.delete(`/api/v1/vehicle_type_api/${id}`);
    dispatch(deleteVehicleTypeSuccess());
  } catch (error) {
    //handle error
    dispatch(deleteVehicleTypeFail(error.response.data.message));
  }
};
