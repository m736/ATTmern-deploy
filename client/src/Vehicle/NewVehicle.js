import { UploadOutlined } from "@ant-design/icons";
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
  Radio,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getDriverListAction } from "../action/DriverListAction";
import { getAgencyListAction } from "../action/AgencyListAction";
import { getOwnerListAction } from "../action/ownerListAction";
import { createVehicleAction } from "../action/VehicleInductionAction";
import { getClientMasterAction } from "../action/clientMasterAction";
import { getVehicleTypeAction } from "../action/vehicleTypeAction";
import {
  clearAddVehicleCreated,
  clearError,
} from "../slices/VehicleInductionSlice";
const { Option } = Select;

const NewVehicle = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [driverDetail, setDriverDetail] = useState([]);
  const [attachedOwnerDetail, setAttachedOwnerDetail] = useState([]);
  const [agencyDetail, setAgencyDetail] = useState([]);
  const [companyArr, setCompanyArr] = useState([]);
  const [vehicleArr, setVehicleArr] = useState([]);
  const { driver_detail, driverListLoading } = useSelector(
    (state) => state.DriverState || []
  );
  const { owner_detail, ownerListLoading } = useSelector(
    (state) => state.ownerState || []
  );
  const { agency_detail, agencyListLoading } = useSelector(
    (state) => state.AgencyState || []
  );
  const { vehicle_types } = useSelector(
    (state) => state.VehicleTypeState || []
  );
  const { client_master_detail } = useSelector(
    (state) => state.ClientMasterState || []
  );
  useEffect(() => {
    dispatch(getDriverListAction);
    dispatch(getAgencyListAction);
    dispatch(getOwnerListAction);
    dispatch(getClientMasterAction);
    dispatch(getVehicleTypeAction);
  }, []);
  useEffect(() => {
    if (driver_detail?.length) {
      setDriverDetail(driver_detail);
    }
    if (owner_detail?.length) {
      setAttachedOwnerDetail(owner_detail);
    }
    if (agency_detail?.length) {
      setAgencyDetail(agency_detail);
    }
    if (client_master_detail && client_master_detail.length > 0) {
      let companyList = client_master_detail.map((item) => {
        return {
          id: item._id,
          text: item.Company_Name,
          value: item.Company_Name,
        };
      });
      setCompanyArr(removeDuplicateObjects(companyList, "value"));
    }
    if (vehicle_types && vehicle_types.length > 0) {
      setVehicleArr(removeDuplicateObjects(vehicle_types, "value"));
    }
  }, [
    driver_detail,
    owner_detail,
    agency_detail,
    vehicle_types,
    client_master_detail,
  ]);
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
  const [form] = Form.useForm();

  const getFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList[0]?.originFileObj;
  };
  const [ownerType, setOwnerType] = useState("");
  const selectingOwner = (e) => {
    setOwnerType(e.target.value);
  };
  const onFinish = async (fieldsValue) => {
    const values = {
      ...fieldsValue,
      vehicle_regdate_exp:
        fieldsValue?.["vehicle_regdate_exp"] &&
        moment(new Date(fieldsValue?.["vehicle_regdate_exp"])).format(
          "YYYY-MM-DD"
        ),
      vehicle_taxdate_exp:
        fieldsValue?.["vehicle_taxdate_exp"] &&
        moment(new Date(fieldsValue?.["vehicle_taxdate_exp"])).format(
          "YYYY-MM-DD"
        ),
      vehicle_fitnessdate_exp:
        fieldsValue?.["vehicle_fitnessdate_exp"] &&
        moment(new Date(fieldsValue?.["vehicle_fitnessdate_exp"])).format(
          "YYYY-MM-DD"
        ),
      vehicle_insurancedate_exp:
        fieldsValue?.["vehicle_insurancedate_exp"] &&
        moment(new Date(fieldsValue?.["vehicle_insurancedate_exp"])).format(
          "YYYY-MM-DD"
        ),
    };
    console.log(values);
    dispatch(createVehicleAction(values));
  };
  const { vehicleListLoading, isVehicleListCreated, error } = useSelector(
    (state) => state.VechicleInductionState || []
  );
  useEffect(() => {
    if (isVehicleListCreated) {
      toast("New Driver Created Succesfully!", {
        type: "success",
        position: toast.POSITION.BOTTOM_CENTER,
        onOpen: () => dispatch(clearAddVehicleCreated()),
      });
      navigate("/vehicle/vehicle_list");
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
  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };
  const { Title } = Typography;
  console.log(vehicleArr);
  return (
    <>
      <Spin spinning={vehicleListLoading} tip="loading">
        <div className="container">
          <Title
            className="text-center py-3 text-bold uppercase underline"
            level={4}
          >
            New Vehicle
          </Title>
          <Form form={form} name="create_vehicle" onFinish={onFinish}>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item name="vehicle_regnumber" label="Registration Number">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="vehicle_type" label="Vehicle Type">
                  <Select showSearch allowClear>
                    {vehicleArr?.map((item) => {
                      return (
                        <Option
                          key={item?.VehicleType}
                          value={item?.VehicleType}
                        >
                          {item?.VehicleType}
                        </Option>
                      );
                    })}
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
                <Form.Item name="vehicle_client_ids" label="Client Name">
                  <Select showSearch mode="multiple" allowClear>
                    {companyArr?.map((item) => {
                      return (
                        <Option key={item.value} value={item.id}>
                          {item.text}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="vehicle_regdate_exp" label="Registration Date">
                  <DatePicker />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="vehicle_taxdate_exp" label="Tax Expiry">
                  <DatePicker />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="vehicle_fitnessdate_exp"
                  label="Fitness Expiry"
                >
                  <DatePicker />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="vehicle_insurancedate_exp"
                  label="Insurance Expiry"
                >
                  <DatePicker />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="vehicle_puc"
                  label="PUC"
                  getValueFromEvent={getFile}
                >
                  <Upload maxCount={1} customRequest={dummyRequest}>
                    <Button icon={<UploadOutlined />}>Click to upload</Button>
                  </Upload>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="vehicle_driver_id" label="Select Driver">
                  <Select style={{ width: "200px" }} showSearch allowClear>
                    {driverDetail?.map((item) => {
                      return (
                        <Option key={item._id} value={item._id}>
                          {item.driver_name}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={16}>
                <Form.Item name="owner_type" label="Select Owner Type">
                  <Radio.Group onChange={selectingOwner} value={ownerType}>
                    <Radio value="own">Own</Radio>
                    <Radio value="attached">Attached</Radio>
                    <Radio value="agency">Agency</Radio>
                  </Radio.Group>
                </Form.Item>
                {ownerType == "own" && (
                  <Row className="owner1">
                    <Form.Item label="Select Owner_Name" name="owner_id">
                      <Select style={{ width: "240px" }}>
                        <Option value="Ambassador">Ambassador</Option>
                        <Option value="ATT">ATT</Option>
                      </Select>
                    </Form.Item>
                  </Row>
                )}
                {ownerType == "attached" && (
                  <Row className="owner1">
                    <Form.Item label="Select Owner_Name" name="owner_id">
                      <Select style={{ width: "240px" }}>
                        {attachedOwnerDetail?.map((item) => {
                          return (
                            <Option
                              key={item._id}
                              value={item._id}
                              title={`${item.owner_name}-${item.pancard_no}`}
                            >
                              {item.owner_name}-{item.pancard_no}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </Row>
                )}
                {ownerType == "agency" && (
                  <Row className="owner1">
                    <Form.Item label="Select Owner_Name" name="owner_id">
                      <Select style={{ width: "240px" }}>
                        {agencyDetail?.map((item) => {
                          return (
                            <Option key={item._id} value={item._id}>
                              {item.owner_name}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </Row>
                )}{" "}
              </Col>
            </Row>

            <div
              style={{
                textAlign: "right",
              }}
            >
              <Space size="small">
                <Button htmlType="submit">Submit</Button>
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
      </Spin>
    </>
  );
};

export default NewVehicle;
