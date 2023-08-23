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
  }, [day_base_mis_uploadlist]);
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
        "http://localhost:4000/daymis_bulk/download_dayBase_misdata",
        values
      );

      const filteredSearchData = data.map((item) => ({
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
      setSearchData(filteredSearchData);
      dispatch(searchDayBaseMisDataSuccess(data));
    } catch (error) {
      //handle error
      dispatch(searchDayBaseMisDataFail(error.response.data.message));
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
                Download
              </Button>
            )}
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default DownloadDayBaseMis;
