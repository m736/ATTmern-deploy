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
  const [form] = Form.useForm();
  const { confirm } = Modal;
  const dispatch = useDispatch();
  const tableProps = {
    bordered,
  };
  const {
    vehicle_types = [],
    vehicleTypeLoading,
    isVehicleTypeUpdated,
    isVehicleTypeDeleted,
    error,
  } = useSelector((state) => state.VehicleTypeState || []);

  const [editingKey, setEditingKey] = useState("");
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
      console.log(updatedVehicleType);

      setTabledata(updatedVehicleType);
    } else {
      dispatch(getVehicleTypeAction);
    }
  }, [vehicle_types]);
  const save = async (key) => {
    try {
      console.log(key);
      const row = await form.validateFields();
      console.log(row);
      dispatch(editVehicleTypeAction(key, { VehicleType: row.value }));
      setEditingKey("");
      setTimeout(() => {
        dispatch(getVehicleTypeAction);
      }, 1000);
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
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
  }, [isVehicleTypeUpdated, error, dispatch]);
  const [tabledata, setTabledata] = useState([]);

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
              onClick={() => save(record._id)}
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
  const deleteVehicleTypeFunc = (id) => {
    // setCurrentPage(1);
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
  }, [isVehicleTypeDeleted, error, dispatch]);
  // console.log(client_master_detail);

  return (
    <>
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
    </>
  );
};

export default ListVehicleType;
