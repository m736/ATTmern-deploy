import * as React from "react";
import { Form, Input, Button, Select, Card, Row, Col } from "antd";
import { TarrifTable } from "./TarrifTable";
import { NumericInput } from "./TarrifNumericInput";
import TarrifForm from "./TarrifForm";

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
  area: [
    { value: "red", text: "Red" },
    { value: "yellow", text: "Yellow" },
    { value: "blue", text: "Blue" },
  ],
  slabhrs: [
    { value: "4hrs", text: "4 Hours" },
    { value: "5hrs", text: "4 Hours" },
    { value: "6hrs", text: "4 Hours" },
  ],
  slabkms: [
    { value: "10kms", text: "10Kms" },
    { value: "20kms", text: "20Kms" },
    { value: "30kms", text: "30Kms" },
  ],
  slabfrom: [
    { value: 1, text: 1 },
    { value: 2, text: 2 },
    { value: 3, text: 4 },
  ],
  slabto: [
    { value: 50, text: 50 },
    { value: 60, text: 60 },
    { value: 70, text: 70 },
  ],
  addon: [
    { value: "single", text: "Single" },
    { value: "escort", text: "Escort" },
  ],
  salesRate: null,
  purchaseRate: null,
  salesExKmsRate: null,
  salesExHrsRate: null,
  purchaseExHrsRate: null,
  purchaseExKmsRate: null,
  purchaseGraceTime: null,
  driverbata: null,
  position: 1,
};
export const CreateNewTarrif = () => {
  const [tarrifInput, setTarrifInput] = React.useState([tarrifInputField]);

  return (
    <>
      <Form name="dynamic_form_item" className="px-4">
        <Form.Item name={["userlistName"]}>
          <Input
            placeholder="user list name"
            style={{ width: "30%", marginRight: 8 }}
          />
        </Form.Item>
        <Form.List name="fields">
          {({ add, remove }) => {
            return (
              <div>
                {tarrifInput.map((item, index) => {
                  return (
                    <TarrifTable
                      tarrifInput={tarrifInput}
                      tarrif={item}
                      setTarrifInput={setTarrifInput}
                      add={add}
                      remove={remove}
                    />
                  );
                })}
              </div>
            );
          }}
        </Form.List>
        <Form.Item className="mt-3">
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
      {/* {tarrifInput.map((item, index) => {
        return (
          <TarrifForm
            tarrifInput={tarrifInput}
            tarrif={item}
            setTarrifInput={setTarrifInput}
          />
        );
      })} */}
    </>
  );
};
