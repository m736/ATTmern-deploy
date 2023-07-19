import { useState } from "react";
import * as React from "react";
import { Form, Input, Button, Table, Select } from "antd";
import { PlusOutlined, EditOutlined, MinusOutlined } from "@ant-design/icons";

const { Column } = Table;

export const TarrifTable = (props) => {
  const { users, add, remove } = props;
  const [editingIndex, setEditingIndex] = useState(undefined);
  const { Option } = Select;

  return (
    <Table
      dataSource={users}
      pagination={false}
      footer={() => {
        return (
          <Form.Item>
            <Button onClick={add}>
              <PlusOutlined /> Add field
            </Button>
          </Form.Item>
        );
      }}
    >
      <Column
        dataIndex={"rental"}
        title={"Rental"}
        render={(value, row, index) => {
          return (
            <Form.Item name={[index, "rental"]}>
              <Select placeholder="Please select a country">
                <Option value="china">China</Option>
                <Option value="usa">U.S.A</Option>
              </Select>
            </Form.Item>
          );
        }}
      />
      <Column
        dataIndex={"segment"}
        title={"Segment"}
        render={(value, row, index) => {
          return (
            <Form.Item name={[index, "segment"]}>
              <Input placeholder="segment" />
            </Form.Item>
          );
        }}
      />
      <Column
        dataIndex={"area"}
        title={"Area"}
        render={(value, row, index) => {
          return (
            <Form.Item name={[index, "area"]}>
              <Input placeholder="area" />
            </Form.Item>
          );
        }}
      />
      <Column
        dataIndex={"slabhrs"}
        title={"slabhrs"}
        render={(value, row, index) => {
          return (
            <Form.Item name={[index, "slabhrs"]}>
              <Input placeholder="slabhrs" />
            </Form.Item>
          );
        }}
      />
      <Column
        title={"Action"}
        render={(value, row, index) => {
          return (
            <React.Fragment>
              <Button
                icon={<MinusOutlined />}
                shape={"circle"}
                onClick={() => remove(row.name)}
              />
            </React.Fragment>
          );
        }}
      />
    </Table>
  );
};
