import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  Spin,
  Typography,
} from "antd";
import { NumericInput } from "../Tarrif/NumericInput";
import { useDispatch, useSelector } from "react-redux";
import {
  getInvoiceNumberAction,
  updateInvoiceNumberAction,
} from "../action/BackDatedInvoiceGenerateAction";
import {
  clearInvoiceError,
  clearUpdateInvoiceNoDeleted,
  getInvoiceNoFail,
  getInvoiceNoRequest,
  getInvoiceNoSuccess,
} from "../slices/BackDatedInvoSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const InvoiceNumber = () => {
  const { Title } = Typography;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [invoiceNum, setInvoiceNum] = useState({});
  const { invoice_no, invoiceLoading, error, isInvoiceNoUpdated } = useSelector(
    (state) => state.BackDateInvoiceGenerateState || []
  );
  useEffect(() => {
    dispatch(getInvoiceNumberAction);
  }, []);
  useEffect(() => {
    if (invoice_no) {
      setInvoiceNum(invoice_no);
    }
  }, [invoice_no]);

  const onFinish = async (values) => {
    dispatch(updateInvoiceNumberAction(values));
  };
  useEffect(() => {
    if (isInvoiceNoUpdated) {
      toast("Invoice Number Updated Succesfully!", {
        type: "success",
        position: toast.POSITION.BOTTOM_CENTER,
        onOpen: () => dispatch(clearUpdateInvoiceNoDeleted()),
      });
      navigate("/invoice/invoice_no");
      return;
    }

    if (error) {
      toast(error, {
        position: toast.POSITION.BOTTOM_CENTER,
        type: "error",
        onOpen: () => {
          dispatch(clearInvoiceError());
        },
      });
      return;
    }
  }, [isInvoiceNoUpdated, error, dispatch]);
  return (
    <>
      <Spin spinning={invoiceLoading} tip="Loading">
        <Title className="mb-10 ml-7">Invoice Generate</Title>
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
          fields={[
            {
              name: ["last_invoice_no"],
              value: invoiceNum?.last_invoice_no,
            },
            {
              name: ["invoice_no"],
              value: invoiceNum?.next_invoice_no,
            },
          ]}
          autoComplete="off"
          onFinish={onFinish}
        >
          {invoiceNum && (
            <>
              <Form.Item
                label="Last Invoice No"
                name="last_invoice_no"
                value={invoiceNum?.last_invoice_no}
              >
                <InputNumber
                  value={invoiceNum?.last_invoice_no}
                  readOnly={true}
                />
              </Form.Item>
              <Form.Item
                label="Next Invoice No"
                name="invoice_no"
                value={invoiceNum?.next_invoice_no}
              >
                <NumericInput value={invoiceNum?.next_invoice_no} />
              </Form.Item>
            </>
          )}

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button htmlType="submit">Update</Button>
          </Form.Item>
        </Form>
      </Spin>
    </>
  );
};

export default InvoiceNumber;
