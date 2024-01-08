import { combineReducers, configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import VechicleDetailSliceReducer from "./slices/VechicleDetailSlice";
import VehicleInductionSliceReducer from "./slices/VehicleInductionSlice";
import TarrifSliceReducer from "./slices/TarrifSlice";
import ClientMasterReducer from "./slices/ClientMasterSlice";
import TripSheetSliceReducer from "./slices/TripSheetSlice";
import OnCallMisSliceReducer from "./slices/OnCallMisSlice";
import SlabBaseMisSliceReducer from "./slices/SlabBaseMisSlice";
import SiteSlabBaseSliceReducer from "./slices/SiteSlabBaseSlice";
import TripBaseMisSliceReducer from "./slices/TripBaseMisSlice";
import DayBaseMisSliceReducer from "./slices/DayBaseMisSlice";
import AreaListReducer from "./slices/AreaListSlice";
import VehicleTypeReducer from "./slices/VehicleTypeSlice";
import BackDatedInvoSliceReducer from "./slices/BackDatedInvoSlice";
import authReducer from "./slices/authSlice";
const reducer = combineReducers({
  authState: authReducer,
  VechicleDetailState: VechicleDetailSliceReducer,
  VechicleInductionState: VehicleInductionSliceReducer,
  TarrifState: TarrifSliceReducer,
  ClientMasterState: ClientMasterReducer,
  AreaListState: AreaListReducer,
  VehicleTypeState: VehicleTypeReducer,
  TripSheetState: TripSheetSliceReducer,
  OnCallMisState: OnCallMisSliceReducer,
  SlabBaseMisState: SlabBaseMisSliceReducer,
  SiteSlabBaseState: SiteSlabBaseSliceReducer,
  TripBaseMisState: TripBaseMisSliceReducer,
  DayBaseMisState: DayBaseMisSliceReducer,
  BackDateInvoiceGenerateState: BackDatedInvoSliceReducer,
});

const store = configureStore({
  reducer,
  middleware: [thunk],
});

export default store;
