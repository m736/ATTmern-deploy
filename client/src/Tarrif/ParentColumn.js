import { PlusOutlined, EditOutlined, MinusOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, Card, Row, Col, Table } from "antd";
import { NumericInput } from "./TarrifNumericInput";
const { Column } = Table;

export const ParentColum = (props) => {
  const { tarrif, setTarrifInput, tarrifInput, add } = props;
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

  const style = {
    background: "#0092ff",
    padding: "8px 0",
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
    <>
      <Column
        dataIndex={"rental"}
        title={"Rental"}
        fixed="left"
        render={(value, row, index) => {
          return (
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
          );
        }}
      />
      <Column
        dataIndex={"segment"}
        title={"Segment"}
        render={(value, row, index) => {
          return (
            <>
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
            </>
          );
        }}
      />
      <Column
        dataIndex={"area"}
        title={"Area"}
        render={(value, row, index) => {
          return (
            <>
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
            </>
          );
        }}
      />
      <Column
        dataIndex={"slabhrs"}
        title={"slabhrs"}
        render={(value, row, index) => {
          return (
            <>
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
            </>
          );
        }}
      />
      <Column
        dataIndex={"slabkms"}
        title={"slabkms"}
        render={(value, row, index) => {
          return (
            <>
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
            </>
          );
        }}
      />
      <Column
        dataIndex={"slabfrom"}
        title={"slabfrom"}
        render={(value, row, index) => {
          return (
            <>
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
            </>
          );
        }}
      />
      <Column
        dataIndex={"slabto"}
        title={"slabto"}
        render={(value, row, index) => {
          return (
            <>
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
            </>
          );
        }}
      />
      <Column
        dataIndex={"addon"}
        title={"addon"}
        render={(value, row, index) => {
          return (
            <>
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
            </>
          );
        }}
      />
      <Column
        dataIndex={"salesRate"}
        title={"salesRate"}
        render={(value, row, index) => {
          console.log(value);
          return (
            <>
              <Form.Item name="salesRate">
                <NumericInput
                  value={value}
                  disabled={!enableinput.includes("salesRate")}
                  onChange={(value) => {
                    valueHandle("salesRate", value);
                  }}
                />
              </Form.Item>
            </>
          );
        }}
      />
      <Column
        dataIndex={"purchaseRate"}
        title={"purchaseRate"}
        render={(value, row, index) => {
          return (
            <>
              <Form.Item name="purchaseRate">
                <NumericInput
                  value={tarrif.purchaseRate}
                  disabled={!enableinput.includes("purchaseRate")}
                  onChange={(value) => {
                    valueHandle("purchaseRate", value);
                  }}
                />
              </Form.Item>
            </>
          );
        }}
      />
      <Column
        dataIndex={"salesExKmsRate"}
        title={"salesExKmsRate"}
        render={(value, row, index) => {
          return (
            <>
              <Form.Item name="salesExKmsRate">
                <NumericInput
                  value={tarrif.salesExKmsRate}
                  disabled={!enableinput.includes("salesExKmsRate")}
                  onChange={(value) => {
                    valueHandle("salesExKmsRate", value);
                  }}
                />
              </Form.Item>
            </>
          );
        }}
      />
      <Column
        dataIndex={"salesExHrsRate"}
        title={"salesExHrsRate"}
        render={(value, row, index) => {
          return (
            <>
              <Form.Item name="salesExHrsRate">
                <NumericInput
                  value={tarrif.salesExHrsRate}
                  disabled={!enableinput.includes("salesExHrsRate")}
                  onChange={(value) => {
                    valueHandle("salesExHrsRate", value);
                  }}
                />
              </Form.Item>
            </>
          );
        }}
      />
      <Column
        dataIndex={"purchaseExHrsRate"}
        title={"purchaseExHrsRate"}
        render={(value, row, index) => {
          return (
            <>
              <Form.Item name="purchaseExHrsRate">
                <NumericInput
                  value={tarrif.purchaseExHrsRate}
                  disabled={!enableinput.includes("purchaseExHrsRate")}
                  onChange={(value) => {
                    valueHandle("purchaseExHrsRate", value);
                  }}
                />
              </Form.Item>
            </>
          );
        }}
      />
      <Column
        dataIndex={"purchaseExKmsRate"}
        title={"purchaseExKmsRate"}
        render={(value, row, index) => {
          return (
            <>
              <Form.Item name="purchaseExKmsRate">
                <NumericInput
                  value={tarrif.purchaseExKmsRate}
                  disabled={!enableinput.includes("purchaseExKmsRate")}
                  onChange={(value) => {
                    valueHandle("purchaseExKmsRate", value);
                  }}
                />
              </Form.Item>
            </>
          );
        }}
      />
      {/* <Column
        dataIndex={"rental"}
        title={"Rental"}
        render={(value, row, index) => {
          return <></>;
        }}
      />
      <Column
        dataIndex={"rental"}
        title={"Rental"}
        render={(value, row, index) => {
          return <></>;
        }}
      />
      <Column
        dataIndex={"rental"}
        title={"Rental"}
        render={(value, row, index) => {
          return <></>;
        }}
      /> */}
    </>
  );
};
