//Create Product - /api/v1/product/new
const express = require("express");
const { ClientMasterModel } = require("../utils/models");
const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../middleware/error-handler");
const APIFeatures = require("../utils/apiFeatures");
const router = express.Router();

router.get(
  "/client_master_api",
  catchAsyncError(async (req, res, next) => {
    // const resPerPage = 3;
    // let buildQuery = () => {
    //   return new APIFeatures(ClientMasterModel.find(), req.query)
    //     .search()
    //     .filter();
    // };

    // const filteredClientMasterCount = await buildQuery().query.countDocuments(
    //   {}
    // );
    // const totalClientMasterCount = await ClientMasterModel.countDocuments({});
    // let clientMasterCount = totalClientMasterCount;

    // if (filteredClientMasterCount !== totalClientMasterCount) {
    //   clientMasterCount = filteredClientMasterCount;
    // }

    const getClientMaster = await ClientMasterModel.find();
    res.status(201).json({
      success: true,
      // count: clientMasterCount,
      // resPerPage,
      getClientMaster,
    });
  })
);
router.get(
  "/client_master_api/:id",
  catchAsyncError(async (req, res, next) => {
    const getIndividualClientMaster = await ClientMasterModel.findById(
      req.params.id
    );
    // console.log(getIndividualClientMaster);
    if (!getIndividualClientMaster) {
      return next(
        new ErrorHandler(
          `ClientMaster not found with this id: ${req.params.id}`,
          404
        )
      );
    }
    res.status(201).json({
      success: true,
      getIndividualClientMaster,
    });
  })
);
router.post(
  "/client_master_api",
  catchAsyncError(async (req, res, next) => {
    const createClientMaster = await ClientMasterModel.create(req.body);
    // console.log(createClientMaster);
    res.status(201).json({
      success: true,
      createClientMaster,
    });
  })
);
router.put(
  "/client_master_api/:id",
  catchAsyncError(async (req, res, next) => {
    const updateClientMaster = await ClientMasterModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updateClientMaster) {
      return next(
        new ErrorHandler(
          `ClientMaster not found with this id: ${req.params.id}`,
          404
        )
      );
    }

    res.status(201).json({
      success: true,
      updateClientMaster,
    });
  })
);
router.delete(
  "/client_master_api/:id",
  catchAsyncError(async (req, res, next) => {
    const deleteClientMaster = await ClientMasterModel.findById(req.params.id);
    if (!deleteClientMaster) {
      return next(
        new ErrorHandler(
          `ClientMaster not found with this id: ${req.params.id}`,
          404
        )
      );
    }
    await deleteClientMaster.remove();
    res.status(201).json({
      success: true,
      deleteClientMaster,
    });
  })
);
router.get(
  "/unique_company_name_api",
  catchAsyncError(async (req, res, next) => {
    const getUniqueCompanyDetails = await ClientMasterModel.distinct(
      "Company_Name"
    );
    res.status(201).json({
      success: true,
      getUniqueCompanyDetails,
    });
  })
);

module.exports = router;
