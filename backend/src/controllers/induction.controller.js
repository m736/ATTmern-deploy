const express = require("express");
const path = require("path");
const multer = require("multer");
const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../middleware/error-handler");
const APIFeatures = require("../utils/apiFeatures");
const {
  OwnerList,
  AgencyList,
  VehicleAndDriverList,
  DriverList,
  VehicleList,
} = require("../utils/inductionModel");
const { ClientMasterModel } = require("../utils/models");
const router = express.Router();
// const storage = multer.diskStorage({
//   // destination: function (req, file, cb) {
//   //   cb(null, "E:/nodejs-mongo-express-crud-main/backend/src/uploads");
//   // },
//   destination: function (req, file, cb) {
//     const dir = path.join(__dirname, "../..", `uploads/${file.fieldname}`);
//     if (file.fieldname === "vehicle_puc") {
//       cb(null, dir);
//     }
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "../..", `uploads/${file.fieldname}`));
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});

router.get(
  "/get_vehicle_list_api",
  catchAsyncError(async (req, res, next) => {
    const getVehicleList = await VehicleList.find();
    // console.log(createClientMaster);
    res.status(201).json({
      success: true,
      getVehicleList,
    });
  })
);
router.get(
  "/get_individual_vehicle_list_api/:id",
  catchAsyncError(async (req, res, next) => {
    const getIndividualVehicleList = await VehicleList.findById(req.params.id);
    // console.log(getIndividualClientMaster);
    if (!getIndividualVehicleList) {
      return next(
        new ErrorHandler(
          `VehicleList not found with this id: ${req.params.id}`,
          404
        )
      );
    }
    res.status(201).json({
      success: true,
      getIndividualVehicleList,
    });
  })
);

router.post(
  "/create_vehicle_list_api",
  upload.single("vehicle_puc"),
  catchAsyncError(async (req, res, next) => {
    const {
      vehicle_regnumber,
      vehicle_type,
      vehicle_model,
      vehicle_client_ids,
      vehicle_regdate_exp,
      vehicle_taxdate_exp,
      vehicle_fitnessdate_exp,
      vehicle_insurancedate_exp,
      owner_id,
      vehicle_driver_id,
      owner_type,
    } = req.body;
    console.log(req.body);
    let vehicle_clientnames = [];
    let findClientDetails;
    let findOwnerDetails;
    let owners_list = [];
    let findDriverDetails;
    let drivers_list = [];

    const results = await ClientMasterModel.find({ _id: vehicle_client_ids });
    console.log(results);
    results.forEach((element) => {
      vehicle_clientnames.push(element?.Company_Name);
    });

    console.log(vehicle_clientnames);

    if (req.body.owner_id) {
      if (req.body.owner_type == "attached") {
        findOwnerDetails = await OwnerList.findById(req.body.owner_id);
      } else {
        findOwnerDetails = await AgencyList.findById(req.body.owner_id);
      }
      if (findOwnerDetails) {
        owners_list.push({
          ...findOwnerDetails._doc,
          owner_type: req.body.owner_type,
        });
      } else {
        owners_list.push({
          owner_name: req.body.owner_id,
          owner_type: req.body.owner_type,
        });
      }
    }

    if (req.body.vehicle_driver_id) {
      findDriverDetails = await DriverList.findById(req.body.vehicle_driver_id);
      drivers_list.push({ ...findDriverDetails._doc });
    }

    let BASE_URL = `${req.protocol}://${req.get("host")}`;
    let vehicle_puc;
    if (req.file) {
      vehicle_puc = `${BASE_URL}/uploads/${req.file.fieldname}/${req.file.originalname}`;
    }

    const createVehicleList = await VehicleList.create({
      vehicle_regnumber,
      vehicle_type,
      vehicle_model,
      vehicle_regdate_exp,
      vehicle_taxdate_exp,
      vehicle_fitnessdate_exp,
      vehicle_insurancedate_exp,
      vehicle_puc,
      vehicle_clientnames,
      vehicle_client_ids,
      owner_type,
      driver_name: drivers_list[0]?.driver_name,
      owner_name: owners_list[0]?.owner_name,
      owners: owners_list,
      drivers: drivers_list,
      owner_id,
      vehicle_driver_id,
    });
    const addvehicleDetailInClient = await VehicleList.find({});
    res.status(201).json({
      success: true,
      createVehicleList,
    });
  })
);
router.put(
  "/edit_vehicle__driver_list_api/:id",
  upload.single("vehicle_puc"),
  catchAsyncError(async (req, res, next) => {
    console.log(req.file);
    let newVehicleData = {
      vehicle_regnumber: req.body.vehicle_regnumber,
      vehicle_type: req.body.vehicle_type,
      vehicle_model: req.body.vehicle_model,
      vehicle_clientnames: req.body.vehicle_clientnames,
      vehicle_client_ids: req.body.vehicle_client_ids,
      vehicle_regdate_exp: req.body.vehicle_regdate_exp,
      vehicle_taxdate_exp: req.body.vehicle_taxdate_exp,
      vehicle_fitnessdate_exp: req.body.vehicle_fitnessdate_exp,
      vehicle_insurancedate_exp: req.body.vehicle_insurancedate_exp,
      owner_type: req.body.owner_type,
      driver_name: req.body.driver_name,
      owner_name: req.body.owner_name,
      owners: req.body.owners,
      owner_id: req.body.owner_id,
      vehicle_driver_id: req.body.vehicle_driver_id,
      effective_date: req?.body?.effective_date,
      remark: req?.body?.remark,
      vehicleownernameChanged: req.body.vehicleownernameChanged,
    };

    let findOwnerDetails;

    let BASE_URL = `${req.protocol}://${req.get("host")}`;
    if (newVehicleData?.vehicleownernameChanged == "true") {
      console.log("changed");
      if (newVehicleData?.owner_type == "attached") {
        findOwnerDetails = await OwnerList.findById(newVehicleData?.owner_id);
      } else {
        findOwnerDetails = await AgencyList.findById(newVehicleData?.owner_id);
      }
      if (findOwnerDetails) {
        newVehicleData.owners.push({
          ...findOwnerDetails._doc,
          owner_type: req.body.owner_type,
          remark: req.body.remark,
          effective_date: req.body.effective_date,
        });
      } else {
        newVehicleData.owners.push({
          owner_name: req.body.owner_id,
          owner_type: req.body.owner_type,
        });
      }
    } else {
      console.log("not changed");
      if (newVehicleData?.owner_type == "attached") {
        findOwnerDetails = await OwnerList.findById(newVehicleData?.owner_id);
      } else {
        findOwnerDetails = await AgencyList.findById(newVehicleData?.owner_id);
      }

      if (findOwnerDetails) {
        const newArr = newVehicleData.owners.map((element) => {
          myObjectId = findOwnerDetails._id;
          myObjectIdString = myObjectId.toString();
          if (element._id === myObjectIdString) {
            return {
              ...findOwnerDetails._doc,
              owner_type: req.body.owner_type,
            };
          }
          return element;
        });
        console.log(newArr);
        newVehicleData.owners = newArr;
      }
    }

    let vehicle_puc;

    if (req.file) {
      vehicle_puc = `${BASE_URL}/uploads/${req.file.fieldname}/${req.file.originalname}`;
      newVehicleData = { ...newVehicleData, vehicle_puc };
    }
    const updateVehicleData = await VehicleList.findByIdAndUpdate(
      req.params.id,
      newVehicleData,
      { upsert: true, new: true }
    );

    res.status(201).json({
      success: true,
      updateVehicleData,
    });
  })
);

module.exports = router;
