import { Form, Input, Popconfirm, Select, Table, Typography } from "antd";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTarrif } from "../action/tarrifAction";
import { tarrifInputField } from "./CreateNewTarrif";
import { NumericInput } from "./TarrifNumericInput";
const { Option } = Select;
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
  const inputNode =
    inputType === "" ? (
      <>
        {dataIndex == "company" ? (
          <>
            <Select placeholder="Select a option and change input text above">
              {tarrifInputField?.company?.map((item) => {
                return (
                  <Option key={item.value} value={item.value}>
                    {item.text}
                  </Option>
                );
              })}
            </Select>
          </>
        ) : null}
        {dataIndex == "vehicleType" ? (
          <>
            <Select placeholder="Select a option and change input text above">
              {tarrifInputField?.vehicleType?.map((item) => {
                return (
                  <Option key={item.value} value={item.value}>
                    {item.text}
                  </Option>
                );
              })}
            </Select>
          </>
        ) : null}
        {dataIndex == "selectedRental" ? (
          <>
            <Select placeholder="Select a option and change input text above">
              {tarrifInputField?.rental?.map((item) => {
                return (
                  <Option key={item.value} value={item.value}>
                    {item.text}
                  </Option>
                );
              })}
            </Select>
          </>
        ) : null}
        {dataIndex == "selectedSegment" ? (
          <>
            <Select placeholder="Select Segment">
              {tarrifInputField?.segment?.map((item) => {
                return (
                  <Option key={item.value} value={item.value}>
                    {item.text}
                  </Option>
                );
              })}
            </Select>
          </>
        ) : null}
        {dataIndex == "selectedArea" ? (
          <>
            <Select placeholder="Select Area">
              {tarrifInputField?.area?.map((item) => {
                return (
                  <Option key={item.value} value={item.value}>
                    {item.text}
                  </Option>
                );
              })}
            </Select>
          </>
        ) : null}
        {dataIndex == "selectedSlabhrs" ? (
          <>
            <Select placeholder="Slab Hrs">
              {tarrifInputField?.slabhrs?.map((item) => {
                return (
                  <Option key={item.value} value={item.value}>
                    {item.text}
                  </Option>
                );
              })}
            </Select>
          </>
        ) : null}
        {dataIndex == "selectedSlabkms" ? (
          <>
            <Select placeholder="Slab Kms">
              {tarrifInputField?.slabkms?.map((item) => {
                return (
                  <Option key={item.value} value={item.value}>
                    {item.text}
                  </Option>
                );
              })}
            </Select>
          </>
        ) : null}
        {dataIndex == "selectedSlabfrom" ? (
          <>
            <Select placeholder="Slab From">
              {tarrifInputField?.slabfrom?.map((item) => {
                return (
                  <Option key={item.value} value={item.value}>
                    {item.text}
                  </Option>
                );
              })}
            </Select>
          </>
        ) : null}
        {dataIndex == "selectedSlabto" ? (
          <>
            <Select placeholder="Slab To">
              {tarrifInputField?.slabto?.map((item) => {
                return (
                  <Option key={item.value} value={item.value}>
                    {item.text}
                  </Option>
                );
              })}
            </Select>
          </>
        ) : null}
        {dataIndex == "selectedAddon" ? (
          <>
            <Select placeholder="Select AddOn">
              {tarrifInputField?.addon?.map((item) => {
                return (
                  <Option key={item.value} value={item.value}>
                    {item.text}
                  </Option>
                );
              })}
            </Select>
          </>
        ) : null}
        {dataIndex == "salesRate" ? (
          <>
            <NumericInput />
          </>
        ) : null}
        {dataIndex == "purchaseRate" ? (
          <>
            <NumericInput />
          </>
        ) : null}
        {dataIndex == "salesExKmsRate" ? (
          <>
            <NumericInput />
          </>
        ) : null}
        {dataIndex == "salesExHrsRate" ? (
          <>
            <NumericInput />
          </>
        ) : null}
        {dataIndex == "purchaseExHrsRate" ? (
          <>
            <NumericInput />
          </>
        ) : null}
        {dataIndex == "purchaseExKmsRate" ? (
          <>
            <NumericInput />
          </>
        ) : null}
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
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
const ReUpDeTarrif = () => {
  const dispatch = useDispatch();
  const { tarrifData, loading } = useSelector((state) => state.TarrifState);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record) => record.key === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      company: "",
      vehicleType: "",
      selectedRental: "",
      selectedSegment: "",
      selectedArea: "",
      selectedSlabhrs: "",
      selectedSlabkms: "",
      selectedSlabfrom: "",
      selectedSlabto: "",
      selectedAddon: "",
      salesRate: "",
      purchaseRate: "",
      salesExKmsRate: "",
      purchaseExKmsRate: "",
      salesExHrsRate: "",
      purchaseExHrsRate: "",

      ...record,
    });
    setEditingKey(record.key);
  };
  const cancel = () => {
    setEditingKey("");
  };
  const fetchVehicleListData = async () => {
    dispatch(getTarrif);
  };

  useEffect(() => {
    fetchVehicleListData();
  }, []);
  const save = async (key) => {
    try {
      const row = await form.validateFields();
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };
  const columns = [
    {
      title: "Company Name",
      dataIndex: "company",
      editable: true,
    },
    {
      title: "Vehicle Type",
      dataIndex: "vehicleType",
      editable: true,
    },
    {
      title: "Rental",
      dataIndex: "selectedRental",
      editable: true,
    },
    {
      title: "Segment",
      dataIndex: "selectedSegment",
      editable: true,
    },
    {
      title: "Area",
      dataIndex: "selectedArea",
      editable: true,
    },
    {
      title: "Slab Hours",
      dataIndex: "selectedSlabhrs",
      editable: true,
    },
    {
      title: "Slab Kms",
      dataIndex: "selectedSlabkms",
      editable: true,
    },
    {
      title: "Slab From",
      dataIndex: "selectedSlabfrom",
      editable: true,
    },
    {
      title: "Slab To",
      dataIndex: "selectedSlabto",
      editable: true,
    },
    {
      title: "Add On",
      dataIndex: "selectedAddon",
      editable: true,
    },
    {
      title: "Sales Rate",
      dataIndex: "salesRate",
      editable: true,
    },
    {
      title: "Purchase Rate",
      dataIndex: "purchaseRate",
      editable: true,
    },
    {
      title: "Sales Ex Kms Rate",
      dataIndex: "salesExKmsRate",
      editable: true,
    },
    {
      title: "Purchase Ex Kms Rate",
      dataIndex: "purchaseExKmsRate",
      editable: true,
    },
    {
      title: "Sales Ex Hrs Rate",
      dataIndex: "salesExHrsRate",
      editable: true,
    },
    {
      title: "Purchase Ex Hrs Rate",
      dataIndex: "purchaseExHrsRate",
      editable: true,
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
        inputType:
          col.dataIndex === "company" ||
          col.dataIndex === "vehicleType" ||
          col.dataIndex === "selectedRental" ||
          col.dataIndex === "selectedSegment" ||
          col.dataIndex === "selectedArea" ||
          col.dataIndex === "selectedSlabhrs" ||
          col.dataIndex === "selectedSlabkms" ||
          col.dataIndex === "selectedSlabfrom" ||
          col.dataIndex === "selectedSlabto" ||
          col.dataIndex === "selectedAddon" ||
          col.dataIndex === "salesRate" ||
          col.dataIndex === "purchaseRate" ||
          col.dataIndex === "salesExKmsRate" ||
          col.dataIndex === "salesExHrsRate" ||
          col.dataIndex === "purchaseExKmsRate" ||
          col.dataIndex === "purchaseExHrsRate"
            ? ""
            : "text",
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
            bordered
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            dataSource={tarrifData}
            columns={mergedColumns}
            rowClassName="editable-row"
            pagination={{
              onChange: cancel,
            }}
            scroll={{
              x: 2500,
            }}
          />
        </Form>
      </div>
    </>
  );
};
export default ReUpDeTarrif;
