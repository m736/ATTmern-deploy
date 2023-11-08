import { UploadOutlined } from "@ant-design/icons";
import moment from "moment";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Space,
  Spin,
  Upload,
  theme,
} from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import AddDriver from "../Driver/AddDriver";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  addVehicleFail,
  addVehicleRequest,
  addVehicleSuccess,
  clearAddVehicleCreated,
  clearError,
} from "../slices/VehicleInductionSlice";
import { useNavigate } from "react-router-dom";
const { Option } = Select;
const AdvancedSearchForm = () => {
  const { loading, isVehicleListCreated, error } = useSelector(
    (state) => state.VechicleInductionState
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [regdate, setRegDate] = useState([]);
  const [taxdate, setTaxDate] = useState([]);
  const [fitnesdate, setFitnesDate] = useState([]);
  const [insurancedate, setInsuranceDate] = useState([]);

  const formStyle = {
    maxWidth: "none",
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: 24,
  };
  const getFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e?.fileList[0]?.originFileObj;
  };
  const onFinish = async (values) => {
    const dob = values.driver_dob;
    const badgexp = values.driver_badge_exp;
    const licencexp = values.driver_licence_exp;
    const pccexp = values.driver_pcc_exp;
    const newvalue = {
      ...values,
      DriverDOB: moment(new Date(dob)).format("DD-MM-YYYY"),
      DriverBadgeExp: moment(new Date(badgexp)).format("DD-MM-YYYY"),
      DriverLicenceExp: moment(new Date(licencexp)).format("DD-MM-YYYY"),
      DriverPccExp: moment(new Date(pccexp)).format("DD-MM-YYYY"),
      RegDate: moment(new Date(regdate)).format("DD-MM-YYYY"),
      TaxDate: moment(new Date(taxdate)).format("DD-MM-YYYY"),
      FitnessDate: moment(new Date(fitnesdate)).format("DD-MM-YYYY"),
      InsuranceDate: moment(new Date(insurancedate)).format("DD-MM-YYYY"),
    };

    const formData = new FormData();
    formData.append("vehicle_regnumber", newvalue.vehicle_regnumber);
    formData.append("vehicle_type", newvalue.vehicle_type);
    formData.append("vehicle_model", newvalue.vehicle_model);
    formData.append("vehicle_clientname", newvalue.vehicle_clientname);
    formData.append("vehicle_regdate_exp", newvalue.RegDate);
    formData.append("vehicle_taxdate_exp", newvalue.TaxDate);
    formData.append("vehicle_fitnessdate_exp", newvalue.FitnessDate);
    formData.append("vehicle_insurancedate_exp", newvalue.InsuranceDate);
    formData.append("vehicle_puc", newvalue.vehicle_puc);
    formData.append("driver_name", newvalue.driver_name);
    formData.append("driver_dob", newvalue.DriverDOB);
    formData.append("driver_address", newvalue.driver_address);
    formData.append("driver_licence_no", newvalue.driver_licence_no);
    formData.append("driver_badge_no", newvalue.driver_badge_no);
    formData.append("driver_licence_exp", newvalue.DriverLicenceExp);
    formData.append("driver_badge_exp", newvalue.DriverBadgeExp);
    formData.append("driver_contact_no", newvalue.driver_contact_no);
    formData.append("driver_aadhar_no", newvalue.driver_aadhar_no);
    formData.append(
      "driver_pcc_file_upload",
      newvalue.driver_pcc_file_upload?.file?.originFileObj
    );
    formData.append("driver_pcc_exp", newvalue.DriverPccExp);
    formData.append("driver_pcc_application_no", newvalue.pcc_application_no);
    formData.append(
      "driver_medical_insuranceno",
      newvalue.driver_medical_insuranceno
    );
    formData.append(
      "driver_bgv_file_upload",
      newvalue.driver_bgv_file_upload?.file?.originFileObj
    );
    formData.append("driver_photo", newvalue.driver_photo?.file?.originFileObj);
    formData.append("driver_insurance_no", newvalue.driver_insurance_no);
    formData.append(
      "driver_badgefile_upload",
      newvalue.driver_badgefile_upload?.file?.originFileObj
    );

    try {
      dispatch(addVehicleRequest());
      const { data } = await axios.post(`/vehicle/addvehicle`, formData, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      });
      dispatch(addVehicleSuccess(data));
    } catch (error) {
      dispatch(addVehicleFail(error.response.data.message));
    }
  };

  useEffect(() => {
    if (isVehicleListCreated) {
      toast("New Vehicle Created Succesfully!", {
        type: "success",
        position: toast.POSITION.BOTTOM_CENTER,
        onOpen: () => dispatch(clearAddVehicleCreated()),
      });
      navigate("/vehicle_list");
      return;
    }

    if (error) {
      toast(error, {
        position: toast.POSITION.BOTTOM_CENTER,
        type: "error",
        onOpen: () => {
          dispatch(clearError());
        },
      });
      return;
    }
  }, [isVehicleListCreated, error, dispatch]);

  const handleChange = (info) => {
    let newFileList = [...info.fileList];

    newFileList = newFileList.slice(-1);
    newFileList = newFileList.map((file) => {
      if (file.response) {
        file.url = file.response.url;
      }
      return file;
    });
    setFileList(newFileList);
  };
  return (
    <>
      <div className="container">
        <h3 className="text-center py-3 text-bold">Add-Vehicle</h3>
        <Form
          form={form}
          name="add-vehicle"
          style={formStyle}
          onFinish={onFinish}
        >
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item name="vehicle_regnumber" label="Registration Number">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="vehicle_type" label="Vehicle Type">
                <Select>
                  <Option value="TT">TT</Option>
                  <Option value="DZIRE">DZIRE</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="vehicle_model"
                label="Make (Model)"
                rules={[
                  {
                    type: "text",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="vehicle_clientname" label="Client Name">
                <Select>
                  <Option value="APC">APC</Option>
                  <Option value="IBM">IBM</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="vehicle_regdate_exp" label="Registration Date">
                <DatePicker
                  onChange={(x) => {
                    setRegDate(x);
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="vehicle_taxdate_exp" label="Tax Expiry">
                <DatePicker
                  onChange={(x) => {
                    setTaxDate(x);
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="vehicle_fitnessdate_exp" label="Fitness Expiry">
                <DatePicker
                  onChange={(x) => {
                    setFitnesDate(x);
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="vehicle_insurancedate_exp"
                label="Insurance Expiry"
              >
                <DatePicker
                  onChange={(x) => {
                    setInsuranceDate(x);
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="vehicle_puc"
                label="PUC"
                getValueFromEvent={getFile}
              >
                <Upload
                  maxCount={1}
                  showUploadList={true}
                  onChange={handleChange}
                  fileList={fileList}
                >
                  <Button icon={<UploadOutlined />}>Click to upload</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <AddDriver />
            </Col>
          </Row>
          <div
            style={{
              textAlign: "right",
            }}
          >
            <Space size="small">
              <Button htmlType="submit" disabled={loading ? <Spin /> : null}>
                Submit
              </Button>
              <Button
                onClick={() => {
                  form.resetFields();
                }}
              >
                Clear
              </Button>
            </Space>
          </div>
        </Form>
      </div>
    </>
  );
};
const AddVehicleList = () => {
  return (
    <>
      <AdvancedSearchForm />
    </>
  );
};
export default AddVehicleList;
