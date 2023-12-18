import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Button,
  Form,
  Modal,
  Typography,
  Popconfirm,
  Input,
  Space,
  Spin,
} from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import moment from "moment";
import { Table } from "antd";
import {
  clearVehicleTypeDeleted,
  clearVehicleTypeError,
  clearVehicleTypeUpdated,
} from "../slices/VehicleTypeSlice";
import {
  deleteVehicleTypeAction,
  editVehicleTypeAction,
  getVehicleTypeAction,
} from "../action/vehicleTypeAction";
import { useNavigate } from "react-router-dom";

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          <Input />
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
const ListVehicleType = () => {
  const [bordered, setBordered] = useState(true);
  const [editingKey, setEditingKey] = useState("");
  const [form] = Form.useForm();
  const { confirm } = Modal;
  const dispatch = useDispatch();
  const [tabledata, setTabledata] = useState([]);
  const tableProps = {
    bordered,
  };
  const {
    vehicle_types,
    vehicleTypeLoading,
    isVehicleTypeUpdated,
    isVehicleTypeDeleted,
    error,
  } = useSelector((state) => state.VehicleTypeState || []);
  useEffect(() => {
    dispatch(getVehicleTypeAction);
  }, []);
  useEffect(() => {
    if (vehicle_types && vehicle_types.length > 0) {
      let updatedVehicleType = vehicle_types.map((item) => {
        const Created = moment
          .utc(item.createdAt)
          .local()
          .format("DD-MM-YYYY hh:mm A");
        const Updated = moment
          .utc(item.updatedAt)
          .local()
          .format("DD-MM-YYYY hh:mm A");

        return {
          ...item,
          Created: Created,
          Updated: Updated,
        };
      });
      setTabledata(updatedVehicleType);
    } else {
      setTabledata([]);
    }
  }, [vehicle_types]);
  const isEditing = (record) => record._id === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      VehicleType: "",
      ...record,
    });
    setEditingKey(record._id);
  };
  const cancel = () => {
    setEditingKey("");
  };
  const columns = [
    {
      title: "Vehicle Type",
      dataIndex: "value",
      editable: true,
    },
    {
      title: "createdAt",
      dataIndex: "Created",
    },
    {
      title: "updatedAt",
      dataIndex: "Updated",
    },
    {
      title: "Action",
      dataIndex: "",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Space>
            <Typography.Link
              onClick={() => saveVehicle(record._id)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </Space>
        ) : (
          <Space>
            <Typography.Link
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
            >
              <Button>Edit</Button>
            </Typography.Link>
            <Button
              className="bg-red-700 hover:bg-red-400  border-red-700 hover:border-red-500 text-white"
              onClick={() => deleteVehicleTypeFunc(record?._id)}
            >
              Delete
            </Button>
          </Space>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  const saveVehicle = async (key) => {
    try {
      const row = await form.validateFields();
      console.log(row);
      dispatch(editVehicleTypeAction(key, { VehicleType: row.value }));
      setEditingKey("");
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };
  const deleteVehicleTypeFunc = (id) => {
    confirm({
      title: "Do you want to Delete these Client Details?",
      icon: <ExclamationCircleFilled />,

      onOk() {
        dispatch(deleteVehicleTypeAction(id));
        setTimeout(() => {
          dispatch(getVehicleTypeAction);
        }, [1000]);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  useEffect(() => {
    if (isVehicleTypeUpdated) {
      toast("Vehicle Type Updated Succesfully!", {
        type: "success",
        position: toast.POSITION.BOTTOM_CENTER,
        onOpen: () => dispatch(clearVehicleTypeUpdated()),
      });
      return;
    }
    if (isVehicleTypeDeleted) {
      toast("Vehicle Type Deleted Succesfully!", {
        type: "success",
        position: toast.POSITION.TOP_CENTER,
        onOpen: () => dispatch(clearVehicleTypeDeleted()),
      });
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
  }, [isVehicleTypeUpdated, isVehicleTypeDeleted, error, dispatch]);
  // console.log(client_master_detail);
  const navigate = useNavigate();
  const AddVehicleMaster = () => {
    navigate("/client_master/create_vehicle_type");
  };
  return (
    <>
      <Spin spinning={vehicleTypeLoading} tip="loading">
        <div class="flex flex-row items-center justify-end">
          <Button
            className="text-white border-green-500 bg-green-500 hover:bg-white mb-7"
            onClick={AddVehicleMaster}
          >
            Add Vehicle
          </Button>
        </div>
        <Form form={form} component={false}>
          <Table
            id={"vehicle_types"}
            {...tableProps}
            columns={mergedColumns}
            dataSource={tabledata}
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            pagination={{
              onChange: cancel,
            }}
          />
        </Form>
      </Spin>
    </>
  );
};

export default ListVehicleType;
