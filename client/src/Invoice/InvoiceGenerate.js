import React, { useEffect, useState } from "react";
import { Button, DatePicker, Form, Input, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getClientMasterAction } from "../action/clientMasterAction";
import moment from "moment";
import { BackDatedInvoiceInputGenerateAction } from "../action/BackDatedInvoiceGenerateAction";
const InvoiceGenerate = () => {
  const { RangePicker } = DatePicker;
  const [companyList, setCompanyList] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [clLocation, setClLocation] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState([]);
  const dispatch = useDispatch();
  const { client_master_detail } = useSelector(
    (state) => state.ClientMasterState || []
  );
  useEffect(() => {
    if (client_master_detail.length) {
      let companyList = client_master_detail.map((item) => {
        return {
          text: item.Company_Name,
          value: item.Company_Name,
        };
      });
      setCompanyList(removeDuplicateObjects(companyList, "value"));
    } else {
      dispatch(getClientMasterAction);
    }
  }, [client_master_detail]);
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
  const onFinish = async (values) => {
    console.log(values);
    const fromandto = values.FromAndToDate;

    const newvalue = {
      ...values,
      Fromdate: fromandto[0].format("YYYY-MM-DD"),
      Todate: fromandto[1].format("YYYY-MM-DD"),
    };
    console.log(newvalue);
    dispatch(BackDatedInvoiceInputGenerateAction(newvalue));
  };

  return (
    <>
      <Form
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout="horizontal"
        style={{
          maxWidth: 600,
        }}
        onFinish={onFinish}
      >
        {/* <Form.Item label="Client">
          <Input />
        </Form.Item> */}
        <Form.Item label="Client" name="Client">
          <Select
            onChange={(e) => {
              let updated = client_master_detail.filter(
                (item) => e == item.Company_Name
              );
              let updatedLocation = updated.map((item) =>
                item?.Location?.map((loc) => loc?.Client_Location)
              );
              console.log(updatedLocation);
              setClLocation(updatedLocation);
              setSelectedCompany(e);
            }}
            value={selectedCompany}
          >
            <Select.Option value="">Select Company</Select.Option>
            {companyList.map((comapny) => (
              <Option value={comapny.value}>{comapny.text}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Location" name="Location">
          <Select
            onChange={(e) => {
              setSelectedLocation(e);
            }}
            value={selectedLocation}
          >
            <Select.Option value="">Select Location</Select.Option>
            {clientLocationMap ? clientLocationMap : null}
          </Select>
        </Form.Item>

        <Form.Item label="FromAndToDate" name="FromAndToDate">
          <RangePicker />
        </Form.Item>

        <Form.Item>
          <Button htmlType="submit">Save</Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default InvoiceGenerate;
