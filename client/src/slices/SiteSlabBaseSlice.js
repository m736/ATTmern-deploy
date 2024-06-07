import { createSlice } from "@reduxjs/toolkit";
const SiteSlabBaseSlice = createSlice({
  name: "mis_vehicle",
  initialState: {
    siteMisloading: false,
    downloadMis: false,
    site_slab_base_mis_uploadlist: [],
    site_oncall_base_mis_uploadlist: [],
    site_trip_base_mis_uploadlist: [],
    site_day_base_mis_uploadlist: [],
    download_site_mis: [],
    delete_site_mis: false,
  },
  reducers: {
    siteSlabBaseMisUploadRequest(state, action) {
      return {
        ...state,
        siteMisloading: true,
      };
    },
    siteSlabBaseMisUploadSuccess(state, action) {
      return {
        ...state,
        site_slab_base_mis_uploadlist: action.payload,
        siteMisloading: false,
      };
    },
    siteSlabBaseMisUploadFail(state, action) {
      return {
        siteMisloading: false,
        error: action.payload,
      };
    },
    siteOnCallBaseMisUploadRequest(state, action) {
      return {
        ...state,
        siteMisloading: true,
      };
    },
    siteOnCallBaseMisUploadSuccess(state, action) {
      return {
        ...state,
        site_oncall_base_mis_uploadlist: action.payload,
        siteMisloading: false,
      };
    },
    siteOnCallBaseMisUploadFail(state, action) {
      return {
        siteMisloading: false,
        error: action.payload,
      };
    },
    siteTripBaseMisUploadRequest(state, action) {
      return {
        ...state,
        siteMisloading: true,
      };
    },
    siteTripBaseMisUploadSuccess(state, action) {
      return {
        ...state,
        site_trip_base_mis_uploadlist: action.payload,
        siteMisloading: false,
      };
    },
    siteTripBaseMisUploadFail(state, action) {
      return {
        siteMisloading: false,
        error: action.payload,
      };
    },
    siteDayBaseMisUploadRequest(state, action) {
      return {
        ...state,
        siteMisloading: true,
      };
    },
    siteDayBaseMisUploadSuccess(state, action) {
      return {
        ...state,
        site_day_base_mis_uploadlist: action.payload,
        siteMisloading: false,
      };
    },
    siteDayBaseMisUploadFail(state, action) {
      return {
        siteMisloading: false,
        error: action.payload,
      };
    },
    downloadSiteSlabBaseMisUploadRequest(state, action) {
      return {
        ...state,
        downloadMis: true,
      };
    },
    downloadSiteSlabBaseMisUploadSuccess(state, action) {
      return {
        ...state,
        downloadMis: false,
        download_site_mis: action.payload,
      };
    },
    downloadSiteSlabBaseMisUploadFail(state, action) {
      return {
        downloadMis: false,
        error: action.payload,
      };
    },
    deleteSiteMisUploadRequest(state, action) {
      return {
        ...state,
        siteMisloading: true,
      };
    },
    deleteSiteMisUploadSuccess(state, action) {
      return {
        ...state,
        siteMisloading: false,
        delete_site_mis: true,
      };
    },
    deleteSiteMisUploadFail(state, action) {
      return {
        siteMisloading: false,
        error: action.payload,
      };
    },
    clearDeleteSiteMis(state, action) {
      return {
        ...state,
        delete_site_mis: false,
      };
    },
    clearSiteMisError(state, action) {
      return { ...state, error: null };
    },
  },
});

const { actions, reducer } = SiteSlabBaseSlice;

export const {
  siteSlabBaseMisUploadRequest,
  siteSlabBaseMisUploadSuccess,
  siteSlabBaseMisUploadFail,
  downloadSiteSlabBaseMisUploadRequest,
  downloadSiteSlabBaseMisUploadSuccess,
  downloadSiteSlabBaseMisUploadFail,
  siteOnCallBaseMisUploadRequest,
  siteOnCallBaseMisUploadSuccess,
  siteOnCallBaseMisUploadFail,
  siteTripBaseMisUploadRequest,
  siteTripBaseMisUploadSuccess,
  siteTripBaseMisUploadFail,
  siteDayBaseMisUploadRequest,
  siteDayBaseMisUploadSuccess,
  siteDayBaseMisUploadFail,
  deleteSiteMisUploadRequest,
  deleteSiteMisUploadSuccess,
  deleteSiteMisUploadFail,
  clearDeleteSiteMis,
  clearSiteMisError,
} = actions;

export default reducer;
