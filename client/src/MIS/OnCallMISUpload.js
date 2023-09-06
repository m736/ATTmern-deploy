import React, { useEffect, useState } from "react";
import { read, utils } from "xlsx";
import { onCallMisrequiredFields } from "../Tarrif/TarrifInputField";
import { useDispatch, useSelector } from "react-redux";
import { getOnCallMisData } from "../action/onCallMisAction";
import axios from "axios";
import { getTarrif } from "../action/tarrifAction";
const OnCallMISUpload = () => {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [excelRows, setExcelRows] = useState([]);
  const dispatch = useDispatch();
  const { oncall_mis_uploadlist } = useSelector(
    (state) => state.OnCallMisState
  );
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

  const fetchOnCallMisUploadData = async () => {
    dispatch(getOnCallMisData);
  };
  useEffect(() => {
    dispatch(getTarrif());
    fetchOnCallMisUploadData();
  }, []);
  const uploadData = async () => {
    try {
      setLoading(true);
      const firstItemKeys = excelRows[0] && Object.keys(excelRows[0]);
      let requiredValidation = false;
      if (firstItemKeys.length) {
        onCallMisrequiredFields.forEach((element) => {
          if (!firstItemKeys.find((x) => x === element)) {
            requiredValidation = true;
          }
        });
      }
      if (requiredValidation) {
        alert("Required fields " + JSON.stringify(onCallMisrequiredFields));
        setLoading(false);
        return;
      }
      const onCallMisUploadList = oncall_mis_uploadlist || [];
      const listOnCall = excelRows.map((obj) => ({
        _id: onCallMisUploadList?.find(
          (x) => x.Dutyslip_No === obj["Dutyslip_No"]
        )?._id,

        Usage_Date: obj["Usage_Date"] || "",
        Vehicle_No: obj["Vehicle_No"] || "",
        Vehicle_Type: obj["Vehicle_Type"] || "",
        Vehicle_Billed_As: obj["Vehicle_Billed_As"] || "",
        Segment: obj["Segment"] || "",
        Dutyslip_No: obj["Dutyslip_No"] || "",
        Used_By: obj["Used_By"] || "",
        Place: obj["Place"] || "",
        Rental: obj["Rental"] || "",
        Total_Kms: obj["Total_Kms"] || 0,
        Total_Days: obj["Total_Days"] || 0,
        Total_Hrs: obj["Total_Hrs"] || 0,
        Toll: obj["Toll"] || 0,
        Parking: obj["Parking"] || 0,
        Permit: obj["Permit"] || 0,
        Driver_Batta: obj["Driver_Batta"] || 0,
        Day_Bata: obj["Day_Bata"] || 0,
        Night_Sales_Bata: obj["Night_Sales_Bata"] || 0,
        Night_Purchase_Bata: obj["Night_Purchase_Bata"] || 0,
        Others: obj["Others"] || 0,
        Fuel_Difference: obj["Fuel_Difference"] || 0,
        Company_Name: obj["Company_Name"] || "",
        Area: obj["Area"] || "",
      }));

      const updatedlistOnCall = listOnCall.filter((x) => x._id);
      const newlistOnCall = listOnCall.filter((x) => !x._id);
      // console.log(updatedlistOnCall, getFinalFilteredArray(updatedlistOnCall));
      const updateFinalListOnCall = getFinalFilteredArray(updatedlistOnCall);
      const newFinalListOnCall = getFinalFilteredArray(newlistOnCall);

      if (updatedlistOnCall.length) {
        const result = (
          await axios.post(
            "http://localhost:4000/oncall_bulk/oncallmis_bulk_update",
            updateFinalListOnCall
          )
        ).data;
        if (result) {
          alert(
            "Successfully updated " +
              updateFinalListOnCall.length +
              " documents"
          );
        }
      }
      if (newlistOnCall.length) {
        const result = (
          await axios.post(
            "http://localhost:4000/oncall_bulk/oncallmis_bulk_insert",
            newFinalListOnCall
          )
        ).data;
        if (result) {
          alert(
            "Successfully added " + newFinalListOnCall.length + " documents"
          );
        }
      }

      fetchOnCallMisUploadData();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("uploadData error: ", error);
    }
  };

  const getFinalFilteredArray = (parentList) => {
    let finalList = parentList.map((singleOnCallData) => {
      if (tarrifData?.length) {
        let filterData = tarrifData.filter(
          (item) =>
            singleOnCallData?.Company_Name == item?.company &&
            singleOnCallData?.Vehicle_Billed_As == item?.vehicleType &&
            singleOnCallData?.Rental == item?.selectedRental &&
            singleOnCallData?.Segment == item?.selectedSegment
        );

        if (singleOnCallData?.Rental != "Out Station") {
          if (singleOnCallData?.Total_Hrs) {
            let graceTimeFilter = filterData.filter((item) => {
              let totalHrs = Number(item?.selectedSlabhrs);
              if (item?.salesGraceTime) {
                totalHrs += Number(item?.salesGraceTime);
              }

              return Number(singleOnCallData?.Total_Hrs) <= totalHrs;
            });
            if (graceTimeFilter.length) {
              filterData = [...graceTimeFilter];
            } else {
              filterData = [filterData[filterData.length - 1]];
            }
          }
        }
        filterData = filterData?.sort(
          (a, b) => Number(a?.selectedSlabhrs) - Number(b?.selectedSlabhrs)
        );

        let calculationItem = filterData[0];
        const tarrrifSlabKms = Number(calculationItem?.selectedSlabkms ?? 0);
        const OurTotalKms = Number(singleOnCallData?.Total_Kms ?? 0);

        const tarrifSlabHrs = Number(calculationItem?.selectedSlabhrs ?? 0);
        const OurTotalHrs = Number(singleOnCallData?.Total_Hrs ?? 0);
        const OurTotalDays = Number(singleOnCallData?.Total_Days ?? 0);

        const Toll = Number(singleOnCallData?.Toll ?? 0);
        const Parking = Number(singleOnCallData?.Parking ?? 0);
        const Permit = Number(singleOnCallData?.Permit ?? 0);
        const Driver_Batta = Number(singleOnCallData?.Driver_Batta ?? 0);
        const Day_Bata = Number(singleOnCallData?.Day_Bata ?? 0);
        const Night_Sales_Bata = Number(
          singleOnCallData?.Night_Sales_Bata ?? 0
        );
        const Night_Purchase_Bata = Number(
          singleOnCallData?.Night_Purchase_Bata ?? 0
        );
        const Others = Number(singleOnCallData?.Others ?? 0);
        const Fuel_Difference = Number(singleOnCallData?.Fuel_Difference ?? 0);

        const tarrifSlabExHrsRate = Number(
          calculationItem?.salesExHrsRate ?? 0
        );
        const tarrifSlabExKmsRate = Number(
          calculationItem?.salesExKmsRate ?? 0
        );
        const tarrifPurchaseExHrsRate = Number(
          calculationItem?.purchaseExHrsRate ?? 0
        );
        const tarrifPurchaseExKmsRate = Number(
          calculationItem?.purchaseExKmsRate ?? 0
        );
        const remainingHrs =
          tarrifSlabHrs && OurTotalHrs >= tarrifSlabHrs
            ? OurTotalHrs - tarrifSlabHrs
            : 0;
        const remainingKms =
          tarrrifSlabKms && OurTotalKms >= tarrrifSlabKms
            ? OurTotalKms - tarrrifSlabKms
            : 0;
        // console.log(remainingKms);
        const remainingKmsForOutAndDay =
          OurTotalDays > 0 && OurTotalDays * tarrrifSlabKms >= OurTotalKms
            ? OurTotalDays * tarrrifSlabKms
            : OurTotalKms;
        const exHrs =
          singleOnCallData?.Rental !== "Out Station" ? remainingHrs : 0;
        const exKms =
          singleOnCallData?.Rental !== "Out Station"
            ? remainingKms
            : remainingKmsForOutAndDay;
        // console.log(exKms);
        const totalSalesHrsPrice = exHrs * tarrifSlabExHrsRate;
        const totalSalesKmsPrice = exKms * tarrifSlabExKmsRate;
        const totalPurchaseHrsPrice = exHrs * tarrifPurchaseExHrsRate;
        const totalPurchaseKmsPrice = exKms * tarrifPurchaseExKmsRate;
        const totalKmsPriceForSalesOutAndDay = exKms * tarrifSlabExKmsRate;
        const totalKmsPriceForPurchasesOutAndDay =
          exKms * tarrifPurchaseExKmsRate;
        const tarrifSalesRate = Number(calculationItem?.salesRate ?? 0);
        const tarrifPurchaseRate = Number(calculationItem?.purchaseRate ?? 0);

        const salesGross =
          singleOnCallData?.Rental !== "Out Station"
            ? totalSalesHrsPrice + totalSalesKmsPrice + tarrifSalesRate
            : totalKmsPriceForSalesOutAndDay;
        const salesNett =
          salesGross +
          Toll +
          Parking +
          Permit +
          Driver_Batta +
          Day_Bata +
          Night_Sales_Bata +
          Others +
          Fuel_Difference;
        const purchaseGross =
          singleOnCallData?.Rental !== "Out Station"
            ? totalPurchaseHrsPrice + totalPurchaseKmsPrice + tarrifPurchaseRate
            : totalKmsPriceForPurchasesOutAndDay;
        const purchaseNett =
          purchaseGross +
          Toll +
          Parking +
          Permit +
          Driver_Batta +
          Day_Bata +
          Night_Sales_Bata +
          Others +
          Fuel_Difference;

        return {
          ...calculationItem,
          ...singleOnCallData,
          exHrs: exHrs,
          exKms: exKms,
          salesGross: salesGross,
          salesNett: salesNett,
          purchaseGross: purchaseGross,
          purchaseNett: purchaseNett,
        };
      } else {
        return singleOnCallData;
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
        Upload On Call MIS Data
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
              {onCallMisrequiredFields.join(", ")}
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

export default OnCallMISUpload;
