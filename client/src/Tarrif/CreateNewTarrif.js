import React, { useEffect, useState } from "react";
import TarrifForm from "./TarrifForm";
import { Button, Card, Space, Spin, Row, Col, Select, Form } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { createTarrif } from "../action/tarrifAction";
import { useNavigate } from "react-router-dom";
import { clearCreateTarrif, clearTarrifError } from "../slices/TarrifSlice";
import { toast } from "react-toastify";
import TarrifFormTable from "./TarrifFormTable";
export const tarrifInputField = {
  rental: [
    { value: "slab", text: "Slab" },
    { value: "outstation", text: "Out Station" },
    { value: "flat_rate", text: "Flat Rate" },
  ],
  companies: [
    { value: "c1", text: "c1" },
    { value: "c2", text: "c2" },
    { value: "c3", text: "c3" },
  ],
  vehicleTypes: [
    { value: "v1", text: "v1" },
    { value: "v2", text: "v2" },
    { value: "v3", text: "v3" },
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
  const [tarrifInput, setTarrifInput] = useState([tarrifInputField]);
  return (
    <>
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Role
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Role
                    </th>

                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200"></tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
