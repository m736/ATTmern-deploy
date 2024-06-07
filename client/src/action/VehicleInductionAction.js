import axios from "axios";

import {
  addVehicleFail,
  addVehicleRequest,
  addVehicleSuccess,
  getIndividualVehicleListRequest,
  getIndividualVehicleListSuccess,
  geIndividualVehicleListFail,
  getVehicleListFail,
  getVehicleListRequest,
  getVehicleListSuccess,
  updateVehicleListFail,
  updateVehicleListRequest,
  updateVehicleListSuccess,
} from "../slices/VehicleInductionSlice";

export const getVechicleAction = async (dispatch) => {
  try {
    dispatch(getVehicleListRequest());
    const { data } = await axios.get("/api/v1/induction/get_vehicle_list_api");
    dispatch(getVehicleListSuccess(data));
  } catch (error) {
    //handle error
    dispatch(getVehicleListFail(error.response.data.message));
  }
};
export const getIndividualVechicleAction = (id) => async (dispatch) => {
  try {
    dispatch(getIndividualVehicleListRequest());
    const { data } = await axios.get(
      `/api/v1/induction/get_individual_vehicle_list_api/${id}`
    );

    dispatch(getIndividualVehicleListSuccess(data));
  } catch (error) {
    //handle error
    dispatch(geIndividualVehicleListFail(error.response.data.message));
  }
};
export const createVehicleAction = (formData) => async (dispatch) => {
  try {
    dispatch(addVehicleRequest());
    const { data } = await axios.post(
      `/api/v1/induction/create_vehicle_list_api`,
      formData,
      {
        headers: {
          "Content-type": "multipart/form-data",
        },
      }
    );
    setTimeout(() => {
      dispatch(getVechicleAction);
    }, [1000]);

    dispatch(addVehicleSuccess(data));
  } catch (error) {
    dispatch(addVehicleFail(error.response.data.message));
  }
};

export const updateVehicleAction =
  (id, vehicleListData) => async (dispatch) => {
    console.log(vehicleListData);
    try {
      dispatch(updateVehicleListRequest());
      const { data } = await axios.put(
        `/api/v1/induction/edit_vehicle__driver_list_api/${id}`,
        vehicleListData,
        {
          headers: {
            "Content-type": "multipart/form-data",
          },
        }
      );
      setTimeout(() => {
        dispatch(getVechicleAction);
      }, [1000]);
      console.log(data);
      dispatch(updateVehicleListSuccess(data));
    } catch (error) {
      //handle error
      dispatch(updateVehicleListFail(error.response.data.message));
    }
  };
