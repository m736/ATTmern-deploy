import React, { useCallback, useEffect, useState } from "react";
import {
  HashRouter,
  Routes,
  Route,
  NavLink,
  BrowserRouter,
} from "react-router-dom";
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

function App() {
  const [rows, setRows] = useState([]);
  const dispatch = useDispatch();

  const fetchData = useCallback(async () => {
    try {
      dispatch(vechicleRequest());
      const { data } = await axios.get(
        "https://creo-8w4j.onrender.com/api/v1/jokes"
      );
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
        <aside className="h-screen sticky top-0 w-2/12">
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
              <Route path="/tarrif">
                <Route path="new_tarrif" element={<CreateNewTarrif />} />
                <Route
                  path="tarrif_list"
                  element={<ReadUpdateDeleteTarrif />}
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
