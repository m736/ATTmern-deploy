import React, { useEffect, useState } from "react";
import { read, utils } from "xlsx";
import { tripExcelUploadrequiredFields } from "../Tarrif/TarrifInputField";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { getTarrif } from "../action/tarrifAction";
import { getTripBaseMisData } from "../action/tripBaseMisAction";
const TripBaseMisUpload = () => {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [excelRows, setExcelRows] = useState([]);
  const dispatch = useDispatch();
  const { trip_base_mis_uploadlist } = useSelector(
    (state) => state.TripBaseMisState || []
  );
  const { tarrifData } = useSelector((state) => state.TarrifState || []);
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
          cellText: false,
          raw: false,
        });

        setLoading(false);
        setExcelRows(json);
      };
      reader.readAsArrayBuffer(file);
    }
  };
  console.log(excelRows);
  const fetchTripBaseMisUploadData = async () => {
    dispatch(getTripBaseMisData);
  };
  useEffect(() => {
    dispatch(getTarrif);
    fetchTripBaseMisUploadData();
  }, []);
  const uploadData = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const firstItemKeys = excelRows[0] && Object.keys(excelRows[0]);
      let requiredValidation = false;
      if (firstItemKeys.length) {
        tripExcelUploadrequiredFields.forEach((element) => {
          if (!firstItemKeys.find((x) => x === element)) {
            requiredValidation = true;
          }
        });
      }
      if (requiredValidation) {
        alert(
          "Required fields " + JSON.stringify(tripExcelUploadrequiredFields)
        );
        setLoading(false);
        return;
      }
      const tripBaseMisUploadList = trip_base_mis_uploadlist || [];
      const listTripBase = excelRows.map((obj) => ({
        _id: tripBaseMisUploadList?.find((x) => x["Trip_Id"] === obj["Trip_Id"])
          ?._id,
        Usage_Date: obj["Usage_Date"] || "",
        Trip_Id: obj["Trip_Id"] || "",
        Vehicle_No: obj["Vehicle_No"] || "",
        Vehicle_Type: obj["Vehicle_Type"] || "",
        Vehicle_Billed_As: obj["Vehicle_Billed_As"] || "",
        Segment: obj["Segment"] || "",
        Total_Kms: obj["Total_Kms"] || 0,
        Trip_Type: obj["Trip_Type"] || "",
        Duty_Type: obj["Duty_Type"] || "",
        Trip: obj["Trip"] || 0,
        Trip_Escort: obj["Trip_Escort"] || 0,
        Trip_Single: obj["Trip_Single"] || 0,
        Trip_Back_to_Back: obj["Trip_Back_to_Back"] || 0,
        Trip_Single_Long: obj["Trip_Single_Long"] || 0,
        Toll: obj["Toll"] || 0,
        Fuel_Difference: obj["Fuel_Difference"] || 0,
        Company: obj["Company"] || "",
        Area: obj["Area"] || "",
        Sales_Bata: obj["Sales_Bata"] || 0,
        Purchase_Bata: obj["Purchase_Bata"] || 0,
      }));

      const updatedlistTripBase = listTripBase.filter((x) => x._id);
      const newlistTripBase = listTripBase.filter((x) => !x._id);

      const updateFinalTripBase = getFinalFilteredArray(updatedlistTripBase);
      const newFinalListTripBase = getFinalFilteredArray(newlistTripBase);
      console.log(updateFinalTripBase);
      console.log(newFinalListTripBase);

      // if (updateFinalTripBase.length) {
      //   const result = (
      //     await axios.post(
      //       "http://localhost:4000/tripmis_bulk/tripbase_mis_bulk_update",
      //       updateFinalTripBase
      //     )
      //   ).data;
      //   if (result) {
      //     alert(
      //       "Successfully updated " + updateFinalTripBase.length + " documents"
      //     );
      //   }
      // }
      // if (newFinalListTripBase.length) {
      //   const result = (
      //     await axios.post(
      //       "http://localhost:4000/tripmis_bulk/tripbase_mis_bulk_insert",
      //       newFinalListTripBase
      //     )
      //   ).data;
      //   if (result) {
      //     alert(
      //       "Successfully added " + newFinalListTripBase.length + " documents"
      //     );
      //   }
      // }
      // fetchTripBaseMisUploadData();
      // setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("uploadData error: ", error);
    }
  };

  const getFinalFilteredArray = (parentList) => {
    let finalList = parentList.map((singleTripBaseData) => {
      // console.log(singleTripBaseData);
      if (tarrifData?.length) {
        let filterData = tarrifData.filter((item) => {
          return (
            singleTripBaseData?.Company?.toUpperCase() ==
              item?.company?.toUpperCase() &&
            singleTripBaseData?.Vehicle_Billed_As?.toUpperCase() ==
              item?.vehicleType?.toUpperCase() &&
            singleTripBaseData?.Trip_Type?.toUpperCase() ==
              item?.selectedRental?.toUpperCase() &&
            singleTripBaseData?.Segment?.toUpperCase() ==
              item?.selectedSegment?.toUpperCase() &&
            singleTripBaseData?.Area?.toUpperCase() ==
              item?.selectedArea?.toUpperCase()
          );
        });

        let ActiveSlabs = [];
        for (let [key, value] of Object.entries(singleTripBaseData)) {
          if (key.includes("Trip") && value !== 0) {
            ActiveSlabs.push(key.replace("Trip", ""));
          }
        }
        // console.log(ActiveSlabs);
        // let SlabFilterData = [];
        // ActiveSlabs.forEach((slab) => {
        //   if (slab.includes("E")) {
        //     let emptyAddOn = filterData.filter(
        //       (addon) => addon.selectedAddon == "escort"
        //     );
        //     if (emptyAddOn[Number(slab.replace("_Escort", "")) - 1]) {
        //       SlabFilterData.push(
        //         emptyAddOn[Number(slab.replace("_Escort", "")) - 1]
        //       );
        //     }
        //   }
        //   if (slab.includes("Single")) {
        //     let emptyAddOn = filterData.filter(
        //       (addon) => addon.selectedAddon == "single"
        //     );
        //     // console.log(emptyAddOn[Number(slab.replace("_Single", ""))]);
        //     if (emptyAddOn[Number(slab.replace("_Single", ""))]) {
        //       SlabFilterData.push(
        //         emptyAddOn[Number(slab.replace("_Single", ""))]
        //       );
        //     }
        //   }
        //   if (!slab.includes("E") && !slab.includes("Single")) {
        //     let emptyAddOn = filterData.filter(
        //       (addon) => addon.selectedAddon == ""
        //     );
        //     if (emptyAddOn[Number(slab) - 1]) {
        //       SlabFilterData.push(emptyAddOn[Number(slab) - 1]);
        //     }
        //   }
        // });
        // console.log(SlabFilterData);
      } else {
        return singleTripBaseData;
      }
    });
    return finalList;
  };
  const removeFile = () => {
    setSelectedFile(null);
    setExcelRows([]);
    window.location.reload();
  };
  return (
    <>
      <h1 className="text-black mt-5 mb-10 text-2xl">
        Upload Slab Base MIS Data
      </h1>
      <form>
        <div className="grid grid-cols-2">
          <div>
            <input
              type="file"
              name="oncall_mis"
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
              {tripExcelUploadrequiredFields.join(", ")}
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

export default TripBaseMisUpload;