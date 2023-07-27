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
  updateTarrifListFail,
  updateTarrifListRequest,
  updateTarrifListSuccess,
} from "../slices/TarrifSlice";

export const createTarrif = (formData) => async (dispatch) => {
  try {
    dispatch(createTarrifRequest());
    const { data } = await axios.post(
      `http://localhost:4000/tarrif/add_tarrif`,

      formData
    );
    console.log(data);
    dispatch(createTarrifSuccess(data));
  } catch (error) {
    console.log(error);
    dispatch(createTarrifFail(error));
  }
};
export const getTarrif = async (dispatch) => {
  try {
    dispatch(getTarrifListRequest());
    const { data } = await axios.get(
      "http://localhost:4000/api/v1/list_tarrif"
    );
    console.log("data");
    console.log(data);
    dispatch(getTarrifListSuccess(data));
  } catch (error) {
    //handle error
    dispatch(getTarrifListFail(error.response.data.message));
  }
};
export const updateSingleTarrif =
  (id, updatedTarrifListData) => async (dispatch) => {
    try {
      dispatch(updateTarrifListRequest());
      const { data } = await axios.put(
        `http://localhost:4000/tarrif/update_tarrif/${id}`,
        updatedTarrifListData
      );

      dispatch(updateTarrifListSuccess(data));
      setTimeout(() => {
        dispatch(getTarrif);
      }, 5000);
    } catch (error) {
      //handle error
      dispatch(updateTarrifListFail(error.response.data.message));
    }
  };
export const deleteTarrif = (id) => async (dispatch) => {
  try {
    dispatch(deleteTarrifRequest());
    await axios.delete(`http://localhost:4000/api/v1/delete_tarrif/${id}`);
    dispatch(deleteTarrifSuccess());
  } catch (error) {
    //handle error
    dispatch(deleteTarrifFail(error.response.data.message));
  }
};
