import {
  Avatar,
  Button,
  Form,
  Image,
  Input,
  InputNumber,
  Popconfirm,
  Table,
  Typography,
  Upload,
} from "antd";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateVehicleList } from "../action/getVehicleAction";
import {
  getVehicleListFail,
  getVehicleListRequest,
  getVehicleListSuccess,
} from "../slices/VehicleInductionSlice";
import axios from "axios";

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
  // const filename = record?.PCC;
  // const imagefile = filename?.substring(
  //   filename?.lastIndexOf("/") + 1,
  //   filename?.length
  // );

  const [fileList, setFileList] = useState([]);
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
  const props = {
    onChange: handleChange,
    multiple: true,
  };
  const getFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e?.fileList[0]?.originFileObj;
  };
  const inputNode =
    inputType === "file" ? (
      <>
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          getValueFromEvent={getFile}
        >
          <Upload showUploadList={true} {...props}>
            <Button>Upload</Button>
          </Upload>
        </Form.Item>
      </>
    ) : (
      <Input />
    );
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
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
const VehicleList = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);

  const fetchVehicleListData = async () => {
    try {
      dispatch(getVehicleListRequest());
      const { data } = await axios.get(
        "http://localhost:4000/api/v1/vehicle_list"
      );

      dispatch(getVehicleListSuccess(data));
      setData(
        data.map((vehicle) => ({
          key: vehicle._id,
          Registration_No: vehicle.vehicle_regnumber,
          PCC: vehicle.vehicle_puc,
          Vehicle_Type: vehicle.vehicle_type,
          Model: vehicle.vehicle_model,
        }))
      );
    } catch (error) {
      dispatch(getVehicleListFail());
    }
  };
  useEffect(() => {
    fetchVehicleListData();
  }, []);

  const [form] = Form.useForm();

  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record) => record.key === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      Registration_No: "",
      Vehicle_Type: "",
      PCC: "",
      Model: "",
      ...record,
    });
    setEditingKey(record.key);
  };
  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const formData = new FormData();
      formData.append("vehicle_regnumber", row.Registration_No);
      formData.append("vehicle_type", row.Vehicle_Type);
      formData.append("vehicle_model", row.Model);
      formData.append("vehicle_puc", row.PCC);
      dispatch(updateVehicleList(key, formData));
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });

        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };
  const columns = [
    {
      title: "Registration_No",
      dataIndex: "Registration_No",
      width: "25%",
      editable: true,
    },
    {
      title: "Vehicle_Type",
      dataIndex: "Vehicle_Type",
      editable: true,
    },
    {
      title: "PCC",
      dataIndex: "PCC",
      maxWidth: 50,
      render: (t, r) => <Image src={r.PCC} />,
      editable: true,
    },

    {
      title: "Model",
      dataIndex: "Model",
      editable: true,
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            Edit
          </Typography.Link>
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
        inputType: col.dataIndex === "PCC" ? "file" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <>
      <div className="container">
        <Form form={form} component={false}>
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            bordered
            dataSource={data}
            columns={mergedColumns}
            rowClassName="editable-row"
            pagination={{
              onChange: cancel,
            }}
          />
        </Form>
      </div>
    </>
  );
};
export default VehicleList;
