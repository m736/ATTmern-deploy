import { Button, Form, Input, Select, DatePicker } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { NumericInput } from "../Tarrif/NumericInput";
import { useDispatch, useSelector } from "react-redux";
import { getTarrif } from "../action/tarrifAction";
import moment from "moment";
import {
  clearCreateTripSheet,
  clearTripSheetError,
} from "../slices/TripSheetSlice";
import { toast } from "react-toastify";
import { createTripSheetAction } from "../action/tripSheetAction";
import { useNavigate } from "react-router-dom";
const { Option } = Select;
const { RangePicker } = DatePicker;

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const rangeConfig = {
  rules: [
    {
      type: "array",
      message: "Please select time!",
    },
  ],
};
const NewTripSheetEntry = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tarrifData, loading } = useSelector((state) => state.TarrifState);
  const { tripSheetLoading, isTripSheetCreated, error } = useSelector(
    (state) => state.TripSheetState
  );
  const [clientList, setClientList] = useState([]);
  const [vehicleList, setvehicleList] = useState([]);
  const [rentalList, setRentalList] = useState([]);
  const [acType, setAcType] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [selectedRental, setSelectedRental] = useState("");
  const [selectedSegment, setSelectedSegment] = useState("");

  useEffect(() => {
    if (tarrifData && tarrifData.length) {
      let updatedClient = tarrifData.map((item) => item.company);
      setClientList([...new Set(updatedClient)]);
    } else {
      dispatch(getTarrif);
    }
  }, [tarrifData]);
  const onFinish = (fieldsValue) => {
    const totalKm = fieldsValue["closingkm"] - fieldsValue["startingkm"];
    const rangeTimejourney = fieldsValue["journeyStart"];
    const tripDateField = fieldsValue["tripDate"];
    const startJourney = moment(
      rangeTimejourney[0]?.format("YYYY-MM-DD HH:mm")
    );
    const endJourney = moment(rangeTimejourney[1]?.format("YYYY-MM-DD HH:mm"));
    var ms = moment(endJourney, "DD/MM/YYYY HH:mm").diff(
      moment(startJourney, "DD/MM/YYYY HH:mm")
    );
    var duration = moment.duration(ms);
    var totalHrs =
      Math.floor(duration?.asHours()) + moment.utc(ms).format(".mm");

    const totalDays = Math.ceil(duration?.asDays());

    const values = {
      ...fieldsValue,
      totalDays: totalDays,
      totalHrs: totalHrs,
      totalKm: totalKm,
    };
    console.log("Received values of form: ", values);
    // console.log(fieldsValue);
    navigate("/tripsheet/tripsheet_calculation", { state: values });
    // dispatch(createTripSheetAction(values));
  };
  // useEffect(() => {
  //   if (isTripSheetCreated) {
  //     toast("New Trip Sheet Created Succesfully!", {
  //       type: "success",
  //       position: toast.POSITION.BOTTOM_CENTER,
  //       onOpen: () => dispatch(clearCreateTripSheet()),
  //     });
  //     navigate("/tripsheet/tripsheet_calculation");
  //     return;
  //   }
  //   if (error) {
  //     toast(error, {
  //       position: toast.POSITION.BOTTOM_CENTER,
  //       type: "error",
  //       onOpen: () => {
  //         dispatch(clearTripSheetError());
  //       },
  //     });
  //     return;
  //   }
  // }, [isTripSheetCreated, error, dispatch]);
  return (
    <Form
      name="tarrifSheet"
      style={{
        maxWidth: 600,
      }}
      onFinish={onFinish}
    >
      {/* <Form.Item
        name="dutySlipNo"
        label="Duty Slip No"
        // rules={[
        //   {
        //     required: true,
        //     message: "Please input your Duty Slip No!",
        //   },
        // ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="tripId"
        label="Trip Id"
        // rules={[
        //   {
        //     required: true,
        //     message: "Please input your Trip Id!",
        //   },
        // ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="bookedBy"
        label="Booked By"
        // rules={[
        //   {
        //     required: true,
        //     message: "Please input your Booked By!",
        //   },
        // ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="passenger"
        label="Passenger"
        // rules={[
        //   {
        //     required: true,
        //     message: "Please input your Passenger!",
        //   },
        // ]}
      >
        <Input />
      </Form.Item> */}
      {/* <Form.Item
        name="placeOfVisit"
        label="Place Of Visit"
        // rules={[
        //   {
        //     required: true,
        //     message: "Please input your Place Of Visit!",
        //   },
        // ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="address"
        label="Address"
        // rules={[
        //   {
        //     required: true,
        //     message: "Please input Address",
        //   },
        // ]}
      >
        <Input.TextArea showCount maxLength={100} />
      </Form.Item>
      <Form.Item
        name="location"
        label="Location"
        // rules={[
        //   {
        //     required: true,
        //     message: "Please select Location!",
        //   },
        // ]}
      >
        <Select placeholder="select your Location">
          <Option value="">Select</Option>
          <Option value="oncall">On Call</Option>
        </Select>
      </Form.Item>
      <Form.Item name="tripDate" label="Trip Date">
        <DatePicker />
      </Form.Item>
      <Form.Item
        name="vehicleNum"
        label="Vehicle Number"
        // rules={[
        //   {
        //     required: true,
        //     message: "Please select Vehicle Number!",
        //   },
        // ]}
      >
        <Select placeholder="select your Vehicle Number">
          <Option value="">Select</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="vehicleType"
        label="Vehicle Type"
        // rules={[
        //   {
        //     required: true,
        //     message: "Please select Vehicle Type!",
        //   },
        // ]}
      >
        <Select placeholder="select your Vehicle Type">
          <Option value="">Select</Option>
        </Select>
      </Form.Item> */}
      <Form.Item name="companyName" label="Client/Company Name">
        <Select
          onChange={(e) => {
            let updated = tarrifData.filter((item) => e == item.company);
            let updatedVehicle = updated.map((item) => item.vehicleType);
            setvehicleList([...new Set(updatedVehicle)]);
            setSelectedCompany(e);
          }}
          value={selectedCompany}
        >
          {clientList.map((item) => {
            return (
              <Option key={item} value={item}>
                {item}
              </Option>
            );
          })}
        </Select>
      </Form.Item>
      <Form.Item
        name="vehicleBilled"
        label="Vehicle Billed As"
        initialValue={selectedVehicle}
      >
        <Select
          className="uppercase"
          onChange={(e) => {
            let updated = tarrifData.filter(
              (item) =>
                e == item?.vehicleType && selectedCompany == item?.company
            );
            let updatedRental = updated.map((item) => item?.selectedRental);
            setRentalList([...new Set(updatedRental)]);
            setSelectedVehicle(e);
          }}
          value={[]}
        >
          {vehicleList.map((item) => {
            return (
              <Option key={item} value={item}>
                {item}
              </Option>
            );
          })}
        </Select>
      </Form.Item>
      <Form.Item name="rental" label="Rental">
        <Select
          className="uppercase"
          onChange={(e) => {
            let updated = tarrifData.filter(
              (item) =>
                e == item.selectedRental && selectedVehicle == item.vehicleType
            );
            let updatedAcType = updated.map((item) => item.selectedSegment);
            setAcType([...new Set(updatedAcType)]);
            setSelectedRental(e);
          }}
          value={selectedRental}
        >
          {rentalList.map((item) => {
            return (
              <Option key={item} value={item} className="uppercase">
                {item}
              </Option>
            );
          })}
        </Select>
      </Form.Item>
      <Form.Item name="acType" label="Ac Type">
        <Select
          className="uppercase"
          onChange={(e) => {
            setSelectedSegment(e);
          }}
          value={selectedSegment}
        >
          {acType.map((item) => {
            return (
              <Option key={item} value={item} className="uppercase">
                {item}
              </Option>
            );
          })}
        </Select>
      </Form.Item>
      {/* <Form.Item
        name="area"
        label="Area"
        // rules={[
        //   {
        //     required: true,
        //     message: "Please select Area!",
        //   },
        // ]}
      >
        <Select placeholder="select your Area">
          <Option value="">Select</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="addon"
        label="Addon"
        // rules={[
        //   {
        //     required: true,
        //     message: "Please select Addon!",
        //   },
        // ]}
      >
        <Select placeholder="select your Addon">
          <Option value="">Select</Option>
        </Select>
      </Form.Item> */}
      <Form.Item name="journeyStart" label="Journey Start" {...rangeConfig}>
        <RangePicker showTime format="YYYY-MM-DD HH:mm" />
      </Form.Item>
      <Form.Item name="startingkm" label="Opening Km" initialValue="">
        <NumericInput />
      </Form.Item>
      <Form.Item name="closingkm" label="Closing Km" initialValue="">
        <NumericInput />
      </Form.Item>
      {/* <Form.Item name="department" label="Department" initialValue="">
        <NumericInput />
      </Form.Item>
      <Form.Item name="advance" label="Advance" initialValue="">
        <NumericInput />
      </Form.Item>
      <Form.Item name="outstationBata" label="Outstation Bata" initialValue="">
        <NumericInput />
      </Form.Item>
      <Form.Item name="salesNightBata" label="Sales Night Bata" initialValue="">
        <NumericInput />
      </Form.Item>
      <Form.Item
        name="purchaseNightBata"
        label="Purchase Night Bata"
        initialValue=""
      >
        <NumericInput />
      </Form.Item>
      <Form.Item name="salesEscort" label="Sales Escort" initialValue="">
        <NumericInput />
      </Form.Item>
      <Form.Item name="purchaseEscort" label="Purchase Escort" initialValue="">
        <NumericInput />
      </Form.Item>
      <Form.Item name="permit" label="Permit" initialValue="">
        <NumericInput />
      </Form.Item>
      <Form.Item name="parking" label="Parking" initialValue="">
        <NumericInput />
      </Form.Item>
      <Form.Item name="others" label="Others" initialValue="">
        <NumericInput />
      </Form.Item> */}
      <Form.Item {...tailFormItemLayout}>
        <Button htmlType="submit">Next</Button>
      </Form.Item>
    </Form>
  );
};
export default NewTripSheetEntry;
