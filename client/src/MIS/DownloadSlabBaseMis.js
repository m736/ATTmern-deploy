import React, { useEffect, useState } from "react";
import { DatePicker, Button, Form, Select } from "antd";
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

const DownloadSlabBaseMis = () => {
  const [form] = Form.useForm();
  const [, forceUpdate] = useState({});
  const { Option } = Select;
  const dispatch = useDispatch();
  const [companyList, setCompanyList] = useState([]);
  const fileName = "slabBaseMisDownloadData";
  // To disable submit button at the beginning.
  useEffect(() => {
    forceUpdate({});
  }, []);
  const { slab_base_mis_uploadlist } = useSelector(
    (state) => state.SlabBaseMisState
  );
  useEffect(() => {
    if (slab_base_mis_uploadlist && slab_base_mis_uploadlist.length) {
      let updatedCompany = slab_base_mis_uploadlist.map((item) => item.Company);
      setCompanyList([...new Set(updatedCompany)]);
    } else {
      dispatch(getSlabBaseMisData);
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
      dispatch(searchSlabBaseMisDataRequest());
      const { data } = await axios.post(
        "/slabmis_bulk/download_slabBase_misdata",
        values
      );

      setSearchData(data);
      dispatch(searchSlabBaseMisDataSuccess(data));
    } catch (error) {
      //handle error
      dispatch(searchSlabBaseMisDataFail(error.response.data.message));
    }
  };

  let filteredSearchData = [];
  if (searchData && searchData.length > 0) {
    filteredSearchData = searchData?.map((item) => ({
      Invoice_No: item?.Invoice_No,
      Id: item?._id,
      "Duty Slip No": item?.["Trip ID"],
      Rental: item?.["Duty Type"],
      Client: item?.Company,
      "Vehicle billed As": item?.["Vehicle Billed as"],
      Segment: item?.Segment,
      "Vehicle No": item?.["Vehicle No"] ?? "-",
      "Vehicle Type": item?.["Vehicle TYPE"] ?? "-",
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
      Bata: item?.["Bata"] ?? 0,
      Fuel: item?.["Fuel Difference"] ?? 0,
      Company: item?.["Company"] ?? "",
      Area: item?.["AREA"] ?? 0,
      salesNett: item?.["salesNett"] ?? 0,
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

export default DownloadSlabBaseMis;
