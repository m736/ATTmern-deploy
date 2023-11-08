import React from "react";
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

const InvoiceGenerate = () => {
  return (
    <>
      <h1 className="text-center lg mb-9 font-bold">Invoice Generate</h1>
      <Row>
        <Col
          lg={{
            span: 9,
            offset: 2,
          }}
          style={style}
        >
          <Typography.Text>Client :</Typography.Text>
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
          <Typography.Text>Location</Typography.Text>
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
          <Typography.Text> Date :</Typography.Text>
          <Input />
        </Col>
        <Col
          lg={{
            span: 9,
            offset: 2,
          }}
          style={style}
        >
          <Typography.Text>Incentive / Deduction</Typography.Text>
          <Input />
        </Col>
        <Col
          lg={{
            span: 9,
            offset: 2,
          }}
          style={style}
        >
          <Typography.Text>Toll</Typography.Text>
          <Input />
        </Col>
        <Col
          lg={{
            span: 9,
            offset: 2,
          }}
          style={style}
        >
          <Typography.Text>Penalty</Typography.Text>
          <Input />
        </Col>
        <Col
          lg={{
            span: 9,
            offset: 2,
          }}
          style={style}
        >
          <Typography.Text>Adjustment</Typography.Text>
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

export default InvoiceGenerate;
