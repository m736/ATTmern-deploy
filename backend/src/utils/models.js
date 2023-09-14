const mongoose = require("mongoose");
const Schema = mongoose.Schema;
function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

// =====Vehicle Model=====
const vehicleSchema = new Schema(
  {
    jokeId: String,
    vechicle_no: String,
    company: String,
    date: String,
    slipno: String,
    trip: Number,
    time: String,
    p_d: String,
    distance: String,
    s_location: String,
    e_location: String,
  },
  { strict: false, timestamps: true }
);
const addVehicleSchema = new mongoose.Schema(
  {
    vehicle_regnumber: String,
    vehicle_type: String,
    vehicle_model: String,
    vehicle_clientname: String,
    vehicle_regdate_exp: String,
    vehicle_taxdate_exp: String,
    vehicle_fitnessdate_exp: String,
    vehicle_insurancedate_exp: String,
    vehicle_puc: String,
    driver_name: String,
    driver_dob: String,
    driver_address: String,
    driver_licence_no: String,
    driver_badge_no: String,
    driver_badgefile_upload: String,
    driver_licence_exp: String,
    driver_badge_exp: String,
    driver_contact_no: String,
    driver_aadhar_no: String,
    driver_pcc_file_upload: String,
    driver_pcc_exp: String,
    driver_pcc_application_no: String,
    driver_medical_insuranceno: String,
    driver_bgv_file_upload: String,
    driver_photo: String,
    driver_insurance_no: String,
  },
  { timestamps: true }
);
const CreatetarrifShema = new mongoose.Schema(
  {
    "S.No": String,
    rental: Array,
    company: String,
    vehicleType: String,
    companies: Array,
    vehicleTypes: Array,
    selectedRental: String,
    segment: Array,
    selectedSegment: String,
    area: Array,
    selectedArea: String,
    slabhrs: Array,
    selectedSlabhrs: String,
    slabkms: Array,
    selectedSlabkms: String,
    slabfrom: Array,
    selectedSlabfrom: String,
    slabto: Array,
    selectedSlabto: String,
    addon: Array,
    selectedAddon: String,
    salesRate: Number,
    purchaseRate: Number,
    salesExKmsRate: Number,
    salesExHrsRate: Number,
    purchaseExHrsRate: Number,
    purchaseExKmsRate: Number,
    purchaseGraceTime: String,
    salesGraceTime: String,
    driverbata: String,
    position: Number,
  },
  { timestamps: true }
);
const newTripSheetEntryShema = new mongoose.Schema(
  {
    acType: String,
    addon: String,
    address: String,
    advance: Number,
    area: String,
    bookedBy: String,
    companyName: String,
    department: String,
    dutySlipNo: String,
    journeyStart: Array,
    location: String,
    others: Number,
    outstationBata: Number,
    parking: Number,
    passenger: Number,
    permit: Number,
    placeOfVisit: String,
    purchaseEscort: Number,
    purchaseNightBata: Number,
    rental: String,
    salesEscort: Number,
    salesNightBata: Number,
    tripDate: String,
    tripId: String,
    vehicleBilled: String,
    vehicleNum: String,
    vehicleType: String,
    totalHrs: Number,
  },
  { timestamps: true }
);
const onCallMisSchema = new Schema(
  {
    Dutyslip_No: String,
    Usage_Date: {
      type: String,
      required: true,
      set: (date) => formatDate(date),
    },
    Vehicle_No: String,
    Vehicle_Type: String,
    Vehicle_Billed_As: String,
    Segment: String,
    Used_By: String,
    Place: String,
    Rental: String,
    Total_Kms: Number,
    Total_Days: Number,
    Total_Hrs: String,
    Toll: Number,
    Parking: Number,
    Permit: Number,
    Driver_Batta: Number,
    Day_Bata: Number,
    Night_Sales_Bata: Number,
    Night_Purchase_Bata: Number,
    Others: Number,
    Fuel_Difference: Number,
    Company_Name: String,
    salesRate: Number,
    selectedSlabhrs: String,
    selectedSlabkms: String,
    salesExHrsRate: Number,
    salesGraceTime: String,
    gross: Number,
    Area: String,
  },
  { strict: false, timestamps: true }
);
const slabBaseMisSchema = new Schema(
  {
    date: {
      type: String,
      required: true,
      set: (date) => formatDate(date),
    },
    "Trip ID": String,
    "Vehicle No": String,
    "Vehicle TYPE": String,
    "Vehicle Billed as": String,
    Segment: String,
    "Tot Kms": Number,
    "Trip Type": String,
    "Duty Type": String,
    Slab1: Number,
    Slab2: Number,
    Slab3: Number,
    Slab4: Number,
    Slab5: Number,
    "Slab1 - E": Number,
    "Slab2 - E": Number,
    "Slab3 - E": Number,
    "Slab4 - E": Number,
    "Slab5 - E": Number,
    "Slab1 - Single": Number,
    "Slab2 - Single": Number,
    "Slab3 - Single": Number,
    "Slab4 - Single": Number,
    "Slab5 - Single": Number,
    "Slab1 - Single": Number,
    Bata: Number,
    "Fuel Difference": Number,
    Company: String,
    Area: String,
    Sale_Bhata: Number,
    Purchase_Bhata: Number,
    SalesTotal: Number,
  },
  { strict: false, timestamps: true }
);
const tripBaseMisSchema = new Schema(
  {
    Usage_Date: {
      type: String,
      required: true,
      set: (date) => formatDate(date),
    },
    Trip_Id: String,
    Vehicle_No: String,
    Vehicle_Type: String,
    Vehicle_Billed_As: String,
    Segment: String,
    Total_Kms: Number,
    Trip_Type: String,
    Duty_Type: String,
    Trip: Number,
    Trip_Single: Number,
    Trip_Back_to_Back: Number,
    Trip_Escort: Number,
    Trip_Single_Long: Number,
    Toll: Number,
    Fuel_Difference: Number,
    Company: String,
    Area: String,
    Sales_Bata: Number,
    Purchase_Bata: Number,
    salesTotal: Number,
    purchaseTotal: Number,
  },
  { strict: false, timestamps: true }
);
const dayBaseMisSchema = new Schema(
  {
    Usage_Date: {
      type: String,
      required: true,
      set: (date) => formatDate(date),
    },
    Trip_Id: String,
    Vehicle_No: String,
    Vehicle_Type: String,
    Vehicle_Billed_As: String,
    Segment: String,
    Rental: String,
    Total_Days: Number,
    No_Of_Months: Number,
    Total_Kms: Number,
    Total_Hrs: Number,
    Toll: Number,
    Parking: Number,
    Permit: Number,
    Driver_Batta: Number,
    Day_Bata: Number,
    Night_Sales_Bata: Number,
    Night_Purchase_Bata: Number,
    Fuel_Difference: Number,
    Company: String,
    Area: String,
    salesTotal: Number,
    purchaseTotal: Number,
  },
  { strict: false, timestamps: true }
);
const locationSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  Client_Location: String,
  Client_GST: String,
  Economic_Zone: [Object],
  selectedEconomicZone: String,
  SGST: [Object],
  selectedSGST: String,
  CGST: [Object],
  selectedCGST: String,
  IGST: [Object],
  selectedIGST: String,
  Position: Number,
});
const clientMasterSchema = new Schema(
  {
    Company_Name: String,
    Location: [locationSchema],
    Address: String,
    City: String,
    Pincode: Number,
    Group: Array,
    selectedGroup: String,
    Mailto: String,
    Telephone: String,
    Phone_No: String,
    Agreement_validity: "",
    service_Tax: Array,
    selectedserviceTax: String,
    Cess: Array,
    selectedCess: String,
    Entity: Array,
    selectedEntity: String,
  },
  { strict: false, timestamps: true }
);
const areaListSchema = new Schema(
  {
    Area: String,
  },
  { strict: false, timestamps: true }
);
const vehicleTypeSchema = new Schema(
  {
    VehicleType: String,
  },
  { strict: false, timestamps: true }
);
module.exports = {
  Location: mongoose.model("location_table", locationSchema),
  Vehicle: mongoose.model("vehicles", vehicleSchema),
  AddVehicle: mongoose.model("addvehicles", addVehicleSchema),
  Createtarrif: mongoose.model("createtarrif", CreatetarrifShema),
  ClientMasterModel: mongoose.model("client_master_table", clientMasterSchema),
  OnCallMisUploadData: mongoose.model("on_call_mis_table", onCallMisSchema),
  SlabBaseMisUploadData: mongoose.model(
    "slab_base_mis_table",
    slabBaseMisSchema
  ),
  TripBaseMisUploadData: mongoose.model(
    "trip_base_mis_table",
    tripBaseMisSchema
  ),
  DayBaseMisUploadData: mongoose.model("day_base_mis_table", dayBaseMisSchema),
  NewTripSheetEntry: mongoose.model(
    "new_tripsheet_entry",
    newTripSheetEntryShema
  ),
  AreaListModel: mongoose.model("area_table", areaListSchema),
  VehicleTypeModel: mongoose.model("vehicle_type_table", vehicleTypeSchema),
};
