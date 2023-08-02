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
      `http://localhost:4000/api/v1/tripsheet_entry/create_new_tripsheet_entry`,

      formData
    );
    console.log(data);
    dispatch(createTripSheetSuccess(data));
  } catch (error) {
    console.log(error);
    dispatch(createTripSheetFail(error));
  }
};
export const getTripSheetAction = async (dispatch) => {
  try {
    dispatch(getTripSheetListRequest());
    const { data } = await axios.get(
      "http://localhost:4000/api/v1/tripsheet_entry/get_tripsheet_list"
    );

    console.log(data);
    dispatch(getTripSheetListSuccess(data));
  } catch (error) {
    //handle error
    dispatch(getTripSheetListFail(error.response.data.message));
  }
};
