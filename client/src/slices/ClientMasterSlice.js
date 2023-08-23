import { createSlice } from "@reduxjs/toolkit";

const ClientMasterSlice = createSlice({
  name: "Client_Master",
  initialState: {
    clientMasterLoading: false,
    isClientMasterCreated: false,
    isClientMasterUpdated: false,
    isClientMasterDeleted: false,
    client_master_detail: [],
  },
  reducers: {
    getClientMasterRequest(state, action) {
      return {
        ...state,
        clientMasterLoading: true,
      };
    },
    getClientMasterSuccess(state, action) {
      return {
        clientMasterLoading: false,
        client_master_detail: action.payload,
      };
    },
    getClientMasterFail(state, action) {
      return {
        ...state,
        clientMasterLoading: false,
        error: action.payload,
      };
    },
    createClientMasterRequest(state, action) {
      return {
        ...state,
        clientMasterLoading: true,
      };
    },
    createClientMasterSuccess(state, action) {
      return {
        ...state,
        clientMasterLoading: false,
        client_master_detail: action.payload.createTarrif,
        isClientMasterCreated: true,
      };
    },
    createClientMasterFail(state, action) {
      return {
        ...state,
        clientMasterLoading: false,
        error: action.payload,
        isClientMasterCreated: false,
      };
    },
    clearClientMasterCreated(state, action) {
      return {
        ...state,
        isClientMasterCreated: false,
      };
    },

    clearClientMasterError(state, action) {
      return { ...state, error: null };
    },
    updateClientMasterRequest(state, action) {
      return {
        ...state,
        clientMasterLoading: true,
      };
    },
    updateClientMasterSuccess(state, action) {
      return {
        clientMasterLoading: false,
        client_master_detail: action.payload.createTarrif,
        isClientMasterUpdated: true,
      };
    },
    updateClientMasterFail(state, action) {
      return {
        ...state,
        clientMasterLoading: false,
        error: action.payload,
      };
    },
    clearClientMasterUpdated(state, action) {
      return {
        ...state,
        isClientMasterUpdated: false,
      };
    },
    deleteClientMasterRequest(state, action) {
      return {
        ...state,
        clientMasterLoading: true,
      };
    },
    deleteClientMasterSuccess(state, action) {
      return {
        ...state,
        clientMasterLoading: false,
        isClientMasterDeleted: true,
      };
    },
    deleteClientMasterFail(state, action) {
      return {
        ...state,
        clientMasterLoading: false,
        error: action.payload,
      };
    },
    clearClientMasterDeleted(state, action) {
      return {
        ...state,
        isClientMasterDeleted: false,
      };
    },
  },
});

const { actions, reducer } = ClientMasterSlice;

export const {
  getClientMasterRequest,
  getClientMasterSuccess,
  getClientMasterFail,
  createClientMasterRequest,
  createClientMasterSuccess,
  createClientMasterFail,
  updateClientMasterRequest,
  updateClientMasterSuccess,
  updateClientMasterFail,
  deleteClientMasterRequest,
  deleteClientMasterSuccess,
  deleteClientMasterFail,
  clearClientMasterCreated,
  clearClientMasterUpdated,
  clearClientMasterDeleted,
  clearClientMasterError,
} = actions;

export default reducer;
