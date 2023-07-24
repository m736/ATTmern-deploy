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
    selectedRental: String,
    selectedSegment: String,
    selectedArea: String,
    selectedSlabhrs: String,
    selectedSlabkms: String,
    selectedSlabfrom: String,
    selectedSlabto: String,
    selectedAddon: String,
  },
  { timestamps: true }
);

module.exports = {
  Vehicle: mongoose.model("vehicles", vehicleSchema),
  AddVehicle: mongoose.model("addvehicles", addVehicleSchema),
  Createtarrif: mongoose.model("createtarrif", CreatetarrifShema),
};
