import { createSlice } from "@reduxjs/toolkit";

const ClientMasterSlice = createSlice({
  name: "Area_List",
  initialState: {
    areaListLoading: false,
    isAreaCreated: false,
    isAreaUpdated: false,
    isAreaDeleted: false,
    area_list: [],
  },
  reducers: {
    getAreaListRequest(state, action) {
      return {
        ...state,
        areaListLoading: true,
      };
    },
    getAreaListSuccess(state, action) {
      return {
        areaListLoading: false,
        area_list: action.payload.map((item) => {
          return {
            ...item,
            value: item.Area,
            text: item.Area,
          };
        }),
        // page_count: action.payload.count,
        // resPerPage: action.payload.resPerPage,
      };
    },
    getAreaListFail(state, action) {
      return {
        ...state,
        areaListLoading: false,
        error: action.payload,
      };
    },

    createAreaListRequest(state, action) {
      return {
        ...state,
        areaListLoading: true,
      };
    },
    createAreaListSuccess(state, action) {
      return {
        ...state,
        areaListLoading: false,
        area_list: action.payload,
        isAreaCreated: true,
      };
    },
    createAreaListFail(state, action) {
      return {
        ...state,
        areaListLoading: false,
        error: action.payload,
      };
    },
    clearAreaListCreated(state, action) {
      return {
        ...state,
        isAreaCreated: false,
      };
    },

    clearAreaListError(state, action) {
      return { ...state, error: null };
    },
    updateAreaListRequest(state, action) {
      return {
        ...state,
        areaListLoading: true,
      };
    },
    updateAreaListSuccess(state, action) {
      console.log(action.payload);
      return {
        areaListLoading: false,
        area_list: action.payload,
        isAreaUpdated: true,
      };
    },
    updateAreaListFail(state, action) {
      return {
        ...state,
        areaListLoading: false,
        error: action.payload,
      };
    },
    clearAreaListUpdated(state, action) {
      return {
        ...state,
        isAreaUpdated: false,
      };
    },
    deleteAreaListRequest(state, action) {
      return {
        ...state,
        areaListLoading: true,
      };
    },
    deleteAreaListSuccess(state, action) {
      return {
        ...state,
        areaListLoading: false,
        isAreaDeleted: true,
      };
    },
    deleteAreaListFail(state, action) {
      return {
        ...state,
        areaListLoading: false,
        error: action.payload,
      };
    },
    clearAreaListDeleted(state, action) {
      return {
        ...state,
        isAreaDeleted: false,
      };
    },
  },
});

const { actions, reducer } = ClientMasterSlice;

export const {
  getAreaListRequest,
  getAreaListSuccess,
  getAreaListFail,
  createAreaListRequest,
  createAreaListSuccess,
  createAreaListFail,
  clearAreaListError,
  clearAreaListCreated,
  updateAreaListRequest,
  updateAreaListSuccess,
  updateAreaListFail,
  clearAreaListUpdated,
  deleteAreaListRequest,
  deleteAreaListSuccess,
  deleteAreaListFail,
  clearAreaListDeleted,
} = actions;

export default reducer;
