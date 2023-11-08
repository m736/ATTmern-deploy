import React, { useEffect, useState } from "react";
import { DatePicker, Button, Form, Select } from "antd";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import {
  searchTripBaseMisDataFail,
  searchTripBaseMisDataRequest,
  searchTripBaseMisDataSuccess,
} from "../slices/TripBaseMisSlice";
import { getTripBaseMisData } from "../action/tripBaseMisAction";
import ExportToExcel from "./ExportToExcel";

const DownloadTripBaseMis = () => {
  const [form] = Form.useForm();
  const [, forceUpdate] = useState({});
  const { Option } = Select;
  const dispatch = useDispatch();
  const [companyList, setCompanyList] = useState([]);
  const fileName = "tripBaseMisDownloadData";
  // To disable submit button at the beginning.
  useEffect(() => {
    forceUpdate({});
  }, []);
  const { trip_base_mis_uploadlist } = useSelector(
    (state) => state.TripBaseMisState
  );
  useEffect(() => {
    if (trip_base_mis_uploadlist && trip_base_mis_uploadlist.length) {
      let updatedCompany = trip_base_mis_uploadlist.map((item) => item.Company);
      setCompanyList([...new Set(updatedCompany)]);
    } else {
      dispatch(getTripBaseMisData);
    }
  }, []);
  const [searchData, setSearchData] = useState([]);
  const [onFinishValues, setOnFinishValues] = useState([]);
  const onFinish = async (fieldsValue) => {
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
      dispatch(searchTripBaseMisDataRequest());
      const { data } = await axios.post(
        "/tripmis_bulk/download_tripBase_misdata",
        values
      );

      setSearchData(data);
      dispatch(searchTripBaseMisDataSuccess(data));
    } catch (error) {
      //handle error
      dispatch(searchTripBaseMisDataFail(error.response.data.message));
    }
  };
  let filteredSearchData = [];
  if (searchData && searchData.length > 0) {
    filteredSearchData = searchData.map((item) => ({
      Trip_Id: item?.Trip_Id,
      Vehicle_No: item?.Vehicle_No,
      Vehicle_Type: item?.Vehicle_Type,
      Vehicle_Billed_As: item?.Vehicle_Billed_As,
      Segment: item?.Segment,
      Total_Kms: item?.Total_Kms,
      Trip_Type: item?.Trip_Type,
      Duty_Type: item?.Duty_Type,
      Trip: item?.Trip,
      Trip_Single: item?.Trip_Single,
      Trip_Back_to_Back: item?.Trip_Back_to_Back,
      Trip_Escort: item?.Trip_Escort,
      Trip_Single_Long: item?.Trip_Single_Long,
      Toll: item?.Toll,
      Fuel_Difference: item?.Fuel_Difference,
      Company: item?.Company,
      Area: item?.Area,
      Sales_Bata: item?.Sales_Bata,
      Purchase_Bata: item?.Purchase_Bata,
      salesTotal: item?.salesTotal,
      purchaseTotal: item?.purchaseTotal,
    }));
  }
  return (
    <>
      <div className="container">
        <h4 className="text-uppercase text-decoration-underline my-3">
          Download Trip Base Data
        </h4>

        <Form
          form={form}
          name="download_tripBase_mis_data"
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

export default DownloadTripBaseMis;
