import React, { useEffect, useState } from "react";
import { Button, DatePicker, Form, Typography, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getClientMasterAction } from "../action/clientMasterAction";
import moment from "moment";
import dayjs from "dayjs";
import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";
import {
  clearProMemoListCreated,
  clearProMemoListError,
} from "../slices/PurchaseMemoSlice";
import { createProMemoAction } from "../action/PurchaseMemoAction";

const CreatePurchaseMemo = () => {
  const { RangePicker } = DatePicker;
  const { Title } = Typography;
  const dateFormat = "YYYY-MM-DD";
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { proMemoLoading, error, isProMemoCreated } = useSelector(
    (state) => state.PurchaseMemoState || []
  );
  const onFinish = async (values) => {
    console.log(values);
    const fromandto = values?.FromAndToDate;
    const prodate = values?.purchase_memo_date;

    const newvalue = {
      ...values,
      startDate: fromandto[0]?.format("YYYY-MM-DD"),
      endDate: fromandto[1]?.format("YYYY-MM-DD"),
      purchase_memo_date: prodate.format("YYYY-MM-DD"),
    };
    console.log(newvalue);
    dispatch(createProMemoAction(newvalue));
  };
  useEffect(() => {
    if (isProMemoCreated) {
      toast("New Pro Memo Created Succesfully!", {
        type: "success",
        position: toast.POSITION.BOTTOM_CENTER,
        onOpen: () => dispatch(clearProMemoListCreated()),
      });
      navigate("/purchase_memo/list_purchase_memo");
      return;
    }

    if (error) {
      toast(error, {
        position: toast.POSITION.BOTTOM_CENTER,
        type: "error",
        onOpen: () => {
          dispatch(clearProMemoListError());
        },
      });
      return;
    }
  }, [isProMemoCreated, error, dispatch]);
  return (
    <>
      <Spin spinning={proMemoLoading} tip="Loading">
        <Title className="ml-10 py-3 text-bold uppercase" level={3}>
          PurchaseMemo Generate
        </Title>
        <Form
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          layout="horizontal"
          fields={[
            {
              name: ["purchase_memo_date"],
              value: dayjs("0000-00-00", dateFormat),
            },
          ]}
          onFinish={onFinish}
        >
          {/* <Form.Item label="Client">
            <Input />
          </Form.Item> */}

          <Form.Item label="FromAndToDate" name="FromAndToDate">
            <RangePicker />
          </Form.Item>

          <Form.Item label="Purchase_Memo Date" name="purchase_memo_date">
            <DatePicker
              format="YYYY-MM-DD"
              value={dayjs("0000-00-00", dateFormat)}
            />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button htmlType="submit">Create</Button>
          </Form.Item>
        </Form>
      </Spin>
    </>
  );
};

export default CreatePurchaseMemo;
