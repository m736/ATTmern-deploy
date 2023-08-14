import React, { useEffect, useMemo, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { Button, Form } from "antd";
import { getTarrif } from "../action/tarrifAction";
import TarrifFormTable from "./TarrifFormTable";
import { tarrifInputField } from "./TarrifInputField";
import { useNavigate } from "react-router-dom";
import Pagination from "../Pagination/CommonPagination";

let PageSize = 10;
const ReadUpdateDeleteTarrif = () => {
  const dispatch = useDispatch();
  const { tarrifData, loading } = useSelector((state) => state.TarrifState);
  const [tarrifInput, setTarrifInput] = useState([]);
  const [editableIndex, setEditableIndex] = useState(null);
  const [editableRow, setEditableRow] = useState(null);
  const fetchVehicleListData = async () => {
    dispatch(getTarrif);
  };
  const [currentPage, setCurrentPage] = useState(1);

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return tarrifData?.slice(firstPageIndex, lastPageIndex);
  }, [currentPage]);
  useEffect(() => {
    fetchVehicleListData();
  }, []);
  useEffect(() => {
    if (tarrifData && tarrifData.length) {
      setTarrifInput(
        tarrifData.map((item, index) => {
          return {
            ...item,
            editable: false,
            position: index + 1,
            empty: "NA",
          };
        })
      );
    } else {
      setTarrifInput([]);
    }
  }, [tarrifData]);
  const navigate = useNavigate();

  const addTarrifPage = () => {
    navigate("/tarrif/new_tarrif");
  };

  console.log(currentTableData);
  return (
    <>
      {tarrifInput?.length > 0 ? (
        <>
          <div className="flex flex-col mb-14">
            <div className="-my-2 overflow-x-auto">
              <div className="py-2 align-middle inline-block min-w-full">
                <div className="shadow overflow-hidden border border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200 border-collapse">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-bold text-gray-500 border-r border-gray-200  uppercase tracking-wider"
                        >
                          Company
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-r border-gray-200"
                        >
                          VehicleType
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-bold text-gray-500 border-r border-gray-200  uppercase tracking-wider"
                        >
                          Rental
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-r border-gray-200"
                        >
                          Segment
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-r border-gray-200"
                        >
                          Area
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-r border-gray-200"
                        >
                          Slab Hours
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-r border-gray-200"
                        >
                          Slab Kms
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-r border-gray-200"
                        >
                          Slab From
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-r border-gray-200"
                        >
                          Slab To
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-r border-gray-200"
                        >
                          Add On
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-r border-gray-200"
                        >
                          Sales Rate
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-r border-gray-200"
                        >
                          Purchase Rate
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-r border-gray-200"
                        >
                          Sales Ex Kms Rate
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-r border-gray-200"
                        >
                          Purchase Ex Kms Rate
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-r border-gray-200"
                        >
                          Sales Ex Hrs Rate
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-r border-gray-200"
                        >
                          Purchase Ex Hrs Rate
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-r border-gray-200"
                        >
                          Sales Grace Time
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-r border-gray-200"
                        >
                          Purchase Grace Time
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-r border-gray-200"
                        >
                          Driver Bata
                        </th>

                        <th
                          scope="col"
                          className="px-4 py-3 text-center text-xs  text-blue-500 font-bold uppercase tracking-wider border-r border-gray-200"
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentTableData?.map((item, index) => {
                        return (
                          <TarrifFormTable
                            screenEdit={"edit"}
                            key={index}
                            name={index}
                            editableIndex={editableIndex}
                            setEditableIndex={setEditableIndex}
                            tarrifInput={tarrifInput}
                            tarrif={item}
                            setTarrifInput={setTarrifInput}
                            index={index}
                            tarrifInputField={tarrifInputField}
                            editableRow={editableRow}
                            setEditableRow={setEditableRow}
                          />
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <Pagination
            className="pagination-bar"
            currentPage={currentPage}
            totalCount={tarrifInput?.length}
            pageSize={PageSize}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </>
      ) : (
        <>
          <h1 className="text-black text-center uppercase font-bold">
            No Data
          </h1>
          <div class="flex items-center justify-center">
            <Button
              onClick={addTarrifPage}
              className="bg-green-700  hover:bg-green-400  border-green-700 hover:border-green-500 text-white"
            >
              Add
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default ReadUpdateDeleteTarrif;
