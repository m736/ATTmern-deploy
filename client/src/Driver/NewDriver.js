import {
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Checkbox,
  Upload,
  Button,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
const { TextArea } = Input;
const DriverDetailForm = () => {
  const [pccchecked, setPccChecked] = useState(false);
  const [pccfileList, setPccFileList] = useState([]);
  const [insurancechecked, setInsurancechecked] = useState(false);
  const [medicalinsurance, setMedicalInsurance] = useState(false);
  const [badgefile, setBadgeFile] = useState(false);
  const [badgefileList, setBadgeFileList] = useState([]);
  const [bgvfile, setBgvFile] = useState(false);
  const [bgvfileList, setBgvFileList] = useState([]);
  const [driverphoto, setDriverPhoto] = useState([]);
  const pccChange = (e) => {
    setPccChecked(e.target.checked);
  };
  const InsuranceChange = (e) => {
    setInsurancechecked(e.target.checked);
  };
  const getFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e?.file;
  };
  return (
    <>
      <h3 className="text-center py-3 text-bold">Driver Details</h3>
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item name="driver_name" label="Driver Name">
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
          <Form.Item name="driver_photo" label="Driver Photo">
            <Upload
              maxCount={1}
              customRequest={(info) => {
                setDriverPhoto([info.file]);
              }}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Click to upload</Button>
              {driverphoto[0]?.name}
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
                <Upload
                  customRequest={(info) => {
                    setPccFileList([info.file]);
                  }}
                  showUploadList={false}
                >
                  <Button icon={<UploadOutlined />}>Click to upload</Button>
                  {pccfileList[0]?.name}
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
              <Form.Item name="driver_badgefile_upload" label="Badge_File">
                <Upload
                  customRequest={(info) => {
                    setBadgeFileList([info.file]);
                  }}
                  showUploadList={false}
                >
                  <Button icon={<UploadOutlined />}>Click to upload</Button>
                  {badgefileList[0]?.name}
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
              <Form.Item name="driver_bgv_file_upload" label="BGV_File">
                <Upload
                  customRequest={(info) => {
                    setBgvFileList([info.file]);
                  }}
                  showUploadList={false}
                >
                  <Button icon={<UploadOutlined />}>Click to upload</Button>
                  {bgvfileList[0]?.name}
                </Upload>
              </Form.Item>
            </Row>
          )}
        </Col>
      </Row>
    </>
  );
};
const NewDriver = () => {
  return (
    <>
      <DriverDetailForm />
    </>
  );
};
export default NewDriver;
