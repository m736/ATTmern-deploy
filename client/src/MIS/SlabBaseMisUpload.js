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
  const { alltarrifData } = useSelector((state) => state.TarrifState || []);
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
  // console.log(alltarrifData);
  const fetchSlabBaseMisUploadData = async () => {
    dispatch(getSlabBaseMisData);
  };
  useEffect(() => {
    dispatch(getTarrif());
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
        // date: moment(new Date(obj["date"]).format("YYYY-MM-DD")) || "",
        "Trip ID": obj["Trip ID"] || "",
        "Vehicle No": obj["Vehicle No"] || "",
        "Vehicle TYPE": obj["Vehicle TYPE"] || "",
        "Vehicle Billed as": obj["Vehicle Billed as"] || "",
        Segment: obj["Segment"] || "",
        "Tot Kms": obj["Tot Kms"] || 0,
        "Trip Type": obj["Trip Type"] || "",
        "Duty Type": obj["Duty Type"] || "",
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
        "Fuel Difference": obj["Fuel Difference"] || 0,
        Company: obj["Company"] || "",
        Area: obj["Area"] || "",
        Sale_Bhata: obj["Sale_Bhata"] || 0,
        Purchase_Bhata: obj["Purchase_Bhata"] || 0,
      }));

      const updatedlistSlabBase = listSlabBase.filter((x) => x._id);
      const newlistSlabBase = listSlabBase.filter((x) => !x._id);

      const updateFinalSlabBase = getFinalFilteredArray(updatedlistSlabBase);
      const newFinalListSlabBase = getFinalFilteredArray(newlistSlabBase);
      if (updateFinalSlabBase.length) {
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
        }
      }
      if (newFinalListSlabBase.length) {
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
      if (alltarrifData?.length) {
        let filterData = alltarrifData.filter((item) => {
          return (
            singleSlabBaseData?.Company?.toUpperCase() ==
              item?.company?.toUpperCase() &&
            singleSlabBaseData?.["Vehicle Billed as"]?.toUpperCase() ==
              item?.vehicleType?.toUpperCase() &&
            singleSlabBaseData?.["Duty Type"]?.toUpperCase() ==
              item?.selectedRental?.toUpperCase() &&
            singleSlabBaseData?.Segment?.toUpperCase() ==
              item?.selectedSegment?.toUpperCase() &&
            singleSlabBaseData?.Area.toUpperCase() ==
              item?.selectedArea.toUpperCase()
          );
        });
        // console.log(filterData);
        let ActiveSlabs = [];
        for (let [key, value] of Object.entries(singleSlabBaseData)) {
          if (key.includes("Slab") && value == 1) {
            ActiveSlabs.push(key.replace("Slab", ""));
          }
        }
        // console.log(ActiveSlabs);
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
            // console.log(emptyAddOn);
            if (emptyAddOn[Number(slab) - 1]) {
              SlabFilterData.push(emptyAddOn[Number(slab) - 1]);
            }
          }
        });
        // console.log(SlabFilterData);
        let salesEscortBata = 0;
        let salesBata = 0;
        let salesSingleBata = 0;
        let purchaseEscortBata = 0;
        let purchaseBata = 0;
        let purchaseSingleBata = 0;
        SlabFilterData.forEach((item) => {
          // console.log(item);
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
          salesBata: salesBata,
          salesEscortBata: salesEscortBata,
          salesSingleBata: salesSingleBata,
          salesTotal: salesTotal,
          purchaseTotal: purchaseTotal,
          ...singleSlabBaseData,
        };
      } else {
        return singleSlabBaseData;
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
              {slabExcelUploadrequiredFields.join(", ")}
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

export default SlabBaseMisUpload;
