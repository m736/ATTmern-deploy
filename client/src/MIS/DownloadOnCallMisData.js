import React, { useEffect, useState } from "react";
import { DatePicker, Button, Form, Select, Spin } from "antd";
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
import { getClientMasterAction } from "../action/clientMasterAction";

const DownloadOnCallMisData = () => {
  const [form] = Form.useForm();
  const [, forceUpdate] = useState({});
  const { Option } = Select;
  const dispatch = useDispatch();
  const [companyList, setCompanyList] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [clLocation, setClLocation] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileName = "oncallMisDownloadData";
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
      setLoading(true);
      dispatch(searchOnCallMisDataRequest());
      const { data } = await axios.post(
        "/oncall_bulk/download_oncall_misdata",
        values
      );
      setSearchData(data);
      dispatch(searchOnCallMisDataSuccess(data));
      setLoading(false);
    } catch (error) {
      //handle error
      setLoading(false);
      dispatch(searchOnCallMisDataFail(error.response.data.message));
    }
  };
  let filteredSearchData = [];
  if (searchData && searchData.length > 0) {
    filteredSearchData = searchData.map((item) => ({
      Invoice_No: item?.Invoice_No,
      Client: item?.Client,
      Location: item?.Location,
      Dutyslip_No: item?.Dutyslip_No,
      Rental: item?.Rental,
      Company_Name: item?.Company_Name,
      Vehicle_Billed_As: item?.Vehicle_Billed_As,
      Segment: item?.Segment,
      Vehicle_No: item?.Vehicle_No ?? "-",
      Vehicle_Type: item?.Vehicle_Type ?? "-",
      Total_Kms: item?.Total_Kms ?? 0,
      Total_Hrs: item?.Total_Hrs ?? 0,
      Total_Days: item?.Total_Days ?? 0,
      Slab_Applied: `${item?.selectedSlabhrs ?? 0}Hrs/${
        item?.selectedSlabkms ?? 0
      }Kms`,
      ExKms: item?.exKms ?? 0,
      ExHrs: item?.exHrs + "mins" ?? 0,
      SalesRate: item?.salesRate ?? 0,
      PurchaseRate: item?.purchaseRate ?? 0,
      // "SalesExKm Rate": item?.salesExKmsRate ?? 0,
      // "SalesExHrs Rate": item?.salesExHrsRate ?? 0,
      // "Sales Grace Time": item?.salesGraceTime ?? 0,
      // "Night Sales Bata": item?.Night_Sales_Bata ?? 0,
      // "PurchaseExKm Rate": item?.purchaseExKmsRate ?? 0,
      // "PurchaseExHrs Rate": item?.purchaseExHrsRate ?? 0,
      // "Purchase Grace Time": item?.purchaseGraceTime ?? 0,
      // "Night_Purchase_Bata": item?.Night_Purchase_Bata ?? 0,
      Toll: item?.Toll ?? 0,
      Parking: item?.Parking ?? 0,
      Permit: item?.Permit ?? 0,
      Driver_Batta: item?.Driver_Batta ?? 0,
      Day_Bata: item?.Day_Bata ?? 0,
      Others: item?.Others ?? 0,
      Fuel_Difference: item?.Fuel_Difference ?? 0,
      Sales_Nett: item?.Sales_Nett ?? 0,
      Purchase_Nett: item?.Purchase_Nett ?? 0,
    }));
  }
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
  console.log(selectedLocation);
  return (
    <>
      <div className="container">
        <h4 className="text-uppercase text-decoration-underline my-3">
          Download OnCallMIS Data
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
          <Form.Item name="start_end_date">
            <DatePicker.RangePicker format="MMM Do, YYYY" allowClear={true} />
          </Form.Item>

          <Form.Item shouldUpdate>
            {() => <Button htmlType="submit">Search</Button>}
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

export default DownloadOnCallMisData;
