import React, { useEffect, useState } from "react";
import { Button, DatePicker, Form, Input, Select } from "antd";
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
  const AddTarrifInput = () => {
    let newItem = {
      ...inputFieldObj,
      position: MGIInputArr[MGIInputArr.length - 1]?.position + 1,
    };

    setMGIInputArr([...MGIInputArr, newItem]);
  };
  console.log(MGIInputArr);
  return (
    <>
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
          <Option value={comapny.Company_Name}>{comapny.Company_Name}</Option>
        ))}
      </Select>
      <Select
        style={{ width: "200px" }}
        onChange={(e) => {
          valueHandle("selectedClientLocation", e);
        }}
      >
        <Select.Option value="">Select Location</Select.Option>
        {clientLocationMap ? clientLocationMap : null}
      </Select>

      <RangePicker
        format="YYYY-MM-DD"
        onChange={(value, dateString) => {
          console.log(dateString[0]);
          console.log(dateString[1]);
          valueHandle("selectedFromAndToDate", dateString);
        }}
      />
      <Button onClick={AddTarrifInput}>Add</Button>
    </>
  );
};

export default MergeInvoiceGenerateAddField;
