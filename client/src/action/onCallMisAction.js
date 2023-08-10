import axios from "axios";
import {
  onCallMisCalculationFail,
  onCallMisCalculationRequest,
  onCallMisCalculationSuccess,
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
    const { data } = await axios.get(
      "http://localhost:4000/api/v1/oncall_mis_data"
    );

    dispatch(onCallMisUploadSuccess(data));
  } catch (error) {
    //handle error
    dispatch(onCallMisUploadFail(error.response.data.message));
  }
};
export const searchOnOnCallMisAction = (formData) => async (dispatch) => {
  try {
    console.log(formData);
    dispatch(searchOnCallMisDataRequest());
    const { data } = await axios.post(
      "http://localhost:4000/oncall_bulk/download_oncall_misdata",
      formData
    );

    dispatch(searchOnCallMisDataSuccess(data));
  } catch (error) {
    //handle error
    dispatch(searchOnCallMisDataFail(error.response.data.message));
  }
};
