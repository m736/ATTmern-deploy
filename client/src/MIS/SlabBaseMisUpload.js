import React, { useEffect, useRef, useState } from "react";
import { read, utils } from "xlsx";
import { slabExcelUploadrequiredFields } from "../Tarrif/TarrifInputField";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { getTarrif } from "../action/tarrifAction";
import { getSlabBaseMisData } from "../action/slabBasMisAction";
import { getClientMasterAction } from "../action/clientMasterAction";
import { Spin } from "antd";
const SlabBaseMisUpload = () => {
  const [fileLoading, setLoading] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [companyList, setCompanyList] = useState([]);
  const [excelRows, setExcelRows] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [clLocation, setClLocation] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState([]);
  const dispatch = useDispatch();
  const { slab_base_mis_uploadlist } = useSelector(
    (state) => state.SlabBaseMisState || []
  );
  const { tarrifData, loading } = useSelector(
    (state) => state.TarrifState || []
  );
  const { client_master_detail, clientMasterLoading } = useSelector(
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
          raw: false,
        });
        setExcelRows(json);
        setLoading(false);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const fetchSlabBaseMisUploadData = async () => {
    dispatch(getSlabBaseMisData);
  };
  useEffect(() => {
    dispatch(getTarrif);
    dispatch(getClientMasterAction);
    fetchSlabBaseMisUploadData();
  }, []);
  useEffect(() => {
    if (client_master_detail.length) {
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
    setLoading(true);
    try {
      const firstItemKeys = excelRows[0] && Object.keys(excelRows[0]);
      let requiredValidation = false;
      if (firstItemKeys?.length) {
        slabExcelUploadrequiredFields.forEach((element) => {
          if (!firstItemKeys.find((x) => x === element)) {
            requiredValidation = true;
          }
        });
      }
      if (requiredValidation) {
        alert(
          "Required fields " + JSON.stringify(slabExcelUploadrequiredFields)
        );
        setLoading(false);
        return;
      }
      const slabBaseMisUploadList = slab_base_mis_uploadlist || [];
      const listSlabBase = excelRows.map((obj) => ({
        _id: slabBaseMisUploadList?.find(
          (x) => x["Dutyslip_No"] === obj["Dutyslip_No"]
        )?._id,
        Date: obj["Date"] || "",
        // date: moment(new Date(obj["date"]).format("YYYY-MM-DD")) || "",
        Dutyslip_No: obj["Dutyslip_No"] || "",
        Vehicle_No: obj["Vehicle_No"] || "",
        Vehicle_Type: obj["Vehicle_Type"] || "",
        Vehicle_Billed_As: obj["Vehicle_Billed_As"] || "",
        Segment: obj["Segment"] || "",
        Total_Kms: obj["Total_Kms"] || 0,
        Trip_Type: obj["Trip_Type"] || "",
        Rental: obj["Rental"] || "",
        Slab1: obj["Slab1"] || 0,
        Slab2: obj["Slab2"] || 0,
        Slab3: obj["Slab3"] || 0,
        Slab4: obj["Slab4"] || 0,
        Slab5: obj["Slab5"] || 0,
        "Slab1 - E": obj["Slab1 - E"] || 0,
        "Slab2 - E": obj["Slab2 - E"] || 0,
        "Slab3 - E": obj["Slab3 - E"] || 0,
        "Slab4 - E": obj["Slab4 - E"] || 0,
        "Slab5 - E": obj["Slab5 - E"] || 0,
        "Slab1 - Single": obj["Slab1 - Single"] || 0,
        "Slab2 - Single": obj["Slab2 - Single"] || 0,
        "Slab3 - Single": obj["Slab3 - Single"] || 0,
        "Slab4 - Single": obj["Slab4 - Single"] || 0,
        "Slab5 - Single": obj["Slab5 - Single"] || 0,
        Bata: obj["Bata"] || 0,
        Fuel_Difference: obj["Fuel_Difference"] || 0,
        Company_Name: obj["Company_Name"] || "",
        Area: obj["Area"] || "",
        Sale_Bhata: obj["Sale_Bhata"] || 0,
        Purchase_Bhata: obj["Purchase_Bhata"] || 0,
      }));

      const updatedlistSlabBase = listSlabBase.filter((x) => x._id);
      const newlistSlabBase = listSlabBase.filter((x) => !x._id);

      const updateFinalSlabBase = getFinalFilteredArray(updatedlistSlabBase);
      const newFinalListSlabBase = getFinalFilteredArray(newlistSlabBase);

      if (updateFinalSlabBase.length > 0) {
        const result = (
          await axios.post(
            "/slabmis_bulk/slabbase_mis_bulk_update",
            updateFinalSlabBase
          )
        ).data;
        if (result) {
          alert(
            "Successfully updated " + updateFinalSlabBase.length + " documents"
          );
          inputRef.current.value = null;
          setSelectedFile(null);
          setExcelRows([]);
        }
      }
      if (newFinalListSlabBase.length > 0) {
        const result = (
          await axios.post(
            "/slabmis_bulk/slabbase_mis_bulk_insert",
            newFinalListSlabBase
          )
        ).data;
        if (result) {
          alert(
            "Successfully added " + newFinalListSlabBase.length + " documents"
          );
          inputRef.current.value = null;
          setSelectedFile(null);
          setExcelRows([]);
        }
      }
      fetchSlabBaseMisUploadData();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("uploadData error: ", error);
    }
  };

  const getFinalFilteredArray = (parentList) => {
    let finalList = parentList.map((singleSlabBaseData) => {
      if (tarrifData?.length) {
        let filterData = tarrifData.filter((item) => {
          return (
            singleSlabBaseData?.Company_Name?.toUpperCase() ==
              item?.company?.toUpperCase() &&
            singleSlabBaseData?.Vehicle_Billed_As?.toUpperCase() ==
              item?.vehicleType?.toUpperCase() &&
            singleSlabBaseData?.Rental?.toUpperCase() ==
              item?.selectedRental?.toUpperCase() &&
            singleSlabBaseData?.Segment?.toUpperCase() ==
              item?.selectedSegment?.toUpperCase() &&
            singleSlabBaseData?.Area.toUpperCase() ==
              item?.selectedArea.toUpperCase()
          );
        });

        let ActiveSlabs = [];
        for (let [key, value] of Object.entries(singleSlabBaseData)) {
          if (key.includes("Slab") && value == 1) {
            ActiveSlabs.push(key.replace("Slab", ""));
          }
        }

        let SlabFilterData = [];
        ActiveSlabs.forEach((slab) => {
          if (slab.includes("E")) {
            let emptyAddOn = filterData.filter(
              (addon) => addon.selectedAddon == "escort"
            );

            emptyAddOn = emptyAddOn?.sort(
              (a, b) =>
                Number(a?.selectedSlabfrom) - Number(b?.selectedSlabfrom)
            );

            if (emptyAddOn[Number(slab.replace(" - E", "")) - 1]) {
              SlabFilterData.push(
                emptyAddOn[Number(slab.replace(" - E", "")) - 1]
              );
            }
          }
          if (slab.includes("Single")) {
            let emptyAddOn = filterData.filter(
              (addon) => addon.selectedAddon == "single"
            );
            emptyAddOn = emptyAddOn?.sort(
              (a, b) =>
                Number(a?.selectedSlabfrom) - Number(b?.selectedSlabfrom)
            );
            if (emptyAddOn[Number(slab.replace(" - Single", "")) - 1]) {
              SlabFilterData.push(
                emptyAddOn[Number(slab.replace(" - Single", "")) - 1]
              );
            }
          }
          if (!slab.includes("E") && !slab.includes("Single")) {
            let emptyAddOn = filterData.filter(
              (addon) => addon.selectedAddon == ""
            );

            emptyAddOn = emptyAddOn?.sort(
              (a, b) =>
                Number(a?.selectedSlabfrom) - Number(b?.selectedSlabfrom)
            );

            if (emptyAddOn[Number(slab) - 1]) {
              SlabFilterData.push(emptyAddOn[Number(slab) - 1]);
            }
          }
        });

        let salesEscortBata = 0;
        let salesBata = 0;
        let salesSingleBata = 0;
        let purchaseEscortBata = 0;
        let purchaseBata = 0;
        let purchaseSingleBata = 0;
        SlabFilterData.forEach((item) => {
          if (item?.selectedAddon == "") {
            salesBata = Number(item?.salesRate ?? 0);
            purchaseBata = Number(item?.purchaseRate ?? 0);
          } else if (item?.selectedAddon == "escort") {
            salesEscortBata = Number(item?.salesRate ?? 0);
            purchaseEscortBata = Number(item?.purchaseRate ?? 0);
          } else if (item?.selectedAddon == "single") {
            salesSingleBata = Number(item?.salesRate ?? 0);
            purchaseSingleBata = Number(item?.purchaseRate ?? 0);
          }
        });
        let salesTotal = 0;
        let purchaseTotal = 0;
        SlabFilterData.forEach((item) => {
          salesTotal = Number(
            `${
              Number(item?.Bata ?? 0) +
              Number(item?.Sale_Bhata ?? 0) +
              Number(item?.["Fuel Difference"] ?? 0) +
              salesEscortBata +
              salesBata +
              salesSingleBata
            }`
          );
          purchaseTotal = Number(
            `${
              Number(item?.Bata ?? 0) +
              Number(item?.Purchase_Bhata ?? 0) +
              Number(item?.["Fuel Difference"] ?? 0) +
              purchaseEscortBata +
              purchaseBata +
              purchaseSingleBata
            }`
          );
        });

        return {
          Sales_Nett: salesTotal,
          Purchase_Nett: purchaseTotal,
          Client: selectedCompany,
          Location: selectedLocation,
          ...singleSlabBaseData,
        };
      } else {
        return singleSlabBaseData;
      }
    });

    return finalList;
  };
  const inputRef = useRef(null);
  const removeFile = (e) => {
    inputRef.current.value = null;
    setSelectedFile(null);
    setExcelRows([]);
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

  console.log(loading);
  return (
    <>
      <h1 className="text-black mt-5 mb-10 text-2xl">
        Upload Slab Base MIS Data
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

                setClLocation(updatedLocation);
                setSelectedCompany(e.target.value);
              }}
              value={selectedCompany}
              required
            >
              {clientMasterLoading ? (
                <Spin spinning={clientMasterLoading}></Spin>
              ) : (
                <>
                  <option selected>Choose a company</option>
                  {companyList.map((comapny) => (
                    <option value={comapny.value}>{comapny.text}</option>
                  ))}
                  ;
                </>
              )}
            </select>
            <select
              id="location"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-6"
              onChange={(e) => {
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
              ref={inputRef}
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
              {slabExcelUploadrequiredFields?.join(", ")}
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

export default SlabBaseMisUpload;
