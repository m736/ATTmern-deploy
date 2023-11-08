import React, { useState } from "react";
import {
  Button,
  Col,
  Divider,
  Input,
  Radio,
  Row,
  Select,
  Typography,
} from "antd";
const style = {
  padding: "0px 0px 30px 0px",
};
const { Option } = Select;
const { TextArea } = Input;

const ManualInvoice = () => {
  const [value, setValue] = useState(1);
  return (
    <>
      <h1 className="text-center lg mb-9 font-bold">Manual Invoice</h1>
      <Row>
        <Col
          lg={{
            span: 9,
            offset: 2,
          }}
          style={style}
        >
          <Typography.Text>Invoice No :</Typography.Text>
          <Input />
        </Col>
        <Col
          lg={{
            span: 9,
            offset: 2,
          }}
          style={style}
        >
          <Typography.Text>Invoice Date :</Typography.Text>
        </Col>

        <Col
          lg={{
            span: 9,
            offset: 2,
          }}
          style={style}
        >
          <Typography.Text>Invoice Month :</Typography.Text>
          <Select style={{ width: "100%" }}>
            <Option key="January" value="January">
              January
            </Option>
          </Select>
        </Col>
        <Col
          lg={{
            span: 9,
            offset: 2,
          }}
          style={style}
        >
          <Typography.Text>Trips Date :</Typography.Text>
          <Input />
        </Col>
        <Col
          lg={{
            span: 9,
            offset: 2,
          }}
          style={style}
        >
          <Typography.Text>Personal Name :</Typography.Text>
          <Input />
        </Col>
        <Col
          lg={{
            span: 9,
            offset: 2,
          }}
          style={style}
        >
          <Typography.Text>Address :</Typography.Text>
          <TextArea rows={4} />
        </Col>
        <Col
          lg={{
            span: 9,
            offset: 2,
          }}
          style={style}
        >
          <Typography.Text>Client Name :</Typography.Text>
          <Select style={{ width: "100%" }}>
            <Option key="January" value="January">
              January
            </Option>
          </Select>
        </Col>
        <Col
          lg={{
            span: 9,
            offset: 2,
          }}
          style={style}
        >
          <Typography.Text>Vendor Name :</Typography.Text>
          <Select style={{ width: "100%" }}>
            <Option key="January" value="January">
              January
            </Option>
          </Select>
        </Col>
        <Col
          lg={{
            span: 9,
            offset: 2,
          }}
          style={style}
        >
          <Radio.Group value={value}>
            <Radio value={1}>Individual </Radio>
            <Radio value={2}>Company</Radio>
          </Radio.Group>
        </Col>
      </Row>
      <Row>
        <Col
          lg={{
            span: 3,
            offset: 2,
          }}
          style={style}
        >
          <Typography.Text>GST Number:</Typography.Text>
          <Input />
        </Col>
        <Col
          lg={{
            span: 3,
            offset: 1,
          }}
          style={style}
        >
          <Typography.Text>C GST :</Typography.Text>
          <Input />
        </Col>
        <Col
          lg={{
            span: 3,
            offset: 1,
          }}
          style={style}
        >
          <Typography.Text>S GST :</Typography.Text>
          <Input />
        </Col>
        <Col
          lg={{
            span: 3,
            offset: 1,
          }}
          style={style}
        >
          <Typography.Text>I GST :</Typography.Text>
          <Input />
        </Col>
        <Col
          lg={{
            span: 3,
            offset: 1,
          }}
          style={style}
        >
          <Typography.Text>Nett :</Typography.Text>
          <Input />
        </Col>
      </Row>
      <Row>
        <Col
          lg={{
            span: 4,
            offset: 2,
          }}
          style={style}
        >
          <Button>Submit</Button>
        </Col>
      </Row>
    </>
  );
};

export default ManualInvoice;
