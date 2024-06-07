const express = require("express");
const {
  SiteSlabBaseMisUploadModel,
  SiteOnCallBaseMisUploadModel,
  SiteTripBaseMisUploadModel,
  SiteDayBaseMisUploadModel,
} = require("../utils/models");
var moment = require("moment");
const router = express.Router();
const cors = require("cors");
const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middleware/authenticate");

// insert slab data
router.post(
  "/site_slabbase_mis_bulk_insert",
  isAuthenticatedUser,
  authorizeRoles("sitemanager", "admin"),
  async (req, res, next) => {
    try {
      const siteSlabBaseMisData = req.body;

      await SiteSlabBaseMisUploadModel.insertMany(
        siteSlabBaseMisData,
        (error, docs) => {
          if (docs) {
            res.status(200).json({
              success: true,
              message: "site_slabbase_mis_bulk_insert success",
            });
          }
          if (error) {
            // console.log("slabbase_mis_bulk_insert insertMany error: ", error);
            res.status(400).json({
              success: false,
              error: error,
              message: "site_slabbase_mis_bulk_insert failed",
            });
          }
        }
      );
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "site_slabbase_mis_bulk_insert internal_server_error",
      });
    }
  }
);

// insert oncall data
router.post(
  "/site_oncallbase_mis_bulk_insert",
  isAuthenticatedUser,
  authorizeRoles("sitemanager", "admin"),
  async (req, res, next) => {
    try {
      const siteOnCallBaseMisData = req.body;

      await SiteOnCallBaseMisUploadModel.insertMany(
        siteOnCallBaseMisData,
        (error, docs) => {
          if (docs) {
            res.status(200).json({
              success: true,
              message: "site_oncall_mis_bulk_insert success",
            });
          }
          if (error) {
            // console.log("slabbase_mis_bulk_insert insertMany error: ", error);
            res.status(400).json({
              success: false,
              error: error,
              message: "site_oncall_mis_bulk_insert failed",
            });
          }
        }
      );
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "site_oncall_mis_bulk_insert internal_server_error",
      });
    }
  }
);

// insert trip data
router.post(
  "/site_tripbase_mis_bulk_insert",
  isAuthenticatedUser,
  authorizeRoles("sitemanager", "admin"),
  async (req, res, next) => {
    try {
      const siteTripBaseMisData = req.body;

      await SiteTripBaseMisUploadModel.insertMany(
        siteTripBaseMisData,
        (error, docs) => {
          if (docs) {
            res.status(200).json({
              success: true,
              message: "site_tripbase_mis_bulk_insert success",
            });
          }
          if (error) {
            // console.log("slabbase_mis_bulk_insert insertMany error: ", error);
            res.status(400).json({
              success: false,
              error: error,
              message: "site_tripbase_mis_bulk_insert failed",
            });
          }
        }
      );
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "site_tripbase_mis_bulk_insert internal_server_error",
      });
    }
  }
);

// insert day data
router.post(
  "/site_daybase_mis_bulk_insert",
  isAuthenticatedUser,
  authorizeRoles("sitemanager", "admin"),
  async (req, res, next) => {
    try {
      const siteDayBaseMisData = req.body;

      await SiteDayBaseMisUploadModel.insertMany(
        siteDayBaseMisData,
        (error, docs) => {
          if (docs) {
            res.status(200).json({
              success: true,
              message: "site_daybase_mis_bulk_insert success",
            });
          }
          if (error) {
            // console.log("slabbase_mis_bulk_insert insertMany error: ", error);
            res.status(400).json({
              success: false,
              error: error,
              message: "site_daybase_mis_bulk_insert failed",
            });
          }
        }
      );
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "site_daybase_mis_bulk_insert internal_server_error",
      });
    }
  }
);

// router.post(
//   "/site_slabbase_mis_bulk_update",
//   isAuthenticatedUser,
//   authorizeRoles("sitemanager"),
//   async (req, res, next) => {
//     try {
//       const siteSlabBaseMisData = req.body;

//       const promises = siteSlabBaseMisData.map(async (item) => {
//         const res = await SiteSlabBaseMisUploadModel.findByIdAndUpdate(
//           item._id,
//           {
//             $set: { ...item },
//           }
//         );

//         return res;
//       });

//       Promise.all(promises)
//         .then(() =>
//           res.json({
//             success: true,
//             message: "site_slabbase_mis_bulk_update success",
//           })
//         )
//         .catch((err) => res.status(400).json(err));
//     } catch (err) {
//       res.status(500).json({
//         success: false,
//         message: "site_slabbase_mis_bulk_update internal_server_error",
//       });
//     }
//   }
// );

/*---download site mis data---*/
router.post(
  "/download_site_mis",
  isAuthenticatedUser,
  authorizeRoles("sitemanager", "admin"),
  async (req, res, next) => {
    try {
      const siteSlabBaseMIs = req?.body;
      const company = req?.body?.company;

      let siteMIsArray = [];
      if (company.length > 0) {
        for await (const cmpny of company) {
          const SlabBasedData = await SiteSlabBaseMisUploadModel.aggregate([
            {
              $match: {
                $and: [
                  { Company_Name: cmpny },
                  {
                    Date: {
                      $gte: siteSlabBaseMIs.startJourney,
                      $lte: siteSlabBaseMIs.endJourney,
                    },
                  },
                ],
              },
            },
          ]);
          // console.log(SlabBasedData.length);

          if (SlabBasedData.length) {
            siteMIsArray.push(...SlabBasedData);
          }
          const OnCallBasedData = await SiteOnCallBaseMisUploadModel.aggregate([
            {
              $match: {
                $and: [
                  { Company_Name: cmpny },
                  {
                    Date: {
                      $gte: siteSlabBaseMIs.startJourney,
                      $lte: siteSlabBaseMIs.endJourney,
                    },
                  },
                ],
              },
            },
          ]);
          // console.log(SlabBasedData.length);

          if (OnCallBasedData.length) {
            siteMIsArray.push(...OnCallBasedData);
          }
          const TripBasedData = await SiteTripBaseMisUploadModel.aggregate([
            {
              $match: {
                $and: [
                  { Company_Name: cmpny },
                  {
                    Date: {
                      $gte: siteSlabBaseMIs.startJourney,
                      $lte: siteSlabBaseMIs.endJourney,
                    },
                  },
                ],
              },
            },
          ]);
          // console.log(SlabBasedData.length);

          if (TripBasedData.length) {
            siteMIsArray.push(...TripBasedData);
          }
          const DayBasedData = await SiteDayBaseMisUploadModel.aggregate([
            {
              $match: {
                $and: [
                  { Company_Name: cmpny },
                  {
                    Date: {
                      $gte: siteSlabBaseMIs.startJourney,
                      $lte: siteSlabBaseMIs.endJourney,
                    },
                  },
                ],
              },
            },
          ]);
          // console.log(SlabBasedData.length);

          if (DayBasedData.length) {
            siteMIsArray.push(...DayBasedData);
          }
        }
      }

      console.log(siteMIsArray?.length);
      return res.json({
        success: true,
        message: "Get Mis Data successfully",
        siteMIsArray,
      });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: "internal_server_error" });
    }
  }
);

/*---delete site mis data---*/
router.delete(
  "/delete_site_mis",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  async (req, res, next) => {
    try {
      const siteSlabBaseMIs = req?.body;
      const company = req?.body?.company;

      let siteMIsArray = [];
      if (company.length > 0) {
        for await (const cmpny of company) {
          const SlabBasedData = await SiteSlabBaseMisUploadModel.aggregate([
            {
              $match: {
                $and: [
                  { Company_Name: cmpny },
                  {
                    Date: {
                      $gte: siteSlabBaseMIs.startJourney,
                      $lte: siteSlabBaseMIs.endJourney,
                    },
                  },
                ],
              },
            },
          ]);
          // console.log(SlabBasedData.length);

          if (SlabBasedData.length) {
            siteMIsArray.push(...SlabBasedData);
          }
          const OnCallBasedData = await SiteOnCallBaseMisUploadModel.aggregate([
            {
              $match: {
                $and: [
                  { Company_Name: cmpny },
                  {
                    Date: {
                      $gte: siteSlabBaseMIs.startJourney,
                      $lte: siteSlabBaseMIs.endJourney,
                    },
                  },
                ],
              },
            },
          ]);
          // console.log(SlabBasedData.length);

          if (OnCallBasedData.length) {
            siteMIsArray.push(...OnCallBasedData);
          }
          const TripBasedData = await SiteTripBaseMisUploadModel.aggregate([
            {
              $match: {
                $and: [
                  { Company_Name: cmpny },
                  {
                    Date: {
                      $gte: siteSlabBaseMIs.startJourney,
                      $lte: siteSlabBaseMIs.endJourney,
                    },
                  },
                ],
              },
            },
          ]);
          // console.log(SlabBasedData.length);

          if (TripBasedData.length) {
            siteMIsArray.push(...TripBasedData);
          }
          const DayBasedData = await SiteDayBaseMisUploadModel.aggregate([
            {
              $match: {
                $and: [
                  { Company_Name: cmpny },
                  {
                    Date: {
                      $gte: siteSlabBaseMIs.startJourney,
                      $lte: siteSlabBaseMIs.endJourney,
                    },
                  },
                ],
              },
            },
          ]);
          // console.log(SlabBasedData.length);

          if (DayBasedData.length) {
            siteMIsArray.push(...DayBasedData);
          }
        }
      }

      console.log(siteMIsArray?.length);
      if (siteMIsArray.length > 0) {
        ids = siteMIsArray.map(function (doc) {
          return doc._id;
        });
        if (ids.length) {
          await SiteSlabBaseMisUploadModel.deleteMany({
            _id: { $in: ids },
          });
          await SiteOnCallBaseMisUploadModel.deleteMany({
            _id: { $in: ids },
          });
          await SiteTripBaseMisUploadModel.deleteMany({
            _id: { $in: ids },
          });
          await SiteDayBaseMisUploadModel.deleteMany({
            _id: { $in: ids },
          });
        }

        res.status(201).json({
          success: true,
          message: "deleted successfully",
        });
      } else {
        res.status(404).json({
          success: true,
          message: "No data Found",
        });
      }
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: "internal_server_error" });
    }
  }
);

// slab missing update date
router.get("/sitemis_missing_upload_date", async (req, res, next) => {
  let allsiteMisData = [];

  const slabMisData = await SiteSlabBaseMisUploadModel.aggregate([
    {
      $group: {
        _id: {
          date: "$Date",
          company: "$Company_Name",
        },
        Count: {
          $sum: 1,
        },
      },
    },
    {
      $project: {
        _id: false,
        Date: "$_id.date",
        company: "$_id.company",
        Count: 1,
      },
    },

    {
      $sort: {
        Date: -1,
      },
    },
    {
      $group: {
        _id: "$company",
        company: { $push: { Count: "$Count", Date: "$Date" } },
      },
    },
  ]);
  if (slabMisData.length) {
    allsiteMisData.push(...slabMisData);
  }
  const onCallMisData = await SiteOnCallBaseMisUploadModel.aggregate([
    {
      $group: {
        _id: {
          date: "$Date",
          company: "$Company_Name",
        },
        Count: {
          $sum: 1,
        },
      },
    },
    {
      $project: {
        _id: false,
        Date: "$_id.date",
        company: "$_id.company",
        Count: 1,
      },
    },

    {
      $sort: {
        Date: -1,
      },
    },
    {
      $group: {
        _id: "$company",
        company: { $push: { Count: "$Count", Date: "$Date" } },
      },
    },
  ]);
  if (onCallMisData.length) {
    allsiteMisData.push(...onCallMisData);
  }
  const tripMisData = await SiteTripBaseMisUploadModel.aggregate([
    {
      $group: {
        _id: {
          date: "$Date",
          company: "$Company_Name",
        },
        Count: {
          $sum: 1,
        },
      },
    },
    {
      $project: {
        _id: false,
        Date: "$_id.date",
        company: "$_id.company",
        Count: 1,
      },
    },

    {
      $sort: {
        Date: -1,
      },
    },
    {
      $group: {
        _id: "$company",
        company: { $push: { Count: "$Count", Date: "$Date" } },
      },
    },
  ]);
  if (tripMisData.length) {
    allsiteMisData.push(...tripMisData);
  }

  let newArray = allsiteMisData.reduce((a, b) => {
    const found = a.find((e) => e._id == b._id);

    return (
      found
        ? found.company.push(...b.company)
        : a.push({ ...b, company: b.company }),
      a
    );
  }, []); // Example usage:

  let outputValue = [];
  newArray?.forEach((element) => {
    let datesArray = element.company.map((item) => item.Date);

    const start = moment("2024-03-01").toDate();
    const end = moment("2024-03-31").toDate();
    let loop = new Date(start);
    let outputDates = [];
    while (loop <= end) {
      if (!datesArray.includes(moment(loop).format("YYYY-MM-DD"))) {
        outputDates.push(loop);
      }
      let newDate = loop.setDate(loop.getDate() + 1);
      loop = new Date(newDate);
    }
    outputValue.push({
      ...element,
      remainingDates: outputDates,
    });
  });

  return res.json({
    success: true,
    message: "Missing Dates",
    outputValue,
  });
});

module.exports = router;
