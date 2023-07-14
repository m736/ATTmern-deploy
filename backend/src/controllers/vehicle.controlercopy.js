//Create Product - /api/v1/product/new
const express = require("express");
const { AddVehicle } = require("../utils/models");
const multer = require("multer");
const catchAsyncError = require("../middleware/catchAsyncError");
const path = require("path");
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "E:/nodejs-mongo-express-crud-main/backend/src/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });
router.post(
  "/addvehicle",
  catchAsyncError(async (req, res, next) => {
    const addvehicle = await AddVehicle.create({
      regnumber,
      model,
      vehicletype,
      clientname,
      RegDate,
      TaxDate,
      FitnessDate,
      InsuranceDate,
    });
    res.status(201).json({
      success: true,
      addvehicle,
    });
  })
);
module.exports = router;
