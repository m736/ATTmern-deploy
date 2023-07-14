import { Col, Divider, Form, Radio, Row, Select } from "antd";
import { useState } from "react";
import NewDriver from "./NewDriver";
const AddDriver = () => {
  const [value, setValue] = useState();
  const DriverSelection = (e) => {
    setValue(e.target.value);
  };
  const onChange = (value) => {
    console.log(`selected ${value}`);
  };
  const onSearch = (value) => {
    console.log("search:", value);
  };
  return (
    <>
      <Form.Item name="radio-group" label="Radio.Group">
        {/* <Radio.Group onChange={DriverSelection} value={value}>
          <Radio value={exsist}>Exsisting Driver</Radio>
          <Radio value={neww}>New Driver</Radio>
        </Radio.Group> */}
        <Radio.Group onChange={DriverSelection} value={value}>
          <Radio value={1}>Exsisting Driver</Radio>
          <Radio value={2}>New Driver</Radio>
        </Radio.Group>
      </Form.Item>
      {value == 1 && (
        <>
          <Row>
            <Col span={8}>
              <Form.Item
                name="clientname"
                label="Client Name"
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please select your Client Name!",
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Select a person"
                  optionFilterProp="children"
                  onChange={onChange}
                  onSearch={onSearch}
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={[
                    {
                      value: "jack",
                      label: "Jack",
                    },
                    {
                      value: "lucy",
                      label: "Lucy",
                    },
                    {
                      value: "tom",
                      label: "Tom",
                    },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
        </>
      )}
      {value == 2 && (
        <>
          <Row>
            <Divider />
            <NewDriver />
          </Row>
        </>
      )}
    </>
  );
};
export default AddDriver;
