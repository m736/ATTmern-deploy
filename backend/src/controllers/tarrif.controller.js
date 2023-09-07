//Create Product - /api/v1/product/new
const express = require("express");
const { Createtarrif } = require("../utils/models");
const catchAsyncError = require("../middleware/catchAsyncError");
const router = express.Router();
const APIFeatures = require("../utils/apiFeatures");
const multer = require("multer");
const upload = multer();

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
    const createTarrif = await Createtarrif.findByIdAndUpdate(req.body);
    res.status(201).json({
      success: true,
      createTarrif,
    });
  })
);
router.get(
  "/list_tarrif",
  catchAsyncError(async (req, res, next) => {
    const resPerPage = 10;
    let buildQuery = () => {
      return new APIFeatures(Createtarrif.find(), req.query).search().filter();
    };

    const filteredTarrifCount = await buildQuery().query.countDocuments({});
    const totalTarrifCount = await Createtarrif.countDocuments({});
    let tarrifCount = totalTarrifCount;

    if (filteredTarrifCount !== totalTarrifCount) {
      tarrifCount = filteredTarrifCount;
    }
    const getTarrifData = await buildQuery().paginate(resPerPage).query;
    const getAllTarrifData = await Createtarrif.find();
    res.status(201).json({
      success: true,
      count: tarrifCount,
      resPerPage,
      getTarrifData,
      getAllTarrifData,
    });
  })
);
router.get(
  "/tarrif_unique_field",
  catchAsyncError(async (req, res, next) => {
    const getTarrrifCompanyDetails = await Createtarrif.distinct(
      "company"
    ).exec();
    const getTarrrifVehicleDetails = await Createtarrif.distinct(
      "vehicleType"
    ).exec();
    const getTarrrifSelectedRental = await Createtarrif.distinct(
      "selectedRental"
    ).exec();
    const getTarrrifSelectedSegment = await Createtarrif.distinct(
      "selectedSegment"
    ).exec();
    console.log(getTarrrifCompanyDetails);
    res.status(201).json({
      success: true,
      getTarrrifCompanyDetails,
      getTarrrifVehicleDetails,
      getTarrrifSelectedRental,
      getTarrrifSelectedSegment,
    });
  })
);
router.post(
  "/tarrif_search_company_name",
  upload.none(),
  catchAsyncError(async (req, res, next) => {
    const searchTarrif = req.body;
    const resPerPage = 3;
    let getTarrrifDetails = await Createtarrif.find({
      $or: [
        { company: searchTarrif?.company },
        { vehicleType: searchTarrif?.vehicleType },
        { selectedRental: searchTarrif?.selectedRental },
        { selectedSegment: searchTarrif?.selectedSegment },
      ],
    }).exec();

    res.status(201).json({
      success: true,
      getTarrrifDetails,
      count: getTarrrifDetails.length,
      resPerPage,
    });
  })
);

module.exports = router;
