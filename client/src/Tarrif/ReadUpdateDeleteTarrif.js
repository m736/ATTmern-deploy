import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { Form } from "antd";
import { getTarrif } from "../action/tarrifAction";
import TarrifFormTable from "./TarrifFormTable";
import { tarrifInputField } from "./TarrifInputField";

const ReadUpdateDeleteTarrif = () => {
  const dispatch = useDispatch();
  const { tarrifData, loading } = useSelector((state) => state.TarrifState);
  const [tarrifInput, setTarrifInput] = useState([]);
  const [editableIndex, setEditableIndex] = useState(null);
  const [editableRow, setEditableRow] = useState(null);
  const fetchVehicleListData = async () => {
    dispatch(getTarrif);
  };

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
            empty: "empty",
          };
        })
      );
    } else {
      setTarrifInput([]);
    }
  }, [tarrifData]);
  return (
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
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 border-r border-gray-200  uppercase tracking-wider"
                    >
                      Rental
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200"
                    >
                      Segment
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200"
                    >
                      Area
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200"
                    >
                      Slab Hours
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200"
                    >
                      Slab Kms
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200"
                    >
                      Slab From
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200"
                    >
                      Slab To
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200"
                    >
                      Add On
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200"
                    >
                      Sales Rate
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200"
                    >
                      Purchase Rate
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200"
                    >
                      Sales Ex Kms Rate
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200"
                    >
                      Purchase Ex Kms Rate
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200"
                    >
                      Sales Ex Hrs Rate
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200"
                    >
                      Purchase Ex Hrs Rate
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200"
                    >
                      Sales Grace Time
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200"
                    >
                      Purchase Grace Time
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200"
                    >
                      Driver Bata
                    </th>

                    <th scope="col" className="relative px-4 py-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tarrifInput?.map((item, index) => {
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
    </>
  );
};

export default ReadUpdateDeleteTarrif;
