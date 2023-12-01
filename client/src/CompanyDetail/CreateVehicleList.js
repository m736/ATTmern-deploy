import React, { useEffect } from "react";
import { Button, Checkbox, Form, Input, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { createVehicleTypeAction } from "../action/vehicleTypeAction";
import {
  clearVehicleTypeCreated,
  clearVehicleTypeError,
} from "../slices/VehicleTypeSlice";
const CreateVehicleType = () => {
  const { vehicleTypeLoading, isVehicleTypeCreated, error } = useSelector(
    (state) => state.VehicleTypeState || []
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onFinish = (values) => {
    console.log(values);
    dispatch(createVehicleTypeAction(values));
  };
  useEffect(() => {
    if (isVehicleTypeCreated) {
      toast("New Vehicle Type Created Succesfully!", {
        type: "success",
        position: toast.POSITION.BOTTOM_CENTER,
        onOpen: () => dispatch(clearVehicleTypeCreated()),
      });
      navigate("/client_master/vehicle_type_list");
      return;
    }

    if (error) {
      toast(error, {
        position: toast.POSITION.BOTTOM_CENTER,
        type: "error",
        onOpen: () => {
          dispatch(clearVehicleTypeError());
        },
      });
      return;
    }
  }, [isVehicleTypeCreated, error, dispatch]);
  return (
    <div>
      <Spin spinning={vehicleTypeLoading} tip="loading">
        <Form
          name="vehicle_type_form"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Vehicle Type"
            name="VehicleType"
            rules={[
              {
                required: true,
                message: "Please enter Vehicle Type!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button htmlType="submit">Submit</Button>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  );
};

export default CreateVehicleType;
