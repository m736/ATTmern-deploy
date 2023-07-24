import * as React from "react";
import TarrifForm from "./TarrifForm";
import { Button, Card, Space } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { createTarrif } from "../action/tarrifAction";
const tarrifInputField = {
  rental: [
    { value: "slab", text: "Slab" },
    { value: "outstation", text: "Out Station" },
    { value: "flat_rate", text: "Flat Rate" },
  ],
  selectedRental: "slab",
  segment: [
    { value: "ac", text: "Ac" },
    { value: "nonac", text: "Non/Ac" },
  ],
  selectedSegment: "",
  area: [
    { value: "red", text: "Red" },
    { value: "yellow", text: "Yellow" },
    { value: "blue", text: "Blue" },
  ],
  selectedArea: "",
  slabhrs: [
    { value: "4hrs", text: "4 Hours" },
    { value: "5hrs", text: "4 Hours" },
    { value: "6hrs", text: "4 Hours" },
  ],
  selectedSlabhrs: "",
  slabkms: [
    { value: "10kms", text: "10Kms" },
    { value: "20kms", text: "20Kms" },
    { value: "30kms", text: "30Kms" },
  ],
  selectedSlabkms: "",
  slabfrom: [
    { value: 1, text: 1 },
    { value: 2, text: 2 },
    { value: 3, text: 4 },
  ],
  selectedSlabfrom: "",
  slabto: [
    { value: 50, text: 50 },
    { value: 60, text: 60 },
    { value: 70, text: 70 },
  ],
  selectedSlabto: "",
  addon: [
    { value: "single", text: "Single" },
    { value: "escort", text: "Escort" },
  ],
  selectedAddon: "",
  salesRate: null,
  selectedSalesRate: "",
  purchaseRate: null,
  selectedPurchaseRate: "",
  salesExKmsRate: null,
  selectedSalesExKmsRate: "",
  salesExHrsRate: null,
  selectedSalesExHrsRate: "",
  purchaseExHrsRate: null,
  selectedPurchaseExHrsRate: "",
  purchaseExKmsRate: null,
  selectedPurchaseExKmsRate: "",
  purchaseGraceTime: null,
  selectedPurchaseGraceTime: "",
  driverbata: null,
  selectedDriverbata: "",
  position: 1,
};

export const CreateNewTarrif = () => {
  const [tarrifInput, setTarrifInput] = React.useState([tarrifInputField]);
  const AddTarrifInput = () => {
    let newItem = {
      ...tarrifInputField,
      position: tarrifInput[tarrifInput.length - 1]?.position + 1,
    };
    setTarrifInput([...tarrifInput, newItem]);
  };
  const dispatch = useDispatch();
  const formDetails = () => {
    dispatch(createTarrif(tarrifInput));
    setTarrifInput(tarrifInput);
  };
  return (
    <>
      <Card scroll={{ x: 2000 }}>
        {tarrifInput?.map((item, index) => {
          return (
            <TarrifForm
              name={index}
              tarrifInput={tarrifInput}
              tarrif={item}
              setTarrifInput={setTarrifInput}
              index={index}
              tarrifInputField={tarrifInputField}
            />
          );
        })}
        <Space>
          <Button className="mt-3" onClick={AddTarrifInput}>
            Add
          </Button>
          <Button type="primary" className="mt-3" onClick={formDetails}>
            Submit
          </Button>
        </Space>
      </Card>
    </>
  );
};
