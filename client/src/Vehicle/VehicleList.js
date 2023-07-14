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
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateVehicleList } from "../action/getVehicleAction";
import {
  clearError,
  clearUpdateVehicleListCreated,
  getVehicleListFail,
  getVehicleListRequest,
  getVehicleListSuccess,
} from "../slices/VehicleInductionSlice";
import axios from "axios";
import { toast } from "react-toastify";
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
  const filename = record?.PUC;
  const imagefile = filename?.substring(
    filename?.lastIndexOf("/") + 1,
    filename?.length
  );

  const [fileList, setFileList] = useState([
    {
      name: `${imagefile ? imagefile : null}`,
    },
  ]);
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
          <Upload
            onChange={handleChange}
            defaultFileList={fileList}
            fileList={fileList}
          >
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
  const navigate = useNavigate();
  const {
    vehiclelist = [],
    isVehicleListUpdated,
    loading,
    error,
  } = useSelector((state) => state.VechicleInductionState);
  const [data, setData] = useState([]);

  const [form] = Form.useForm();

  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record) => record.key === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      Registration_No: "",
      Vehicle_Type: "",
      PUC: "",
      Model: "",
      ...record,
    });
    setEditingKey(record.key);
  };
  const cancel = () => {
    setEditingKey("");
  };
  const fetchVehicleListData = async () => {
    try {
      dispatch(getVehicleListRequest());
      const { data } = await axios.get(
        "https://att-creotech.onrender.com/api/v1/vehicle_list"
      );

      dispatch(getVehicleListSuccess(data));
      setData(
        data.map((vehicle) => ({
          key: vehicle._id,
          Registration_No: vehicle.vehicle_regnumber,
          PUC: vehicle.vehicle_puc,
          Vehicle_Type: vehicle.vehicle_type,
          Model: vehicle.vehicle_model,
          ClientName: vehicle.vehicle_clientname,
          RegDate: vehicle.vehicle_regdate_exp,
          TaxDate: vehicle.vehicle_taxdate_exp,
          FitnessDate: vehicle.vehicle_fitnessdate_exp,
          InsuranceDate: vehicle.vehicle_insurancedate_exp,
          Created: moment
            .utc(vehicle.createdAt)
            .local()
            .format("DD-MM-YYYY hh:mm A"),
          Updated: moment
            .utc(vehicle.updatedAt)
            .local()
            .format("DD-MM-YYYY hh:mm A"),
        }))
      );
      setEditingKey("");
    } catch (error) {
      dispatch(getVehicleListFail());
    }
  };

  useEffect(() => {
    fetchVehicleListData();
  }, []);
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      console.log(row);
      const formData = new FormData();
      formData.append("vehicle_regnumber", row.Registration_No);
      formData.append("vehicle_type", row.Vehicle_Type);
      formData.append("vehicle_model", row.Model);
      formData.append("vehicle_clientname", row.ClientName);
      formData.append("vehicle_puc", row.PUC);
      formData.append("vehicle_created", row.Created);
      formData.append("vehicle_updated", row.Updated);
      formData.append("vehicle_regdate_exp", row.RegDate);
      formData.append("vehicle_taxdate_exp", row.TaxDate);
      formData.append("vehicle_fitnessdate_exp", row.FitnessDate);
      formData.append("vehicle_insurancedate_exp", row.InsuranceDate);
      dispatch(updateVehicleList(key, formData));
      setTimeout(() => {
        fetchVehicleListData();
      }, 1000);
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  useEffect(() => {
    if (isVehicleListUpdated) {
      toast("Vehicle Updated Succesfully!", {
        type: "success",
        position: toast.POSITION.BOTTOM_CENTER,
        onOpen: () => dispatch(clearUpdateVehicleListCreated()),
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
  }, [isVehicleListUpdated, error, dispatch]);
  const columns = [
    {
      title: "Registration_No",
      dataIndex: "Registration_No",
      editable: true,
      fixed: "left",
    },
    {
      title: "Vehicle_Type",
      dataIndex: "Vehicle_Type",
      editable: true,
    },
    {
      title: "Model",
      dataIndex: "Model",
      editable: true,
    },
    {
      title: "Client_name",
      dataIndex: "ClientName",
      // editable: true,
    },
    {
      title: "Regdate_Exp",
      dataIndex: "RegDate",
      // editable: true,
    },
    {
      title: "Taxdate_Exp",
      dataIndex: "TaxDate",
      // editable: true,
    },
    {
      title: "Fitnessdate_Exp",
      dataIndex: "FitnessDate",
      // editable: true,
    },
    {
      title: "Insurancedate_Exp",
      dataIndex: "InsuranceDate",
      // editable: true,
    },
    {
      title: "PUC",
      dataIndex: "PUC",
      maxWidth: 50,
      render: (t, r) => (
        <Image
          src={r.PUC ? r.PUC : error}
          width={50}
          height={50}
          alt="PUC"
          fallback="data:image/png;base64,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"
        />
      ),
      editable: true,
    },

    {
      title: "Created At",
      dataIndex: "Created",
    },
    {
      title: "Updated At",
      dataIndex: "Updated",
    },
    {
      title: "operation",
      dataIndex: "operation",
      fixed: "right",
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
        inputType: col.dataIndex === "PUC" ? "file" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  // var copy = JSON.parse(JSON.stringify(data));
  return (
    <>
      <div className="container">
        <h1 className="text-black">Vehicle List</h1>
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
            scroll={{
              x: 1500,
              y: 300,
            }}
          />
        </Form>
      </div>
    </>
  );
};
export default VehicleList;
