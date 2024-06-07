import React, { useEffect, useState } from "react";
import { DatePicker, Button, Form, Spin, TreeSelect } from "antd";
import { useDispatch, useSelector } from "react-redux";

import moment from "moment";
import { toast } from "react-toastify";
import {
  deleteSiteMisAction,
  getSiteSlabBaseMisAction,
} from "../../action/SiteMisAction";
import {
  clearDeleteSiteMis,
  clearSiteMisError,
} from "../../slices/SiteSlabBaseSlice";
import { getClientMasterAction } from "../../action/clientMasterAction";

const DeleteSiteMisData = () => {
  const [form] = Form.useForm();
  const [, forceUpdate] = useState({});
  const dispatch = useDispatch();
  const [companyList, setCompanyList] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);

  // To disable submit button at the beginning.
  const { client_master_detail } = useSelector(
    (state) => state.ClientMasterState || []
  );
  const { delete_site_mis, error, siteMisloading } = useSelector(
    (state) => state.SiteSlabBaseState || []
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
    if (selectedValues.length > 0) {
      dispatch(deleteSiteMisAction(values));
      dispatch(getSiteSlabBaseMisAction);
      form.resetFields();
    } else {
      alert("please select company");
    }
  };
  useEffect(() => {
    if (delete_site_mis) {
      toast("Site MIS  data Deleted Succesfully!", {
        type: "success",
        position: toast.POSITION.BOTTOM_CENTER,
        onOpen: () => dispatch(clearDeleteSiteMis()),
      });

      return;
    }

    if (error) {
      toast(error, {
        position: toast.POSITION.BOTTOM_CENTER,
        type: "error",
        onOpen: () => {
          dispatch(clearSiteMisError());
        },
      });
      return;
    }
  }, [delete_site_mis, error, dispatch]);
  return (
    <>
      <div className="container">
        <h4 className="text-uppercase text-decoration-underline mt-6 font-bold text-lg">
          Delete Site Mis Data
        </h4>
        <Form
          form={form}
          name="download_slabBase_mis_data"
          className="py-5 mb-6"
          layout="inline"
          onFinish={onFinish}
        >
          <Form.Item name="company">
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
            {() => <Button htmlType="submit">Delete</Button>}
          </Form.Item>
        </Form>{" "}
      </div>
    </>
  );
};

export default DeleteSiteMisData;
