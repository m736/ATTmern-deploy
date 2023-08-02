import React, { useEffect, useState } from "react";
import { tarrifInputField } from "./TarrifInputField";
import { Button, Card, Space, Spin, Row, Col, Select, Form } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { createTarrif } from "../action/tarrifAction";
import { useNavigate } from "react-router-dom";
import { clearCreateTarrif, clearTarrifError } from "../slices/TarrifSlice";
import { toast } from "react-toastify";
import TarrifFormTable from "./TarrifFormTable";

export const CreateNewTarrif = () => {
  const [tarrifInput, setTarrifInput] = useState([tarrifInputField]);

  const [company, setCompany] = useState(null);
  const [vehicleType, setVehicleType] = useState(null);
  const { Option } = Select;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, isTarrifCreated, error } = useSelector(
    (state) => state.TarrifState
  );

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
    setTarrifInput(tarrifInput);
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
  return (
    <>
      <Form>
        <Row gutter={[16, 24]}>
          <Col className="gutter-row" span={4}>
            <Form.Item name="company">
              <Select placeholder="Select Company" onChange={companyChange}>
                {tarrifInputField?.companies?.map((item) => {
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
              >
                {tarrifInputField?.vehicleTypes?.map((item) => {
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
                  {tarrifInput?.map((item, index) => {
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
                        tarrifInputField={tarrifInputField}
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
        <Button
          type="primary"
          className="mt-3"
          onClick={formDetails}
          disabled={loading ? <Spin /> : null}
        >
          Submit
        </Button>
      </Space>
    </>
  );
};
