import axios from "axios";
import {
  onCallMisUploadFail,
  onCallMisUploadRequest,
  onCallMisUploadSuccess,
  searchOnCallMisDataFail,
  searchOnCallMisDataRequest,
  searchOnCallMisDataSuccess,
} from "../slices/OnCallMisSlice";

export const getOnCallMisData = async (dispatch) => {
  try {
    dispatch(onCallMisUploadRequest());
    const { data } = await axios.get("/api/v1/oncall_mis_data");

    dispatch(onCallMisUploadSuccess(data));
  } catch (error) {
    //handle error
    dispatch(onCallMisUploadFail(error.response.data.message));
  }
};
export const searchOnOnCallMisAction = (formData) => async (dispatch) => {
  try {
    dispatch(searchOnCallMisDataRequest());
    const { data } = await axios.post(
      "/oncall_bulk/download_oncall_misdata",
      formData
    );

    dispatch(searchOnCallMisDataSuccess(data));
  } catch (error) {
    //handle error
    dispatch(searchOnCallMisDataFail(error.response.data.message));
  }
};
