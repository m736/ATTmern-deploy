import React, { useCallback, useEffect, useState } from "react";
import { Button, Checkbox, Form, Input, InputNumber } from "antd";
import { NumericInput } from "../Tarrif/NumericInput";
import { useDispatch, useSelector } from "react-redux";
import {
  getInvoiceNumberAction,
  updateInvoiceNumberAction,
} from "../action/BackDatedInvoiceGenerateAction";
import {
  getInvoiceNoFail,
  getInvoiceNoRequest,
  getInvoiceNoSuccess,
} from "../slices/BackDatedInvoSlice";
import axios from "axios";

const InvoiceNumber = () => {
  const dispatch = useDispatch();
  const [invoiceNum, setInvoiceNum] = useState([]);
  const { invoice_no, invoiceLoading, error } = useSelector(
    (state) => state.BackDateInvoiceGenerateState || []
  );
  // useEffect(() => {
  //   if (invoice_no && invoice_no.length) {
  //     console.log(invoice_no);
  //     setInvoiceNum(invoice_no);
  //   } else {
  //     dispatch(getInvoiceNumberAction);
  //   }
  // }, []);
  // console.log(invoiceNum);
  // const [tabledata, setTabledata] = useState([]);
  const fetchData = useCallback(async () => {
    try {
      dispatch(getInvoiceNoRequest());

      const { data } = await axios.get("/invoice/invoice_no_api");
      setInvoiceNum(data.getInvoiceNumber);
      dispatch(getInvoiceNoSuccess(data));
    } catch (error) {
      //handle error
      dispatch(getInvoiceNoFail(error));
    }
  }, [dispatch]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  const onFinish = async (values) => {
    dispatch(updateInvoiceNumberAction(values));
    fetchData();
    // dispatch(BackDatedInvoiceInputGenerateAction(newvalue));
  };
  return invoiceNum?.map((item) => (
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
      }}
      initialValues={{
        remember: true,
      }}
      autoComplete="off"
      onFinish={onFinish}
    >
      <Form.Item label="Last Invoice No" name="last_invoice_no">
        {/* <NumericInput
          defaultValue={Number(item.last_invoice_no)}
          value={Number(item.last_invoice_no)}
          inputReadOnly={true}
        /> */}
        <InputNumber defaultValue={item?.last_invoice_no} readOnly={true} />
      </Form.Item>
      <Form.Item
        label="Next Invoice No"
        name="invoice_no"
        rules={[
          {
            required: true,
            message: "Please input your Invoice No!",
          },
        ]}
      >
        <NumericInput
          defaultValue={Number(item.next_invoice_no)}
          value={Number(item.next_invoice_no)}
        />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit">Update</Button>
      </Form.Item>
    </Form>
  ));
};

export default InvoiceNumber;
