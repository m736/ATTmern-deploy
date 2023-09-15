import React, { useEffect, useState } from "react";
import { DatePicker, Button, Form, Select } from "antd";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import {
  searchTripBaseMisDataFail,
  searchTripBaseMisDataRequest,
  searchTripBaseMisDataSuccess,
} from "../slices/TripBaseMisSlice";
import { getTripBaseMisData } from "../action/tripBaseMisAction";

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
  }, [trip_base_mis_uploadlist]);
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
      dispatch(searchTripBaseMisDataRequest());
      const { data } = await axios.post(
        "/tripmis_bulk/download_tripBase_misdata",
        values
      );

      const filteredSearchData = data.map((item) => ({
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
      setSearchData(filteredSearchData);
      dispatch(searchTripBaseMisDataSuccess(data));
    } catch (error) {
      //handle error
      dispatch(searchTripBaseMisDataFail(error.response.data.message));
    }
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    if (searchData && searchData.length) {
      const ws = XLSX.utils.json_to_sheet(searchData);
      const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: fileType });
      FileSaver.saveAs(
        data,
        `${fileName}${onFinishValues?.startJourney}to${onFinishValues?.endJourney}${fileExtension}`
      );
    } else {
      alert("no data");
    }
  };
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
                Download
              </Button>
            )}
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default DownloadTripBaseMis;
