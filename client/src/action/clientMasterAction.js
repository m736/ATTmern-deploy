import axios from "axios";
import {
  createClientMasterFail,
  createClientMasterRequest,
  createClientMasterSuccess,
  deleteClientMasterFail,
  deleteClientMasterRequest,
  deleteClientMasterSuccess,
  getClientMasterFail,
  getClientMasterRequest,
  getClientMasterSuccess,
  updateClientMasterFail,
  updateClientMasterRequest,
  updateClientMasterSuccess,
} from "../slices/ClientMasterSlice";

export const createClientMasterAction = (formData) => async (dispatch) => {
  try {
    console.log(formData);
    dispatch(createClientMasterRequest());
    const { data } = await axios.post(
      `http://localhost:4000/api/v1/client/client_master_api`,
      formData
    );

    dispatch(createClientMasterSuccess(data));
  } catch (error) {
    dispatch(createClientMasterFail(error));
  }
};
export const getClientMasterAction =
  (keyword, price, category, rating, currentPage) => async (dispatch) => {
    try {
      dispatch(getClientMasterRequest());
      let link = `http://localhost:4000/api/v1/client/client_master_api?page=${currentPage}`;

      if (keyword) {
        link += `&keyword=${keyword}`;
      }
      if (price) {
        link += `&price[gte]=${price[0]}&price[lte]=${price[1]}`;
      }
      if (category) {
        link += `&category=${category}`;
      }
      if (rating) {
        link += `&ratings=${rating}`;
      }
      // const { data } = await axios.get(
      //   "http://localhost:4000/api/v1/client/client_master_api"
      // );
      const { data } = await axios.get(link);

      dispatch(getClientMasterSuccess(data));
    } catch (error) {
      //handle error
      dispatch(getClientMasterFail(error.response.data.message));
    }
  };
// export const getIndividualClientAction = (id) => async (dispatch) => {
//   try {
//     dispatch(getIndividualClientRequest());
//     const { data } = await axios.get(
//       `http://localhost:4000/api/v1/client_master_api/${id}`
//     );

//     dispatch(getIndividualClientSuccess(data));
//   } catch (error) {
//     //handle error
//     dispatch(getIndividualClientFail(error.response.data.message));
//   }
// };

export const editClientMasterAction =
  (id, updatedClientMasterData) => async (dispatch) => {
    try {
      console.log(updatedClientMasterData);
      dispatch(updateClientMasterRequest());
      const { data } = await axios.put(
        `http://localhost:4000/api/v1/client/client_master_api/${id}`,
        updatedClientMasterData
      );
      console.log(data);
      dispatch(updateClientMasterSuccess(data));
    } catch (error) {
      //handle error
      dispatch(updateClientMasterFail(error.response.data.message));
    }
  };
export const deleteClientMasterAction = (id) => async (dispatch) => {
  try {
    dispatch(deleteClientMasterRequest());
    await axios.delete(
      `http://localhost:4000/api/v1/client/client_master_api/${id}`
    );
    dispatch(deleteClientMasterSuccess());
  } catch (error) {
    //handle error
    dispatch(deleteClientMasterFail(error.response.data.message));
  }
};
