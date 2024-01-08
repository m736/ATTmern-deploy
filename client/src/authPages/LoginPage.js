import React from "react";
import { Button, Typography, Form, Input } from "antd";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthError, login } from "../action/userAction";

import { toast } from "react-toastify";
import { Link, useLocation, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { Title } = Typography;
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.authState
  );
  const redirect = location.search ? "/" + location.search.split("=")[1] : "/";
  console.log(redirect);
  const onFinish = (values) => {
    dispatch(login(values));
  };
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirect);
    }
  }, [isAuthenticated, dispatch, navigate]);
  return (
    <>
      <Title className="ml-80 mb-10">Login</Title>
      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
          padding: 50,
          marginLeft: 130,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        autoComplete="none"
      >
        <Form.Item label="Username" name="email">
          <Input />
        </Form.Item>

        <Form.Item label="Password" name="password">
          <Input.Password />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default LoginPage;
