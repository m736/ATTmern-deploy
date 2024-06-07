//Create Product - /api/v1/product/new
const express = require("express");
const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../middleware/error-handler");
const APIFeatures = require("../utils/apiFeatures");
const { OwnerList } = require("../utils/inductionModel");
const router = express.Router();

router.get(
  "/owner_list_api",
  catchAsyncError(async (req, res, next) => {
    const getOwnerList = await OwnerList.find();
    res.status(201).json({
      success: true,
      getOwnerList,
    });
  })
);
router.get(
  "/owner_list_api/:id",
  catchAsyncError(async (req, res, next) => {
    const getIndividualOwnerList = await OwnerList.findById(req.params.id);
    // console.log(getIndividualClientMaster);
    if (!getIndividualOwnerList) {
      return next(
        new ErrorHandler(
          `OwnerList not found with this id: ${req.params.id}`,
          404
        )
      );
    }
    res.status(201).json({
      success: true,
      getIndividualOwnerList,
    });
  })
);
router.post(
  "/owner_list_api",
  catchAsyncError(async (req, res, next) => {
    const createOwnerList = await OwnerList.create(req.body);
    // console.log(createClientMaster);
    res.status(201).json({
      success: true,
      createOwnerList,
    });
  })
);
router.put(
  "/owner_list_api/:id",
  catchAsyncError(async (req, res, next) => {
    const updateOwnerList = await OwnerList.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updateOwnerList) {
      return next(
        new ErrorHandler(
          `OwnerList not found with this id: ${req.params.id}`,
          404
        )
      );
    }

    res.status(201).json({
      success: true,
      updateOwnerList,
    });
  })
);
router.delete(
  "/owner_list_api/:id",
  catchAsyncError(async (req, res, next) => {
    const deleteOwnerList = await OwnerList.findById(req.params.id);
    if (!deleteOwnerList) {
      return next(
        new ErrorHandler(
          `OwnerList not found with this id: ${req.params.id}`,
          404
        )
      );
    }
    await deleteOwnerList.remove();
    res.status(201).json({
      success: true,
      deleteOwnerList,
    });
  })
);

module.exports = router;
