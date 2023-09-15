import React, { useEffect, useMemo, useState } from "react";
import { Button, Space, Spin, Row, Col, Select, Form } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Pagination } from "antd";
import {
  getTarrif,
  searchTarrifAction,
  uniqueTarrifDataAction,
} from "../action/tarrifAction";
import TarrifFormTable from "./TarrifFormTable";
import { tarrifInputField } from "./TarrifInputField";
import { useNavigate } from "react-router-dom";
import {
  searchTarrifDataFail,
  searchTarrifDataRequest,
  searchTarrifDataSuccess,
} from "../slices/TarrifSlice";
import axios from "axios";
import { getClientMasterAction } from "../action/clientMasterAction";
import { toast } from "react-toastify";
import {
  clearTarrifDeleted,
  clearTarrifError,
  clearUpdateTarrifListCreated,
} from "../slices/TarrifSlice";

const ReadUpdateDeleteTarrif = () => {
  const dispatch = useDispatch();
  const [tarrifInput, setTarrifInput] = useState([]);
  const [editableIndex, setEditableIndex] = useState(null);
  const [editableRow, setEditableRow] = useState(null);
  // const [tarrifDataCompany, setTarrifDataSelectedcompany] = useState([]);
  const [clientList, setClientList] = useState([]);
  const [vehicleList, setvehicleList] = useState([]);
  const [rentalList, setRentalList] = useState([]);
  const [acType, setAcType] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [selectedRental, setSelectedRental] = useState("");
  const [selectedSegment, setSelectedSegment] = useState("");
  const { Option } = Select;
  const {
    tarrifData,
    page_count,
    resPerPage,
    alltarrifData,
    isTarrifDeleted,
    isTarrifUpdated,
    error,
  } = useSelector((state) => state.TarrifState);
  const [pageCount, setPageCount] = useState(10);
  const [perPage, setResPerPage] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);
  const setCurrentPageNo = (pageNo) => {
    setCurrentPage(pageNo);
  };

  useEffect(() => {
    dispatch(getTarrif(currentPage));
  }, [currentPage]);

  useEffect(() => {
    setPageCount(page_count);
  }, [page_count]);
  useEffect(() => {
    setResPerPage(resPerPage);
  }, [resPerPage]);

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
  // useEffect(() => {
  //   if (alltarrifData && alltarrifData.length) {
  //     let updatedClient = alltarrifData.map((item) => item.company);
  //     setClientList([...new Set(updatedClient)]);
  //   }
  // }, [alltarrifData]);
  // const searchTarrifData = async (item) => {
  //   // setTarrifInput(updated);
  //   const formData = new FormData();
  //   formData.append("company", selectedCompany);
  //   formData.append("vehicleType", selectedVehicle);
  //   formData.append("selectedRental", selectedRental);
  //   formData.append("selectedSegment", selectedSegment);
  //   try {
  //     dispatch(searchTarrifDataRequest());
  //     const { data } = await axios.post(
  //       `/tarrif/tarrif_search_company_name`,
  //       formData
  //     );

  //     // dispatch(searchTarrifDataSuccess(data));
  //     setTarrifInput(
  //       data?.getTarrrifDetails?.length ? data?.getTarrrifDetails : []
  //     );
  //     setPageCount(data?.count);
  //     setResPerPage(data?.resPerPage);
  //     setCurrentPage(1);
  //     setSelectedCompany(null);
  //     setSelectedVehicle(null);
  //     setSelectedRental(null);
  //     setSelectedSegment(null);
  //   } catch (error) {
  //     //handle error
  //     dispatch(searchTarrifDataFail(error.response.data.message));
  //   }
  // };
  useEffect(() => {
    if (isTarrifDeleted) {
      toast("Tarrif Deleted Succesfully!", {
        type: "success",
        position: toast.POSITION.BOTTOM_CENTER,
        onOpen: () => dispatch(clearTarrifDeleted()),
      });

      return;
    }

    if (error) {
      toast(error, {
        position: toast.POSITION.BOTTOM_CENTER,
        type: "error",
        onOpen: () => {
          dispatch(clearTarrifError());
        },
      });
      return;
    }
  }, [isTarrifDeleted, error, dispatch]);
  useEffect(() => {
    if (isTarrifUpdated) {
      toast("Tarrif updated Succesfully!", {
        type: "success",
        position: toast.POSITION.BOTTOM_CENTER,
        onOpen: () => dispatch(clearUpdateTarrifListCreated()),
      });

      return;
    }

    if (error) {
      toast(error, {
        position: toast.POSITION.BOTTOM_CENTER,
        type: "error",
        onOpen: () => {
          dispatch(clearTarrifError());
        },
      });
      return;
    }
  }, [isTarrifUpdated, error, dispatch]);

  return (
    <>
      {/* <Row className="mb-5" gutter={[16, 24]}>
        <Col className="gutter-row" span={4}>
          <Select
            placeholder="Select Company"
            style={{
              width: 120,
            }}
            onChange={(e) => {
              let updated = alltarrifData.filter((item) => e == item.company);
              let updatedVehicle = updated.map((item) => item.vehicleType);
              setvehicleList([...new Set(updatedVehicle)]);
              setSelectedCompany(e);
              setSelectedVehicle(null);
              setSelectedRental(null);
              setSelectedSegment(null);
            }}
            value={selectedCompany}
          >
            {clientList.map((item) => {
              return (
                <Option key={item} value={item}>
                  {item}
                </Option>
              );
            })}
          </Select>
        </Col>
        <Col className="gutter-row" span={4}>
          <Select
            className="uppercase"
            style={{
              width: 120,
            }}
            onChange={(e) => {
              let updated = alltarrifData.filter(
                (item) =>
                  e == item?.vehicleType && selectedCompany == item?.company
              );
              let updatedRental = updated.map((item) => item?.selectedRental);
              setRentalList([...new Set(updatedRental)]);
              setSelectedVehicle(e);
              setSelectedRental(null);
              setSelectedSegment(null);
            }}
            value={selectedVehicle}
          >
            {vehicleList.map((item) => {
              return (
                <Option key={item} value={item}>
                  {item}
                </Option>
              );
            })}
          </Select>
        </Col>
        <Col className="gutter-row" span={4}>
          <Select
            className="uppercase"
            style={{
              width: 120,
            }}
            onChange={(e) => {
              let updated = alltarrifData.filter(
                (item) =>
                  e == item.selectedRental &&
                  selectedVehicle == item.vehicleType
              );
              let updatedAcType = updated.map((item) => item.selectedSegment);
              setAcType([...new Set(updatedAcType)]);
              setSelectedRental(e);
              setSelectedSegment(null);
            }}
            value={selectedRental}
          >
            {rentalList.map((item) => {
              return (
                <Option key={item} value={item} className="uppercase">
                  {item}
                </Option>
              );
            })}
          </Select>
        </Col>
        <Col className="gutter-row" span={4}>
          <Select
            className="uppercase"
            style={{
              width: 120,
            }}
            onChange={(e) => {
              setSelectedSegment(e);
            }}
            value={selectedSegment}
          >
            {acType.map((item) => {
              return (
                <Option key={item} value={item} className="uppercase">
                  {item}
                </Option>
              );
            })}
          </Select>
        </Col>
        <Col className="gutter-row" span={4}>
          <Button type="primary" onClick={searchTarrifData}>
            Search
          </Button>
        </Col>
      </Row> */}

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
          {pageCount > 0 && pageCount > perPage ? (
            <div className="flex justify-center">
              <Pagination
                // current={currentPage}
                onChange={setCurrentPageNo}
                total={pageCount}
                pageSize={perPage}
              />
            </div>
          ) : null}
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
