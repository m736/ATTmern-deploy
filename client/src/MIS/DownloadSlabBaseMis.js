import React, { useEffect, useState } from "react";
import { DatePicker, Button, Form, Select, Spin } from "antd";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getSlabBaseMisData } from "../action/slabBasMisAction";
import moment from "moment";
import {
  searchSlabBaseMisDataFail,
  searchSlabBaseMisDataRequest,
  searchSlabBaseMisDataSuccess,
} from "../slices/SlabBaseMisSlice";
import ExportToExcel from "./ExportToExcel";
import { getClientMasterAction } from "../action/clientMasterAction";

const DownloadSlabBaseMis = () => {
  const [form] = Form.useForm();
  const [, forceUpdate] = useState({});
  const { Option } = Select;
  const dispatch = useDispatch();
  const [companyList, setCompanyList] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [clLocation, setClLocation] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileName = "slabBaseMisDownloadData";
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
      dispatch(searchSlabBaseMisDataRequest());
      const { data } = await axios.post(
        "/slabmis_bulk/download_slabBase_misdata",
        values
      );

      setSearchData(data);
      dispatch(searchSlabBaseMisDataSuccess(data));
      setLoading(false);
    } catch (error) {
      //handle error
      setLoading(false);
      dispatch(searchSlabBaseMisDataFail(error.response.data.message));
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
    filteredSearchData = searchData?.map((item) => ({
      Invoice_No: item?.Invoice_No,
      Client: item?.Client,
      Location: item?.Location,
      Dutyslip_No: item?.["Dutyslip_No"],
      Rental: item?.["Rental"],
      Vehicle_Billed_As: item?.["Vehicle_Billed_As"],
      Segment: item?.Segment,
      Vehicle_No: item?.["Vehicle_No"] ?? "-",
      Vehicle_Type: item?.["Vehicle_Type"] ?? "-",
      Slab1: item?.["Slab1"] ?? 0,
      Slab2: item?.["Slab2"] ?? 0,
      Slab3: item?.["Slab3"] ?? 0,
      Slab4: item?.["Slab4"] ?? 0,
      Slab5: item?.["Slab5"] ?? 0,
      "Slab1 - E": item?.["Slab1 - E"] ?? 0,
      "Slab2 - E": item?.["Slab2 - E"] ?? 0,
      "Slab3 - E": item?.["Slab3 - E"] ?? 0,
      "Slab4 - E": item?.["Slab4 - E"] ?? 0,
      "Slab5 - E": item?.["Slab5 - E"] ?? 0,
      "Slab1 - Single": item?.["Slab1 - Single"] ?? 0,
      "Slab2 - Single": item?.["Slab2 - Single"] ?? 0,
      "Slab3 - Single": item?.["Slab3 - Single"] ?? 0,
      "Slab4 - Single": item?.["Slab4 - Single"] ?? 0,
      "Slab5 - Single": item?.["Slab5 - Single"] ?? 0,
      Fuel_Difference: item?.["Fuel_Difference"] ?? 0,
      Company_Name: item?.["Company_Name"] ?? "",
      Area: item?.["Area"] ?? 0,
      Sales_Nett: item?.["Sales_Nett"] ?? 0,
      Purchase_Nett: item?.["Purchase_Nett"] ?? 0,
    }));
  }

  return (
    <>
      <div className="container">
        <h4 className="text-uppercase text-decoration-underline my-3">
          Download Slab Base Data
        </h4>

        <Form
          form={form}
          name="download_slabBase_mis_data"
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

export default DownloadSlabBaseMis;
