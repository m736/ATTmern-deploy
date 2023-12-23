import React, { useEffect, useState } from "react";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Space,
  Spin,
  Typography,
} from "antd";
import { MIGInputField } from "./MIGInputField";
import { useDispatch, useSelector } from "react-redux";
import { getClientMasterAction } from "../action/clientMasterAction";
import MergeInvoiceGenerateAddField from "./MergeInvoiceGenerateAddField";
import {
  MergeInvoiceInputGenerateAction,
  getInvoiceNumberAction,
} from "../action/BackDatedInvoiceGenerateAction";
import dayjs from "dayjs";
import moment from "moment";
import { toast } from "react-toastify";
import {
  clearInvoiceError,
  clearMergeInvoiceGenerateInput,
} from "../slices/BackDatedInvoSlice";
import { useNavigate } from "react-router-dom";
const MergeInvoiceGenerate = () => {
  const { Title } = Typography;
  const dateFormat = "YYYY-MM-DD";
  const [invoiceDate, setInvoiceDate] = useState(moment().format("YYYY-MM-DD"));
  const [invoiceNum, setInvoiceNum] = useState("");
  const [inputFieldObj, setInputFieldObj] = useState(MIGInputField);
  const [MGIInputArr, setMGIInputArr] = useState([]);
  const [clientArr, setClienArr] = useState([]);
  const [clLocation, setClLocation] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { client_master_detail } = useSelector(
    (state) => state.ClientMasterState || []
  );
  const { invoice_no, invoiceLoading, error, isMergeInvoiceCreated } =
    useSelector((state) => state.BackDateInvoiceGenerateState || []);
  useEffect(() => {
    dispatch(getClientMasterAction);
    dispatch(getInvoiceNumberAction);
  }, []);
  useEffect(() => {
    if (client_master_detail && client_master_detail.length) {
      setClienArr(client_master_detail);
      setMGIInputArr([{ ...inputFieldObj, client: client_master_detail }]);
    }
    if (invoice_no) {
      setInvoiceNum(invoice_no?.next_invoice_no);
    }
  }, [client_master_detail, invoice_no]);
  const formDetails = () => {
    const updated = {
      invoiceNum: invoiceNum,
      invoiceDate: invoiceDate,
      MGIInputArr: MGIInputArr,
    };

    console.log(updated);
    setMGIInputArr(MGIInputArr);
    dispatch(MergeInvoiceInputGenerateAction(updated));
  };
  useEffect(() => {
    if (isMergeInvoiceCreated) {
      toast("New Invoice Created Succesfully!", {
        type: "success",
        position: toast.POSITION.BOTTOM_CENTER,
        onOpen: () => dispatch(clearMergeInvoiceGenerateInput()),
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
  }, [isMergeInvoiceCreated, error, dispatch]);

  return (
    <>
      <Spin spinning={invoiceLoading} tip="Loading">
        <Card>
          <Title className="mb-10">Merge Invoice Generate</Title>
          <Row className="mt-3">
            <Col span={4}>Invoice Date</Col>
            <Col span={8} offset={2}>
              <DatePicker
                defaultValue={dayjs("0000-00-00", dateFormat)}
                value={dayjs("0000-00-00", dateFormat)}
                format={dateFormat}
                onChange={(value, dateString) => {
                  console.log(dateString[0]);
                  console.log(dateString[1]);
                  setInvoiceDate(dateString);
                }}
              />
            </Col>
          </Row>
          <Row className="mt-3">
            <Col span={4}>Invoice No</Col>
            <Col span={8} offset={2}>
              <InputNumber value={invoiceNum} readOnly />
            </Col>
          </Row>
          {MGIInputArr?.map((item, index) => {
            return (
              <MergeInvoiceGenerateAddField
                key={index}
                screenAdd={"add"}
                MGIInputArr={MGIInputArr}
                setMGIInputArr={setMGIInputArr}
                addField={item}
                setInputFieldObj={setInputFieldObj}
                index={index}
                clientArr={clientArr}
                inputFieldObj={inputFieldObj}
                clLocation={clLocation}
                setClLocation={setClLocation}
              />
            );
          })}
          <Button className="mt-3" onClick={formDetails}>
            Submit
          </Button>
        </Card>
      </Spin>
    </>
  );
};

export default MergeInvoiceGenerate;
