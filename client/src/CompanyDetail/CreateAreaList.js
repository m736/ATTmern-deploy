import React, { useEffect } from "react";
import { Button, Checkbox, Form, Input, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { createAreaListAction } from "../action/AreaListAction";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  clearAreaListCreated,
  clearAreaListError,
} from "../slices/AreaListSlice";
const CreateAreaList = () => {
  const { area_list, areaListLoading, isAreaCreated, error } = useSelector(
    (state) => state.AreaListState || []
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onFinish = (values) => {
    dispatch(createAreaListAction(values));
  };
  useEffect(() => {
    if (isAreaCreated) {
      toast("New Area Created Succesfully!", {
        type: "success",
        position: toast.POSITION.BOTTOM_CENTER,
        onOpen: () => dispatch(clearAreaListCreated()),
      });
      navigate("/client_master/list_area");
      return;
    }

    if (error) {
      toast(error, {
        position: toast.POSITION.BOTTOM_CENTER,
        type: "error",
        onOpen: () => {
          dispatch(clearAreaListError());
        },
      });
      return;
    }
  }, [isAreaCreated, error, dispatch]);
  return (
    <div>
      <Spin spinning={areaListLoading} tip="loading">
        <Form
          name="basic"
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
            label="Area"
            name="Area"
            rules={[
              {
                required: true,
                message: "Please enter Area name!",
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

export default CreateAreaList;
