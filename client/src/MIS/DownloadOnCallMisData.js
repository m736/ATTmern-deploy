import React, { useEffect, useState } from "react";
import { DatePicker, Button, Form, Select } from "antd";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getOnCallMisData } from "../action/onCallMisAction";
import moment from "moment";
import {
  searchOnCallMisDataFail,
  searchOnCallMisDataRequest,
  searchOnCallMisDataSuccess,
} from "../slices/OnCallMisSlice";
import ExportToExcel from "./ExportToExcel";

const DownloadOnCallMisData = () => {
  const [form] = Form.useForm();
  const [, forceUpdate] = useState({});
  const { Option } = Select;
  const dispatch = useDispatch();
  const [companyList, setCompanyList] = useState([]);
  const fileName = "oncallMisDownloadData";
  // To disable submit button at the beginning.
  useEffect(() => {
    forceUpdate({});
  }, []);
  const { oncall_mis_uploadlist } = useSelector(
    (state) => state.OnCallMisState
  );
  useEffect(() => {
    if (oncall_mis_uploadlist && oncall_mis_uploadlist.length) {
      let updatedCompany = oncall_mis_uploadlist.map(
        (item) => item.Company_Name
      );
      setCompanyList([...new Set(updatedCompany)]);
    } else {
      dispatch(getOnCallMisData);
    }
  }, []);
  const [searchData, setSearchData] = useState([]);
  const [onFinishValues, setOnFinishValues] = useState([]);
  const onFinish = async (fieldsValue) => {
    // console.log("Finish:", values);
    // moment(new Date(dateRange[0])).format("YYYY-MM-DD")
    const rangeTimejourney = fieldsValue["start_end_date"];
    const startJourney = moment(new Date(rangeTimejourney[0])).format(
      "YYYY-MM-DD"
    );
    const endJourney = moment(new Date(rangeTimejourney[1])).format(
      "YYYY-MM-DD"
    );
    const values = {
      ...fieldsValue,
      startJourney: startJourney,
      endJourney: endJourney,
    };
    setOnFinishValues(values);
    try {
      dispatch(searchOnCallMisDataRequest());
      const { data } = await axios.post(
        "/oncall_bulk/download_oncall_misdata",
        values
      );

      setSearchData(data);
      dispatch(searchOnCallMisDataSuccess(data));
    } catch (error) {
      //handle error
      dispatch(searchOnCallMisDataFail(error.response.data.message));
    }
  };
  let filteredSearchData = [];
  if (searchData && searchData.length > 0) {
    filteredSearchData = searchData.map((item) => ({
      Invoice_No: item?.Invoice_No,
      Id: item?._id,
      "Duty Slip No": item?.Dutyslip_No,
      Rental: item?.Rental,
      Client: item?.Company_Name,
      "Vehicle billed As": item?.Vehicle_Billed_As,
      Segment: item?.Segment,
      "Vehicle No": item?.Vehicle_No ?? "-",
      "Vehicle Type": item?.Vehicle_Type ?? "-",
      "Our Total Kms": item?.Total_Kms ?? 0,
      "Our Total Hrs": item?.Total_Hrs ?? 0,
      "Our Total Days": item?.Total_Days ?? 0,
      "Slab Applied": `${item?.selectedSlabhrs ?? 0}Hrs/${
        item?.selectedSlabkms ?? 0
      }Kms`,
      ExKm: item?.exKms ?? 0,
      ExHrs: item?.exHrs + "mins" ?? 0,
      SalesRate: item?.salesRate ?? 0,
      PurchaseRate: item?.purchaseRate ?? 0,
      "SalesExKm Rate": item?.salesExKmsRate ?? 0,
      "SalesExHrs Rate": item?.salesExHrsRate ?? 0,
      "Sales Grace Time": item?.salesGraceTime ?? 0,
      "Night Sales Bata": item?.Night_Sales_Bata ?? 0,
      "PurchaseExKm Rate": item?.purchaseExKmsRate ?? 0,
      "PurchaseExHrs Rate": item?.purchaseExHrsRate ?? 0,
      "Purchase Grace Time": item?.purchaseGraceTime ?? 0,
      "Night Purchase Bata": item?.Night_Purchase_Bata ?? 0,
      Toll: item?.Toll ?? 0,
      Parking: item?.Parking ?? 0,
      Permit: item?.Permit ?? 0,
      "Driver Bata": item?.Driver_Batta ?? 0,
      "Day Bata": item?.Day_Bata ?? 0,
      Others: item?.Others ?? 0,
      "Fuel Difference": item?.Fuel_Difference ?? 0,
      "Sales Gross": item?.salesGross ?? 0,
      "Purchase Gross": item?.purchaseGross ?? 0,
      "Sales Nett Amount": item?.salesNett ?? 0,
      "Purchase Nett Amount": item?.purchaseNett ?? 0,
    }));
  }
  return (
    <>
      <div className="container">
        <h4 className="text-uppercase text-decoration-underline my-3">
          Download OnCallMIS Data
        </h4>

        <Form
          form={form}
          name="download_oncall_data"
          className="py-5"
          layout="inline"
          onFinish={onFinish}
        >
          <Form.Item
            name="company"
            rules={[
              {
                required: true,
                message: "fill",
              },
            ]}
          >
            <Select
              showSearch
              allowClear={true}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              placeholder="company"
            >
              {companyList.map((item) => {
                return (
                  <Option key={item} value={item}>
                    {item}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>

          <Form.Item
            name="start_end_date"
            rules={[
              {
                required: true,
                message: "fill",
              },
            ]}
          >
            <DatePicker.RangePicker format="MMM Do, YYYY" allowClear={true} />
          </Form.Item>
          <Form.Item shouldUpdate>
            {() => (
              <Button
                htmlType="submit"
                disabled={
                  !form.isFieldsTouched(true) ||
                  !!form.getFieldsError().filter(({ errors }) => errors.length)
                    .length
                }
              >
                Search
              </Button>
            )}
          </Form.Item>
        </Form>
        {filteredSearchData && filteredSearchData.length > 0 ? (
          <ExportToExcel apiData={filteredSearchData} fileName={fileName} />
        ) : (
          "No Data"
        )}
      </div>
    </>
  );
};

export default DownloadOnCallMisData;
