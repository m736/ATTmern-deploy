import React, { useEffect, useState } from "react";
import { Button, Col, DatePicker, Form, Input, Row, Select, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getClientMasterAction } from "../action/clientMasterAction";
import moment from "moment";
import { BackDatedInvoiceInputGenerateAction } from "../action/BackDatedInvoiceGenerateAction";

const MergeInvoiceGenerateAddField = (props) => {
  const {
    key,
    screenAdd,
    MGIInputArr,
    addField,
    setInputFieldObj,
    index,
    inputFieldObj,
    clientArr,
    setClLocation,
    clLocation,
    setMGIInputArr,
  } = props;

  const { RangePicker } = DatePicker;
  const { Option } = Select;
  let clientLocationMap =
    clLocation?.length &&
    clLocation?.map((item, i) => {
      return item?.map((again) => {
        return (
          <Option key={again} value={again}>
            {again}
          </Option>
        );
      });
    });
  const valueHandle = (field, value) => {
    console.log(field);
    let activeIndex = MGIInputArr.findIndex(
      (item) => item.position == addField.position
    );

    if (activeIndex > -1) {
      let updated = [];
      updated = MGIInputArr?.map((item, index) => {
        if (index == activeIndex) {
          return {
            ...item,
            [field]: value,
          };
        } else {
          return item;
        }
      });
      setMGIInputArr(updated);
    }
  };
  const AddMergeInput = () => {
    let newItem = {
      ...inputFieldObj,
      position: MGIInputArr[MGIInputArr.length - 1]?.position + 1,
    };

    setMGIInputArr([...MGIInputArr, newItem]);
  };
  const RemoveMergeInput = () => {
    let activeIndex = MGIInputArr.findIndex(
      (item) => item.position == addField.position
    );

    if (activeIndex > -1) {
      let updated = MGIInputArr.filter((i, index) => index !== activeIndex);
      setMGIInputArr(updated);
    }
  };
  console.log(MGIInputArr);
  return (
    <>
      <Row className="mt-10">
        <Col span={4}>Rental Type</Col>
        <Col span={8} offset={2}>
          <Select
            style={{ width: "200px" }}
            onChange={(e) => {
              valueHandle("selectedRentalType", e);
            }}
          >
            <Option value="">Select Rental</Option>
            {inputFieldObj?.rental?.map((item) => (
              <Option key={item.value} value={item.value}>
                {item.text}
              </Option>
            ))}
          </Select>
        </Col>
        <Col span={4} offset={6}>
          <Space>
            <Button onClick={AddMergeInput}>Add</Button>
            {index > 0 ? (
              <Button
                className="bg-red-700 hover:bg-red-400  border-red-700 hover:border-red-500 text-white"
                onClick={RemoveMergeInput}
              >
                Remove
              </Button>
            ) : null}
          </Space>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col span={4}>Client</Col>
        <Col span={8} offset={2}>
          <Select
            style={{ width: "200px" }}
            onChange={(e) => {
              let updated = clientArr.filter((item) => e == item.Company_Name);
              let updatedLocation = updated.map((item) =>
                item?.Location?.map((loc) => loc?.Client_Location)
              );
              setClLocation(updatedLocation);
              valueHandle("selectedClient", e);
            }}
          >
            <Option value="">Select Company</Option>
            {clientArr.map((comapny) => (
              <Option value={comapny.Company_Name}>
                {comapny.Company_Name}
              </Option>
            ))}
          </Select>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col span={4}>Location</Col>
        <Col span={8} offset={2}>
          <Select
            style={{ width: "200px" }}
            onChange={(e) => {
              valueHandle("selectedClientLocation", e);
            }}
          >
            <Select.Option value="">Select Location</Select.Option>
            {clientLocationMap ? clientLocationMap : null}
          </Select>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col span={4}>From And To Date</Col>
        <Col span={8} offset={2}>
          <RangePicker
            format="YYYY-MM-DD"
            onChange={(value, dateString) => {
              console.log(dateString[0]);
              console.log(dateString[1]);
              valueHandle("selectedFromAndToDate", dateString);
            }}
          />
        </Col>
      </Row>
    </>
  );
};

export default MergeInvoiceGenerateAddField;
