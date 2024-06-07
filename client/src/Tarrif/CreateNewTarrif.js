import React, { useEffect, useState } from "react";
import { tarrifInputField } from "./TarrifInputField";
import { Button, Space, Spin, Row, Col, Select, Form, Typography } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { createTarrif } from "../action/tarrifAction";
import { useNavigate } from "react-router-dom";
import { clearCreateTarrif, clearTarrifError } from "../slices/TarrifSlice";
import { toast } from "react-toastify";
import TarrifFormTable from "./TarrifFormTable";
import { getAreaListAction } from "../action/AreaListAction";
import { getVehicleTypeAction } from "../action/vehicleTypeAction";
import { getClientMasterAction } from "../action/clientMasterAction";

export const CreateNewTarrif = () => {
  const [tarrifInfield, setTarrifInputField] = useState(tarrifInputField);
  const [tarrifInput, setTarrifInput] = useState([]);
  const [allarea, setAllArea] = useState([]);
  const [company, setCompany] = useState(null);
  const [companyArr, setCompanyArr] = useState([]);
  const [vehicleArr, setVehicleArr] = useState([]);
  const [areaArr, setAreaArr] = useState([]);
  const [vehicleType, setVehicleType] = useState(null);
  const { Option } = Select;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { area_list } = useSelector((state) => state.AreaListState || []);
  const { vehicle_types } = useSelector(
    (state) => state.VehicleTypeState || []
  );
  const { client_master_detail } = useSelector(
    (state) => state.ClientMasterState || []
  );
  const { loading, isTarrifCreated, error } = useSelector(
    (state) => state.TarrifState
  );
  useEffect(() => {
    dispatch(getClientMasterAction);
    dispatch(getVehicleTypeAction);
    dispatch(getAreaListAction);
  }, []);
  useEffect(() => {
    if (client_master_detail && client_master_detail.length > 0) {
      let companyList = client_master_detail.map((item) => {
        return {
          text: item.Company_Name,
          value: item.Company_Name,
        };
      });
      setCompanyArr(removeDuplicateObjects(companyList, "value"));
    }
    if (vehicle_types && vehicle_types.length > 0) {
      setVehicleArr(removeDuplicateObjects(vehicle_types, "value"));
    }
    if (area_list && area_list.length > 0) {
      setAreaArr(removeDuplicateObjects(area_list, "value"));
    }
  }, [client_master_detail, vehicle_types, area_list]);

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
  useEffect(() => {
    setTarrifInputField({
      ...tarrifInputField,
      vehicleTypes: vehicleArr,
      companies: companyArr,
      areas: areaArr,
    });
  }, [companyArr, vehicleArr, areaArr]);
  useEffect(() => {
    setTarrifInput([tarrifInfield]);
  }, [tarrifInfield]);
  const companyChange = (e) => {
    setCompany(e);
    let updated = tarrifInput.map((item) => {
      return { ...item, company: e };
    });
    setTarrifInput(updated);
  };
  const vehicleChange = (e) => {
    setVehicleType(e);
    let updated = tarrifInput.map((item) => {
      return { ...item, vehicleType: e };
    });
    setTarrifInput(updated);
  };

  const formDetails = () => {
    console.log(tarrifInput);
    dispatch(createTarrif(tarrifInput));
  };
  useEffect(() => {
    if (isTarrifCreated) {
      toast("New Tarrif Created Succesfully!", {
        type: "success",
        position: toast.POSITION.BOTTOM_CENTER,
        onOpen: () => dispatch(clearCreateTarrif()),
      });
      navigate("/tarrif/tarrif_list");
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
  }, [isTarrifCreated, error, dispatch]);
  const { Title } = Typography;
  return (
    <>
      <Title
        className="text-center py-3 text-bold uppercase underline"
        level={4}
      >
        Create Tarrif
      </Title>
      <Form>
        <Row gutter={[16, 24]}>
          <Col className="gutter-row" span={4}>
            <Form.Item name="company">
              <Select
                placeholder="Select Company"
                onChange={companyChange}
                allowClear
                showSearch
              >
                {tarrifInfield?.companies?.map((item) => {
                  return (
                    <Option key={item.value} value={item.value}>
                      {item.text}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={4}>
            <Form.Item name="vehicleType">
              <Select
                placeholder="Select vehicleType"
                onChange={vehicleChange}
                allowClear
                showSearch
              >
                {tarrifInfield?.vehicleTypes?.map((item) => {
                  return (
                    <Option key={item.value} value={item.value}>
                      {item.text}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <div className="flex flex-col">
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
                      className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider border-r border-gray-200"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tarrifInput?.length > 0 &&
                    tarrifInput?.map((item, index) => {
                      return (
                        <TarrifFormTable
                          key={index}
                          screenAdd={"add"}
                          name={index}
                          company={company}
                          vehicleType={vehicleType}
                          tarrifInput={tarrifInput}
                          tarrif={item}
                          setTarrifInput={setTarrifInput}
                          index={index}
                          tarrifInputField={tarrifInfield}
                        />
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Space>
        <Button className="mt-3" onClick={formDetails}>
          Submit
        </Button>
      </Space>
    </>
  );
};
