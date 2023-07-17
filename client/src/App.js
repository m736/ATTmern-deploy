import React, { useCallback, useEffect, useState } from "react";
import { HashRouter, Routes, Route, NavLink } from "react-router-dom";
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
      console.log(data);
      dispatch(vechicleSuccess(data));
    } catch (error) {
      dispatch(vechicleFail());
    }
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <HashRouter>
      <div className="flex">
        <aside class="h-screen sticky top-0">
          <NavBar />
        </aside>
        <main className="px-3 pt-20 w-4/5">
          <div>
            <ToastContainer theme="dark" />
            <Routes>
              <Route exact path="/" element={<ExcelUpload />} />
              <Route path="/tabledata" element={<FormSelect />} />
              <Route path="/add_vechicle" element={<AddVehicleList />} />
              <Route path="/vehicle_list" element={<VehicleList />} />
            </Routes>
          </div>
        </main>
      </div>
    </HashRouter>
  );
}

export default App;
