import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getIndividualTarrifFail,
  getIndividualTarrifRequest,
  getIndividualTarrifSuccess,
} from "../slices/TarrifSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Card, Col, Row, Select, Form } from "antd";
import { tarrifInputField } from "./TarrifInputField";
import { getClientMasterAction } from "../action/clientMasterAction";
import { getVehicleTypeAction } from "../action/vehicleTypeAction";
import { getAreaListAction } from "../action/AreaListAction";
const style = {
  width: "80%",
  padding: "8px 0",
};
const EditTarrifMaster = () => {
  const { id } = useParams();
  const { Option } = Select;
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [singleTarrifDetail, setSingleTarrifDetail] = useState({});
  const [tarrifInfield, setTarrifInputField] = useState(tarrifInputField);
  const [companyArr, setCompanyArr] = useState([]);
  const [vehicleArr, setVehicleArr] = useState([]);
  const [areaArr, setAreaArr] = useState([]);
  const EnableTarrifRentalInput = {
    Local: [
      "segment",
      "areas",
      "slabhrs",
      "slabkms",
      "salesRate",
      "purchaseRate",
      "salesExKmsRate",
      "salesExHrsRate",
      "purchaseExHrsRate",
      "purchaseExKmsRate",
      "purchaseGraceTime",
      "salesGraceTime",
    ],
    "Out Station": [
      "segment",
      "slabhrs",
      "slabkms",
      "areas",
      "salesExKmsRate",
      "purchaseExKmsRate",
      "driverbata",
    ],
    "Flat Rate": [
      "segment",
      "slabhrs",
      "slabkms",
      "salesRate",
      "purchaseRate",
      "salesExKmsRate",
      "salesExHrsRate",
      "purchaseExHrsRate",
      "purchaseExKmsRate",
      "purchaseGraceTime",
      "salesGraceTime",
    ],
    "Airport Transfer": [
      "segment",
      "areas",
      "slabhrs",
      "slabkms",
      "salesRate",
      "purchaseRate",
      "driverbata",
    ],
    "Hotel Transfer": [
      "segment",
      "slabhrs",
      "slabkms",
      "salesRate",
      "purchaseRate",
      "salesExKmsRate",
      "salesExHrsRate",
      "purchaseExHrsRate",
      "purchaseExKmsRate",
      "purchaseGraceTime",
      "salesGraceTime",
    ],
    "Slab Rate": [
      "segment",
      "areas",
      "slabfrom",
      "slabto",
      "addon",
      "purchaseRate",
      "salesRate",
    ],
    "Trip rate": ["segment", "areas", "addon", "purchaseRate", "salesRate"],
    "Shift Rate": ["segment", "areas", "purchaseRate", "salesRate"],
    "Day Rate": ["segment", "areas", "purchaseRate", "salesRate"],
    "Escort Airport Transfer": [
      "segment",
      "slabhrs",
      "slabkms",
      "salesRate",
      "purchaseRate",
      "salesExKmsRate",
      "salesExHrsRate",
      "purchaseExHrsRate",
      "purchaseExKmsRate",
      "purchaseGraceTime",
      "salesGraceTime",
    ],
    "One Way": [
      "segment",
      "slabhrs",
      "slabkms",
      "salesRate",
      "purchaseRate",
      "salesExKmsRate",
      "salesExHrsRate",
      "purchaseExHrsRate",
      "purchaseExKmsRate",
      "purchaseGraceTime",
      "salesGraceTime",
    ],
    "Two Way": [
      "segment",
      "slabhrs",
      "slabkms",
      "salesRate",
      "purchaseRate",
      "salesExKmsRate",
      "salesExHrsRate",
      "purchaseExHrsRate",
      "purchaseExKmsRate",
      "purchaseGraceTime",
      "salesGraceTime",
    ],
    "Railway Bus Transfer": [
      "segment",
      "slabhrs",
      "slabkms",
      "salesRate",
      "purchaseRate",
      "salesExKmsRate",
      "salesExHrsRate",
      "purchaseExHrsRate",
      "purchaseExKmsRate",
      "purchaseGraceTime",
      "salesGraceTime",
    ],
    "KMS Rate": ["segment", "salesRate", "purchaseRate"],
  };
  const [enableinput, setEnableInput] = useState([]);
  const { area_list } = useSelector((state) => state.AreaListState || []);
  const { vehicle_types } = useSelector(
    (state) => state.VehicleTypeState || []
  );
  const { client_master_detail } = useSelector(
    (state) => state.ClientMasterState || []
  );
  useEffect(() => {
    dispatch(getClientMasterAction);
    dispatch(getVehicleTypeAction);
    dispatch(getAreaListAction);
  }, []);
  useEffect(() => {
    if (client_master_detail && client_master_detail.length > 0) {
      let companyList = client_master_detail.map((item) => {
        return {
          text: item.Company_Name,
          value: item.Company_Name,
        };
      });
      setCompanyArr(removeDuplicateObjects(companyList, "value"));
    }
    if (vehicle_types && vehicle_types.length > 0) {
      setVehicleArr(removeDuplicateObjects(vehicle_types, "value"));
    }
    if (area_list && area_list.length > 0) {
      setAreaArr(removeDuplicateObjects(area_list, "value"));
    }
  }, [client_master_detail, vehicle_types, area_list]);
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
  useEffect(() => {
    setTarrifInputField({
      ...tarrifInputField,
      vehicleTypes: vehicleArr,
      companies: companyArr,
      areas: areaArr,
    });
  }, [companyArr, vehicleArr, areaArr]);
  useEffect(() => {
    if (singleTarrifDetail?.selectedRental) {
      setEnableInput(
        EnableTarrifRentalInput[singleTarrifDetail?.selectedRental]
      );
    }
  }, [singleTarrifDetail]);
  const loadSingleTarrifDetail = async () => {
    try {
      dispatch(getIndividualTarrifRequest());
      const { data } = await axios.get(
        `/tarrif/single_tarrif_master_api/${id}`
      );
      setSingleTarrifDetail(data?.getSingleTarrifMaster);
      dispatch(getIndividualTarrifSuccess(data));
    } catch (error) {
      //handle error
      dispatch(getIndividualTarrifFail(error.response.data.message));
    }
  };
  useEffect(() => {
    loadSingleTarrifDetail();
  }, []);
  const RentalChange = (value) => {
    form.resetFields();
    valueHandle("selectedRental", value);
  };
  const valueHandle = (field, value) => {
    if (field == "selectedRental") {
      setSingleTarrifDetail({
        ...tarrifInfield,
        _id: id,
        [field]: value,
      });
    } else {
      setSingleTarrifDetail({
        ...singleTarrifDetail,
        [field]: value,
      });
    }
  };
  console.log(singleTarrifDetail);
  return (
    <>
      <Card>
        <Row>
          <Col span={6}>
            {" "}
            <Select
              style={style}
              value={singleTarrifDetail?.company}
              onChange={(value) => {
                valueHandle("company", value);
              }}
            >
              {singleTarrifDetail?.companies?.map((item) => {
                return (
                  <Option key={item.value} value={item.value}>
                    {item.text}
                  </Option>
                );
              })}
            </Select>
          </Col>
          <Col span={6}>
            {" "}
            <Select
              style={style}
              value={singleTarrifDetail?.vehicleType}
              onChange={(value) => {
                valueHandle("vehicleType", value);
              }}
            >
              {singleTarrifDetail?.vehicleTypes?.map((item) => {
                return (
                  <Option key={item.value} value={item.value}>
                    {item.text}
                  </Option>
                );
              })}
            </Select>
          </Col>
          <Col span={6}>
            {" "}
            <Select
              style={style}
              value={singleTarrifDetail?.selectedRental}
              onChange={RentalChange}
            >
              {singleTarrifDetail?.rental?.map((item) => {
                return (
                  <Option key={item.value} value={item.value}>
                    {item.text}
                  </Option>
                );
              })}
            </Select>
          </Col>

          <Col span={6}>
            {" "}
            <Select
              style={style}
              value={singleTarrifDetail?.selectedSegment}
              disabled={!enableinput?.includes("segment")}
              onChange={(value) => {
                valueHandle("selectedSegment", value);
              }}
            >
              {singleTarrifDetail?.segment?.map((item) => {
                return (
                  <Option key={item.value} value={item.value}>
                    {item.text}
                  </Option>
                );
              })}
            </Select>
          </Col>
          <Col span={6}>
            {" "}
            <Select
              style={style}
              disabled={!enableinput?.includes("areas")}
              value={singleTarrifDetail?.selectedArea}
              onChange={(value) => {
                valueHandle("selectedArea", value);
              }}
            >
              {singleTarrifDetail?.areaArr?.map((item) => {
                return (
                  <Option key={item.value} value={item.value}>
                    {item.text}
                  </Option>
                );
              })}
            </Select>
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default EditTarrifMaster;
