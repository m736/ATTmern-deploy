import axios from "axios";
import {
  createTarrifFail,
  createTarrifRequest,
  createTarrifSuccess,
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
