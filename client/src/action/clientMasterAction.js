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
  getUniqueClientNameFail,
  getUniqueClientNameRequest,
  getUniqueClientNameSuccess,
  updateClientMasterFail,
  updateClientMasterRequest,
  updateClientMasterSuccess,
} from "../slices/ClientMasterSlice";

export const createClientMasterAction = (formData) => async (dispatch) => {
  try {
    dispatch(createClientMasterRequest());
    const { data } = await axios.post(
      `/api/v1/client/client_master_api`,
      formData
    );

    dispatch(createClientMasterSuccess(data));
  } catch (error) {
    dispatch(createClientMasterFail(error));
  }
};
export const getClientMasterAction = async (dispatch) => {
  try {
    dispatch(getClientMasterRequest());
    // let link = `/api/v1/client/client_master_api`;

    // if (currentPage) {
    //   link += `?page=${currentPage}`;
    // }

    const { data } = await axios.get("/api/v1/client/client_master_api");
    // const { data } = await axios.get(link);

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
//       `/api/v1/client_master_api/${id}`
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
      dispatch(updateClientMasterRequest());
      const { data } = await axios.put(
        `/api/v1/client/client_master_api/${id}`,
        updatedClientMasterData
      );

      dispatch(updateClientMasterSuccess(data));
    } catch (error) {
      //handle error
      dispatch(updateClientMasterFail(error.response.data.message));
    }
  };
export const deleteClientMasterAction = (id) => async (dispatch) => {
  try {
    dispatch(deleteClientMasterRequest());
    await axios.delete(`/api/v1/client/client_master_api/${id}`);
    dispatch(deleteClientMasterSuccess());
  } catch (error) {
    //handle error
    dispatch(deleteClientMasterFail(error.response.data.message));
  }
};
export const DistinctClientMasterAction = async (dispatch) => {
  try {
    dispatch(getUniqueClientNameRequest());
    const { data } = await axios.get(`/api/v1/client/unique_company_name_api`);

    dispatch(getUniqueClientNameSuccess(data));
  } catch (error) {
    //handle error
    dispatch(getUniqueClientNameFail(error.response.data.message));
  }
};
