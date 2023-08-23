export const clientLocation = {
  Client_Location: "",
  Client_GST: "",
  Economic_Zone: [
    { text: "SEZ", value: "SEZ" },
    { text: "Non SEZ", value: "Non SEZ" },
  ],
  selectedEconomicZone: "SEZ",
  SGST: [
    { text: 2.5, value: 2.5 },
    { text: 3.5, value: 3.5 },
    { text: 8.0, value: 8.0 },
  ],
  selectedSGST: "",
  CGST: [
    { text: 2.5, value: 2.5 },
    { text: 3.5, value: 3.5 },
    { text: 8.0, value: 8.0 },
  ],
  selectedCGST: "",
  IGST: [
    { text: 0, value: 0 },
    { text: 5.0, value: 5.0 },
    { text: 3.0, value: 3.0 },
  ],
  selectedIGST: "",
  Position: 1,
};
export const clientInputField = {
  Company_Name: "",
  Location: [clientLocation],

  Address: "",

  City: "",
  Pincode: "",
  Group: [
    { text: "Sundry Deptors", value: "Sundry Deptors" },
    { text: "Duties And Taxes", value: "Duties And Taxes" },
    { text: "Sundry Creditors", value: "Sundry Creditors" },
  ],
  selectedGroup: "",
  Mailto: "",
  Telephone: "",
  Phone_No: "",
  Agreement_validity: "",
  service_Tax: [
    { text: 0, value: 0 },
    { text: 15, value: 15 },
    { text: 5.6, value: 5.6 },
  ],
  selectedserviceTax: "",
  Cess: [
    { text: 0, value: 0 },
    { text: 0.4, value: 0.4 },
  ],
  selectedCess: "",
  Entity: [
    {
      text: "Ambassador Tours And Travels",
      value: "Ambassador Tours And Travels",
    },
    {
      text: "ATT Logistics Private Limited",
      value: "ATT Logistics Private Limited",
    },
  ],
  selectedEntity: "",
};
