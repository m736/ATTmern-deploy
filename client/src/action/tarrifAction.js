import axios from "axios";
import {
  createTarrifFail,
  createTarrifRequest,
  createTarrifSuccess,
  deleteTarrifFail,
  deleteTarrifRequest,
  deleteTarrifSuccess,
  getTarrifListFail,
  getTarrifListRequest,
  getTarrifListSuccess,
  uniqueTarrifDataFail,
  uniqueTarrifDataRequest,
  uniqueTarrifDataSuccess,
  updateTarrifListFail,
  updateTarrifListRequest,
  updateTarrifListSuccess,
} from "../slices/TarrifSlice";

export const createTarrif = (formData) => async (dispatch) => {
  try {
    dispatch(createTarrifRequest());
    const { data } = await axios.post(`/tarrif/add_tarrif`, formData);

    dispatch(createTarrifSuccess(data));
  } catch (error) {
    dispatch(createTarrifFail(error));
  }
};
export const getTarrif = (currentPage) => async (dispatch) => {
  try {
    dispatch(getTarrifListRequest());
    let link = `/tarrif/list_tarrif`;

    if (currentPage) {
      link += `?page=${currentPage}`;
    }
    const { data } = await axios.get(link);
    // const { data } = await axios.get(
    //   "/tarrif/list_tarrif"
    // );

    dispatch(getTarrifListSuccess(data));
  } catch (error) {
    //handle error
    dispatch(getTarrifListFail(error.response.data.message));
  }
};
export const uniqueTarrifDataAction = async (dispatch) => {
  try {
    dispatch(uniqueTarrifDataRequest());

    const { data } = await axios.get("/tarrif/tarrif_unique_field");
    console.log(data);
    dispatch(uniqueTarrifDataSuccess(data));
  } catch (error) {
    //handle error
    dispatch(uniqueTarrifDataFail(error.response.data.message));
  }
};
export const updateSingleTarrif =
  (id, updatedTarrifListData) => async (dispatch) => {
    try {
      dispatch(updateTarrifListRequest());
      const { data } = await axios.put(
        `/api/v1/update_tarrif/${id}`,
        updatedTarrifListData
      );

      dispatch(updateTarrifListSuccess(data));
    } catch (error) {
      //handle error
      dispatch(updateTarrifListFail(error.response.data.message));
    }
  };
export const deleteTarrif = (id) => async (dispatch) => {
  try {
    dispatch(deleteTarrifRequest());
    await axios.delete(`/api/v1/delete_tarrif/${id}`);
    dispatch(deleteTarrifSuccess());
  } catch (error) {
    //handle error
    dispatch(deleteTarrifFail(error.response.data.message));
  }
};
