import React, { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  InputNumber,
  Typography,
  Spin,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getClientMasterAction } from "../action/clientMasterAction";
import moment from "moment";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import {
  BackDatedInvoiceInputGenerateAction,
  getInvoiceNumberAction,
} from "../action/BackDatedInvoiceGenerateAction";
import {
  clearBackDatedInvoiceGenerateInput,
  clearInvoiceError,
} from "../slices/BackDatedInvoSlice";
import { useNavigate } from "react-router-dom";
const InvoiceGenerate = () => {
  const { RangePicker } = DatePicker;
  const { Title } = Typography;
  const [companyList, setCompanyList] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [clLocation, setClLocation] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const dateFormat = "YYYY-MM-DD";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [invoiceNum, setInvoiceNum] = useState("");
  const { client_master_detail } = useSelector(
    (state) => state.ClientMasterState || []
  );
  const { invoice_no, invoiceLoading, error, isInvoiceCreated } = useSelector(
    (state) => state.BackDateInvoiceGenerateState || []
  );
  useEffect(() => {
    dispatch(getClientMasterAction);
    dispatch(getInvoiceNumberAction);
  }, []);

  // console.log(invoiceNum);
  useEffect(() => {
    if (client_master_detail.length) {
      let companyList = client_master_detail.map((item) => {
        return {
          text: item.Company_Name,
          value: item.Company_Name,
        };
      });
      setCompanyList(removeDuplicateObjects(companyList, "value"));
    }
    if (invoice_no) {
      setInvoiceNum(invoice_no?.next_invoice_no);
    }
  }, [client_master_detail, invoice_no]);
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
  const { Option } = Select;

  let clientLocationMap =
    clLocation?.length &&
    clLocation?.map((item, i) => {
      return item?.map((again) => {
        return (
          <Option key={again} value={again}>
            {again}
          </Option>
        );
      });
    });
  console.log(clLocation);
  const onFinish = async (values) => {
    console.log(values);
    const fromandto = values?.FromAndToDate;
    const invoicedate = values?.Invoice_Date;

    const newvalue = {
      ...values,
      Fromdate: fromandto[0]?.format("YYYY-MM-DD"),
      Todate: fromandto[1]?.format("YYYY-MM-DD"),
      invoiceDate: invoicedate?.format("YYYY-MM-DD"),
    };
    console.log(newvalue);
    dispatch(BackDatedInvoiceInputGenerateAction(newvalue));
  };
  useEffect(() => {
    if (isInvoiceCreated) {
      toast("New Invoice Created Succesfully!", {
        type: "success",
        position: toast.POSITION.BOTTOM_CENTER,
        onOpen: () => dispatch(clearBackDatedInvoiceGenerateInput()),
      });
      navigate("/invoice/invoice_list");
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
  }, [isInvoiceCreated, error, dispatch]);
  return (
    <>
      <Spin spinning={invoiceLoading} tip="Loading">
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
              name: ["invoiceNum"],
              value: invoiceNum,
            },
            {
              name: ["Invoice_Date"],
              value: dayjs("0000-00-00", dateFormat),
            },
          ]}
          onFinish={onFinish}
        >
          {/* <Form.Item label="Client">
          <Input />
        </Form.Item> */}

          <Title className="mb-10 ml-7">Invoice Generate</Title>

          <Form.Item label="Client" name="Client">
            <Select
              style={{
                width: 300,
              }}
              onChange={(e) => {
                let updated = client_master_detail.filter(
                  (item) => e == item.Company_Name
                );
                let updatedLocation = updated.map((item) =>
                  item?.Location?.map((loc) => loc?.Client_Location)
                );
                console.log(updatedLocation);
                setClLocation(updatedLocation);
                setSelectedCompany(e);
              }}
              value={selectedCompany}
            >
              <Select.Option value="">Select Company</Select.Option>
              {companyList.map((comapny) => (
                <Option value={comapny.value}>{comapny.text}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Location" name="Location">
            <Select
              style={{
                width: 300,
              }}
              onChange={(e) => {
                setSelectedLocation(e);
              }}
              value={selectedLocation}
            >
              <Select.Option value="">Select Location</Select.Option>
              {clientLocationMap ? clientLocationMap : null}
            </Select>
          </Form.Item>

          <Form.Item label="FromAndToDate" name="FromAndToDate">
            <RangePicker />
          </Form.Item>

          <Form.Item
            label="Invoice Date"
            name="Invoice_Date"
            value={dayjs("0000-00-00", dateFormat)}
          >
            <DatePicker
              format="YYYY-MM-DD"
              value={dayjs("0000-00-00", dateFormat)}
            />
          </Form.Item>
          {invoiceNum && (
            <Form.Item label="Invoice No" name="invoiceNum" value={invoiceNum}>
              <InputNumber value={invoiceNum} readOnly />
            </Form.Item>
          )}
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

export default InvoiceGenerate;
