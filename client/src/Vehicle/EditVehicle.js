import {
  Button,
  Spin,
  Space,
  Typography,
  DatePicker,
  Input,
  Select,
  Upload,
  Radio,
} from "antd";
import moment from "moment";
import dayjs from "dayjs";
import { UploadOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getIndividualVechicleAction,
  getVechicleAction,
  updateVehicleAction,
} from "../action/VehicleInductionAction";
import { getDriverListAction } from "../action/DriverListAction";
import { getAgencyListAction } from "../action/AgencyListAction";
import { getOwnerListAction } from "../action/ownerListAction";
import { getClientMasterAction } from "../action/clientMasterAction";
import {
  clearError,
  clearUpdateVehicleListCreated,
  clearVehicleListDeleted,
} from "../slices/VehicleInductionSlice";
import { getVehicleTypeAction } from "../action/vehicleTypeAction";
const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  if (img) {
    reader.readAsDataURL(img);
  }
};
const EditVehicle = () => {
  const { id } = useParams();
  const { Option } = Select;
  const dateFormat = "YYYY-MM-DD";
  const [vehicleData, setVehicleData] = useState({});
  const [companyArr, setCompanyArr] = useState([]);
  const [vehicleArr, setVehicleArr] = useState([]);
  const [copyVehicleData, setCopyVehicleData] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [driverDetail, setDriverDetail] = useState([]);
  const [attachedOwnerDetail, setAttachedOwnerDetail] = useState([]);
  const [agencyDetail, setAgencyDetail] = useState([]);
  const [imageUrl, setImageUrl] = useState();
  const [loading, setLoading] = useState(false);
  const [effectiveDate, setEffectiveDate] = useState(false);
  const { driver_detail, driverListLoading } = useSelector(
    (state) => state.DriverState || []
  );
  const { owner_detail, ownerListLoading } = useSelector(
    (state) => state.ownerState || []
  );
  const { agency_detail, agencyListLoading } = useSelector(
    (state) => state.AgencyState || []
  );
  const {
    single_vehicle_list,
    vehicleListLoading,
    error,
    isVehicleListDeleted,
    isVehicleListUpdated,
  } = useSelector((state) => state.VechicleInductionState);
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
  }, [driver_detail, owner_detail, agency_detail]);

  useEffect(() => {
    dispatch(getIndividualVechicleAction(id));
  }, []);
  useEffect(() => {
    if (single_vehicle_list) {
      setImageUrl(single_vehicle_list?.vehicle_puc);

      setVehicleData(single_vehicle_list);
      setCopyVehicleData(single_vehicle_list);
    } else {
      setVehicleData({});
      setCopyVehicleData({});
    }
  }, [single_vehicle_list]);
  useEffect(() => {
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
  }, [vehicle_types, client_master_detail]);
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
  const handleChange = (field, value) => {
    setVehicleData({
      ...vehicleData,
      [field]: value,
    });
  };
  const handleOwnerTypeChange = (field, value) => {
    if (value) {
      let clonedObject = { ...vehicleData };
      clonedObject = { ...clonedObject, owner_id: "", owner_name: "" };

      setVehicleData({
        ...clonedObject,
        [field]: value,
      });
    }
  };
  console.log(vehicleArr);
  const handleOwnerChange = (owner) => {
    setVehicleData({
      ...vehicleData,
      ...owner,
    });
  };
  const handleClientChange = (client) => {
    setVehicleData({
      ...vehicleData,
      ...client,
    });
  };
  const handleDriverChange = (driver) => {
    setVehicleData({
      ...vehicleData,
      ...driver,
    });
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      alert("You can only upload JPG/PNG file!");
    }

    return isJpgOrPng;
  };
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

  const ImageChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }

    // Get this url from response in real world.
    getBase64(info.file.originFileObj, (url) => {
      setLoading(false);
      setImageUrl(url);
    });
    setVehicleData({
      ...vehicleData,
      vehicle_puc: info.fileList[0]?.originFileObj,
    });
  };

  const editVehicleDetail = () => {
    if (vehicleData?.owner_id === copyVehicleData?.owner_id) {
      dispatch(
        updateVehicleAction(id, {
          ...vehicleData,
          vehicleownernameChanged: false,
        })
      );
    } else {
      dispatch(
        updateVehicleAction(id, {
          ...vehicleData,
          vehicleownernameChanged: true,
        })
      );
    }
  };
  const { Title } = Typography;

  useEffect(() => {
    if (isVehicleListUpdated) {
      toast("Vehicle Updated Succesfully!", {
        type: "success",
        position: toast.POSITION.BOTTOM_CENTER,
        onOpen: () => dispatch(clearUpdateVehicleListCreated()),
      });
      navigate("/vehicle/vehicle_list");
      return;
    }
    if (isVehicleListDeleted) {
      toast("Vehicle Deleted Succesfully!", {
        type: "success",
        position: toast.POSITION.BOTTOM_CENTER,
        onOpen: () => dispatch(clearVehicleListDeleted()),
      });

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
  }, [isVehicleListUpdated, isVehicleListDeleted, error, dispatch]);
  return (
    <>
      <Spin spinning={vehicleListLoading} tip="loading">
        <div className="container">
          <Title
            className="text-center py-3 text-bold uppercase underline"
            level={4}
          >
            Edit Vehicle Details
          </Title>
          <div className="w-full max-w-4xl">
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  htmlFor="company"
                >
                  Registration Number
                </label>
              </div>
              <div className="md:w-4/12">
                <Input
                  value={vehicleData?.vehicle_regnumber}
                  onChange={(e) => {
                    handleChange("vehicle_regnumber", e.target.value);
                  }}
                />{" "}
              </div>
            </div>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  htmlFor="company"
                >
                  Vehicle Type
                </label>
              </div>
              <div className="md:w-4/12">
                <Select
                  value={vehicleData?.vehicle_type}
                  onChange={(e) => {
                    handleChange("vehicle_type", e);
                  }}
                  showSearch
                  allowClear
                  style={{ width: "150px" }}
                >
                  {vehicleArr?.map((item) => {
                    return (
                      <Option key={item?.VehicleType} value={item?.VehicleType}>
                        {item?.VehicleType}
                      </Option>
                    );
                  })}
                </Select>
              </div>
            </div>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  htmlFor="company"
                >
                  Make (Model)
                </label>
              </div>
              <div className="md:w-4/12">
                <Input
                  value={vehicleData?.vehicle_model}
                  onChange={(e) => {
                    handleChange("vehicle_model", e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  htmlFor="company"
                >
                  Client Name
                </label>
              </div>
              <div className="md:w-4/12">
                <Select
                  value={vehicleData?.vehicle_clientnames}
                  // onChange={(e) => {
                  //   handleChange("vehicle_clientnames", e);
                  // }}
                  // onChange={(e) => {
                  //   let client = client_master_detail.filter(
                  //     (item) => item._id == e
                  //   );
                  //   console.log(client);
                  //   client.forEa
                  //   handleClientChange({
                  //     vehicle_client_ids: client._id,
                  //     vehicle_clientnames: client.Company_Name,
                  //   });
                  // }}
                  showSearch
                  mode="multiple"
                  allowClear
                  style={{ width: "250px" }}
                >
                  {companyArr?.map((item) => {
                    return (
                      <Option key={item.value} value={item.id}>
                        {item.text}
                      </Option>
                    );
                  })}
                </Select>
              </div>
            </div>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  htmlFor="company"
                >
                  Registration Date
                </label>
              </div>
              <div className="md:w-4/12">
                <DatePicker
                  value={
                    vehicleData?.vehicle_regdate_exp &&
                    dayjs(`${vehicleData?.vehicle_regdate_exp}`, dateFormat)
                  }
                  format={dateFormat}
                  onChange={(value, date) => {
                    handleChange("vehicle_regdate_exp", date);
                  }}
                />
              </div>
            </div>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  htmlFor="company"
                >
                  Tax Expiry
                </label>
              </div>
              <div className="md:w-4/12">
                <DatePicker
                  value={
                    vehicleData?.vehicle_taxdate_exp &&
                    dayjs(`${vehicleData?.vehicle_taxdate_exp}`, dateFormat)
                  }
                  format={dateFormat}
                  onChange={(value, date) => {
                    handleChange("vehicle_taxdate_exp", date);
                  }}
                />
              </div>
            </div>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  htmlFor="company"
                >
                  Fitness Expiry
                </label>
              </div>
              <div className="md:w-4/12">
                <DatePicker
                  value={
                    vehicleData?.vehicle_fitnessdate_exp &&
                    dayjs(`${vehicleData?.vehicle_fitnessdate_exp}`, dateFormat)
                  }
                  format={dateFormat}
                  onChange={(value, date) => {
                    handleChange("vehicle_fitnessdate_exp", date);
                  }}
                />
              </div>
            </div>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  htmlFor="company"
                >
                  Insurance Expiry
                </label>
              </div>
              <div className="md:w-4/12">
                <DatePicker
                  value={
                    vehicleData?.vehicle_insurancedate_exp &&
                    dayjs(
                      `${vehicleData?.vehicle_insurancedate_exp}`,
                      dateFormat
                    )
                  }
                  format={dateFormat}
                  onChange={(value, date) => {
                    handleChange("vehicle_insurancedate_exp", date);
                  }}
                />
              </div>
            </div>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  htmlFor="company"
                >
                  PUC
                </label>
              </div>
              <div className="md:w-4/12">
                <Upload
                  name="vehicle_puc"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                  onChange={ImageChange}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="vehicle_puc"
                      style={{
                        width: "100%",
                      }}
                    />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              </div>
            </div>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  htmlFor="company"
                >
                  Select Driver
                </label>
              </div>
              <div className="md:w-4/12">
                <Select
                  showSearch
                  allowClear
                  value={vehicleData?.driver_name}
                  onChange={(e) => {
                    let driver = driverDetail.find((item) => item._id == e);
                    handleDriverChange({
                      vehicle_driver_id: driver._id,
                      driver_name: driver.driver_name,
                    });
                  }}
                >
                  {driverDetail?.map((item) => {
                    return (
                      <Option key={item._id} value={item._id}>
                        {item.driver_name}
                      </Option>
                    );
                  })}
                </Select>
              </div>
            </div>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  htmlFor="company"
                >
                  Select Owner Type
                </label>
              </div>
              <div className="md:w-4/12">
                <Radio.Group
                  value={vehicleData?.owner_type}
                  onChange={(e) => {
                    handleOwnerTypeChange("owner_type", e.target.value);
                  }}
                >
                  <Radio value="own">Own</Radio>
                  <Radio value="attached">Attached</Radio>
                  <Radio value="agency">Agency</Radio>
                </Radio.Group>
              </div>
            </div>
            {vehicleData?.owner_type == "own" && (
              <div className="md:flex md:items-center mb-6">
                <div className="md:w-1/3">
                  <label
                    className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                    htmlFor="company"
                  >
                    Select Owner_Name
                  </label>
                </div>
                <div className="md:w-4/12">
                  <Select
                    showSearch
                    allowClear
                    style={{ width: "240px" }}
                    value={vehicleData.owner_name}
                    onChange={(e) => {
                      handleOwnerChange({
                        owner_id: e,
                        owner_name: e,
                      });
                    }}
                  >
                    <Option value="Ambassador">Ambassador</Option>
                    <Option value="ATT">ATT</Option>
                  </Select>
                </div>
              </div>
            )}
            {vehicleData?.owner_type == "attached" && (
              <div className="md:flex md:items-center mb-6">
                <div className="md:w-1/3">
                  <label
                    className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                    htmlFor="company"
                  >
                    Select Owner_Name
                  </label>
                </div>
                <div className="md:w-4/12">
                  <Select
                    style={{ width: "240px" }}
                    showSearch
                    allowClear
                    value={vehicleData.owner_name}
                    onChange={(e) => {
                      let owner = attachedOwnerDetail.find(
                        (item) => item._id == e
                      );
                      handleOwnerChange({
                        owner_id: owner._id,
                        owner_name: owner.owner_name,
                      });
                    }}
                  >
                    {attachedOwnerDetail?.map((item) => {
                      return (
                        <Option key={item._id} value={item._id}>
                          {item.owner_name}-{item.pancard_no}
                        </Option>
                      );
                    })}
                  </Select>
                </div>
              </div>
            )}
            {vehicleData?.owner_type == "agency" && (
              <div className="md:flex md:items-center mb-6">
                <div className="md:w-1/3">
                  <label
                    className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                    htmlFor="company"
                  >
                    Select Owner_Name
                  </label>
                </div>
                <div className="md:w-4/12">
                  <Select
                    showSearch
                    allowClear
                    style={{ width: "240px" }}
                    value={vehicleData.owner_name}
                    onChange={(e) => {
                      let owner = agencyDetail.find((item) => item._id == e);
                      handleOwnerChange({
                        owner_id: owner._id,
                        owner_name: owner.owner_name,
                      });
                    }}
                  >
                    {agencyDetail?.map((item) => {
                      return (
                        <Option key={item._id} value={item._id}>
                          {item.owner_name}-{item.pancard_no}
                        </Option>
                      );
                    })}
                  </Select>
                </div>
              </div>
            )}{" "}
            {vehicleData?.owner_id !== copyVehicleData?.owner_id ? (
              <>
                <div className="md:flex md:items-center mb-6">
                  <div className="md:w-1/3">
                    <label
                      className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                      htmlFor="company"
                    >
                      Effective_Date
                    </label>
                  </div>
                  <div className="md:w-4/12">
                    <DatePicker
                      value={
                        vehicleData?.effective_date &&
                        dayjs(`${vehicleData?.effective_date}`, dateFormat)
                      }
                      format={dateFormat}
                      onChange={(value, date) => {
                        handleChange("effective_date", date);
                      }}
                    />
                  </div>
                </div>
                <div className="md:flex md:items-center mb-6">
                  <div className="md:w-1/3">
                    <label
                      className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                      htmlFor="company"
                    >
                      Remark
                    </label>
                  </div>
                  <div className="md:w-4/12">
                    <Input
                      value={vehicleData?.remark}
                      onChange={(e) => {
                        handleChange("remark", e.target.value);
                      }}
                    />{" "}
                  </div>
                </div>
              </>
            ) : null}
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  htmlFor="company"
                ></label>
              </div>
              <div className="md:w-4/12">
                <Button
                  htmlType="submit"
                  onClick={editVehicleDetail}
                  className="bg-green-500 font-bold border-green-500"
                >
                  Update
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Spin>
    </>
  );
};

export default EditVehicle;
