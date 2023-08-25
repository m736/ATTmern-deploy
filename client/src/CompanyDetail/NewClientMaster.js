import React, { useEffect, useState } from "react";
import { clientInputField, clientLocation } from "./ClientMasterInputField";
import { Button, DatePicker, Input, Radio, Select, Space } from "antd";
import { NumericInput } from "../Tarrif/NumericInput";
import { useDispatch, useSelector } from "react-redux";
import { createClientMasterAction } from "../action/clientMasterAction";
import { toast } from "react-toastify";
import moment from "moment";
import {
  clearClientMasterCreated,
  clearClientMasterError,
} from "../slices/ClientMasterSlice";
import { useNavigate } from "react-router-dom";
const NewClientMaster = () => {
  const [allClientMasterList, setAllClientMasterList] =
    useState(clientInputField);
  const { Option } = Select;
  const { TextArea } = Input;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    client_master_detail,
    clientMasterLoading,
    isClientMasterCreated,
    error,
  } = useSelector((state) => state.ClientMasterState || []);
  // On change function for all Input
  const handleChange = (field, value) => {
    if (Object.keys(allClientMasterList.Location).includes(field)) {
      setAllClientMasterList({
        ...allClientMasterList,
        Location: {
          ...allClientMasterList.Location,
          [field]: value,
        },
      });
    } else {
      setAllClientMasterList({
        ...allClientMasterList,
        [field]: value,
      });
    }
  };
  // On change function for Client Location
  const handleLocation = (field, value, index) => {
    let updatedList = allClientMasterList.Location.map((location, ind) => {
      if (ind == index && Object.keys(location).includes(field)) {
        return {
          ...location,
          [field]: value,
        };
      } else {
        return location;
      }
    });

    setAllClientMasterList({
      ...allClientMasterList,
      Location: updatedList,
    });
  };
  // Submit Function
  const saveClientMasterDetail = () => {
    setAllClientMasterList(allClientMasterList);
    dispatch(createClientMasterAction(allClientMasterList));
  };

  // Add Client Location Button
  const addClientLocation = () => {
    let locationList = [...allClientMasterList?.Location];

    locationList.push({
      ...clientLocation,
      Position: locationList[locationList.length - 1].Position + 1,
    });
    setAllClientMasterList({ ...allClientMasterList, Location: locationList });
  };
  // Remove Client Location Button
  const removeClientLocation = (Position) => {
    let locationList = [...allClientMasterList?.Location];
    let updated = locationList.filter((i, index) => i?.Position !== Position);
    setAllClientMasterList({ ...locationList, Location: updated });
  };

  useEffect(() => {
    if (isClientMasterCreated) {
      toast("New Client master Created Succesfully!", {
        type: "success",
        position: toast.POSITION.BOTTOM_CENTER,
        onOpen: () => dispatch(clearClientMasterCreated()),
      });
      navigate("/client_master/list_client_master");
      return;
    }

    if (error) {
      toast(error, {
        position: toast.POSITION.BOTTOM_CENTER,
        type: "error",
        onOpen: () => {
          dispatch(clearClientMasterError());
        },
      });
      return;
    }
  }, [isClientMasterCreated, error, dispatch]);
  // console.log(allClientMasterList);
  return (
    <div className="w-full max-w-4xl">
      {/* Company_Name */}
      <div className="md:flex md:items-center mb-6">
        <div className="md:w-1/3">
          <label
            className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
            htmlFor="company"
          >
            Company Name
          </label>
        </div>
        <div className="md:w-4/12">
          <Input
            id="company"
            value={allClientMasterList.Company_Name}
            onChange={(e) => {
              handleChange("Company_Name", e.target.value);
            }}
          />
        </div>
      </div>
      {/* Client_Location */}

      {allClientMasterList?.Location?.map((Location, index) => {
        return (
          <div key={Location?.Position}>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  htmlFor="location"
                >
                  Client Location
                </label>
              </div>
              <div className="md:w-8/12">
                <div className="md:flex md:items-center">
                  <div className="md:w-6/12 mr-4">
                    {" "}
                    <Input
                      id="location"
                      value={Location?.Client_Location}
                      onChange={(e) => {
                        handleLocation(
                          "Client_Location",
                          e.target.value,
                          index
                        );
                      }}
                    />
                  </div>
                  <div className="md:w-6/12 mr-4">
                    {" "}
                    <Radio.Group
                      value={Location?.selectedEconomicZone}
                      onChange={(e) => {
                        handleLocation(
                          "selectedEconomicZone",
                          e.target.value,
                          index
                        );
                      }}
                    >
                      {Location?.Economic_Zone?.map((item) => {
                        return (
                          <Radio key={item.value} value={item.value}>
                            {item.text}
                          </Radio>
                        );
                      })}
                    </Radio.Group>
                  </div>
                  <div className="md:w-2/12">
                    <Space>
                      <button
                        className="shadow bg-green-500 hover:bg-green-400 focus:shadow-outline focus:outline-none text-white font-bold py-1 px-2 rounded"
                        type="button"
                        onClick={addClientLocation}
                      >
                        Add
                      </button>
                      {index > 0 ? (
                        <button
                          className="shadow bg-red-500 hover:bg-red-400 focus:shadow-outline focus:outline-none text-white font-bold py-1 px-2 rounded"
                          type="button"
                          onClick={() => {
                            removeClientLocation(Location?.Position);
                          }}
                        >
                          Remove
                        </button>
                      ) : null}
                    </Space>
                  </div>
                </div>
              </div>
            </div>

            {Location?.selectedEconomicZone === "SEZ" && (
              <>
                <div className="md:flex md:items-center mb-6">
                  <div className="md:w-1/3"></div>
                  <div className="md:w-8/12">
                    <div className="md:flex md:items-center">
                      <div className="md:w-6/12 mr-4">
                        {" "}
                        <NumericInput
                          value={Location?.Client_GST}
                          placeholder="GST"
                          onChange={(e) => {
                            handleLocation("Client_GST", e, index);
                          }}
                        />
                      </div>
                      <div className="md:w-6/12 mr-4">
                        {" "}
                        <Select
                          placeholder="SGST"
                          style={{ width: "100%" }}
                          // value={allClientMasterList?.Location?.selectedSGST}
                          onChange={(e) => {
                            handleLocation("selectedSGST", e);
                          }}
                        >
                          {Location?.SGST?.map((item) => {
                            return (
                              <Option key={item.value} value={item.value}>
                                {item.text}
                              </Option>
                            );
                          })}
                        </Select>
                      </div>
                      <div className="md:w-6/12 mr-4">
                        {" "}
                        <Select
                          placeholder="CGST"
                          style={{ width: "100%" }}
                          // value={allClientMasterList?.Location?.selectedCGST}
                          onChange={(e) => {
                            handleLocation("selectedCGST", e, index);
                          }}
                        >
                          {Location?.CGST?.map((item) => {
                            return (
                              <Option key={item.value} value={item.value}>
                                {item.text}
                              </Option>
                            );
                          })}
                        </Select>
                      </div>
                      <div className="md:w-6/12 mr-4">
                        {" "}
                        <Select
                          placeholder="IGST"
                          style={{ width: "100%" }}
                          // value={allClientMasterList?.Location?.selectedIGST}
                          onChange={(e) => {
                            handleLocation("selectedIGST", e, index);
                          }}
                        >
                          {Location?.IGST?.map((item) => {
                            return (
                              <Option key={item.value} value={item.value}>
                                {item.text}
                              </Option>
                            );
                          })}
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {Location?.selectedEconomicZone === "Non SEZ" && (
              <>
                {" "}
                <div className="md:flex md:items-center mb-6">
                  <div className="md:w-1/3"></div>
                  <div className="md:w-2/3">
                    <div className="md:flex md:items-center">
                      <div className="md:w-6/12 mr-4">
                        {" "}
                        <NumericInput
                          value={Location?.Client_GST}
                          placeholder="GST"
                          onChange={(e) => {
                            handleLocation("Client_GST", e, index);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        );
      })}

      {/* Address */}
      <div className="md:flex md:items-center mb-6">
        <div className="md:w-1/3">
          <label
            className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
            htmlFor="address"
          >
            Address
          </label>
        </div>
        <div className="md:w-4/12">
          <TextArea
            id="address"
            value={allClientMasterList?.Address}
            onChange={(e) => {
              handleChange("Address", e.target.value);
            }}
          />
        </div>
      </div>
      {/* City */}
      <div className="md:flex md:items-center mb-6">
        <div className="md:w-1/3">
          <label
            className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
            htmlFor="city"
          >
            City
          </label>
        </div>
        <div className="md:w-4/12">
          <Input
            id="city"
            value={allClientMasterList.City}
            onChange={(e) => {
              handleChange("City", e.target.value);
            }}
          />
        </div>
      </div>
      {/* PinCode */}
      <div className="md:flex md:items-center mb-6">
        <div className="md:w-1/3">
          <label
            className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
            htmlFor="pincode"
          >
            Pin Code
          </label>
        </div>
        <div className="md:w-4/12">
          <NumericInput
            id="pincode"
            value={allClientMasterList?.Pincode}
            onChange={(e) => {
              handleChange("Pincode", e);
            }}
          />
        </div>
      </div>
      {/* Group */}
      <div className="md:flex md:items-center mb-6">
        <div className="md:w-1/3">
          <label
            className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
            htmlFor="group"
          >
            Group
          </label>
        </div>
        <div className="md:w-4/12">
          <Select
            id="group"
            style={{ width: "100%" }}
            value={allClientMasterList?.selectedGroup}
            onChange={(e) => {
              handleChange("selectedGroup", e);
            }}
          >
            {allClientMasterList?.Group?.map((item) => {
              return (
                <Option key={item.value} value={item.value}>
                  {item.text}
                </Option>
              );
            })}
          </Select>
        </div>
      </div>
      {/*Mail To */}
      <div className="md:flex md:items-center mb-6">
        <div className="md:w-1/3">
          <label
            className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
            htmlFor="mailto"
          >
            Mailto
          </label>
        </div>
        <div className="md:w-4/12">
          <Input
            id="mailto"
            value={allClientMasterList?.Mailto}
            onChange={(e) => {
              handleChange("Mailto", e.target.value);
            }}
          />
        </div>
      </div>
      {/*Telephone*/}
      <div className="md:flex md:items-center mb-6">
        <div className="md:w-1/3">
          <label
            className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
            htmlFor="telephone"
          >
            Telephone
          </label>
        </div>
        <div className="md:w-4/12">
          <Input
            id="telephone"
            value={allClientMasterList?.Telephone}
            onChange={(e) => {
              handleChange("Telephone", e.target.value);
            }}
          />
        </div>
      </div>
      {/*Phone Number*/}
      <div className="md:flex md:items-center mb-6">
        <div className="md:w-1/3">
          <label
            className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
            htmlFor="phoneno"
          >
            Phone Number
          </label>
        </div>
        <div className="md:w-4/12">
          <Input
            id="phoneno"
            value={allClientMasterList?.Phone_No}
            onChange={(e) => {
              handleChange("Phone_No", e.target.value);
            }}
          />
        </div>
      </div>
      {/*Agreement Validity*/}
      <div className="md:flex md:items-center mb-6">
        <div className="md:w-1/3">
          <label
            className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
            htmlFor="agreement_validity"
          >
            Agreement Validity
          </label>
        </div>
        <div className="md:w-4/12">
          <DatePicker
            id="agreement_validity"
            style={{ width: "100%" }}
            onChange={(value, Aggreement_validity_Date) => {
              // const Aggreement_validity_Date = e.format("YYYY-MM-DD");
              handleChange(
                "Agreement_validity",
                moment(Aggreement_validity_Date).format("YYYY-MM-DD")
              );
            }}
          />
        </div>
      </div>
      {/* Service Tax */}
      <div className="md:flex md:items-center mb-6">
        <div className="md:w-1/3">
          <label
            className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
            htmlFor="service_tax"
          >
            Service Tax
          </label>
        </div>
        <div className="md:w-4/12">
          <Select
            id="service_tax"
            style={{ width: "100%" }}
            value={allClientMasterList?.selectedserviceTax}
            onChange={(e) => {
              handleChange("selectedserviceTax", e);
            }}
          >
            {allClientMasterList?.service_Tax?.map((item) => {
              return (
                <Option key={item.value} value={item.value}>
                  {item.text}
                </Option>
              );
            })}
          </Select>
        </div>
      </div>
      {/* Cess */}
      <div className="md:flex md:items-center mb-6">
        <div className="md:w-1/3">
          <label
            className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
            htmlFor="cess"
          >
            Cess
          </label>
        </div>
        <div className="md:w-4/12">
          <Select
            id="cess"
            style={{ width: "100%" }}
            value={allClientMasterList?.selectedCess}
            onChange={(e) => {
              handleChange("selectedCess", e);
            }}
          >
            {allClientMasterList?.Cess?.map((item) => {
              return (
                <Option key={item.value} value={item.value}>
                  {item.text}
                </Option>
              );
            })}
          </Select>
        </div>
      </div>
      {/* Entity */}
      <div className="md:flex md:items-center mb-6">
        <div className="md:w-1/3">
          <label
            className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
            htmlFor="entity"
          >
            Entity
          </label>
        </div>
        <div className="md:w-4/12">
          <Select
            id="entity"
            style={{ width: "100%" }}
            value={allClientMasterList?.selectedEntity}
            onChange={(e) => {
              handleChange("selectedEntity", e);
            }}
          >
            {allClientMasterList?.Entity?.map((item) => {
              return (
                <Option key={item.value} value={item.value}>
                  {item.text}
                </Option>
              );
            })}
          </Select>
        </div>
      </div>
      {/* Save Button */}
      <div className="md:flex md:items-center">
        <div className="md:w-1/3"></div>
        <div className="md:w-2/3">
          <Button
            className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold  rounded"
            type="button"
            loading={clientMasterLoading}
            onClick={saveClientMasterDetail}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewClientMaster;
