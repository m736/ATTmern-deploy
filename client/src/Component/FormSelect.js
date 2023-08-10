import React, { useEffect, useState } from "react";
import { DatePicker, Spin, Button, Form, Select } from "antd";
import moment from "moment";
import axios from "axios";
import { TreeSelect } from "antd";
import { useSelector } from "react-redux";
import MisTable from "./MisTable";
//   console.log(selectedValues)
const FormSelect = (props) => {
  const [load, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [, forceUpdate] = useState({});
  const [data, setData] = useState({});
  const [dateRange, setDateRange] = useState([]);
  const [errmsg, setErrorMsg] = useState("");
  const { misvehicle_list = [], loading } = useSelector(
    (state) => state.VechicleDetailState
  );
  const uniquevechicle = removeDuplicateObjects(misvehicle_list, "vechicle_no");

  //  start selected company concept for select all and unselectall
  const uniqueCompany = removeDuplicateObjects(misvehicle_list, "company");
  const x = Array.from(
    uniqueCompany.map((x, y) => ({
      title: `${y + 1}. ${x.company}`,
      value: `${x.company}`,
    }))
  );
  const allIds = x.map(({ value }) => value);
  const [selectedValues, setSelectedValues] = useState([]);
  const TreeSelectA = ({ company }) => {
    return (
      <TreeSelect
        name={company}
        allowClear={true}
        placeholder="company list"
        treeCheckable={true}
        showCheckedStrategy={TreeSelect.SHOW_CHILD}
        style={{ width: "250px" }}
        dropdownStyle={{ maxHeight: "300px" }}
        onChange={(ids) => setSelectedValues(ids)}
        value={selectedValues}
        maxTagCount={2}
        maxTagPlaceholder={(omittedValues) =>
          `+ ${omittedValues.length} company ...`
        }
        treeData={[
          {
            title:
              selectedValues.length > 0 ? (
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
              ) : (
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
              ),
            value: "xxx",
            disableCheckbox: true,
            disabled: true,
          },
          ...x,
        ]}
      />
    );
  };

  //  end selected company concept for select all and unselectall

  useEffect(() => {
    forceUpdate({});
  }, []);

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
  const isNotValid = (value) =>
    value === null || value === "" || value === undefined;
  const onFinish = async (values) => {
    setLoading(true);
    let isValid = true;
    if (isNotValid(values.vechicle_no) && isNotValid(values.company)) {
      isValid = false;
    }
    if (isNotValid(dateRange[0]) && isNotValid(dateRange[1])) {
      isValid = false;
    }
    if (isValid) {
      setErrorMsg("");

      const res = await axios.post(
        "https://localhost:4000/bulk/vechicle-attendance-list",
        {
          example: {
            ...values,
            company: selectedValues,
            startDate: moment(new Date(dateRange[0])).format("YYYY-MM-DD"),
            endDate: moment(new Date(dateRange[1])).format("YYYY-MM-DD"),
            startTime: moment(new Date(dateRange[0])).format("HH:mm"),
            endTime: moment(new Date(dateRange[1])).format("HH:mm"),
          },
        }
      );
      setData(res.data);
      setLoading(false);
    } else {
      setLoading(false);
      setErrorMsg("please choose date and vechicle no or company name");
    }
  };
  return (
    <>
      <div className="container">
        <h4 className="text-uppercase text-decoration-underline my-3">
          Information About MIS
        </h4>
        <div>{errmsg}</div>

        <>
          {loading ? (
            <div className="centered">
              <Spin tip="Loading">
                <div className="content" />
              </Spin>
            </div>
          ) : (
            <>
              <Form
                form={form}
                name="horizontal_login"
                className="py-5"
                layout="inline"
                onFinish={onFinish}
              >
                <Form.Item name="vechicle_no">
                  <Select
                    mode="multiple"
                    showSearch
                    allowClear={true}
                    style={{ width: 200 }}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    placeholder="vechicle_no"
                  >
                    {uniquevechicle.map((x, y) => (
                      <Select.Option value={x.vechicle_no} key={y}>
                        {x.vechicle_no}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="company">
                  <TreeSelectA />
                </Form.Item>
                <Form.Item name="date">
                  <DatePicker.RangePicker
                    format="MMM Do, YYYY"
                    value={dateRange}
                    separator={"-"}
                    onChange={(x) => {
                      setDateRange(x);
                    }}
                    allowClear={true}
                  />
                </Form.Item>
                <Form.Item shouldUpdate>
                  {() => (
                    <Button
                      className="bg-blue-500 text-white hover:bg-blue-600"
                      htmlType="submit"
                    >
                      Search
                    </Button>
                  )}
                </Form.Item>
              </Form>

              {load ? <Spin /> : <MisTable data={data} />}
            </>
          )}
        </>
      </div>
    </>
  );
};
export default FormSelect;
