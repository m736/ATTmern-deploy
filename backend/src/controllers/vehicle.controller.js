//Create Product - /api/v1/product/new
const express = require("express");
const { AddVehicle } = require("../utils/models");
const multer = require("multer");
const catchAsyncError = require("../middleware/catchAsyncError");
const path = require("path");
const router = express.Router();

const storage = multer.diskStorage({
  // destination: function (req, file, cb) {
  //   cb(null, "E:/nodejs-mongo-express-crud-main/backend/src/uploads");
  // },
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, "../..", `uploads/${file.fieldname}`);
    if (file.fieldname === "vehicle_puc") {
      cb(null, dir);
    } else if (file.fieldname === "driver_badgefile_upload") {
      cb(null, dir);
    } else if (file.fieldname === "driver_photo") {
      cb(null, dir);
    } else if (file.fieldname === "driver_bgv_file_upload") {
      cb(null, dir);
    } else if (file.fieldname === "driver_pcc_file_upload") {
      cb(null, dir);
    }
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });
// var multipleupload = upload.fields([
//   { name: "vehicle_puc" },
//   { name: "driver_badgefile_upload" },
//   { name: "driver_photo" },
//   { name: "driver_bgv_file_upload" },
//   { name: "driver_pcc_file_upload" },
// ]);
router.post(
  "/addvehicle",
  upload.any(),
  catchAsyncError(async (req, res, next) => {
    let uploadfiles = req.files;
    let driverphoto;
    let driver_pcc_file_upload;
    let driver_badgefile_upload;
    let vehicle_puc;
    let driver_bgv_file_upload;
    let BASE_URL = `${req.protocol}://${req.get("host")}`;

    if (uploadfiles) {
      uploadfiles.map((item) => {
        if (item.fieldname === "vehicle_puc") {
          vehicle_puc = `${BASE_URL}/uploads/${item.fieldname}/${item.originalname}`;
        } else if (item.fieldname === "driver_badgefile_upload") {
          driver_badgefile_upload = `${BASE_URL}/uploads/${item.fieldname}/${item.originalname}`;
        } else if (item.fieldname === "driver_photo") {
          driverphoto = `${BASE_URL}/uploads/${item.fieldname}/${item.originalname}`;
        } else if (item.fieldname === "driver_bgv_file_upload") {
          driver_bgv_file_upload = `${BASE_URL}/uploads/${item.fieldname}/${item.originalname}`;
        } else if (item.fieldname === "driver_pcc_file_upload") {
          driver_pcc_file_upload = `${BASE_URL}/uploads/${item.fieldname}/${item.originalname}`;
        }
      });
    }
    req.body.driver_photo = driverphoto;
    req.body.driver_pcc_file_upload = driver_pcc_file_upload;
    req.body.driver_badgefile_upload = driver_badgefile_upload;
    req.body.vehicle_puc = vehicle_puc;
    req.body.driver_bgv_file_upload = driver_bgv_file_upload;
    const addvehicle = await AddVehicle.create(req.body);
    res.status(201).json({
      success: true,
      addvehicle,
    });
  })
);

router.put(
  "/update_vehicle/:id",
  upload.any(),
  catchAsyncError(async (req, res, next) => {
    let vehicleList = await AddVehicle.findById(req.params.id);
    let updateVehiclebody = req.body;
    let uploadfiles = req.files;
    let driverphoto;
    let driver_pcc_file_upload;
    let driver_badgefile_upload;
    let vehicle_puc;
    let driver_bgv_file_upload;
    let BASE_URL = `${req.protocol}://${req.get("host")}`;

    if (uploadfiles) {
      uploadfiles.map((item) => {
        if (item.fieldname === "vehicle_puc") {
          vehicle_puc = `${BASE_URL}/uploads/${item.fieldname}/${item.originalname}`;
          updateVehiclebody = { ...updateVehiclebody, vehicle_puc };
        } else if (item.fieldname === "driver_badgefile_upload") {
          driver_badgefile_upload = `${BASE_URL}/uploads/${item.fieldname}/${item.originalname}`;
        } else if (item.fieldname === "driver_photo") {
          driverphoto = `${BASE_URL}/uploads/${item.fieldname}/${item.originalname}`;
        } else if (item.fieldname === "driver_bgv_file_upload") {
          driver_bgv_file_upload = `${BASE_URL}/uploads/${item.fieldname}/${item.originalname}`;
        } else if (item.fieldname === "driver_pcc_file_upload") {
          driver_pcc_file_upload = `${BASE_URL}/uploads/${item.fieldname}/${item.originalname}`;
        }
      });
      // driver_photo = `E:/nodejs-mongo-express-crud-main/backend/uploads//${req.file.originalname}`
    }
    req.body.driver_photo = driverphoto;
    req.body.driver_pcc_file_upload = driver_pcc_file_upload;
    req.body.driver_badgefile_upload = driver_badgefile_upload;
    req.body.vehicle_puc = vehicle_puc;
    req.body.driver_bgv_file_upload = driver_bgv_file_upload;
    vehicleList = await AddVehicle.findByIdAndUpdate(
      req.params.id,
      updateVehiclebody,
      {
        new: true,
        runValidators: true,
        upsert: true,
        timestamps: { createdAt: false, updatedAt: true },
      }
    );

    res.status(200).json({
      success: true,
      vehicleList,
    });
  })
);
module.exports = router;
