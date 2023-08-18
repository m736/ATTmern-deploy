import axios from "axios";
import {
  vechicleFail,
  vechicleRequest,
  vechicleSuccess,
} from "../slices/VechicleDetailSlice";
import {
  addVehicleFail,
  addVehicleRequest,
  addVehicleSuccess,
  updateVehicleListFail,
  updateVehicleListRequest,
  updateVehicleListSuccess,
} from "../slices/VehicleInductionSlice";

export const getVechicle = async (dispatch) => {
  try {
    dispatch(vechicleRequest());
    const { data } = await axios.get("http://localhost:4000/api/v1/jokes");
    dispatch(vechicleSuccess(data));
  } catch (error) {
    //handle error
    dispatch(vechicleFail(error.response.data.message));
  }
};
export const addVehicle =
  ({ formData }) =>
  async (dispatch) => {
    try {
      dispatch(addVehicleRequest());
      const { data } = await axios.post(
        `http://localhost:4000/api/v1/addvehicle`,
        formData,
        {
          headers: {
            "Content-type": "multipart/form-data",
          },
        }
      );

      dispatch(addVehicleSuccess(data));
    } catch (error) {
      dispatch(addVehicleFail(error.response.data.message));
    }
  };

export const updateVehicleList = (id, vehicleListData) => async (dispatch) => {
  try {
    dispatch(updateVehicleListRequest());
    const { data } = await axios.put(
      `http://localhost:4000/vehicle/update_vehicle/${id}`,
      vehicleListData,
      {
        headers: {
          "Content-type": "multipart/form-data",
        },
      }
    );

    dispatch(updateVehicleListSuccess(data));
  } catch (error) {
    //handle error
    dispatch(updateVehicleListFail(error.response.data.message));
  }
};
