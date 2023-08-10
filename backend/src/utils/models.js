const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// =====RefreshToken Model=====
const refreshTokenSchema = new Schema({
  account: { type: Schema.Types.ObjectId, ref: "Account" },
  token: String,
  expires: Date,
  created: { type: Date, default: Date.now },
  createdByIp: String,
  revoked: Date,
  revokedByIp: String,
  replacedByToken: String,
});
refreshTokenSchema.virtual("isExpired").get(function () {
  return Date.now() >= this.expires;
});
refreshTokenSchema.virtual("isActive").get(function () {
  return !this.revoked && !this.isExpired;
});
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
const onCallMisSchema = new Schema(
  {
    Dutyslip_No: String,
    Usage_Date: String,
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
    selectedSalesRate: String,
    purchaseRate: Number,
    selectedPurchaseRate: String,
    salesExKmsRate: Number,
    selectedSalesExKmsRate: String,
    salesExHrsRate: Number,
    selectedSalesExHrsRate: String,
    purchaseExHrsRate: Number,
    selectedPurchaseExHrsRate: String,
    purchaseExKmsRate: Number,
    selectedPurchaseExKmsRate: String,
    purchaseGraceTime: String,
    selectedPurchaseGraceTime: String,
    salesGraceTime: String,
    selectedSalesGraceTime: String,
    driverbata: String,
    selectedDriverbata: String,
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
const onCallMisCalculationSchema = new Schema(
  {
    Dutyslip_No: String,
    Usage_Date: String,
    Vehicle_No: String,
    Vehicle_Type: String,
    Vehicle_Billed_As: String,
    Segment: String,
    Rental: String,
    Total_Kms: Number,
    Total_Hrs: Number,
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
  },
  { strict: false, timestamps: true }
);
module.exports = {
  Vehicle: mongoose.model("vehicles", vehicleSchema),
  AddVehicle: mongoose.model("addvehicles", addVehicleSchema),
  Createtarrif: mongoose.model("createtarrif", CreatetarrifShema),
  OnCallMisUploadData: mongoose.model("on_call_mis_table", onCallMisSchema),

  NewTripSheetEntry: mongoose.model(
    "new_tripsheet_entry",
    newTripSheetEntryShema
  ),
};
