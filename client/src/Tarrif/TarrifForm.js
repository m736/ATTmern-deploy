import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Card,
  Row,
  Col,
  Divider,
  Space,
  Popconfirm,
} from "antd";
import { TarrifTable } from "./TarrifTable";
import { NumericInput } from "./TarrifNumericInput";
import { updateSingleTarrif } from "../action/tarrifAction";
import { useDispatch } from "react-redux";

const TarrifForm = (props) => {
  const {
    tarrif,
    setTarrifInput,
    tarrifInput,
    index,
    tarrifInputField,
    company,
    vehicleType,
    screenEdit,
    editableIndex,
    id,
    setEditableIndex,
  } = props;
  const [form] = Form.useForm();
  console.log(tarrif);
  const { Option } = Select;
  const EnableTarrifRentalInput = {
    slab: ["segment"],
    outstation: [],
    flat_rate: ["area"],
  };
  const [enableinput, setEnableInput] = useState([]);
  useEffect(() => {
    if (tarrif?.selectedRental) {
      setEnableInput(EnableTarrifRentalInput[tarrif?.selectedRental]);
    }
  }, [tarrif]);

  const RentalChange = (value) => {
    form.resetFields();
    valueHandle("selectedRental", value);
  };

  const valueHandle = (field, value) => {
    let activeIndex = tarrifInput.findIndex(
      (item) => item.position == tarrif.position
    );

    if (activeIndex > -1) {
      let updated = [];
      if (field == "selectedRental") {
        updated = tarrifInput?.map((item, index) => {
          if (index == activeIndex) {
            return screenEdit == "edit"
              ? {
                  ...tarrifInputField,
                  position: item.position,
                  company: company,
                  vehicleType: vehicleType,
                  [field]: value,
                  editable: item.editable,
                }
              : {
                  ...tarrifInputField,
                  position: item.position,
                  company: company,
                  vehicleType: vehicleType,
                  [field]: value,
                };
          } else {
            return item;
          }
        });
      } else {
        updated = tarrifInput?.map((item, index) => {
          if (index == activeIndex) {
            return {
              ...item,
              [field]: value,
            };
          } else {
            return item;
          }
        });
      }
      setTarrifInput(updated);
    }
  };

  const edit = (activeIndex) => {
    let updated = tarrifInput?.map((item, index) => {
      if (index == activeIndex) {
        return {
          ...item,

          editable: true,
        };
      } else {
        return item;
      }
    });
    setEditableIndex(activeIndex);
    setTarrifInput(updated);
  };
  const cancel = (activeIndex) => {
    let canceled = tarrifInput?.map((item, index) => {
      if (index == activeIndex) {
        return {
          ...item,

          editable: false,
        };
      } else {
        return item;
      }
    });

    setTarrifInput(canceled);
  };
  const dispatch = useDispatch();
  const save = async (key) => {
    try {
      dispatch(updateSingleTarrif(key, tarrif));
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const RemoveTarrifInput = () => {
    let activeIndex = tarrifInput.findIndex(
      (item) => item.position == tarrif.position
    );
    if (activeIndex > -1) {
      let updated = tarrifInput.filter((i, index) => index !== activeIndex);
      setTarrifInput(updated);
    }
  };
  return (
    <>
      <Form form={form} name={`tarrifform-${index}`}>
        <Row gutter={[16, 24]}>
          {screenEdit == "edit" ? (
            <>
              <Col className="gutter-row" span={4}>
                <Form.Item name="company">
                  <Select
                    disabled={!tarrif.editable}
                    defaultValue={tarrif?.company}
                    value={tarrif?.company}
                    onChange={(value) => {
                      valueHandle("company", value);
                    }}
                  >
                    {tarrif?.companies?.map((item) => {
                      return (
                        <Option key={item.value} value={item.value}>
                          {item.text}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={4}>
                <Form.Item name="vehicleType">
                  <Select
                    disabled={!tarrif.editable}
                    defaultValue={tarrif?.vehicleType}
                    value={tarrif?.vehicleType}
                    onChange={(value) => {
                      valueHandle("vehicleType", value);
                    }}
                  >
                    {tarrif?.vehicleTypes?.map((item) => {
                      return (
                        <Option key={item.value} value={item.value}>
                          {item.text}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
            </>
          ) : null}
          <Col className="gutter-row" span={4}>
            <Form.Item name="rental">
              <Select
                defaultValue={tarrif?.selectedRental}
                value={tarrif?.selectedRental}
                placeholder="Select Rental"
                onChange={RentalChange}
                disabled={!tarrif?.editable}
              >
                {tarrif?.rental?.map((item) => {
                  return (
                    <Option key={item.value} value={item.value}>
                      {item.text}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={4}>
            <Form.Item name="segment">
              <Select
                disabled={!enableinput.includes("segment") || !tarrif.editable}
                defaultValue={tarrif?.selectedSegment}
                value={tarrif?.selectedSegment}
                onChange={(value) => {
                  valueHandle("selectedSegment", value);
                }}
              >
                {tarrif?.segment?.map((item) => {
                  return (
                    <Option key={item.value} value={item.value}>
                      {item.text}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={4}>
            <Form.Item name="area">
              <Select
                placeholder="Select Area"
                disabled={!enableinput.includes("area") || !tarrif.editable}
                defaultValue={tarrif?.selectedArea}
                value={tarrif?.selectedArea}
                onChange={(value) => {
                  valueHandle("selectedArea", value);
                }}
              >
                {tarrif?.area?.map((item) => {
                  return (
                    <Option key={item.value} value={item.value}>
                      {item.text}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      {screenEdit == "edit" ? (
        <Space>
          {tarrif.editable ? (
            <>
              <Button
                type="primary"
                className="mt-3"
                onClick={() => save(tarrif._id)}
              >
                Save
              </Button>
              <Button className="mt-3">
                <Popconfirm
                  title="Sure to cancel?"
                  onConfirm={() => cancel(index)}
                >
                  <a>Cancel</a>
                </Popconfirm>
              </Button>
            </>
          ) : (
            <>
              <Button
                className="mt-3"
                onClick={() => edit(index)}
                disabled={editableIndex !== null && editableIndex !== index}
              >
                Edit
              </Button>

              <Button
                className="bg-red-700 hover:bg-red-400  border-red-700 hover:border-red-500 text-white mt-3"
                onClick={RemoveTarrifInput}
              >
                Remove
              </Button>
            </>
          )}
        </Space>
      ) : index > 0 ? (
        <Button
          className="bg-red-700 hover:bg-red-400  border-red-700 hover:border-red-500 text-white mt-3"
          onClick={RemoveTarrifInput}
        >
          Remove
        </Button>
      ) : null}
      <Divider />
    </>
  );
};

export default TarrifForm;
