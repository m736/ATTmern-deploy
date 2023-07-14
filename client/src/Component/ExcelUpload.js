import React, { Fragment, useEffect, useState, useCallback } from "react";
import { Col, Row, Button, FormGroup, Input, FormText } from "reactstrap";
import { read, utils } from "xlsx";
import axios from "axios";
import { Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  vechicleFail,
  vechicleRequest,
  vechicleSuccess,
} from "../slices/VechicleDetailSlice";

function ExcelUpload() {
  const [loading, setLoading] = useState(false);
  const [excelRows, setExcelRows] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [rows, setRows] = useState([]);
  const dispatch = useDispatch();
  const { misvehicle_list = [], requiredFields } = useSelector(
    (state) => state.VechicleDetailState
  );
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
  }, [fetchData]);

  const readUploadFile = (e) => {
    e.preventDefault();
    if (e.target.files) {
      setLoading(true);
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = read(data, {
          type: "binary",
          cellText: false,
          cellDates: true,
          cellNF: true,
        });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = utils.sheet_to_json(worksheet, {
          header: 0,
          cellDates: true,
          raw: false,
          dateNF: "yyyy-mm-dd",
        });
        setLoading(false);
        setExcelRows(json);
      };
      reader.readAsArrayBuffer(file);
    }

    setExcelRows([]);
  };
  const uploadData = async () => {
    try {
      setLoading(true);
      const firstItemKeys = excelRows[0] && Object.keys(excelRows[0]);
      let requiredValidation = false;
      if (firstItemKeys.length) {
        requiredFields.forEach((element) => {
          if (!firstItemKeys.find((x) => x === element)) {
            requiredValidation = true;
          }
        });
      }
      if (requiredValidation) {
        alert("Required fields " + JSON.stringify(requiredFields));
        setLoading(false);
        return;
      }
      const jokeList = misvehicle_list || [];
      const jokes = excelRows.map((obj) => ({
        _id: jokeList.find((x) => x.slipno === obj["Slip No"])?._id,
        jokeId: obj["ID"] || "",
        vechicle_no: obj["Vehicle No"] || "",
        company: obj["Company"] || "",
        date: obj["Date"] || "",
        slipno: obj["Slip No"],
        trip: obj["Trip"] || "",
        time: obj["Time"] || "",
        p_d: obj["P_D"] || "",
        distance: obj["Distance"] || "",
        s_location: obj["Start Location"] || "",
        e_location: obj["End Location"] || "",
      }));
      const updatedJokes = jokes.filter((x) => x._id);
      const newJokes = jokes.filter((x) => !x._id);
      if (updatedJokes.length) {
        const result = (
          await axios.post(
            "https://creo-8w4j.onrender.com/bulk/jokes-bulk-update",
            updatedJokes
          )
        ).data;
        if (result) {
          alert("Successfully updated " + updatedJokes.length + " documents");
        }
      }
      if (newJokes.length) {
        const result = (
          await axios.post(
            "https://creo-8w4j.onrender.com/bulk/jokes-bulk-insert",
            newJokes
          )
        ).data;
        if (result) {
          alert("Successfully added " + newJokes.length + " documents");
        }
      }
      fetchData();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("uploadData error: ", error);
    }

    setExcelRows([]);
    // window.location.reload();
  };
  const removeFile = () => {
    setSelectedFile(null);
    setExcelRows([]);
    window.location.reload();
  };

  return (
    <Fragment>
      {loading && (
        <div className="centered">
          <Spin tip="Loading">
            <div className="content" />
          </Spin>
        </div>
      )}
      <h1 className="text-black mt-5 mb-10 text-2xl">Upload MIS Data</h1>
      <form>
        <div className="grid grid-cols-2">
          <div>
            <input
              type="file"
              name="file"
              disabled={loading}
              onChange={readUploadFile}
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              className="file:bg-gradient-to-b file:from-blue-500 file:to-blue-600
     file:px-6 file:py-3 file:m-2 file:border-none file:rounded-full file:text-white
     file:cursor-pointer file:shadow-sm file:shadow-blue-600/50
     bg-gradient-to-br from-gray-600 to-gray-700 text-white rounded-full
     cursor-pointer
     shadow-xl shadow-gray-700/60 w-full
     "
            />
            <div className="text-sm pt-5">
              {" "}
              {"NOTE: The headers in the Excel file should be as follows!. => "}
              {requiredFields.join(", ")}
            </div>
          </div>
          <div>
            <div class="inline-flex ml-24">
              {selectedFile?.name && excelRows.length ? (
                <button
                  class="bg-blue-500 hover:bg-blue-900 text-white py-3 px-4 rounded"
                  disabled={loading}
                  onClick={uploadData}
                >
                  UploadMISData
                </button>
              ) : null}{" "}
              {selectedFile?.name && excelRows.length ? (
                <button
                  class="bg-red-500 hover:bg-red-900 text-white py-3 px-4 ml-3 rounded"
                  disabled={loading}
                  onClick={removeFile}
                >
                  Remove
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </form>
    </Fragment>
  );
}
export default ExcelUpload;
