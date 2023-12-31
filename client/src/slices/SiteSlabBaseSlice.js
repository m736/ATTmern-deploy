import { createSlice } from "@reduxjs/toolkit";
const SiteSlabBaseSlice = createSlice({
  name: "mis_vehicle",
  initialState: {
    siteMisloading: false,
    downloadMis: false,
    site_slab_base_mis_uploadlist: [],
    download_site_slab_base_mis: [],
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
        download_site_slab_base_mis: action.payload,
      };
    },
    downloadSiteSlabBaseMisUploadFail(state, action) {
      return {
        downloadMis: false,
        error: action.payload,
      };
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
} = actions;

export default reducer;
