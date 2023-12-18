import React, { useEffect, useState } from "react";
import { DatePicker, Button, Form, Select, Spin } from "antd";
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
import { getClientMasterAction } from "../action/clientMasterAction";

const DownloadTripBaseMis = () => {
  const [form] = Form.useForm();
  const [, forceUpdate] = useState({});
  const { Option } = Select;
  const dispatch = useDispatch();
  const [companyList, setCompanyList] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [clLocation, setClLocation] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileName = "tripBaseMisDownloadData";
  // To disable submit button at the beginning.
  const { client_master_detail } = useSelector(
    (state) => state.ClientMasterState || []
  );

  useEffect(() => {
    dispatch(getClientMasterAction);
    forceUpdate({});
  }, []);
  useEffect(() => {
    if (client_master_detail && client_master_detail?.length > 0) {
      let companyList = client_master_detail.map((item) => {
        return {
          text: item.Company_Name,
          value: item.Company_Name,
        };
      });
      setCompanyList(removeDuplicateObjects(companyList, "value"));
    }
  }, [client_master_detail]);

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
      setLoading(true);
      dispatch(searchTripBaseMisDataRequest());
      const { data } = await axios.post(
        "/tripmis_bulk/download_tripBase_misdata",
        values
      );

      setSearchData(data);
      dispatch(searchTripBaseMisDataSuccess(data));
      setLoading(false);
    } catch (error) {
      //handle error
      setLoading(false);
      dispatch(searchTripBaseMisDataFail(error.response.data.message));
    }
  };
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
  let durationBody =
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
  let filteredSearchData = [];
  if (searchData && searchData.length > 0) {
    filteredSearchData = searchData.map((item) => ({
      Invoice_No: item?.Invoice_No,
      Client: item?.Client,
      Location: item?.Location,
      Dutyslip_No: item?.Dutyslip_No,
      Vehicle_No: item?.Vehicle_No,
      Vehicle_Type: item?.Vehicle_Type,
      Vehicle_Billed_As: item?.Vehicle_Billed_As,
      Segment: item?.Segment,
      Total_Kms: item?.Total_Kms,
      Trip_Type: item?.Trip_Type,
      Rental: item?.Duty_Type,
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
      Sales_Nett: item?.Sales_Nett,
      Purchase_Nett: item?.Purchase_Nett,
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
              style={{
                width: 120,
              }}
              allowClear={true}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              placeholder="company"
              onChange={(e) => {
                let updated = client_master_detail?.filter(
                  (item) => e == item.Company_Name
                );
                let updatedLocation = updated.map((item) =>
                  item?.Location?.map((loc) => loc?.Client_Location)
                );
                setSelectedCompany(e);
                setSelectedLocation(null);
                form.resetFields(["location"]);
                setClLocation(updatedLocation);
              }}
              value={selectedCompany}
            >
              {companyList?.map((comapny) => {
                return (
                  <Option key={comapny.value} value={comapny.value}>
                    {comapny.text}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            name="location"
            rules={[
              {
                required: true,
                message: "fill",
              },
            ]}
          >
            <Select
              placeholder="location"
              onChange={(e) => {
                setSelectedLocation(e);
              }}
            >
              <Option>Choose Location</Option>
              {durationBody ? durationBody : null}
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
        {loading ? (
          <Spin spinning={loading}></Spin>
        ) : (
          <>
            {filteredSearchData && filteredSearchData.length > 0 ? (
              <ExportToExcel apiData={filteredSearchData} fileName={fileName} />
            ) : (
              "No Data"
            )}
          </>
        )}
      </div>
    </>
  );
};

export default DownloadTripBaseMis;
