import axios from "axios";
import {
  createClientMasterFail,
  createClientMasterRequest,
  createClientMasterSuccess,
} from "../slices/ClientMasterSlice";

export const createClientMasterAction = (formData) => async (dispatch) => {
  try {
    console.log(formData);
    dispatch(createClientMasterRequest());
    const { data } = await axios.post(
      `http://localhost:4000/api/v1/client_master_api`,
      formData
    );
    console.log(data);
    dispatch(createClientMasterSuccess(data));
  } catch (error) {
    dispatch(createClientMasterFail(error));
  }
};
// export const getTarrif = async (dispatch) => {
//   try {
//     dispatch(getTarrifListRequest());
//     const { data } = await axios.get(
//       "http://localhost:4000/api/v1/list_tarrif"
//     );

//     dispatch(getTarrifListSuccess(data));
//   } catch (error) {
//     //handle error
//     dispatch(getTarrifListFail(error.response.data.message));
//   }
// };
// export const updateSingleTarrif =
//   (id, updatedTarrifListData) => async (dispatch) => {
//     try {
//       dispatch(updateTarrifListRequest());
//       const { data } = await axios.put(
//         `http://localhost:4000/api/v1/update_tarrif/${id}`,
//         updatedTarrifListData
//       );

//       dispatch(updateTarrifListSuccess(data));
//     } catch (error) {
//       //handle error
//       dispatch(updateTarrifListFail(error.response.data.message));
//     }
//   };
// export const deleteTarrif = (id) => async (dispatch) => {
//   try {
//     dispatch(deleteTarrifRequest());
//     await axios.delete(`http://localhost:4000/api/v1/delete_tarrif/${id}`);
//     dispatch(deleteTarrifSuccess());
//   } catch (error) {
//     //handle error
//     dispatch(deleteTarrifFail(error.response.data.message));
//   }
// };
