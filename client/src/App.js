import React, { useCallback, useEffect, useState } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./App.css";
import ExcelUpload from "./Component/ExcelUpload";
import NavBar from "./Component/NavBar";
import FormSelect from "./Component/FormSelect";
import { useDispatch } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import {
  vechicleFail,
  vechicleRequest,
  vechicleSuccess,
} from "./slices/VechicleDetailSlice";
import axios from "axios";
import VehicleList from "./Vehicle/VehicleList";
import AddVehicleList from "./Vehicle/AddVehicleList";
import { ToastContainer, toast } from "react-toastify";
import { CreateNewTarrif } from "./Tarrif/CreateNewTarrif";
import ReadUpdateDeleteTarrif from "./Tarrif/ReadUpdateDeleteTarrif";
import NewTripSheetEntry from "./TripSheetEntry/NewTripSheetEntry";
import SalesAndPurchaseCalculation from "./TripSheetEntry/SalesAndPurchaseCalculation";
import OnCallMISUpload from "./MIS/OnCallMISUpload";
import DownloadOnCallMisData from "./MIS/DownloadOnCallMisData";
import TarrifExcelUpload from "./Tarrif/TarrifExcelUpload";
import SlabBaseMisUpload from "./MIS/SlabBaseMisUpload";
import DownloadSlabBaseMis from "./MIS/DownloadSlabBaseMis";
import DownloadTripBaseMis from "./MIS/DownloadTripBaseMis";
import DownloadDayBaseMis from "./MIS/DownloadDayBaseMis";
import TripBaseMisUpload from "./MIS/TripBaseMisUpload";
import DayBaseMisUpload from "./MIS/DayBaseMisUpload";
import NewClientMaster from "./CompanyDetail/NewClientMaster";
import ListClientMaster from "./CompanyDetail/ListClientMaster";
import EditClientMaster from "./CompanyDetail/EditClientMaster";
import CreateAreaList from "./CompanyDetail/CreateAreaList";
import ListArea from "./CompanyDetail/ListArea";
import CreateVehicleType from "./CompanyDetail/CreateVehicleList";
import ListVehicleType from "./CompanyDetail/ListVehicleType";

function App() {
  const [rows, setRows] = useState([]);
  const dispatch = useDispatch();

  const fetchData = useCallback(async () => {
    try {
      dispatch(vechicleRequest());
      const { data } = await axios.get("/api/v1/jokes");
      setRows(data);

      dispatch(vechicleSuccess(data));
    } catch (error) {
      dispatch(vechicleFail());
    }
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <BrowserRouter>
      <div className="flex">
        <aside className="w-2/12">
          <NavBar />
        </aside>
        <main className="px-3 pt-20 w-10/12">
          <div>
            <ToastContainer theme="dark" />
            <Routes>
              <Route exact path="/" element={<ExcelUpload />} />
              <Route path="/tabledata" element={<FormSelect />} />
              <Route path="/add_vechicle" element={<AddVehicleList />} />
              <Route path="/vehicle_list" element={<VehicleList />} />
              <Route path="/client_master">
                <Route path="new_client_master" element={<NewClientMaster />} />
                <Route
                  path="list_client_master"
                  element={<ListClientMaster />}
                />
                <Route
                  path="edit_client_master/:id"
                  element={<EditClientMaster />}
                />
                <Route path="create_area" element={<CreateAreaList />} />
                <Route path="list_area" element={<ListArea />} />
                <Route
                  path="create_vehicle_type"
                  element={<CreateVehicleType />}
                />
                <Route path="vehicle_type_list" element={<ListVehicleType />} />
              </Route>
              <Route path="/tarrif">
                <Route path="new_tarrif" element={<CreateNewTarrif />} />
                <Route path="upload_tarrif" element={<TarrifExcelUpload />} />
                <Route
                  path="tarrif_list"
                  element={<ReadUpdateDeleteTarrif />}
                />
              </Route>
              <Route path="/tripsheet">
                <Route
                  path="new_tripsheet_entry"
                  element={<NewTripSheetEntry />}
                />
                <Route
                  path="tripsheet_calculation"
                  element={<SalesAndPurchaseCalculation />}
                />
              </Route>
              <Route path="/mis">
                <Route path="oncall_mis_upload" element={<OnCallMISUpload />} />
                <Route path="slab_mis_upload" element={<SlabBaseMisUpload />} />
                <Route path="trip_mis_upload" element={<TripBaseMisUpload />} />
                <Route path="day_mis_upload" element={<DayBaseMisUpload />} />
                <Route
                  path="download_onCall_mis"
                  element={<DownloadOnCallMisData />}
                />
                <Route
                  path="download_slabBase_mis"
                  element={<DownloadSlabBaseMis />}
                />
                <Route
                  path="download_tripBase_mis"
                  element={<DownloadTripBaseMis />}
                />
                <Route
                  path="download_dayBase_mis"
                  element={<DownloadDayBaseMis />}
                />
              </Route>
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
