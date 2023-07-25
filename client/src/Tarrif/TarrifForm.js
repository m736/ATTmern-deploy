import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, Card, Row, Col, Divider } from "antd";
import { TarrifTable } from "./TarrifTable";
import { NumericInput } from "./TarrifNumericInput";

const TarrifForm = (props) => {
  const {
    tarrif,
    setTarrifInput,
    tarrifInput,
    index,
    tarrifInputField,
    company,
    vehicleType,
  } = props;
  const [form] = Form.useForm();

  const { Option } = Select;
  const EnableTarrifRentalInput = {
    slab: [
      "segment",
      "area",
      "slabfrom",
      "slabto",
      "addon",
      "salesRate",
      "purchaseRate",
    ],
    outstation: ["segment", "slabhrs", "slabkms", "addon"],
    flat_rate: ["addon", "purchaseRate"],
  };
  const [enableinput, setEnableInput] = useState([]);
  useEffect(() => {
    if (tarrif?.selectedRental) {
      setEnableInput(EnableTarrifRentalInput[tarrif?.selectedRental]);
    }
  }, [tarrif]);

  const RentalChange = (value) => {
    form.resetFields();
    valueHandle("selectedRental", value);
  };

  const valueHandle = (field, value) => {
    let activeIndex = tarrifInput.findIndex(
      (item) => item.position == tarrif.position
    );

    if (activeIndex > -1) {
      let updated = [];
      if (field == "selectedRental") {
        updated = tarrifInput?.map((item, index) => {
          if (index == activeIndex) {
            return {
              ...tarrifInputField,
              position: item.position,
              company: company,
              vehicleType: vehicleType,
              [field]: value,
            };
          } else {
            return item;
          }
        });
      } else {
        updated = tarrifInput?.map((item, index) => {
          if (index == activeIndex) {
            return {
              ...item,
              [field]: value,
            };
          } else {
            return item;
          }
        });
      }
      setTarrifInput(updated);
    }
  };

  const RemoveTarrifInput = () => {
    let activeIndex = tarrifInput.findIndex(
      (item) => item.position == tarrif.position
    );
    if (activeIndex > -1) {
      let updated = tarrifInput.filter((i, index) => index !== activeIndex);
      setTarrifInput(updated);
    }
  };

  return (
    <>
      <Form form={form} name={`tarrifform-${index}`}>
        <Row gutter={[16, 24]}>
          <Col className="gutter-row" span={4}>
            <Form.Item name="rental">
              <Select
                defaultValue={tarrif?.selectedRental}
                value={tarrif?.selectedRental}
                placeholder="Select Rental"
                onChange={RentalChange}
              >
                {tarrif?.rental?.map((item) => {
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
            <Form.Item name="segment">
              <Select
                disabled={!enableinput.includes("segment")}
                onChange={(value) => {
                  valueHandle("selectedSegment", value);
                }}
              >
                {tarrif?.segment?.map((item) => {
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
            <Form.Item name="area">
              <Select
                placeholder="Select Area"
                disabled={!enableinput.includes("area")}
                onChange={(value) => {
                  valueHandle("selectedArea", value);
                }}
              >
                {tarrif?.area?.map((item) => {
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
            <Form.Item name="slabhrs">
              <Select
                placeholder="Slab Hrs"
                disabled={!enableinput.includes("slabhrs")}
                onChange={(value) => {
                  valueHandle("selectedSlabhrs", value);
                }}
              >
                {tarrif?.slabhrs?.map((item) => {
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
            <Form.Item name="slabkms">
              <Select
                placeholder="Slab Kms"
                disabled={!enableinput.includes("slabkms")}
                onChange={(value) => {
                  valueHandle("selectedSlabkms", value);
                }}
              >
                {tarrif?.slabkms?.map((item) => {
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
            <Form.Item name="slabfrom">
              <Select
                placeholder="Slab From"
                disabled={!enableinput.includes("slabfrom")}
                onChange={(value) => {
                  valueHandle("selectedSlabfrom", value);
                }}
              >
                {tarrif?.slabfrom?.map((item) => {
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
            <Form.Item name="slabto">
              <Select
                placeholder="Slab To"
                disabled={!enableinput.includes("slabto")}
                onChange={(value) => {
                  valueHandle("selectedSlabto", value);
                }}
              >
                {tarrif?.slabto?.map((item) => {
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
            <Form.Item name="addon">
              <Select
                placeholder="Select AddOn"
                disabled={!enableinput.includes("addon")}
                onChange={(value) => {
                  valueHandle("selectedAddon", value);
                }}
              >
                {tarrif?.addon?.map((item) => {
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
            <Form.Item name="salesRate" initialValue="">
              <NumericInput
                value={tarrif.salesRate}
                disabled={!enableinput.includes("salesRate")}
                onChange={(value) => {
                  valueHandle("salesRate", value);
                }}
              />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={4}>
            <Form.Item name="purchaseRate" initialValue="">
              <NumericInput
                value={tarrif.purchaseRate}
                disabled={!enableinput.includes("purchaseRate")}
                onChange={(value) => {
                  valueHandle("purchaseRate", value);
                }}
              />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={4}>
            <Form.Item name="salesExKmsRate" initialValue="">
              <NumericInput
                value={tarrif.salesExKmsRate}
                disabled={!enableinput.includes("salesExKmsRate")}
                onChange={(value) => {
                  valueHandle("salesExKmsRate", value);
                }}
              />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={4}>
            <Form.Item name="salesExHrsRate" initialValue="">
              <NumericInput
                value={tarrif.salesExHrsRate}
                disabled={!enableinput.includes("salesExHrsRate")}
                onChange={(value) => {
                  valueHandle("salesExHrsRate", value);
                }}
              />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={4}>
            <Form.Item name="purchaseExHrsRate" initialValue="">
              <NumericInput
                value={tarrif.purchaseExHrsRate}
                disabled={!enableinput.includes("purchaseExHrsRate")}
                onChange={(value) => {
                  valueHandle("purchaseExHrsRate", value);
                }}
              />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={4}>
            <Form.Item name="purchaseExKmsRate" initialValue="">
              <NumericInput
                value={tarrif.purchaseExKmsRate}
                disabled={!enableinput.includes("purchaseExKmsRate")}
                onChange={(value) => {
                  valueHandle("purchaseExKmsRate", value);
                }}
              />
            </Form.Item>
          </Col>
          {/* <Col className="gutter-row" span={4}>
            <div style={style}>col-6</div>
          </Col>
          <Col className="gutter-row" span={4}>
            <div style={style}>col-6</div>
          </Col>
          <Col className="gutter-row" span={4}>
            <div style={style}>col-6</div>
          </Col> */}
        </Row>
      </Form>
      {index > 0 ? (
        <Button
          className="bg-red-700 hover:bg-red-400  border-red-700 hover:border-red-500 text-white mt-3"
          onClick={RemoveTarrifInput}
        >
          Remove
        </Button>
      ) : null}
      <Divider />
    </>
  );
};

export default TarrifForm;
