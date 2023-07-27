//Create Product - /api/v1/product/new
const express = require("express");
const { Createtarrif } = require("../utils/models");
const catchAsyncError = require("../middleware/catchAsyncError");
const router = express.Router();

router.post(
  "/add_tarrif",

  catchAsyncError(async (req, res, next) => {
    const createTarrif = await Createtarrif.create(req.body);
    res.status(201).json({
      success: true,
      createTarrif,
    });
  })
);
router.put(
  "/update_tarrif/:id",

  catchAsyncError(async (req, res, next) => {
    console.log(req.body);

    const createTarrif = await Createtarrif.findByIdAndUpdate(req.body);
    res.status(201).json({
      success: true,
      createTarrif,
    });
  })
);
module.exports = router;
