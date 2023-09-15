import React, { useEffect, useState } from "react";
import { read, utils } from "xlsx";
import { tarrifExcelUploadrequiredFields } from "../Tarrif/TarrifInputField";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { getTarrif } from "../action/tarrifAction";
const TarrifExcelUpload = () => {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [excelRows, setExcelRows] = useState([]);
  const dispatch = useDispatch();
  const { tarrifData } = useSelector((state) => state.TarrifState);
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
        });

        setLoading(false);
        setExcelRows(json);
      };
      reader.readAsArrayBuffer(file);
    }
  };
  // console.log(excelRows);
  const fetchOnCallMisUploadData = async () => {
    dispatch(getTarrif());
  };
  useEffect(() => {
    fetchOnCallMisUploadData();
  }, []);
  const uploadData = async () => {
    try {
      setLoading(true);
      const firstItemKeys = excelRows[0] && Object.keys(excelRows[0]);
      let requiredValidation = false;
      if (firstItemKeys.length) {
        tarrifExcelUploadrequiredFields?.forEach((element) => {
          if (!firstItemKeys.find((x) => x === element)) {
            requiredValidation = true;
          }
        });
      }
      if (requiredValidation) {
        alert(
          "Required fields " + JSON.stringify(tarrifExcelUploadrequiredFields)
        );
        setLoading(false);
        return;
      }
      const tarrifExcelUploadList = tarrifData || [];
      const listTarrifExcelUploadList = excelRows.map((obj) => ({
        _id: tarrifExcelUploadList?.find((x) => x["S.no"] === obj["S.no"])?._id,
        company: obj["Company Name"] || "",
        vehicleType: obj["Vehicle Type"] || "",
        selectedRental: obj["Rental"] || "",
        selectedSegment: obj["Segment"] || "",
        selectedSlabhrs: obj["Slab  Hours"] || 0,
        selectedSlabkms: obj["Slab Kms"] || 0,
        selectedSlabfrom: obj["Slab From"] || "",
        selectedSlabto: obj["Slab To"] || "",
        selectedAddon: obj["Add On"] || "",
        salesRate: obj["Sales Rate"] || 0,
        purchaseRate: obj["Purchase Rate"] || 0,
        salesExKmsRate: obj["Sales Ex Kms Rate"] || 0,
        purchaseExKmsRate: obj["Purchase Ex Kms Rate"] || 0,
        salesExHrsRate: obj["Sales Ex Hrs Rate"] || 0,
        purchaseExHrsRate: obj["Purchase Ex Hrs Rate"] || 0,
        salesGraceTime: obj["Sales Grace Time"] || 0,
        purchaseGraceTime: obj["Purchase Grace Time"] || 0,
        driverbata: obj["Driver Bata"] || 0,
        selectedArea: obj["Area"] || "",
      }));

      const updatedTarrifList = listTarrifExcelUploadList.filter((x) => x._id);
      const newTarrifList = listTarrifExcelUploadList.filter((x) => !x._id);

      if (updatedTarrifList.length) {
        const result = (
          await axios.post(
            "/tarrifexcel_bulk/tarrif_bulk_update",
            updatedTarrifList
          )
        ).data;
        if (result) {
          alert(
            "Successfully updated " + updatedTarrifList.length + " documents"
          );
        }
      }
      if (newTarrifList.length) {
        const result = (
          await axios.post(
            "/tarrifexcel_bulk/tarrif_bulk_insert",
            newTarrifList
          )
        ).data;
        if (result) {
          alert("Successfully added " + newTarrifList.length + " documents");
        }
      }

      fetchOnCallMisUploadData();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("uploadData error: ", error);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setExcelRows([]);
    window.location.reload();
  };
  return (
    <>
      <h1 className="text-black mt-5 mb-10 text-2xl">
        Upload On Call MIS Data
      </h1>
      <form>
        <div className="grid grid-cols-2">
          <div>
            <input
              type="file"
              name="tarrif_excel_upload"
              onChange={readUploadFile}
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              className={`file:bg-gradient-to-b file:from-blue-500 file:to-blue-600
   file:px-6 file:py-3 file:m-2 file:border-none file:rounded-full file:text-white
   file:cursor-pointer file:shadow-sm file:shadow-blue-600/50
   bg-gradient-to-br from-gray-600 to-gray-700 text-white rounded-full
   cursor-pointer w-full`}
            />
            <div className="text-sm pt-5">
              {" "}
              {"NOTE: The headers in the Excel file should be as follows!. => "}
              {tarrifExcelUploadrequiredFields?.join(", ")}
            </div>
          </div>
          <div>
            <div className="inline-flex ml-24">
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
    </>
  );
};

export default TarrifExcelUpload;
