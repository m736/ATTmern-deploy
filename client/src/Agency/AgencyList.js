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

import { useNavigate } from "react-router-dom";
import {
  deleteAgencyListAction,
  editAgencyListAction,
  getAgencyListAction,
} from "../action/AgencyListAction";
import {
  clearAgencyListDeleted,
  clearAgencyListError,
  clearAgencyListUpdated,
} from "../slices/AgencySlice";
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
  let inputNode;
  inputNode =
    inputType === "textarea" ? (
      <>
        <Input.TextArea />
      </>
    ) : (
      <Input />
    );

  return (
    <td {...restProps}>
      {editing &&
      (dataIndex == "owner_name" ||
        dataIndex == "address" ||
        dataIndex == "email_id" ||
        dataIndex == "phone_no" ||
        dataIndex == "pancard_no" ||
        dataIndex == "bank_ccount_no" ||
        dataIndex == "tds" ||
        dataIndex == "gst") ? (
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
          {/* <Input /> */}
          {inputNode}
        </Form.Item>
      ) : editing &&
        (dataIndex == "bank_name" ||
          dataIndex == "IFSC_code" ||
          dataIndex == "bank_branch") ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
        >
          {/* <Input /> */}
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const AgencyList = () => {
  const [bordered, setBordered] = useState(true);
  const [tabledata, setTabledata] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [form] = Form.useForm();
  const { confirm } = Modal;
  const dispatch = useDispatch();
  const tableProps = {
    bordered,
  };
  const {
    agency_detail = [],
    agencyListLoading,
    isAgencyListUpdated,
    isAgencyListDeleted,
    error,
  } = useSelector((state) => state.AgencyState || []);

  useEffect(() => {
    dispatch(getAgencyListAction);
  }, []);
  useEffect(() => {
    if (agency_detail && agency_detail.length > 0) {
      let updatedAgency = agency_detail.map((item) => {
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

      setTabledata(updatedAgency);
    } else {
      setTabledata([]);
    }
  }, [agency_detail]);

  const isEditing = (record) => record._id === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      owner_name: "",
      address: "",
      email_id: "",
      phone_no: "",
      pancard_no: "",
      bank_ccount_no: "",
      bank_name: "",
      IFSC_code: "",
      bank_branch: "",
      tds: "",
      gst: "",
      ...record,
    });
    setEditingKey(record._id);
  };
  const cancel = () => {
    setEditingKey("");
  };

  const columns = [
    {
      title: "Owner Name",
      dataIndex: "owner_name",
      editable: true,
      fixed: "left",
    },
    {
      title: "Address",
      dataIndex: "address",
      editable: true,
    },
    {
      title: "Email_Id",
      dataIndex: "email_id",
      editable: true,
    },
    {
      title: "Phone_No",
      dataIndex: "phone_no",
      editable: true,
    },
    {
      title: "Pancard_No",
      dataIndex: "pancard_no",
      editable: true,
    },
    {
      title: "A/C_No",
      dataIndex: "bank_ccount_no",
      editable: true,
    },
    {
      title: "Bank_Name",
      dataIndex: "bank_name",
      editable: true,
    },
    {
      title: "IFSC Code",
      dataIndex: "IFSC_code",
      editable: true,
    },
    {
      title: "Bank_Branch",
      dataIndex: "bank_branch",
      editable: true,
    },
    {
      title: "TDS",
      dataIndex: "tds",
      editable: true,
    },
    {
      title: "GST",
      dataIndex: "gst",
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
              onClick={() => saveAgency(record._id)}
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
              onClick={() => deleteAgencyFunc(record?._id)}
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
        inputType: col.dataIndex === "address" ? "textarea" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  const saveAgency = async (key) => {
    try {
      const row = await form.validateFields();

      dispatch(
        editAgencyListAction(key, {
          IFSC_code: row.IFSC_code,
          address: row.address,
          bank_branch: row.bank_branch,
          bank_ccount_no: row.bank_ccount_no,
          bank_name: row.bank_name,
          email_id: row.email_id,
          owner_name: row.owner_name,
          pancard_no: row.pancard_no,
          phone_no: row.phone_no,
          tds: row.tds,
          gst: row.gst,
        })
      );
      // dispatch(editAreaAction(key, { Area: row.value }));
      setEditingKey("");
    } catch (errInfo) {
      alert("Validate Failed:", errInfo);
    }
  };
  const deleteAgencyFunc = (id) => {
    // setCurrentPage(1);
    confirm({
      title: "Do you want to Delete these Agency Details?",
      icon: <ExclamationCircleFilled />,

      onOk() {
        dispatch(deleteAgencyListAction(id));
        setTimeout(() => {
          dispatch(getAgencyListAction);
        }, [1000]);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  useEffect(() => {
    if (isAgencyListUpdated) {
      toast("Agency Updated Succesfully!", {
        type: "success",
        position: toast.POSITION.BOTTOM_CENTER,
        onOpen: () => dispatch(clearAgencyListUpdated()),
      });

      return;
    }
    if (isAgencyListDeleted) {
      toast("Agency Deleted Succesfully!", {
        type: "success",
        position: toast.POSITION.TOP_CENTER,
        onOpen: () => dispatch(clearAgencyListDeleted()),
      });
      return;
    }

    if (error) {
      toast(error, {
        position: toast.POSITION.BOTTOM_CENTER,
        type: "error",
        onOpen: () => {
          dispatch(clearAgencyListError());
        },
      });
      return;
    }
  }, [isAgencyListUpdated, isAgencyListDeleted, error, dispatch]);
  const navigate = useNavigate();
  const CreateNewAgency = () => {
    navigate("/agencies/new_agency");
  };
  const { Title } = Typography;
  return (
    <>
      <Spin spinning={agencyListLoading} tip="loading">
        <div class="flex flex-row items-center justify-between mt-5">
          <Title className="font-bold" level={4}>
            Agency List
          </Title>
          <Button
            className="text-white border-green-500 bg-green-500 hover:bg-white mb-7"
            onClick={CreateNewAgency}
          >
            New Agency
          </Button>
        </div>
        <Form form={form} component={false}>
          <Table
            id={"agency_detail"}
            {...tableProps}
            columns={mergedColumns}
            dataSource={tabledata}
            scroll={{
              y: 900,
              x: 2500,
            }}
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

export default AgencyList;
