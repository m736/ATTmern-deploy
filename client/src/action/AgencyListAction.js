import axios from "axios";
import {
  createAgencyListFail,
  createAgencyListRequest,
  createAgencyListSuccess,
  deleteAgencyListFail,
  deleteAgencyListRequest,
  deleteAgencyListSuccess,
  getAgencyListFail,
  getAgencyListRequest,
  getAgencyListSuccess,
  updateAgencyListFail,
  updateAgencyListRequest,
  updateAgencyListSuccess,
} from "../slices/AgencySlice";

export const createAgencyAction = (formData) => async (dispatch) => {
  try {
    dispatch(createAgencyListRequest());
    const { data } = await axios.post(
      `/api/v1/agencies/agency_list_api`,
      formData
    );

    dispatch(createAgencyListSuccess(data));
  } catch (error) {
    dispatch(createAgencyListFail(error.response.data.message));
  }
};
export const getAgencyListAction = async (dispatch) => {
  try {
    dispatch(getAgencyListRequest());

    const { data } = await axios.get("/api/v1/agencies/agency_list_api");

    dispatch(getAgencyListSuccess(data));
  } catch (error) {
    dispatch(getAgencyListFail(error.response.data.message));
  }
};

export const editAgencyListAction = (id, formData) => async (dispatch) => {
  try {
    dispatch(updateAgencyListRequest());
    const { data } = await axios.put(
      `/api/v1/agencies/agency_list_api/${id}`,
      formData
    );
    setTimeout(() => {
      dispatch(getAgencyListAction);
    }, [1000]);
    dispatch(updateAgencyListSuccess(data));
  } catch (error) {
    //handle error
    dispatch(updateAgencyListFail(error.response.data.message));
  }
};
export const deleteAgencyListAction = (id) => async (dispatch) => {
  try {
    dispatch(deleteAgencyListRequest());
    await axios.delete(`/api/v1/agencies/agency_list_api/${id}`);
    setTimeout(() => {
      dispatch(getAgencyListAction);
    }, [1000]);
    dispatch(deleteAgencyListSuccess());
  } catch (error) {
    //handle error
    dispatch(deleteAgencyListFail(error.response.data.message));
  }
};
