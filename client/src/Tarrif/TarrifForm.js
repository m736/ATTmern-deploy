import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, Card, Row, Col } from "antd";
import { TarrifTable } from "./TarrifTable";
import { NumericInput } from "./TarrifNumericInput";

const TarrifForm = (props) => {
  const { tarrif, setTarrifInput, tarrifInput } = props;
  console.log(props);
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
  console.log("enableinput");
  console.log(enableinput);
  const style = {
    background: "#0092ff",
    padding: "8px 0",
  };
  const onFinish = (values) => {
    console.log("Received values of form:", values);
  };
  const RentalChange = (value) => {
    valueHandle("selectedRental", value);
  };

  const valueHandle = (field, value) => {
    let activeIndex = tarrifInput.findIndex(
      (item) => item.position == tarrif.position
    );
    if (activeIndex > -1) {
      let updated = tarrifInput.map((item, index) => {
        if (index == activeIndex) {
          return {
            ...item,
            [field]: value,
          };
        } else {
          return item;
        }
      });
      setTarrifInput(updated);
    }
  };
  return (
    <Card>
      <Form name="tarrifform" onFinish={onFinish}>
        <Row gutter={[16, 24]}>
          <Col className="gutter-row" span={4}>
            <Form.Item name="rental">
              <Select
                placeholder="Select Rental"
                onChange={RentalChange}
                defaultValue={tarrif?.selectedRental}
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
                placeholder="Select Segment"
                disabled={!enableinput.includes("segment")}
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
              <Select placeholder="Select AddOn">
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
            <Form.Item name="salesRate">
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
            <Form.Item name="purchaseRate">
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
            <Form.Item name="salesExKmsRate">
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
            <Form.Item name="salesExHrsRate">
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
            <Form.Item name="purchaseExHrsRate">
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
            <Form.Item name="purchaseExKmsRate">
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
    </Card>
  );
};

export default TarrifForm;
