import { combineReducers, configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import VechicleDetailSliceReducer from "./slices/VechicleDetailSlice";
import VehicleInductionSliceReducer from "./slices/VehicleInductionSlice";
import TarrifSliceReducer from "./slices/TarrifSlice";
import TripSheetSliceReducer from "./slices/TripSheetSlice";

const reducer = combineReducers({
  VechicleDetailState: VechicleDetailSliceReducer,
  VechicleInductionState: VehicleInductionSliceReducer,
  TarrifState: TarrifSliceReducer,
  TripSheetState: TripSheetSliceReducer,
});

const store = configureStore({
  reducer,
  middleware: [thunk],
});

export default store;
