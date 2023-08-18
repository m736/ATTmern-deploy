import { combineReducers, configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import VechicleDetailSliceReducer from "./slices/VechicleDetailSlice";
import VehicleInductionSliceReducer from "./slices/VehicleInductionSlice";
import TarrifSliceReducer from "./slices/TarrifSlice";
import TripSheetSliceReducer from "./slices/TripSheetSlice";
import OnCallMisSliceReducer from "./slices/OnCallMisSlice";
import SlabBaseMisSliceReducer from "./slices/SlabBaseMisSlice";
import TripBaseMisSliceReducer from "./slices/TripBaseMisSlice";
import DayBaseMisSliceReducer from "./slices/DayBaseMisSlice";

const reducer = combineReducers({
  VechicleDetailState: VechicleDetailSliceReducer,
  VechicleInductionState: VehicleInductionSliceReducer,
  TarrifState: TarrifSliceReducer,
  TripSheetState: TripSheetSliceReducer,
  OnCallMisState: OnCallMisSliceReducer,
  SlabBaseMisState: SlabBaseMisSliceReducer,
  TripBaseMisState: TripBaseMisSliceReducer,
  DayBaseMisState: DayBaseMisSliceReducer,
});

const store = configureStore({
  reducer,
  middleware: [thunk],
});

export default store;
