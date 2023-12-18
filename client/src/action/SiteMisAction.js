import axios from "axios";
import {
  siteSlabBaseMisUploadFail,
  siteSlabBaseMisUploadRequest,
  siteSlabBaseMisUploadSuccess,
} from "../slices/SiteSlabBaseSlice";

export const getSiteSlabBaseMisAction = async (dispatch) => {
  try {
    dispatch(siteSlabBaseMisUploadRequest());
    const { data } = await axios.get("/api/v1/get_site_slabbase_mis_data_api");

    dispatch(siteSlabBaseMisUploadSuccess(data));
  } catch (error) {
    //handle error
    dispatch(siteSlabBaseMisUploadFail(error));
  }
};
