import React, { useEffect, useState } from "react";
import { DatePicker, Button, Form, Select, Spin, TreeSelect } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getClientMasterAction } from "../action/clientMasterAction";
import moment from "moment";
import {
  downloadSiteSlabBaseMisUploadFail,
  downloadSiteSlabBaseMisUploadRequest,
  downloadSiteSlabBaseMisUploadSuccess,
} from "../slices/SiteSlabBaseSlice";
import axios from "axios";
const DownloadSiteSlab = () => {
  const [form] = Form.useForm();
  const [, forceUpdate] = useState({});
  const { Option } = Select;
  const dispatch = useDispatch();
  const [companyList, setCompanyList] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [downloadData, setDownloadData] = useState([]);
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
      let companyList = client_master_detail.map((item, index) => {
        return {
          title: `${index + 1}.${item.Company_Name}`,
          value: item.Company_Name,
        };
      });
      setCompanyList(removeDuplicateObjects(companyList, "value"));
    }
  }, [client_master_detail]);
  const allIds = companyList.map(({ value }) => value);
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
  const TreeSelectC = () => {
    return (
      <TreeSelect
        allowClear={true}
        placeholder="Select a block"
        treeCheckable={true}
        showCheckedStrategy={TreeSelect.SHOW_CHILD}
        style={{ width: "350px" }}
        dropdownStyle={{ maxHeight: "300px" }}
        onChange={(ids) => setSelectedValues(ids)}
        value={selectedValues}
        maxTagCount={2}
        maxTagPlaceholder={(omittedValues) =>
          `+ ${omittedValues.length} Blocks ...`
        }
        treeData={[
          {
            title: (
              <React.Fragment>
                {selectedValues.length === companyList.length && (
                  <span
                    style={{
                      display: "inline-block",
                      color: "#ccc",
                      cursor: "not-allowed",
                    }}
                  >
                    Select all
                  </span>
                )}
                {selectedValues.length < companyList.length && (
                  <span
                    onClick={() => setSelectedValues(allIds)}
                    style={{
                      display: "inline-block",
                      color: "#286FBE",
                      cursor: "pointer",
                    }}
                  >
                    Select all
                  </span>
                )}
                &nbsp;&nbsp;&nbsp;
                {selectedValues.length === 0 && (
                  <span
                    style={{
                      display: "inline-block",
                      color: "#ccc",
                      cursor: "not-allowed",
                    }}
                  >
                    Unselect all
                  </span>
                )}
                {selectedValues.length > 0 && (
                  <span
                    onClick={() => setSelectedValues([])}
                    style={{
                      display: "inline-block",
                      color: "#286FBE",
                      cursor: "pointer",
                    }}
                  >
                    Unselect all
                  </span>
                )}
              </React.Fragment>
            ),
            value: "xxx",
            disableCheckbox: true,
            disabled: true,
          },
          ...companyList,
        ]}
      />
    );
  };
  console.log(selectedValues);
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
      company: selectedValues,
      startJourney: startJourney,
      endJourney: endJourney,
    };

    try {
      dispatch(downloadSiteSlabBaseMisUploadRequest());
      const { data } = await axios.post(
        "/api/v1/site_mis/download_site_slabbase_mis",
        values
      );

      setDownloadData(data);
      dispatch(downloadSiteSlabBaseMisUploadSuccess(data));
    } catch (error) {
      dispatch(downloadSiteSlabBaseMisUploadFail(error.response.data.message));
    }
  };
  console.log(downloadData);
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
          <Form.Item name="company">
            {/* <Select
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
            >
              {companyList?.map((comapny) => {
                return (
                  <Option key={comapny.value} value={comapny.value}>
                    {comapny.text}
                  </Option>
                );
              })}
            </Select> */}
            <TreeSelectC />
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
            {() => <Button htmlType="submit">Search</Button>}
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default DownloadSiteSlab;
