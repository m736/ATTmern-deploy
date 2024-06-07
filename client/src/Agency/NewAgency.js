import React, { useEffect } from "react";
import { Button, DatePicker, Form, Input, Spin, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createOwnerAction } from "../action/ownerListAction";
import {
  clearAgencyListCreated,
  clearAgencyListError,
} from "../slices/AgencySlice";
import { createAgencyAction } from "../action/AgencyListAction";
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 6,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 14,
    },
  },
};

const NewAgency = () => {
  const onFinish = (values) => {
    console.log(values);
    dispatch(createAgencyAction(values));
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const { agencyListLoading, isAgencyListCreated, error } = useSelector(
    (state) => state.AgencyState || []
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (isAgencyListCreated) {
      toast("New Agency Created Succesfully!", {
        type: "success",
        position: toast.POSITION.BOTTOM_CENTER,
        onOpen: () => dispatch(clearAgencyListCreated()),
      });
      navigate("/agencies/list_agencies");
      return;
    }

    if (error) {
      toast(error, {
        position: toast.POSITION.BOTTOM_CENTER,
        type: "error",
        onOpen: () => {
          dispatch(clearAgencyListError());
        },
      });
      return;
    }
  }, [isAgencyListCreated, error, dispatch]);
  const { Title } = Typography;
  return (
    <Spin spinning={agencyListLoading} tip="loading">
      <Title
        className="text-center py-3 text-bold uppercase underline"
        level={4}
      >
        New Agency
      </Title>
      <Form
        {...formItemLayout}
        variant="filled"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Name"
          name="owner_name"
          rules={[
            {
              required: true,
              message: "Please Enter Your Name!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Address" name="address">
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          label="Email id"
          name="email_id"
          rules={[
            {
              required: true,
              message: "Please Enter Your Email id!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Phone No" name="phone_no">
          <Input />
        </Form.Item>
        <Form.Item
          label="Pancard No"
          name="pancard_no"
          rules={[
            {
              required: true,
              message: "Please Enter Your Pancard No!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Bank Account No"
          name="bank_ccount_no"
          rules={[
            {
              required: true,
              message: "Please Enter Your Bank Account No!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Bank Name" name="bank_name">
          <Input />
        </Form.Item>
        <Form.Item label="IFSC Code" name="IFSC_code">
          <Input />
        </Form.Item>
        <Form.Item label="Bank Branch" name="bank_branch">
          <Input />
        </Form.Item>
        <Form.Item label="TDS" name="tds">
          <Input />
        </Form.Item>
        <Form.Item label="GSt" name="gst">
          <Input />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 6,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  );
};

export default NewAgency;
