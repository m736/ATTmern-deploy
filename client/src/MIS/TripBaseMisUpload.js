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
          cellDates: true,
          cellNF: false,
          cellText: false,
        });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = utils.sheet_to_json(worksheet, {
          header: 0,
          raw: false,
          dateNF: "YYYY-MM-DD",
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
      // console.log(updateFinalTripBase);
      // console.log(newFinalListTripBase);

      if (updateFinalTripBase.length) {
        const result = (
          await axios.post(
            "/tripmis_bulk/tripbase_mis_bulk_update",
            updateFinalTripBase
          )
        ).data;
        if (result) {
          alert(
            "Successfully updated " + updateFinalTripBase.length + " documents"
          );
        }
      }
      if (newFinalListTripBase.length) {
        const result = (
          await axios.post(
            "/tripmis_bulk/tripbase_mis_bulk_insert",
            newFinalListTripBase
          )
        ).data;
        if (result) {
          alert(
            "Successfully added " + newFinalListTripBase.length + " documents"
          );
        }
      }
      fetchTripBaseMisUploadData();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("uploadData error: ", error);
    }
  };

  const getFinalFilteredArray = (parentList) => {
    let finalList = parentList.map((singleTripBaseData) => {
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
              item?.selectedArea?.toUpperCase() &&
            ((singleTripBaseData?.Trip_Escort &&
              item.selectedAddon == "escort") ||
              (singleTripBaseData?.Trip_Single &&
                item.selectedAddon == "single") ||
              (singleTripBaseData?.Trip_Single_Long &&
                item.selectedAddon == "single_long") ||
              (singleTripBaseData?.Trip_Back_to_Back &&
                item.selectedAddon == "back_to_back") ||
              (singleTripBaseData?.Trip && item.selectedAddon == ""))
          );
        });

        let salesBata = 0;
        let salesEscortBata = 0;
        let salesSingleBata = 0;
        let salesSingleLongBata = 0;
        let salesBackToBackBata = 0;
        filterData.forEach((item) => {
          if (item?.selectedAddon == "") {
            salesBata = Number(item?.salesRate ?? 0);
          } else if (item?.selectedAddon == "escort") {
            salesEscortBata = Number(item?.salesRate ?? 0);
          } else if (item?.selectedAddon == "single") {
            salesSingleBata = Number(item?.salesRate ?? 0);
          } else if (item?.selectedAddon == "single_long") {
            salesSingleLongBata = Number(item?.salesRate ?? 0);
          } else if (item?.selectedAddon == "back_to_back") {
            salesBackToBackBata = Number(item?.salesRate ?? 0);
          }
        });
        let purchaseBata = 0;
        let purchaseEscortBata = 0;
        let purchaseSingleBata = 0;
        let purchaseSingleLongBata = 0;
        let purchaseBackToBackBata = 0;
        filterData.forEach((item) => {
          if (item?.selectedAddon == "") {
            purchaseBata = Number(item?.purchaseRate ?? 0);
          } else if (item?.selectedAddon == "escort") {
            purchaseEscortBata = Number(item?.purchaseRate ?? 0);
          } else if (item?.selectedAddon == "single") {
            purchaseSingleBata = Number(item?.purchaseRate ?? 0);
          } else if (item?.selectedAddon == "single_long") {
            purchaseSingleLongBata = Number(item?.purchaseRate ?? 0);
          } else if (item?.selectedAddon == "back_to_back") {
            purchaseBackToBackBata = Number(item?.purchaseRate ?? 0);
          }
        });

        // console.log(
        //   `${salesBata}-${salesEscortBata}-${salesSingleBata}-${salesSingleLongBata}-${salesBackToBackBata}`
        // );
        // console.log(
        //   Number(
        //     `${
        //       Number(singleTripBaseData?.Toll ?? 0) +
        //       Number(singleTripBaseData?.Fuel_Difference ?? 0) +
        //       Number(singleTripBaseData?.Sales_Bata ?? 0) +
        //       salesBata * Number(singleTripBaseData?.Trip ?? 0) +
        //       salesEscortBata * Number(singleTripBaseData?.Trip_Escort ?? 0) +
        //       salesSingleBata * Number(singleTripBaseData?.Trip_Single ?? 0) +
        //       salesSingleLongBata *
        //         Number(singleTripBaseData?.Trip_Single_Long ?? 0) +
        //       salesBackToBackBata *
        //         Number(singleTripBaseData?.Trip_Back_to_Back ?? 0)
        //     }`
        //   )
        // );
        // console.log(`
        // ${Number(singleTripBaseData?.Toll ?? 0)}-
        // ${Number(singleTripBaseData?.Fuel_Difference ?? 0)}-
        // ${Number(singleTripBaseData?.Sales_Bata ?? 0)}-
        //   ${salesBata}*${Number(singleTripBaseData?.Trip ?? 0)}=${
        //   salesBata * Number(singleTripBaseData?.Trip ?? 0)
        // }-
        //   ${salesEscortBata}*${Number(singleTripBaseData?.Trip_Escort ?? 0)}=${
        //   salesEscortBata * Number(singleTripBaseData?.Trip_Escort ?? 0)
        // }-
        //   ${salesSingleBata}*${Number(singleTripBaseData?.Trip_Single ?? 0)}=${
        //   salesSingleBata * Number(singleTripBaseData?.Trip_Single ?? 0)
        // }-
        //   ${salesSingleLongBata}*${Number(
        //   singleTripBaseData?.Trip_Single_Long ?? 0
        // )}=${
        //   salesSingleLongBata *
        //   Number(singleTripBaseData?.Trip_Single_Long ?? 0)
        // }-
        //   ${salesBackToBackBata}*${Number(
        //   singleTripBaseData?.Trip_Back_to_Back ?? 0
        // )}=${
        //   salesBackToBackBata *
        //   Number(singleTripBaseData?.Trip_Back_to_Back ?? 0)
        // }-
        //  `);

        let salesTotal = Math.round(
          Number(singleTripBaseData?.Toll ?? 0) +
            Number(singleTripBaseData?.Fuel_Difference ?? 0) +
            Number(singleTripBaseData?.Sales_Bata ?? 0) +
            salesBata * Number(singleTripBaseData?.Trip ?? 0) +
            salesEscortBata * Number(singleTripBaseData?.Trip_Escort ?? 0) +
            salesSingleBata * Number(singleTripBaseData?.Trip_Single ?? 0) +
            salesSingleLongBata *
              Number(singleTripBaseData?.Trip_Single_Long ?? 0) +
            salesBackToBackBata *
              Number(singleTripBaseData?.Trip_Back_to_Back ?? 0)
        );

        let purchaseTotal = Math.round(
          Number(singleTripBaseData?.Toll ?? 0) +
            Number(singleTripBaseData?.Fuel_Difference ?? 0) +
            Number(singleTripBaseData?.Sales_Bata ?? 0) +
            purchaseBata * Number(singleTripBaseData?.Trip ?? 0) +
            purchaseEscortBata * Number(singleTripBaseData?.Trip_Escort ?? 0) +
            purchaseSingleBata * Number(singleTripBaseData?.Trip_Single ?? 0) +
            purchaseSingleLongBata *
              Number(singleTripBaseData?.Trip_Single_Long ?? 0) +
            purchaseBackToBackBata *
              Number(singleTripBaseData?.Trip_Back_to_Back ?? 0)
        );

        console.log({
          salesTotal: salesTotal,
          purchaseTotal: purchaseTotal,
          ...singleTripBaseData,
        });
        // console.log(`${salesTotal}-${purchaseTotal}`);
        return {
          purchaseTotal: purchaseTotal,
          salesTotal: salesTotal,
          ...singleTripBaseData,
        };
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
        Upload Trip Base MIS Data
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
                  className="bg-blue-500 hover:bg-blue-900 text-white py-3 px-4 rounded"
                  disabled={loading}
                  onClick={uploadData}
                >
                  UploadMISData
                </button>
              ) : null}{" "}
              {selectedFile?.name && excelRows.length ? (
                <button
                  className="bg-red-500 hover:bg-red-900 text-white py-3 px-4 ml-3 rounded"
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
