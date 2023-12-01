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
    // const getTarrifData = await buildQuery().paginate(resPerPage).query;
    const getTarrifData = await Createtarrif.find();
    res.status(201).json({
      success: true,
      // count: tarrifCount,
      // resPerPage,
      // getTarrifData,
      getTarrifData,
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
    console.log(searchTarrif);
    const resPerPage = 3;
    let getTarrrifDetails;
    const s1 = searchTarrif?.company;
    const s2 = searchTarrif?.vehicleType;
    const s3 = searchTarrif?.selectedRental;
    const s4 = searchTarrif?.selectedSegment;
    // first method
    // let getTarrrifDetails = await Createtarrif.find({
    //   $and: [
    //     { company: searchTarrif?.company },
    //     { vehicleType: searchTarrif?.vehicleType },
    //     { selectedRental: searchTarrif?.selectedRental },
    //     { selectedSegment: searchTarrif?.selectedSegment },
    //   ],
    // }).exec();

    // second method
    // let getTarrrifDetails = await Createtarrif.aggregate([
    //   {
    //     $project: {
    //       company: 1,
    //       company: {
    //         $switch: {
    //           branches: [
    //             {
    //               case: {
    //                 $and: [
    //                   { $eq: ["$company", searchTarrif?.company] },
    //                   { $eq: ["$vehicleType", searchTarrif?.vehicleType] },
    //                   {
    //                     $eq: ["$selectedRental", searchTarrif?.selectedRental],
    //                   },
    //                   {
    //                     $eq: [
    //                       "$selectedSegment",
    //                       searchTarrif?.selectedSegment,
    //                     ],
    //                   },
    //                 ],
    //               },
    //               then: "c,v,r and s",
    //             },
    //             {
    //               case: {
    //                 $and: [
    //                   { $eq: ["$company", searchTarrif?.company] },
    //                   { $eq: ["$vehicleType", searchTarrif?.vehicleType] },
    //                   {
    //                     $eq: ["$selectedRental", searchTarrif?.selectedRental],
    //                   },
    //                 ],
    //               },
    //               then: "c ,v and r",
    //             },
    //             {
    //               case: {
    //                 $and: [
    //                   { $eq: ["$company", searchTarrif?.company] },
    //                   { $eq: ["$vehicleType", searchTarrif?.vehicleType] },
    //                 ],
    //               },
    //               then: "c and v",
    //             },
    //             {
    //               case: {
    //                 $and: [{ $eq: ["$company", searchTarrif?.company] }],
    //               },
    //               then: "c only",
    //             },
    //           ],
    //           default: "nothing",
    //         },
    //       },
    //     },
    //   },
    // ]);
    // third method
    console.log(`${s1}-${s2}-${s3}-${s4}`);
    if (s1) {
      console.log("1 values");
      getTarrrifDetails = await Createtarrif.find({
        company: searchTarrif?.company,
      }).exec();
    } else if (s1 && s2) {
      console.log("2 values");
      getTarrrifDetails = await Createtarrif.find({
        $and: [
          { company: searchTarrif?.company },
          { vehicleType: searchTarrif?.vehicleType },
        ],
      }).exec();
    } else if (s1 && s2 && s3) {
      console.log("3 values");
      getTarrrifDetails = await Createtarrif.find({
        $and: [
          { company: searchTarrif?.company },
          { vehicleType: searchTarrif?.vehicleType },
          { selectedRental: searchTarrif?.selectedRental },
        ],
      }).exec();
    } else if (s1 && s2 && s3 && s4) {
      console.log("4 values");
      getTarrrifDetails = await Createtarrif.find({
        $and: [
          { company: searchTarrif?.company },
          { vehicleType: searchTarrif?.vehicleType },
          { selectedRental: searchTarrif?.selectedRental },
          { selectedSegment: searchTarrif?.selectedSegment },
        ],
      }).exec();
    } else {
      getTarrrifDetails = await Createtarrif.find();
    }
    console.log(getTarrrifDetails.length);

    res.status(201).json({
      success: true,
      getTarrrifDetails,
      count: getTarrrifDetails.length,
      resPerPage,
    });
  })
);
router.get(
  "/single_tarrif_master_api/:id",
  catchAsyncError(async (req, res, next) => {
    const getSingleTarrifMaster = await Createtarrif.findById(req.params.id);
    // console.log(getIndividualClientMaster);
    if (!getSingleTarrifMaster) {
      return next(
        new ErrorHandler(
          `TarrifMaster not found with this id: ${req.params.id}`,
          404
        )
      );
    }
    res.status(201).json({
      success: true,
      getSingleTarrifMaster,
    });
  })
);

module.exports = router;
