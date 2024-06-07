const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// =====Vehicle Model=====
const vehicleListSchema = new Schema(
  {
    vehicle_no: String,
    vehicle_type: String,
  },
  { strict: false, timestamps: true }
);
const driverListSchema = new Schema(
  {
    driver_name: String,
  },
  { strict: false, timestamps: true }
);

const ownerListSchema = new Schema(
  {
    owner_name: String,
    address: String,
    email_id: String,
    phone_no: String,
    pancard_no: String,
    bank_ccount_no: String,
    bank_name: String,
    IFSC_code: String,
    bank_branch: String,
  },
  { strict: false, timestamps: true }
);
const agencyListSchema = new Schema(
  {
    owner_name: String,
    address: String,
    email_id: String,
    phone_no: String,
    pancard_no: String,
    bank_ccount_no: String,
    bank_name: String,
    IFSC_code: String,
    bank_branch: String,
    tds: String,
    gst: String,
  },
  { strict: false, timestamps: true }
);

module.exports = {
  VehicleList: mongoose.model("vehicle_list_table", vehicleListSchema),
  DriverList: mongoose.model("driver_list_table", driverListSchema),
  OwnerList: mongoose.model("owner_list_table", ownerListSchema),
  AgencyList: mongoose.model("agency_list_table", agencyListSchema),
};
