import axios from "axios";
import {
  tripBaseMisUploadFail,
  tripBaseMisUploadRequest,
  tripBaseMisUploadSuccess,
} from "../slices/TripBaseMisSlice";

export const getTripBaseMisData = async (dispatch) => {
  try {
    dispatch(tripBaseMisUploadRequest());
    const { data } = await axios.get(
      "http://localhost:4000/api/v1/tripbase_mis_data"
    );

    dispatch(tripBaseMisUploadSuccess(data));
  } catch (error) {
    //handle error
    dispatch(tripBaseMisUploadFail(error.response.data.message));
  }
};
