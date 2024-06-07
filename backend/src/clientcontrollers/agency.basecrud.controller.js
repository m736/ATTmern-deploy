//Create Product - /api/v1/product/new
const express = require("express");
const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../middleware/error-handler");
const APIFeatures = require("../utils/apiFeatures");
const { AgencyList } = require("../utils/inductionModel");

const router = express.Router();

router.get(
  "/agency_list_api",
  catchAsyncError(async (req, res, next) => {
    const getAgencyList = await AgencyList.find();
    res.status(201).json({
      success: true,
      getAgencyList,
    });
  })
);
router.get(
  "/agency_list_api/:id",
  catchAsyncError(async (req, res, next) => {
    const getIndividualAgencyList = await AgencyList.findById(req.params.id);
    // console.log(getIndividualClientMaster);
    if (!getIndividualAgencyList) {
      return next(
        new ErrorHandler(
          `AgencyList not found with this id: ${req.params.id}`,
          404
        )
      );
    }
    res.status(201).json({
      success: true,
      getIndividualAgencyList,
    });
  })
);
router.post(
  "/agency_list_api",
  catchAsyncError(async (req, res, next) => {
    const createAgencyList = await AgencyList.create(req.body);
    // console.log(createClientMaster);
    res.status(201).json({
      success: true,
      createAgencyList,
    });
  })
);
router.put(
  "/agency_list_api/:id",
  catchAsyncError(async (req, res, next) => {
    const updateAgencyList = await AgencyList.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updateAgencyList) {
      return next(
        new ErrorHandler(
          `AgencyList not found with this id: ${req.params.id}`,
          404
        )
      );
    }

    res.status(201).json({
      success: true,
      updateAgencyList,
    });
  })
);
router.delete(
  "/agency_list_api/:id",
  catchAsyncError(async (req, res, next) => {
    const deleteAgencyList = await AgencyList.findById(req.params.id);
    if (!deleteAgencyList) {
      return next(
        new ErrorHandler(
          `AgencyList not found with this id: ${req.params.id}`,
          404
        )
      );
    }
    await deleteAgencyList.remove();
    res.status(201).json({
      success: true,
      deleteAgencyList,
    });
  })
);

module.exports = router;
