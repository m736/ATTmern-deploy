import React, { useEffect, useState } from "react";
import TarrifForm from "./TarrifForm";
import { Button, Card, Space, Spin, Row, Col, Select, Form } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { createTarrif } from "../action/tarrifAction";
import { useNavigate } from "react-router-dom";
import { clearCreateTarrif, clearTarrifError } from "../slices/TarrifSlice";
import { toast } from "react-toastify";
export const tarrifInputField = {
  rental: [
    { value: "slab", text: "Slab" },
    { value: "outstation", text: "Out Station" },
    { value: "flat_rate", text: "Flat Rate" },
  ],
  companies: [
    { value: "c1", text: "c1" },
    { value: "c2", text: "c2" },
    { value: "c3", text: "c3" },
  ],
  vehicleTypes: [
    { value: "v1", text: "v1" },
    { value: "v2", text: "v2" },
    { value: "v3", text: "v3" },
  ],
  selectedRental: "slab",
  segment: [
    { value: "ac", text: "Ac" },
    { value: "nonac", text: "Non/Ac" },
  ],
  selectedSegment: "",
  area: [
    { value: "red", text: "Red" },
    { value: "yellow", text: "Yellow" },
    { value: "blue", text: "Blue" },
  ],
  selectedArea: "",
  slabhrs: [
    { value: "4hrs", text: "4 Hours" },
    { value: "5hrs", text: "4 Hours" },
    { value: "6hrs", text: "4 Hours" },
  ],
  selectedSlabhrs: "",
  slabkms: [
    { value: "10kms", text: "10Kms" },
    { value: "20kms", text: "20Kms" },
    { value: "30kms", text: "30Kms" },
  ],
  selectedSlabkms: "",
  slabfrom: [
    { value: 1, text: 1 },
    { value: 2, text: 2 },
    { value: 3, text: 4 },
  ],
  selectedSlabfrom: "",
  slabto: [
    { value: 50, text: 50 },
    { value: 60, text: 60 },
    { value: 70, text: 70 },
  ],
  selectedSlabto: "",
  addon: [
    { value: "single", text: "Single" },
    { value: "escort", text: "Escort" },
  ],
  selectedAddon: "",
  salesRate: null,
  selectedSalesRate: "",
  purchaseRate: null,
  selectedPurchaseRate: "",
  salesExKmsRate: null,
  selectedSalesExKmsRate: "",
  salesExHrsRate: null,
  selectedSalesExHrsRate: "",
  purchaseExHrsRate: null,
  selectedPurchaseExHrsRate: "",
  purchaseExKmsRate: null,
  selectedPurchaseExKmsRate: "",
  purchaseGraceTime: null,
  selectedPurchaseGraceTime: "",
  driverbata: null,
  selectedDriverbata: "",
  position: 1,
};

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
  const AddTarrifInput = () => {
    let newItem = {
      ...tarrifInputField,
      position: tarrifInput[tarrifInput.length - 1]?.position + 1,
      company: company,
      vehicleType: vehicleType,
    };

    setTarrifInput([...tarrifInput, newItem]);
  };

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
              <Select
                placeholder="Select a option and change input text above"
                onChange={companyChange}
              >
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
                placeholder="Select a option and change input text above"
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

      <Card scroll={{ x: 2000 }}>
        {tarrifInput?.map((item, index) => {
          return (
            <TarrifForm
              name={index}
              tarrifInput={tarrifInput}
              company={company}
              vehicleType={vehicleType}
              tarrif={item}
              setTarrifInput={setTarrifInput}
              index={index}
              tarrifInputField={tarrifInputField}
            />
          );
        })}
        <Space>
          <Button className="mt-3" onClick={AddTarrifInput}>
            Add
          </Button>
          <Button
            type="primary"
            className="mt-3"
            onClick={formDetails}
            disabled={loading ? <Spin /> : null}
          >
            Submit
          </Button>
        </Space>
      </Card>
    </>
  );
};
