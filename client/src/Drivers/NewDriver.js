import {
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Checkbox,
  Upload,
  Button,
  Typography,
  Spin,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { createDriverAction } from "../action/DriverListAction";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearDriverListCreated } from "../slices/DriverSlice";
import { toast } from "react-toastify";
import moment from "moment";
const { TextArea } = Input;
const { Title } = Typography;
const NewDriver = () => {
  const [pccchecked, setPccChecked] = useState(false);
  const [insurancechecked, setInsurancechecked] = useState(false);
  const [medicalinsurance, setMedicalInsurance] = useState(false);
  const [badgefile, setBadgeFile] = useState(false);
  const [bgvfile, setBgvFile] = useState(false);
  const [driverphoto, setDriverPhoto] = useState([]);
  const pccChange = (e) => {
    setPccChecked(e.target.checked);
  };
  const InsuranceChange = (e) => {
    setInsurancechecked(e.target.checked);
  };
  const normFile = (e) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  const getFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    console.log(e);
    return e?.fileList[0]?.originFileObj;
  };
  const dispatch = useDispatch();
  const onFinish = (fieldsValue) => {
    const values = {
      ...fieldsValue,
      driver_licence_exp: moment(
        new Date(fieldsValue["driver_licence_exp"])
      ).format("YYYY-MM-DD"),
      driver_pcc_exp: moment(new Date(fieldsValue["driver_pcc_exp"])).format(
        "YYYY-MM-DD"
      ),
      driver_badge_exp: moment(
        new Date(fieldsValue["driver_badge_exp"])
      ).format("YYYY-MM-DD"),
      driver_dob: moment(new Date(fieldsValue["driver_dob"])).format(
        "YYYY-MM-DD"
      ),
    };
    console.log(values);
    dispatch(createDriverAction(values));
  };
  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };
  const { driverListLoading, isDriverListCreated, error } = useSelector(
    (state) => state.DriverState || []
  );
  const navigate = useNavigate();
  useEffect(() => {
    if (isDriverListCreated) {
      toast("New Driver Created Succesfully!", {
        type: "success",
        position: toast.POSITION.BOTTOM_CENTER,
        onOpen: () => dispatch(clearDriverListCreated()),
      });
      navigate("/driver/list_driver");
      return;
    }

    if (error) {
      toast(error, {
        position: toast.POSITION.BOTTOM_CENTER,
        type: "error",
        onOpen: () => {
          dispatch(clearDriverListCreated());
        },
      });
      return;
    }
  }, [isDriverListCreated, error, dispatch]);
  const { Title } = Typography;
  return (
    <>
      <Spin spinning={driverListLoading} tip="loading">
        <Title
          className="text-center py-3 text-bold uppercase underline"
          level={4}
        >
          Driver Details
        </Title>
        <Form onFinish={onFinish}>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="driver_name"
                label="Driver Name"
                rules={[
                  {
                    required: true,
                    message: "Please Enter Your Driver_name!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="driver_dob" label="Driver DOB">
                <DatePicker />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="driver_address" label="Driver Address">
                <TextArea rows={2} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="driver_licence_no" label="Licence Number">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="driver_badge_no" label="Badge Number">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="driver_licence_exp" label="Licence Expiry">
                <DatePicker />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="driver_badge_exp" label="Badge Expiry">
                <DatePicker />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="driver_contact_no" label="Driver Contact No">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="driver_aadhar_no" label="Driver Aadhar No">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="driver_photo"
                label="Driver Photo"
                getValueFromEvent={getFile}
              >
                <Upload
                  maxCount={1}
                  // customRequest={(info) => {
                  //   setDriverPhoto([info.file]);
                  // }}
                  customRequest={dummyRequest}
                >
                  <Button icon={<UploadOutlined />}>Click to upload</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="PCC">
                <Checkbox onChange={pccChange}></Checkbox>
              </Form.Item>
              {pccchecked && (
                <Row className="checked_input">
                  <Form.Item
                    name="driver_pcc_file_upload"
                    label="PCC_File"
                    getValueFromEvent={getFile}
                  >
                    <Upload customRequest={dummyRequest}>
                      <Button icon={<UploadOutlined />}>Click to upload</Button>
                    </Upload>
                  </Form.Item>
                  <Form.Item
                    label="Application No"
                    name="driver_pcc_application_no"
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item label="Expiry Date" name="driver_pcc_exp">
                    <DatePicker />
                  </Form.Item>
                </Row>
              )}
            </Col>

            <Col span={12}>
              <Form.Item label="Insurance">
                <Checkbox onChange={InsuranceChange}></Checkbox>
              </Form.Item>
              {insurancechecked && (
                <Row className="checked_input">
                  <Form.Item name="driver_insurance_no" label="Insurance No">
                    <Input />
                  </Form.Item>
                </Row>
              )}
            </Col>
            <Col span={12}>
              <Form.Item label="Medical Insurance">
                <Checkbox
                  onChange={(e) => {
                    setMedicalInsurance(e.target.checked);
                  }}
                ></Checkbox>
              </Form.Item>
              {medicalinsurance && (
                <Row className="checked_input">
                  <Form.Item
                    name="driver_medical_insuranceno"
                    label="MedicalInsurance No"
                  >
                    <Input />
                  </Form.Item>
                </Row>
              )}
            </Col>

            <Col span={12}>
              <Form.Item label="Display Badge">
                <Checkbox
                  onChange={(e) => {
                    setBadgeFile(e.target.checked);
                  }}
                ></Checkbox>
              </Form.Item>
              {badgefile && (
                <Row className="checked_input">
                  <Form.Item
                    name="driver_badgefile_upload"
                    label="Badge_File"
                    getValueFromEvent={getFile}
                  >
                    <Upload customRequest={dummyRequest}>
                      <Button icon={<UploadOutlined />}>Click to upload</Button>
                    </Upload>
                  </Form.Item>
                </Row>
              )}
            </Col>
            <Col span={12}>
              <Form.Item label="BGV">
                <Checkbox
                  onChange={(e) => {
                    setBgvFile(e.target.checked);
                  }}
                ></Checkbox>
              </Form.Item>
              {bgvfile && (
                <Row className="checked_input">
                  <Form.Item
                    name="driver_bgv_file_upload"
                    label="BGV_File"
                    getValueFromEvent={getFile}
                  >
                    <Upload customRequest={dummyRequest}>
                      <Button icon={<UploadOutlined />}>Click to upload</Button>
                    </Upload>
                  </Form.Item>
                </Row>
              )}
            </Col>
          </Row>
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
    </>
  );
};

export default NewDriver;
