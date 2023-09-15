import axios from "axios";
import {
  dayBaseMisUploadFail,
  dayBaseMisUploadRequest,
  dayBaseMisUploadSuccess,
} from "../slices/DayBaseMisSlice";

export const getDayBaseMisData = async (dispatch) => {
  try {
    dispatch(dayBaseMisUploadRequest());
    const { data } = await axios.get("/api/v1/daybase_mis_data");

    dispatch(dayBaseMisUploadSuccess(data));
  } catch (error) {
    //handle error
    dispatch(dayBaseMisUploadFail(error.response.data.message));
  }
};
