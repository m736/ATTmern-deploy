import { Button, Form, Input, Popconfirm, Select, Space } from "antd";
import React, { useEffect, useState } from "react";
import { NumericInput } from "./NumericInput";
import {
  deleteTarrif,
  getTarrif,
  updateSingleTarrif,
} from "../action/tarrifAction";
import { useSelector, useDispatch } from "react-redux";
const TarrifFormTable = (props) => {
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
    screenAdd,
    setEditableIndex,
    setEditableRow,
    editableRow,
  } = props;
  const [form] = Form.useForm();
  const sample = [
    "segment",
    "area",
    "slabhrs",
    "slabkms",

    "slabfrom",
    "slabto",
    "addon",
    "salesRate",
    "purchaseRate",
    "salesExKmsRate",
    "salesExHrsRate",
    "purchaseExHrsRate",
    "purchaseExKmsRate",
    "purchaseGraceTime",
    "salesGraceTime",
    "driverbata",
  ];
  const EnableTarrifRentalInput = {
    local: [
      "segment",
      "area",
      "slabhrs",
      "slabkms",
      "salesRate",
      "purchaseRate",
      "salesExKmsRate",
      "salesExHrsRate",
      "purchaseExHrsRate",
      "purchaseExKmsRate",
      "purchaseGraceTime",
      "salesGraceTime",
    ],
    out_station: [
      "segment",
      "slabhrs",
      "slabkms",
      "area",
      "salesExKmsRate",
      "purchaseExKmsRate",
      "driverbata",
    ],
    flat_rate: [
      "segment",
      "slabhrs",
      "slabkms",
      "salesRate",
      "purchaseRate",
      "salesExKmsRate",
      "salesExHrsRate",
      "purchaseExHrsRate",
      "purchaseExKmsRate",
      "purchaseGraceTime",
      "salesGraceTime",
    ],
    airport_transfer: [
      "segment",
      "area",
      "slabhrs",
      "slabkms",
      "salesRate",
      "purchaseRate",
      "driverbata",
    ],
    hotel_transfer: [
      "segment",
      "slabhrs",
      "slabkms",
      "salesRate",
      "purchaseRate",
      "salesExKmsRate",
      "salesExHrsRate",
      "purchaseExHrsRate",
      "purchaseExKmsRate",
      "purchaseGraceTime",
      "salesGraceTime",
    ],
    slab_rate: [
      "segment",
      "area",
      "slabfrom",
      "slabto",
      "addon",
      "purchaseRate",
      "salesRate",
    ],
    trip_rate: ["segment", "area", "addon", "purchaseRate", "salesRate"],
    shift_rate: ["segment", "area", "purchaseRate", "salesRate"],
    day_rate: ["segment", "area", "purchaseRate", "salesRate"],
    escort_airport_transfer: [
      "segment",
      "slabhrs",
      "slabkms",
      "salesRate",
      "purchaseRate",
      "salesExKmsRate",
      "salesExHrsRate",
      "purchaseExHrsRate",
      "purchaseExKmsRate",
      "purchaseGraceTime",
      "salesGraceTime",
    ],
    one_way: [
      "segment",
      "slabhrs",
      "slabkms",
      "salesRate",
      "purchaseRate",
      "salesExKmsRate",
      "salesExHrsRate",
      "purchaseExHrsRate",
      "purchaseExKmsRate",
      "purchaseGraceTime",
      "salesGraceTime",
    ],
    two_way: [
      "segment",
      "slabhrs",
      "slabkms",
      "salesRate",
      "purchaseRate",
      "salesExKmsRate",
      "salesExHrsRate",
      "purchaseExHrsRate",
      "purchaseExKmsRate",
      "purchaseGraceTime",
      "salesGraceTime",
    ],
    railway_bus_transfer: [
      "segment",
      "slabhrs",
      "slabkms",
      "salesRate",
      "purchaseRate",
      "salesExKmsRate",
      "salesExHrsRate",
      "purchaseExHrsRate",
      "purchaseExKmsRate",
      "purchaseGraceTime",
      "salesGraceTime",
    ],
    KMS_rate: ["segment", "salesRate", "purchaseRate"],
  };
  const [enableinput, setEnableInput] = useState([]);

  const dispatch = useDispatch();
  const { Option } = Select;

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
                  _id: item._id,
                  position: item.position,
                  company: company,
                  vehicleType: vehicleType,
                  [field]: value,
                  editable: item.editable,
                }
              : {
                  ...tarrifInputField,
                  _id: item._id,
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

  const AddTarrifInput = () => {
    let newItem = {
      ...tarrifInputField,
      position: tarrifInput[tarrifInput.length - 1]?.position + 1,
      company: company,
      vehicleType: vehicleType,
    };

    setTarrifInput([...tarrifInput, newItem]);
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

  const editTarrifData = (activeIndex) => {
    let updated = tarrifInput?.map((item, index) => {
      if (index == activeIndex) {
        setEditableRow(item);
        return {
          ...item,
          editable: true,
        };
      } else {
        return item;
      }
    });
    console.log(updated);
    setEditableIndex(activeIndex);
    setTarrifInput(updated);
  };
  const cancelTarrifData = (activeIndex) => {
    let canceled = tarrifInput?.map((item, index) => {
      if (index == activeIndex) {
        return {
          ...editableRow,
          editable: false,
        };
      } else {
        return item;
      }
    });
    setEditableRow(null);
    setEditableIndex(null);
    setTarrifInput(canceled);
  };
  const updateTarrifData = (index) => {
    let updated = tarrifInput.find((i, ind) => ind == index);

    dispatch(updateSingleTarrif(updated?._id, updated));
    setTimeout(() => {
      dispatch(getTarrif);
    }, 1000);
    setEditableIndex(null);
  };
  const deleteTarrifData = (id) => {
    dispatch(deleteTarrif(id));
    setTimeout(() => {
      dispatch(getTarrif);
    }, 1000);
  };

  return (
    <>
      {screenEdit == "edit" && (
        <tr>
          {!tarrif.editable ? (
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200 uppercase">
              {tarrif?.company == null ? (
                <span className="text-red-600">{tarrif.empty}</span>
              ) : (
                tarrif?.company
              )}
            </td>
          ) : (
            <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200 uppercase">
              <Select
                style={{ width: "140px" }}
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
            </td>
          )}

          {!tarrif.editable ? (
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200 uppercase">
              {tarrif?.vehicleType == null ? (
                <span className="text-red-600">{tarrif.empty}</span>
              ) : (
                tarrif?.vehicleType
              )}
            </td>
          ) : (
            <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200 uppercase">
              <Select
                style={{ width: "140px" }}
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
            </td>
          )}

          {!tarrif.editable ? (
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200 uppercase">
              {tarrif?.selectedRental}
            </td>
          ) : (
            <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200 uppercase">
              <Select
                style={{ width: "140px" }}
                defaultValue={tarrif?.selectedRental}
                value={tarrif?.selectedRental}
                onChange={RentalChange}
              >
                {tarrif?.rental?.map((item) => {
                  return (
                    <Option key={item.value} value={item.value}>
                      {item.text}
                    </Option>
                  );
                })}
              </Select>
            </td>
          )}
          {!tarrif.editable ? (
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200 uppercase">
              {tarrif?.selectedSegment == "" ? (
                <span className="text-red-600">{tarrif.empty}</span>
              ) : (
                tarrif?.selectedSegment
              )}
            </td>
          ) : (
            <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200 uppercase">
              {enableinput?.includes("segment") ? (
                <Select
                  style={{ width: "140px" }}
                  disabled={!enableinput?.includes("segment")}
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
              ) : null}
            </td>
          )}
          {!tarrif.editable ? (
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200 uppercase">
              {tarrif?.selectedArea == "" ? (
                <span className="text-red-600">{tarrif.empty}</span>
              ) : (
                tarrif?.selectedArea
              )}
            </td>
          ) : (
            <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200 uppercase">
              {enableinput?.includes("area") ? (
                <Select
                  style={{ width: "140px" }}
                  disabled={!enableinput?.includes("area")}
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
              ) : null}
            </td>
          )}
          {!tarrif.editable ? (
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200 uppercase">
              {tarrif?.selectedSlabhrs == "" ? (
                <span className="text-red-600">{tarrif.empty}</span>
              ) : (
                tarrif?.selectedSlabhrs
              )}
            </td>
          ) : (
            <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200 uppercase">
              {enableinput?.includes("slabhrs") ? (
                <Select
                  style={{ width: "140px" }}
                  disabled={!enableinput?.includes("slabhrs")}
                  onChange={(value) => {
                    valueHandle("selectedSlabhrs", value);
                  }}
                  defaultValue={tarrif?.selectedSlabhrs}
                  value={tarrif?.selectedSlabhrs}
                >
                  {tarrif?.slabhrs?.map((item) => {
                    return (
                      <Option key={item.value} value={item.value}>
                        {item.text}
                      </Option>
                    );
                  })}
                </Select>
              ) : null}
            </td>
          )}
          {!tarrif.editable ? (
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200 uppercase">
              {tarrif?.selectedSlabkms == "" ? (
                <span className="text-red-600">{tarrif.empty}</span>
              ) : (
                tarrif?.selectedSlabkms
              )}
            </td>
          ) : (
            <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200 uppercase">
              {enableinput?.includes("slabkms") ? (
                <Select
                  style={{ width: "140px" }}
                  defaultValue={tarrif.selectedSlabkms}
                  value={tarrif.selectedSlabkms}
                  disabled={!enableinput?.includes("slabkms")}
                  onChange={(value) => {
                    valueHandle("selectedSlabkms", value);
                  }}
                >
                  {tarrif?.slabkms?.map((item) => {
                    return (
                      <Option key={item.value} value={item.value}>
                        {item.text}
                      </Option>
                    );
                  })}
                </Select>
              ) : null}
            </td>
          )}
          {!tarrif.editable ? (
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200 uppercase">
              {tarrif?.selectedSlabfrom == "" ? (
                <span className="text-red-600">{tarrif.empty}</span>
              ) : (
                tarrif?.selectedSlabfrom
              )}
            </td>
          ) : (
            <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200 uppercase">
              {enableinput?.includes("slabfrom") ? (
                <Select
                  style={{ width: "140px" }}
                  defaultValue={tarrif.selectedSlabfrom}
                  value={tarrif.selectedSlabfrom}
                  placeholder="Slab From"
                  disabled={!enableinput?.includes("slabfrom")}
                  onChange={(value) => {
                    valueHandle("selectedSlabfrom", value);
                  }}
                >
                  {tarrif?.slabfrom?.map((item) => {
                    return (
                      <Option key={item.value} value={item.value}>
                        {item.text}
                      </Option>
                    );
                  })}
                </Select>
              ) : null}
            </td>
          )}
          {!tarrif.editable ? (
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200 uppercase">
              {tarrif?.selectedSlabto == "" ? (
                <span className="text-red-600">{tarrif.empty}</span>
              ) : (
                tarrif?.selectedSlabto
              )}
            </td>
          ) : (
            <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200 uppercase">
              {enableinput?.includes("slabto") ? (
                <Select
                  style={{ width: "140px" }}
                  defaultValue={tarrif.selectedSlabto}
                  value={tarrif.selectedSlabto}
                  disabled={!enableinput?.includes("slabto")}
                  onChange={(value) => {
                    valueHandle("selectedSlabto", value);
                  }}
                >
                  {tarrif?.slabto?.map((item) => {
                    return (
                      <Option key={item.value} value={item.value}>
                        {item.text}
                      </Option>
                    );
                  })}
                </Select>
              ) : null}
            </td>
          )}
          {!tarrif.editable ? (
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200 uppercase">
              {tarrif?.selectedAddon == "" ? (
                <span className="text-red-600">{tarrif.empty}</span>
              ) : (
                tarrif?.selectedAddon
              )}
            </td>
          ) : (
            <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200 uppercase">
              {enableinput?.includes("addon") ? (
                <Select
                  style={{ width: "140px" }}
                  defaultValue={tarrif.selectedAddon}
                  value={tarrif.selectedAddon}
                  disabled={!enableinput?.includes("addon")}
                  onChange={(value) => {
                    valueHandle("selectedAddon", value);
                  }}
                >
                  {tarrif?.addon?.map((item) => {
                    return (
                      <Option key={item.value} value={item.value}>
                        {item.text}
                      </Option>
                    );
                  })}
                </Select>
              ) : null}
            </td>
          )}
          {!tarrif.editable ? (
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200 uppercase">
              {tarrif?.salesRate == null ? (
                <span className="text-red-600">{tarrif.empty}</span>
              ) : (
                tarrif?.salesRate
              )}
            </td>
          ) : (
            <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200 uppercase">
              {enableinput?.includes("salesRate") ? (
                <NumericInput
                  style={{ width: "140px" }}
                  defaultValue={tarrif.salesRate}
                  value={tarrif.salesRate}
                  disabled={!enableinput?.includes("salesRate")}
                  onChange={(value) => {
                    valueHandle("salesRate", value);
                  }}
                />
              ) : null}
            </td>
          )}
          {!tarrif.editable ? (
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200 uppercase">
              {tarrif?.purchaseRate == null ? (
                <span className="text-red-600">{tarrif.empty}</span>
              ) : (
                tarrif?.purchaseRate
              )}
            </td>
          ) : (
            <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200 uppercase">
              {enableinput?.includes("purchaseRate") ? (
                <NumericInput
                  style={{ width: "140px" }}
                  defaultValue={tarrif.purchaseRate}
                  value={tarrif.purchaseRate}
                  disabled={!enableinput?.includes("purchaseRate")}
                  onChange={(value) => {
                    valueHandle("purchaseRate", value);
                  }}
                />
              ) : null}
            </td>
          )}
          {!tarrif.editable ? (
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200 uppercase">
              {tarrif?.salesExKmsRate == null ? (
                <span className="text-red-600">{tarrif.empty}</span>
              ) : (
                tarrif?.salesExKmsRate
              )}
            </td>
          ) : (
            <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200 uppercase">
              {enableinput?.includes("salesExKmsRate") ? (
                <NumericInput
                  style={{ width: "140px" }}
                  defaultValue={tarrif.salesExKmsRate}
                  value={tarrif.salesExKmsRate}
                  disabled={!enableinput?.includes("salesExKmsRate")}
                  onChange={(value) => {
                    valueHandle("salesExKmsRate", value);
                  }}
                />
              ) : null}
            </td>
          )}
          {!tarrif.editable ? (
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200 uppercase">
              {tarrif?.salesExHrsRate == null ? (
                <span className="text-red-600">{tarrif.empty}</span>
              ) : (
                tarrif?.salesExHrsRate
              )}
            </td>
          ) : (
            <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200 uppercase">
              {enableinput?.includes("salesExHrsRate") ? (
                <NumericInput
                  style={{ width: "140px" }}
                  defaultValue={tarrif.salesExHrsRate}
                  value={tarrif.salesExHrsRate}
                  disabled={!enableinput?.includes("salesExHrsRate")}
                  onChange={(value) => {
                    valueHandle("salesExHrsRate", value);
                  }}
                />
              ) : null}
            </td>
          )}
          {!tarrif.editable ? (
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200 uppercase">
              {tarrif?.purchaseExHrsRate == null ? (
                <span className="text-red-600">{tarrif.empty}</span>
              ) : (
                tarrif?.purchaseExHrsRate
              )}
            </td>
          ) : (
            <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200 uppercase">
              {enableinput?.includes("purchaseExHrsRate") ? (
                <NumericInput
                  style={{ width: "140px" }}
                  defaultValue={tarrif.purchaseExHrsRate}
                  value={tarrif.purchaseExHrsRate}
                  disabled={!enableinput?.includes("purchaseExHrsRate")}
                  onChange={(value) => {
                    valueHandle("purchaseExHrsRate", value);
                  }}
                />
              ) : null}
            </td>
          )}
          {!tarrif.editable ? (
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200 uppercase">
              {tarrif?.purchaseExKmsRate == null ? (
                <span className="text-red-600">{tarrif.empty}</span>
              ) : (
                tarrif?.purchaseExKmsRate
              )}
            </td>
          ) : (
            <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200 uppercase">
              {enableinput?.includes("purchaseExKmsRate") ? (
                <NumericInput
                  style={{ width: "140px" }}
                  defaultValue={tarrif.purchaseExKmsRate}
                  value={tarrif.purchaseExKmsRate}
                  disabled={!enableinput?.includes("purchaseExKmsRate")}
                  onChange={(value) => {
                    valueHandle("purchaseExKmsRate", value);
                  }}
                />
              ) : null}
            </td>
          )}
          {!tarrif.editable ? (
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200 uppercase">
              {tarrif?.salesGraceTime == null ? (
                <span className="text-red-600">{tarrif.empty}</span>
              ) : (
                tarrif?.salesGraceTime
              )}
            </td>
          ) : (
            <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200 uppercase">
              {enableinput?.includes("salesGraceTime") ? (
                <NumericInput
                  style={{ width: "140px" }}
                  defaultValue={tarrif.salesGraceTime}
                  value={tarrif.salesGraceTime}
                  disabled={!enableinput?.includes("salesGraceTime")}
                  onChange={(value) => {
                    valueHandle("salesGraceTime", value);
                  }}
                />
              ) : null}
            </td>
          )}
          {!tarrif.editable ? (
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200 uppercase">
              {tarrif?.purchaseGraceTime == null ? (
                <span className="text-red-600">{tarrif.empty}</span>
              ) : (
                tarrif?.purchaseGraceTime
              )}
            </td>
          ) : (
            <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200 uppercase">
              {enableinput?.includes("purchaseGraceTime") ? (
                <NumericInput
                  style={{ width: "140px" }}
                  defaultValue={tarrif.purchaseGraceTime}
                  value={tarrif.purchaseGraceTime}
                  disabled={!enableinput?.includes("purchaseGraceTime")}
                  onChange={(value) => {
                    valueHandle("purchaseGraceTime", value);
                  }}
                />
              ) : null}
            </td>
          )}
          {!tarrif.editable ? (
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200 uppercase">
              {tarrif?.driverbata == null ? (
                <span className="text-red-600">{tarrif.empty}</span>
              ) : (
                tarrif?.driverbata
              )}
            </td>
          ) : (
            <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200 uppercase">
              {enableinput?.includes("driverbata") ? (
                <NumericInput
                  style={{ width: "140px" }}
                  defaultValue={tarrif.driverbata}
                  value={tarrif.driverbata}
                  disabled={!enableinput?.includes("driverbata")}
                  onChange={(value) => {
                    valueHandle("driverbata", value);
                  }}
                />
              ) : null}
            </td>
          )}
          <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
            <Space>
              {tarrif.editable ? (
                <>
                  <Button
                    type="primary"
                    className="mt-3"
                    onClick={() => updateTarrifData(index)}
                  >
                    Save
                  </Button>
                  <Button className="mt-3">
                    <Popconfirm
                      title="Sure to cancel?"
                      onConfirm={() => cancelTarrifData(index)}
                    >
                      <a>Cancel</a>
                    </Popconfirm>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    className="mt-3"
                    onClick={() => editTarrifData(index)}
                    disabled={editableIndex !== null && editableIndex !== index}
                  >
                    Edit
                  </Button>

                  <Button
                    disabled={editableIndex !== null && editableIndex !== index}
                    className="bg-red-700 hover:bg-red-400  border-red-700 hover:border-red-500 text-white mt-3"
                    onClick={() => deleteTarrifData(tarrif?._id)}
                  >
                    Delete
                  </Button>
                </>
              )}
            </Space>
          </td>
        </tr>
      )}
      {screenAdd == "add" && (
        <tr>
          <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
            <Select
              style={{ width: "140px" }}
              defaultValue={tarrif?.selectedRental}
              value={tarrif?.selectedRental}
              onChange={RentalChange}
            >
              {tarrif?.rental?.map((item) => {
                return (
                  <Option key={item.value} value={item.value}>
                    {item.text}
                  </Option>
                );
              })}
            </Select>
          </td>

          <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
            {enableinput?.includes("segment") ? (
              <Select
                style={{ width: "140px" }}
                disabled={!enableinput?.includes("segment")}
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
            ) : null}
          </td>
          <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
            {enableinput?.includes("area") ? (
              <Select
                style={{ width: "140px" }}
                disabled={!enableinput?.includes("area")}
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
            ) : null}
          </td>
          <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
            {enableinput?.includes("slabhrs") ? (
              <Select
                style={{ width: "140px" }}
                disabled={!enableinput?.includes("slabhrs")}
                onChange={(value) => {
                  valueHandle("selectedSlabhrs", value);
                }}
                defaultValue={tarrif?.selectedSlabhrs}
                value={tarrif?.selectedSlabhrs}
              >
                {tarrif?.slabhrs?.map((item) => {
                  return (
                    <Option key={item.value} value={item.value}>
                      {item.text}
                    </Option>
                  );
                })}
              </Select>
            ) : null}
          </td>
          <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
            {enableinput?.includes("slabkms") ? (
              <Select
                style={{ width: "140px" }}
                defaultValue={tarrif.selectedSlabkms}
                value={tarrif.selectedSlabkms}
                disabled={!enableinput?.includes("slabkms")}
                onChange={(value) => {
                  valueHandle("selectedSlabkms", value);
                }}
              >
                {tarrif?.slabkms?.map((item) => {
                  return (
                    <Option key={item.value} value={item.value}>
                      {item.text}
                    </Option>
                  );
                })}
              </Select>
            ) : null}
          </td>
          <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
            {enableinput?.includes("slabfrom") ? (
              <Select
                style={{ width: "140px" }}
                defaultValue={tarrif.selectedSlabfrom}
                value={tarrif.selectedSlabfrom}
                placeholder="Slab From"
                disabled={!enableinput?.includes("slabfrom")}
                onChange={(value) => {
                  valueHandle("selectedSlabfrom", value);
                }}
              >
                {tarrif?.slabfrom?.map((item) => {
                  return (
                    <Option key={item.value} value={item.value}>
                      {item.text}
                    </Option>
                  );
                })}
              </Select>
            ) : null}
          </td>
          <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
            {enableinput?.includes("slabto") ? (
              <Select
                style={{ width: "140px" }}
                defaultValue={tarrif.selectedSlabto}
                value={tarrif.selectedSlabto}
                disabled={!enableinput?.includes("slabto")}
                onChange={(value) => {
                  valueHandle("selectedSlabto", value);
                }}
              >
                {tarrif?.slabto?.map((item) => {
                  return (
                    <Option key={item.value} value={item.value}>
                      {item.text}
                    </Option>
                  );
                })}
              </Select>
            ) : null}
          </td>
          <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
            {enableinput?.includes("addon") ? (
              <Select
                style={{ width: "140px" }}
                defaultValue={tarrif.selectedAddon}
                value={tarrif.selectedAddon}
                disabled={!enableinput?.includes("addon")}
                onChange={(value) => {
                  valueHandle("selectedAddon", value);
                }}
              >
                {tarrif?.addon?.map((item) => {
                  return (
                    <Option key={item.value} value={item.value}>
                      {item.text}
                    </Option>
                  );
                })}
              </Select>
            ) : null}
          </td>
          <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
            {enableinput?.includes("salesRate") ? (
              <NumericInput
                style={{ width: "140px" }}
                defaultValue={tarrif.salesRate}
                value={tarrif.salesRate}
                disabled={!enableinput?.includes("salesRate")}
                onChange={(value) => {
                  valueHandle("salesRate", value);
                }}
              />
            ) : null}
          </td>
          <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
            {enableinput?.includes("purchaseRate") ? (
              <NumericInput
                style={{ width: "140px" }}
                defaultValue={tarrif.purchaseRate}
                value={tarrif.purchaseRate}
                disabled={!enableinput?.includes("purchaseRate")}
                onChange={(value) => {
                  valueHandle("purchaseRate", value);
                }}
              />
            ) : null}
          </td>
          <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
            {enableinput?.includes("salesExKmsRate") ? (
              <NumericInput
                style={{ width: "140px" }}
                defaultValue={tarrif.salesExKmsRate}
                value={tarrif.salesExKmsRate}
                disabled={!enableinput?.includes("salesExKmsRate")}
                onChange={(value) => {
                  valueHandle("salesExKmsRate", value);
                }}
              />
            ) : null}
          </td>
          <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
            {enableinput?.includes("salesExHrsRate") ? (
              <NumericInput
                style={{ width: "140px" }}
                defaultValue={tarrif.salesExHrsRate}
                value={tarrif.salesExHrsRate}
                disabled={!enableinput?.includes("salesExHrsRate")}
                onChange={(value) => {
                  valueHandle("salesExHrsRate", value);
                }}
              />
            ) : null}
          </td>
          <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
            {enableinput?.includes("purchaseExHrsRate") ? (
              <NumericInput
                style={{ width: "140px" }}
                defaultValue={tarrif.purchaseExHrsRate}
                value={tarrif.purchaseExHrsRate}
                disabled={!enableinput?.includes("purchaseExHrsRate")}
                onChange={(value) => {
                  valueHandle("purchaseExHrsRate", value);
                }}
              />
            ) : null}
          </td>
          <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
            {enableinput?.includes("purchaseExKmsRate") ? (
              <NumericInput
                style={{ width: "140px" }}
                defaultValue={tarrif.purchaseExKmsRate}
                value={tarrif.purchaseExKmsRate}
                disabled={!enableinput?.includes("purchaseExKmsRate")}
                onChange={(value) => {
                  valueHandle("purchaseExKmsRate", value);
                }}
              />
            ) : null}
          </td>
          <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
            {enableinput?.includes("salesGraceTime") ? (
              <NumericInput
                style={{ width: "140px" }}
                defaultValue={tarrif.salesGraceTime}
                value={tarrif.salesGraceTime}
                disabled={!enableinput?.includes("salesGraceTime")}
                onChange={(value) => {
                  valueHandle("salesGraceTime", value);
                }}
              />
            ) : null}
          </td>
          <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
            {enableinput?.includes("purchaseGraceTime") ? (
              <NumericInput
                style={{ width: "140px" }}
                defaultValue={tarrif.purchaseGraceTime}
                value={tarrif.purchaseGraceTime}
                disabled={!enableinput?.includes("purchaseGraceTime")}
                onChange={(value) => {
                  valueHandle("purchaseGraceTime", value);
                }}
              />
            ) : null}
          </td>
          <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
            {enableinput?.includes("driverbata") ? (
              <NumericInput
                style={{ width: "140px" }}
                defaultValue={tarrif.driverbata}
                value={tarrif.driverbata}
                disabled={!enableinput?.includes("driverbata")}
                onChange={(value) => {
                  valueHandle("driverbata", value);
                }}
              />
            ) : null}
          </td>
          <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
            <Space>
              <Button onClick={AddTarrifInput}>Add</Button>
              {index > 0 ? (
                <Button
                  className="bg-red-700 hover:bg-red-400  border-red-700 hover:border-red-500 text-white"
                  onClick={RemoveTarrifInput}
                >
                  Remove
                </Button>
              ) : null}
            </Space>
          </td>
        </tr>
      )}
    </>
  );
};

export default TarrifFormTable;
