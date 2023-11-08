import React, { useEffect, useState } from "react";
import { DatePicker, Button, Form, Select } from "antd";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import {
  searchDayBaseMisDataFail,
  searchDayBaseMisDataRequest,
  searchDayBaseMisDataSuccess,
} from "../slices/DayBaseMisSlice";
import { getDayBaseMisData } from "../action/dayBaseMisAction";
import ExportToExcel from "./ExportToExcel";

const DownloadDayBaseMis = () => {
  const [form] = Form.useForm();
  const [, forceUpdate] = useState({});
  const { Option } = Select;
  const dispatch = useDispatch();
  const [companyList, setCompanyList] = useState([]);
  const fileName = "dayBaseMisDownloadData";
  // To disable submit button at the beginning.
  useEffect(() => {
    forceUpdate({});
  }, []);
  const { day_base_mis_uploadlist } = useSelector(
    (state) => state.DayBaseMisState
  );
  useEffect(() => {
    if (day_base_mis_uploadlist && day_base_mis_uploadlist.length) {
      let updatedCompany = day_base_mis_uploadlist.map((item) => item.Company);
      setCompanyList([...new Set(updatedCompany)]);
    } else {
      dispatch(getDayBaseMisData);
    }
  }, []);
  const [searchData, setSearchData] = useState([]);
  const [onFinishValues, setOnFinishValues] = useState([]);
  const onFinish = async (fieldsValue) => {
    const rangeTimejourney = fieldsValue["start_end_date"];
    const startJourney = rangeTimejourney[0]?.format("DD/MM/YYYY");
    const endJourney = rangeTimejourney[1]?.format("DD/MM/YYYY");
    const values = {
      ...fieldsValue,
      startJourney: startJourney,
      endJourney: endJourney,
    };
    setOnFinishValues(values);
    try {
      dispatch(searchDayBaseMisDataRequest());
      const { data } = await axios.post(
        "/daymis_bulk/download_dayBase_misdata",
        values
      );

      setSearchData(data);
      dispatch(searchDayBaseMisDataSuccess(data));
    } catch (error) {
      //handle error
      dispatch(searchDayBaseMisDataFail(error.response.data.message));
    }
  };
  let filteredSearchData = [];
  if (searchData && searchData.length > 0) {
    filteredSearchData = searchData.map((item) => ({
      Usage_Date: item?.Usage_Date,
      Trip_Id: item?.Trip_Id,
      Vehicle_No: item?.Vehicle_No,
      Vehicle_Type: item?.Vehicle_Type,
      Vehicle_Billed_As: item?.Vehicle_Billed_As,
      Segment: item?.Segment,
      Rental: item?.Rental,
      Total_Days: item?.Total_Days,
      No_Of_Months: item?.No_Of_Months,
      Total_Kms: item?.Total_Kms,
      Total_Hrs: item?.Total_Hrs,
      Toll: item?.Toll,
      Parking: item?.Parking,
      Permit: item?.Permit,
      Driver_Batta: item?.Driver_Batta,
      Day_Bata: item?.Day_Bata,
      Night_Sales_Bata: item?.Night_Sales_Bata,
      Night_Purchase_Bata: item?.Night_Purchase_Bata,
      Fuel_Difference: item?.Fuel_Difference,
      Company: item?.Company,
      Area: item?.Area,
      salesTotal: item?.salesTotal,
      purchaseTotal: item?.purchaseTotal,
    }));
  }
  return (
    <>
      <div className="container">
        <h4 className="text-uppercase text-decoration-underline my-3">
          Download Day Base Data
        </h4>

        <Form
          form={form}
          name="download_dayBase_mis_data"
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

export default DownloadDayBaseMis;
