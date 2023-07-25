import axios from "axios";
import {
  createTarrifFail,
  createTarrifRequest,
  createTarrifSuccess,
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
        `http://localhost:4000/vehicle/tarrif/update_tarrif/${id}`,
        updatedTarrifListData
      );
      console.log(data);
      dispatch(updateTarrifListSuccess(data));
    } catch (error) {
      //handle error
      dispatch(updateTarrifListFail(error.response.data.message));
    }
  };
