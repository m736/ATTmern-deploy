import axios from "axios";
import {
  deleteSiteMisUploadFail,
  deleteSiteMisUploadRequest,
  deleteSiteMisUploadSuccess,
  siteDayBaseMisUploadFail,
  siteDayBaseMisUploadRequest,
  siteDayBaseMisUploadSuccess,
  siteOnCallBaseMisUploadFail,
  siteOnCallBaseMisUploadRequest,
  siteOnCallBaseMisUploadSuccess,
  siteSlabBaseMisUploadFail,
  siteSlabBaseMisUploadRequest,
  siteSlabBaseMisUploadSuccess,
  siteTripBaseMisUploadFail,
  siteTripBaseMisUploadRequest,
  siteTripBaseMisUploadSuccess,
} from "../slices/SiteSlabBaseSlice";

export const getSiteSlabBaseMisAction = async (dispatch) => {
  try {
    dispatch(siteSlabBaseMisUploadRequest());
    const { data } = await axios.get("/api/v1/get_site_slabbase_mis_data_api");
    console.log(data);
    dispatch(siteSlabBaseMisUploadSuccess(data));
  } catch (error) {
    //handle error
    dispatch(siteSlabBaseMisUploadFail(error.response.data.message));
  }
};

export const getSiteOnCallBaseMisAction = async (dispatch) => {
  try {
    dispatch(siteOnCallBaseMisUploadRequest());
    const { data } = await axios.get(
      "/api/v1/get_site_oncallbase_mis_data_api"
    );

    dispatch(siteOnCallBaseMisUploadSuccess(data));
  } catch (error) {
    //handle error
    dispatch(siteOnCallBaseMisUploadFail(error.response.data.message));
  }
};

export const getSiteTripBaseMisAction = async (dispatch) => {
  try {
    dispatch(siteTripBaseMisUploadRequest());
    const { data } = await axios.get("/api/v1/get_site_tripbase_mis_data_api");

    dispatch(siteTripBaseMisUploadSuccess(data));
  } catch (error) {
    //handle error
    dispatch(siteTripBaseMisUploadFail(error.response.data.message));
  }
};

export const getSiteDayBaseMisAction = async (dispatch) => {
  try {
    dispatch(siteDayBaseMisUploadRequest());
    const { data } = await axios.get("/api/v1/get_site_daybase_mis_data_api");

    dispatch(siteDayBaseMisUploadSuccess(data));
  } catch (error) {
    //handle error
    dispatch(siteDayBaseMisUploadFail(error.response.data.message));
  }
};
export const deleteSiteMisAction = (formData) => async (dispatch) => {
  try {
    dispatch(deleteSiteMisUploadRequest());
    await axios.delete(`/api/v1/site_mis/delete_site_mis`, { data: formData });

    dispatch(deleteSiteMisUploadSuccess());
  } catch (error) {
    //handle error
    dispatch(deleteSiteMisUploadFail(error.response.data.message));
  }
};
