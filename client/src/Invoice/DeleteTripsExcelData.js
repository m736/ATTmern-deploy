import React, { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Spin,
  Typography,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getClientMasterAction } from "../action/clientMasterAction";
import moment from "moment";
import {
  BackDatedInvoiceInputGenerateAction,
  deleteTripsExcelDataAction,
} from "../action/BackDatedInvoiceGenerateAction";
import { useNavigate } from "react-router-dom";
import {
  clearExcelDataDeleted,
  clearInvoiceError,
} from "../slices/BackDatedInvoSlice";
import { toast } from "react-toastify";
const DeleteTripsExcelData = () => {
  const { RangePicker } = DatePicker;
  const { Title } = Typography;
  const [form] = Form.useForm();
  const [companyList, setCompanyList] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [clLocation, setClLocation] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const { Option } = Select;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { client_master_detail } = useSelector(
    (state) => state.ClientMasterState || []
  );
  const { invoiceLoading, error, isExcelDataDeleted } = useSelector(
    (state) => state.BackDateInvoiceGenerateState || []
  );
  useEffect(() => {
    dispatch(getClientMasterAction);
  }, []);
  useEffect(() => {
    if (client_master_detail && client_master_detail.length > 0) {
      let companyList = client_master_detail.map((item) => {
        return {
          text: item.Company_Name,
          value: item.Company_Name,
        };
      });
      setCompanyList(removeDuplicateObjects(companyList, "value"));
    }
  }, [client_master_detail]);
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
  const onFinish = async (values) => {
    console.log(values);
    const fromandto = values?.FromAndToDate;
    const newvalue = {
      ...values,
      Fromdate: fromandto[0]?.format("YYYY-MM-DD"),
      Todate: fromandto[1]?.format("YYYY-MM-DD"),
    };

    dispatch(deleteTripsExcelDataAction(newvalue));
    form.resetFields();
  };
  useEffect(() => {
    if (isExcelDataDeleted) {
      toast("MIS Upload data Deleted Succesfully!", {
        type: "success",
        position: toast.POSITION.BOTTOM_CENTER,
        onOpen: () => dispatch(clearExcelDataDeleted()),
      });

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
  }, [isExcelDataDeleted, error, dispatch]);

  return (
    <>
      <Spin spinning={invoiceLoading} tip="Loading">
        <Form
          form={form}
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          layout="horizontal"
          style={{
            maxWidth: 600,
          }}
          onFinish={onFinish}
        >
          <Title className="mb-10 ml-7" level={3}>
            Delete Client MIS(Slab-OnCall-Trip-Day) Upload Data
          </Title>
          <Form.Item label="Client" name="Client">
            <Select
              onChange={(e) => {
                let updated = client_master_detail?.filter(
                  (item) => e == item.Company_Name
                );
                let updatedLocation = updated.map((item) =>
                  item?.Location?.map((loc) => loc?.Client_Location)
                );

                setSelectedCompany(e);
                setSelectedLocation(null);
                form.resetFields(["Location"]);
                setClLocation(updatedLocation);
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
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button htmlType="submit">Delete</Button>
          </Form.Item>
        </Form>
      </Spin>
    </>
  );
};

export default DeleteTripsExcelData;
