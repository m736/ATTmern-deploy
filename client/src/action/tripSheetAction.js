import axios from "axios";
import {
  createTripSheetFail,
  createTripSheetRequest,
  createTripSheetSuccess,
  getTripSheetListFail,
  getTripSheetListRequest,
  getTripSheetListSuccess,
} from "../slices/TripSheetSlice";

export const createTripSheetAction = (formData) => async (dispatch) => {
  try {
    dispatch(createTripSheetRequest());
    const { data } = await axios.post(
      `/api/v1/tripsheet_entry/create_new_tripsheet_entry`,

      formData
    );

    dispatch(createTripSheetSuccess(data));
  } catch (error) {
    dispatch(createTripSheetFail(error));
  }
};
export const getTripSheetAction = async (dispatch) => {
  try {
    dispatch(getTripSheetListRequest());
    const { data } = await axios.get(
      "/api/v1/tripsheet_entry/get_tripsheet_list"
    );

    dispatch(getTripSheetListSuccess(data));
  } catch (error) {
    //handle error
    dispatch(getTripSheetListFail(error.response.data.message));
  }
};
