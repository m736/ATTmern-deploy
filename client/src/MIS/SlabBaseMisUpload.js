import React, { useEffect, useState } from "react";
import { read, utils } from "xlsx";
import { slabExcelUploadrequiredFields } from "../Tarrif/TarrifInputField";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { getTarrif } from "../action/tarrifAction";
import { getSlabBaseMisData } from "../action/slabBasMisAction";
const SlabBaseMisUpload = () => {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [excelRows, setExcelRows] = useState([]);
  const dispatch = useDispatch();
  const { slab_base_mis_uploadlist } = useSelector(
    (state) => state.SlabBaseMisState || []
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
          raw: false,
        });

        setLoading(false);
        setExcelRows(json);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const fetchSlabBaseMisUploadData = async () => {
    dispatch(getSlabBaseMisData);
  };
  useEffect(() => {
    dispatch(getTarrif);
    fetchSlabBaseMisUploadData();
  }, []);
  const uploadData = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const firstItemKeys = excelRows[0] && Object.keys(excelRows[0]);
      let requiredValidation = false;
      if (firstItemKeys.length) {
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
        _id: slabBaseMisUploadList?.find((x) => x["Trip ID"] === obj["Trip ID"])
          ?._id,

        date: obj["date"] || "",
        "Trip ID": obj["Trip ID"] || "",
        "Vehicle No": obj["Vehicle No"] || "",
        "Vehicle TYPE": obj["Vehicle TYPE"] || "",
        "Vehicle Billed as": obj["Vehicle Billed as"] || "",
        Segment: obj["Segment"] || "",
        "Tot Kms": obj["Tot Kms"] || 0,
        "Trip Type": obj["Trip Type"] || "",
        "Duty Type": obj["Duty Type"] || "",
        Slab1: obj["Slab1"] || "",
        Slab2: obj["Slab2"] || "",
        Slab3: obj["Slab3"] || "",
        Slab4: obj["Slab4"] || "",
        Slab5: obj["Slab5"] || "",
        "Slab1 - E": obj["Slab1 - E"] || "",
        "Slab2 - E": obj["Slab2 - E"] || "",
        "Slab3 - E": obj["Slab3 - E"] || "",
        "Slab4 - E": obj["Slab4 - E"] || "",
        "Slab5 - E": obj["Slab5 - E"] || "",
        "Slab1 - Single": obj["Slab1 - Single"] || "",
        "Slab2 - Single": obj["Slab2 - Single"] || "",
        "Slab3 - Single": obj["Slab3 - Single"] || "",
        "Slab4 - Single": obj["Slab4 - Single"] || "",
        "Slab5 - Single": obj["Slab5 - Single"] || "",
        Bata: obj["Bata"] || 0,
        "Fuel Difference": obj["Fuel Difference"] || 0,
        Company: obj["Company"] || "",
        AREA: obj["AREA"] || "",
        "sale Bhata": obj["sale Bhata"] || 0,
        "Purchase Bhata": obj["Purchase Bhata"] || 0,
      }));

      const updatedlistSlabBase = listSlabBase.filter((x) => x._id);
      const newlistSlabBase = listSlabBase.filter((x) => !x._id);
      console.log(
        updatedlistSlabBase,
        getFinalFilteredArray(updatedlistSlabBase)
      );
      console.log(newlistSlabBase, getFinalFilteredArray(newlistSlabBase));
      // const updateFinalSlabBase = getFinalFilteredArray(updatedlistSlabBase);
      // const newFinalListSlabBase = getFinalFilteredArray(newlistSlabBase);

      // fetchSlabBaseMisUploadData();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("uploadData error: ", error);
    }
  };

  const getFinalFilteredArray = (parentList) => {
    let finalList = parentList.map((singleOnCallData) => {
      console.log(singleOnCallData);
      console.log(singleOnCallData?.["Vehicle Billed as"]);
      if (tarrifData?.length) {
        let filterData = tarrifData.filter((item) => {
          return (
            singleOnCallData?.Company == item?.company &&
            singleOnCallData?.["Vehicle Billed as"] == item?.vehicleType &&
            singleOnCallData?.["Duty Type"] == item?.selectedRental &&
            singleOnCallData?.Segment == item?.selectedSegment
          );
        });
        console.log(filterData);
        let ActiveSlabs = [];
        for (let [key, value] of Object.entries(singleOnCallData)) {
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
            if (emptyAddOn[Number(slab) - 1]) {
              SlabFilterData.push(emptyAddOn[Number(slab) - 1]);
            }
          }
        });
        let escortBata;
        let salesBata;
        let singleBata;
        const newMethod = SlabFilterData.map((item) => {
          if (item.selectedAddon == "") {
            return (salesBata = item?.salesRate ?? 0);
          } else if (item.selectedAddon == "escort") {
            return (escortBata = item?.salesRate ?? 0);
          } else if (item.selectedAddon == "single") {
            return (singleBata = item?.salesRate ?? 0);
          }
        });

        console.log({
          salesBata: salesBata,
          escortBata: escortBata,
          singleBata: singleBata,
          ...singleOnCallData,
        });
      } else {
        return singleOnCallData;
      }
    });
    return finalList;
  };
  // const removeFile = () => {
  //   setSelectedFile(null);
  //   setExcelRows([]);
  //   window.location.reload();
  // };
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
              {slabExcelUploadrequiredFields.join(", ")}
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
              {/* {selectedFile?.name && excelRows.length ? (
                <button
                  class="bg-red-500 hover:bg-red-900 text-white py-3 px-4 ml-3 rounded"
                  disabled={loading}
                  onClick={removeFile}
                >
                  Remove
                </button>
              ) : null} */}
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default SlabBaseMisUpload;
