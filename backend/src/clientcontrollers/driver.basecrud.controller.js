//Create Product - /api/v1/product/new
const express = require("express");
const multer = require("multer");
const catchAsyncError = require("../middleware/catchAsyncError");
const path = require("path");
const { DriverList } = require("../utils/inductionModel");
const router = express.Router();
const storage = multer.diskStorage({
  // destination: function (req, file, cb) {
  //   cb(null, "E:/nodejs-mongo-express-crud-main/backend/src/uploads");
  // },
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, "../..", `uploads/${file.fieldname}`);
    if (file.fieldname === "driver_badgefile_upload") {
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
  "/driver_list_api",
  upload.any(),
  catchAsyncError(async (req, res, next) => {
    let uploadfiles = req.files;
    let driverphoto;
    let driver_pcc_file_upload;
    let driver_badgefile_upload;
    let driver_bgv_file_upload;
    let BASE_URL = `${req.protocol}://${req.get("host")}`;

    const {
      driver_medical_insuranceno,
      driver_licence_exp,
      driver_licence_no,
      driver_name,
      driver_pcc_application_no,
      driver_pcc_exp,
      driver_aadhar_no,
      driver_badge_exp,
      driver_badge_no,
      driver_contact_no,
      driver_address,
      driver_dob,
      driver_insurance_no,
    } = req.body;
    if (uploadfiles) {
      uploadfiles.map((item) => {
        if (item.fieldname === "driver_badgefile_upload") {
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

    req.body.driver_bgv_file_upload = driver_bgv_file_upload;
    const createDriverList = await DriverList.create({
      driver_medical_insuranceno,
      driver_licence_exp,
      driver_licence_no,
      driver_name,
      driver_pcc_application_no,
      driver_pcc_exp,
      driver_aadhar_no,
      driver_badge_exp,
      driver_badge_no,
      driver_contact_no,
      driver_address,
      driver_dob,
      driver_insurance_no,
      driverphoto,
      driver_pcc_file_upload,
      driver_badgefile_upload,
      driver_bgv_file_upload,
    });
    res.status(201).json({
      success: true,
      createDriverList,
    });
  })
);
router.put(
  "/edit_driver_list_api/:id",
  upload.any(),
  catchAsyncError(async (req, res, next) => {
    let uploadfiles = req.files;
    console.log(req.file);
    // let driverphoto;
    // let driver_pcc_file_upload;
    // let driver_badgefile_upload;
    // let driver_bgv_file_upload;
    // let BASE_URL = `${req.protocol}://${req.get("host")}`;

    // if (uploadfiles) {
    //   uploadfiles.map((item) => {
    //     if (item.fieldname === "driver_badgefile_upload") {
    //       driver_badgefile_upload = `${BASE_URL}/uploads/${item.fieldname}/${item.originalname}`;
    //     } else if (item.fieldname === "driver_photo") {
    //       driverphoto = `${BASE_URL}/uploads/${item.fieldname}/${item.originalname}`;
    //     } else if (item.fieldname === "driver_bgv_file_upload") {
    //       driver_bgv_file_upload = `${BASE_URL}/uploads/${item.fieldname}/${item.originalname}`;
    //     } else if (item.fieldname === "driver_pcc_file_upload") {
    //       driver_pcc_file_upload = `${BASE_URL}/uploads/${item.fieldname}/${item.originalname}`;
    //     }
    //   });
    //   // driver_photo = `E:/nodejs-mongo-express-crud-main/backend/uploads//${req.file.originalname}`
    // }
    // // req.body.driver_photo = driverphoto;
    // // req.body.driver_pcc_file_upload = driver_pcc_file_upload;
    // // req.body.driver_badgefile_upload = driver_badgefile_upload;
    // // req.body.driver_bgv_file_upload = driver_bgv_file_upload;
    // let options = { upsert: true, new: true };
    // console.log(req.body);
    // const updateDriverList = await DriverList.findByIdAndUpdate(
    //   req.params.id,
    //   req.body,
    //   options
    // );

    // res.status(200).json({
    //   success: true,
    //   updateDriverList,
    // });
  })
);
router.get(
  "/driver_list_api",
  upload.any(),
  catchAsyncError(async (req, res, next) => {
    const getDriverList = await DriverList.find();
    res.status(201).json({
      success: true,
      getDriverList,
    });
  })
);
router.delete(
  "/delete_driver_list_api/:id",
  catchAsyncError(async (req, res, next) => {
    const deleteDriverList = await DriverList.findById(req.params.id);
    if (!deleteDriverList) {
      return next(
        new ErrorHandler(
          `DriverList not found with this id: ${req.params.id}`,
          404
        )
      );
    }
    await deleteDriverList.remove();
    res.status(201).json({
      success: true,
      deleteDriverList,
    });
  })
);
module.exports = router;
