import axios from "axios";
import {
  slabBaseMisUploadFail,
  slabBaseMisUploadRequest,
  slabBaseMisUploadSuccess,
} from "../slices/SlabBaseMisSlice";

export const getSlabBaseMisData = async (dispatch) => {
  try {
    dispatch(slabBaseMisUploadRequest());
    const { data } = await axios.get(
      "http://localhost:4000/api/v1/slabbase_mis_data"
    );

    dispatch(slabBaseMisUploadSuccess(data));
  } catch (error) {
    //handle error
    dispatch(slabBaseMisUploadFail(error.response.data.message));
  }
};
