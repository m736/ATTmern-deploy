import React, { useEffect, useState } from "react";
import { read, utils } from "xlsx";
import { dayExcelUploadrequiredFields } from "../Tarrif/TarrifInputField";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { getTarrif } from "../action/tarrifAction";
import { getDayBaseMisData } from "../action/dayBaseMisAction";
import { getClientMasterAction } from "../action/clientMasterAction";
import { Spin } from "antd";
const DayBaseMisUpload = () => {
  const [fileLoading, setLoading] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [excelRows, setExcelRows] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [clLocation, setClLocation] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState([]);
  const dispatch = useDispatch();
  const { day_base_mis_uploadlist } = useSelector(
    (state) => state.DayBaseMisState || []
  );
  const { tarrifData } = useSelector((state) => state.TarrifState || []);
  const { client_master_detail } = useSelector(
    (state) => state.ClientMasterState || []
  );
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
  // console.log(excelRows);
  const fetchDayBaseMisUploadData = async () => {
    dispatch(getDayBaseMisData);
  };
  useEffect(() => {
    dispatch(getTarrif);
    fetchDayBaseMisUploadData();
    dispatch(getClientMasterAction);
  }, []);
  useEffect(() => {
    if (client_master_detail && client_master_detail.length > 0) {
      let companyList = client_master_detail.map((item) => {
        return {
          text: item.Company_Name,
          value: item.Company_Name,
        };
      });
      setCompanyList(removeDuplicateObjects(companyList, "value"));
    }
  }, [client_master_detail]);
  function removeDuplicateObjects(array, property) {
    const uniqueIds = [];
    const unique = array.filter((element) => {
      const isDuplicate = uniqueIds.includes(element[property]);
      if (!isDuplicate) {
        uniqueIds.push(element[property]);
        return true;
      }
      return false;
    });
    return unique;
  }
  const uploadData = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const firstItemKeys = excelRows[0] && Object.keys(excelRows[0]);
      let requiredValidation = false;
      if (firstItemKeys.length) {
        dayExcelUploadrequiredFields.forEach((element) => {
          if (!firstItemKeys.find((x) => x === element)) {
            requiredValidation = true;
          }
        });
      }
      if (requiredValidation) {
        alert(
          "Required fields " + JSON.stringify(dayExcelUploadrequiredFields)
        );
        setLoading(false);
        return;
      }
      const dayBaseMisUploadList = day_base_mis_uploadlist || [];
      const listDayBase = excelRows.map((obj) => ({
        _id: dayBaseMisUploadList?.find(
          (x) => x["Dutyslip_No"] === obj["Dutyslip_No"]
        )?._id,
        Date: obj["Date"] || "",
        Dutyslip_No: obj["Dutyslip_No"] || "",
        Vehicle_No: obj["Vehicle_No"] || "",
        Vehicle_Type: obj["Vehicle_Type"] || "",
        Vehicle_Billed_As: obj["Vehicle_Billed_As"] || "",
        Segment: obj["Segment"] || "",
        Rental: obj["Rental"] || "",
        Total_Days: obj["Total_Days"] || 0,
        No_Of_Months: obj["No_Of_Months"] || 0,
        Total_Kms: obj["Total_Kms"] || 0,
        Total_Hrs: obj["Total_Hrs"] || 0,
        Toll: obj["Toll"] || 0,
        Parking: obj["Parking"] || 0,
        Permit: obj["Permit"] || 0,
        Driver_Batta: obj["Driver_Batta"] || 0,
        Day_Bata: obj["Day_Bata"] || 0,
        Night_Sales_Bata: obj["Night_Sales_Bata"] || 0,
        Night_Purchase_Bata: obj["Night_Purchase_Bata"] || 0,
        Fuel_Difference: obj["Fuel_Difference"] || 0,
        Company_Name: obj["Company_Name"] || "",
        Area: obj["Area"] || "",
      }));

      const updatedlistDayBase = listDayBase.filter((x) => x._id);
      const newlistDayBase = listDayBase.filter((x) => !x._id);

      const updateFinalDayBase = getFinalFilteredArray(updatedlistDayBase);
      const newFinalListDayBase = getFinalFilteredArray(newlistDayBase);
      console.log(updateFinalDayBase);
      console.log(newFinalListDayBase);

      if (updateFinalDayBase.length) {
        const result = (
          await axios.post(
            "/daymis_bulk/daybase_mis_bulk_update",
            updateFinalDayBase
          )
        ).data;
        if (result) {
          alert(
            "Successfully updated " + updateFinalDayBase.length + " documents"
          );
        }
      }
      if (newFinalListDayBase.length) {
        const result = (
          await axios.post(
            "/daymis_bulk/daybase_mis_bulk_insert",
            newFinalListDayBase
          )
        ).data;
        if (result) {
          alert(
            "Successfully added " + newFinalListDayBase.length + " documents"
          );
        }
      }
      fetchDayBaseMisUploadData();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("uploadData error: ", error);
    }
  };

  const getFinalFilteredArray = (parentList) => {
    let finalList = parentList.map((singleDayBaseData) => {
      if (tarrifData?.length) {
        let filterData = tarrifData.filter((item) => {
          return (
            singleDayBaseData?.Company_Name?.toUpperCase() ==
              item?.company?.toUpperCase() &&
            singleDayBaseData?.Vehicle_Billed_As?.toUpperCase() ==
              item?.vehicleType?.toUpperCase() &&
            singleDayBaseData?.Rental?.toUpperCase() ==
              item?.selectedRental?.toUpperCase() &&
            singleDayBaseData?.Segment?.toUpperCase() ==
              item?.selectedSegment?.toUpperCase() &&
            singleDayBaseData?.Area?.toUpperCase() ==
              item?.selectedArea?.toUpperCase()
          );
        });
        let calculationDayItem = filterData[0];

        let tarrifSalesRate = Number(calculationDayItem?.salesRate ?? 0);
        let tarrifPurchaseRate = Number(calculationDayItem?.purchaseRate ?? 0);
        let totalDays = Number(singleDayBaseData?.Total_Days ?? 0);
        let salesTotal = Math.round(
          Number(singleDayBaseData?.Toll ?? 0) +
            Number(singleDayBaseData?.Parking ?? 0) +
            Number(singleDayBaseData?.Permit ?? 0) +
            Number(singleDayBaseData?.Driver_Batta ?? 0) +
            Number(singleDayBaseData?.Day_Bata ?? 0) +
            Number(singleDayBaseData?.Night_Sales_Bata ?? 0) +
            Number(singleDayBaseData?.Fuel_Difference ?? 0) +
            tarrifSalesRate * totalDays
        );

        let purchaseTotal = Math.round(
          Number(singleDayBaseData?.Toll ?? 0) +
            Number(singleDayBaseData?.Parking ?? 0) +
            Number(singleDayBaseData?.Permit ?? 0) +
            Number(singleDayBaseData?.Driver_Batta ?? 0) +
            Number(singleDayBaseData?.Day_Bata ?? 0) +
            Number(singleDayBaseData?.Night_Purchase_Bata ?? 0) +
            Number(singleDayBaseData?.Fuel_Difference ?? 0) +
            tarrifPurchaseRate * totalDays
        );
        console.log(
          `${tarrifSalesRate}*${totalDays}=${tarrifSalesRate * totalDays}
          ${tarrifPurchaseRate}*${totalDays}=${tarrifPurchaseRate * totalDays}`
        );
        console.log({
          salesTotal: salesTotal,
          purchaseTotal: purchaseTotal,
          ...singleDayBaseData,
        });
        return {
          Sales_Nett: salesTotal,
          Purchase_Nett: purchaseTotal,
          Client: selectedCompany,
          Location: selectedLocation,
          ...singleDayBaseData,
        };
      } else {
        return singleDayBaseData;
      }
    });
    return finalList;
  };
  const removeFile = () => {
    setSelectedFile(null);
    setExcelRows([]);
    window.location.reload();
  };
  let durationBody =
    clLocation.length &&
    clLocation?.map((item, i) => {
      return item?.map((again) => {
        return (
          <option key={again} value={again}>
            {again}
          </option>
        );
      });
    });
  return (
    <>
      <h1 className="text-black mt-5 mb-10 text-2xl">
        Upload Day Base MIS Data
      </h1>
      <form>
        <div className="grid grid-cols-2">
          <div>
            <select
              id="countries"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-6"
              onChange={(e) => {
                let updated = client_master_detail.filter(
                  (item) => e.target.value == item.Company_Name
                );
                let updatedLocation = updated.map((item) =>
                  item?.Location?.map((loc) => loc?.Client_Location)
                );
                console.log(updatedLocation);
                setClLocation(updatedLocation);
                setSelectedCompany(e.target.value);
              }}
              value={selectedCompany}
            >
              <option selected>Choose a company</option>
              {companyList.map((comapny) => (
                <option value={comapny.value}>{comapny.text}</option>
              ))}
              ;
            </select>
            <select
              id="location"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-6"
              onChange={(e) => {
                console.log(e.target.value);
                setSelectedLocation(e.target.value);
              }}
              value={selectedLocation}
            >
              <option selected>Choose Location</option>
              {durationBody ? durationBody : null}
            </select>
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
              {dayExcelUploadrequiredFields.join(", ")}
            </div>
          </div>
          <div>
            <div className="inline-flex ml-24">
              {fileLoading ? (
                <Spin spinning={fileLoading} tip="fileLoading">
                  {" "}
                </Spin>
              ) : selectedFile?.name && excelRows.length > 0 ? (
                <>
                  <button
                    className="bg-blue-500 hover:bg-blue-900 text-white py-3 px-4 rounded"
                    onClick={uploadData}
                  >
                    UploadMISData
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-900 text-white py-3 px-4 ml-3 rounded"
                    onClick={removeFile}
                  >
                    Remove
                  </button>
                </>
              ) : null}{" "}
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default DayBaseMisUpload;
