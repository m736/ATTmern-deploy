import React, { useEffect, useRef, useState } from "react";
import { read, utils } from "xlsx";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Spin, message } from "antd";
import { getSiteSlabBaseMisAction } from "../action/SiteMisAction";
import { getClientMasterAction } from "../action/clientMasterAction";

const SiteSlabBaseMisUpload = () => {
  const [fileLoading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [companyList, setCompanyList] = useState([]);
  const [excelRows, setExcelRows] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [clLocation, setClLocation] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState([]);
  const dispatch = useDispatch();
  const { site_slab_base_mis_uploadlist, error } = useSelector(
    (state) => state.SiteSlabBaseState || []
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
        const vehicleNumberValidation = json.filter(
          (row) => !/^[0-9]/i.test(row.Vehicle_No)
        );
        console.log(vehicleNumberValidation);
        if (vehicleNumberValidation.length > 0) {
          alert("some vehicle number started as alphabet please check");
          inputRef.current.value = null;
          setSelectedFile(null);
          setExcelRows([]);
        } else {
          setExcelRows(json);
        }

        setLoading(false);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const fetchSiteSlabBaseMisUploadData = async () => {
    dispatch(getSiteSlabBaseMisAction);
  };
  useEffect(() => {
    fetchSiteSlabBaseMisUploadData();
    dispatch(getClientMasterAction);
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

    const sameCompany = [];

    const differentCompany = [];

    excelRows.forEach((row) => {
      if (row.Company_Name == selectedCompany) {
        sameCompany.push(row);
      } else {
        differentCompany.push(row);
      }
    });
    try {
      if (selectedCompany == "") {
        alert("please select company name ");
      } else if (differentCompany.length) {
        setLoading(false);
        alert("different company records found");
      } else if (sameCompany.length) {
        setLoading(true);
        // const firstItemKeys = excelRows[0] && Object.keys(excelRows[0]);
        // let requiredValidation = false;
        // if (firstItemKeys?.length) {
        //   slabExcelUploadrequiredFields.forEach((element) => {
        //     if (!firstItemKeys.find((x) => x === element)) {
        //       requiredValidation = true;
        //     }
        //   });
        // }
        // if (requiredValidation) {
        //   alert(
        //     "Required fields " + JSON.stringify(slabExcelUploadrequiredFields)
        //   );
        //   setLoading(false);
        //   return;
        // }
        const siteSlabBaseMisUploadList = site_slab_base_mis_uploadlist || [];
        const listSlabBase = sameCompany.map((obj) => ({
          Date: obj["Date"] || "",
          // date: moment(new Date(obj["date"]).format("YYYY-MM-DD")) || "",
          Dutyslip_No: obj["Dutyslip_No"] || "",
          Vehicle_No: obj["Vehicle_No"] || "",
          Vehicle_Type: obj["Vehicle_Type"] || "",
          Vehicle_Billed_As: obj["Vehicle_Billed_As"] || "",
          Segment: obj["Segment"] || "",
          Time: obj["Time"] || "",
          P_D: obj["P_D"] || "",
          Total_Kms: obj["Total_Kms"] || 0,
          Trip_Type: obj["Trip_Type"] || "",
          Rental: obj["Slab_Rental"] || "-",
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
          Client: selectedCompany,
          Location: selectedLocation,
        }));
        console.log(listSlabBase);
        // const updatedlistSlabBase = listSlabBase.filter((x) => x._id);
        // const newlistSlabBase = listSlabBase.filter((x) => !x._id);

        if (listSlabBase.length > 0) {
          const result = (
            await axios.post(
              "/api/v1/site_mis/site_slabbase_mis_bulk_insert",
              listSlabBase
            )
          ).data;
          if (result) {
            alert(
              "Successfully inserted " + listSlabBase.length + " documents"
            );
            inputRef.current.value = null;
            setSelectedFile(null);
            setExcelRows([]);
          }
        } else {
          alert("no data found");
        }
        // if (newlistSlabBase.length > 0) {
        //   const result = (
        //     await axios.post(
        //       "/api/v1/site_mis/site_slabbase_mis_bulk_insert",
        //       newlistSlabBase
        //     )
        //   ).data;
        //   if (result) {
        //     alert(
        //       "Successfully added " + newlistSlabBase.length + " documents"
        //     );
        //     inputRef.current.value = null;
        //     setSelectedFile(null);
        //     setExcelRows([]);
        //   }
        // }
        fetchSiteSlabBaseMisUploadData();
        setLoading(false);
      } else {
        setLoading(false);
        alert("no records found");
      }
    } catch (err) {
      setLoading(false);
      alert(err?.response?.data?.message);
    }
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
            {/* <div className="text-sm pt-5">
              {" "}
              {"NOTE: The headers in the Excel file should be as follows!. => "}
              {/* {slabExcelUploadrequiredFields?.join(", ")}
            </div> */}
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
              ) : (
                <button className="bg-red-500 hover:bg-red-900 text-white py-3 px-4 rounded">
                  No Data
                </button>
              )}{" "}
            </div>
          </div>
        </div>
      </form>
    </>
  );
};
export default SiteSlabBaseMisUpload;
