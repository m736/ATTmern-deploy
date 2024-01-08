const express = require("express");
const { SiteSlabBaseMisUploadModel } = require("../utils/models");
var moment = require("moment");
const router = express.Router();
const cors = require("cors");
const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middleware/authenticate");
router.post(
  "/site_slabbase_mis_bulk_insert",
  isAuthenticatedUser,
  authorizeRoles("sitemanager"),
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

router.post(
  "/site_slabbase_mis_bulk_update",
  isAuthenticatedUser,
  authorizeRoles("sitemanager"),
  async (req, res, next) => {
    try {
      const siteSlabBaseMisData = req.body;

      const promises = siteSlabBaseMisData.map(async (item) => {
        const res = await SiteSlabBaseMisUploadModel.findByIdAndUpdate(
          item._id,
          {
            $set: { ...item },
          }
        );

        return res;
      });

      Promise.all(promises)
        .then(() =>
          res.json({
            success: true,
            message: "site_slabbase_mis_bulk_update success",
          })
        )
        .catch((err) => res.status(400).json(err));
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "site_slabbase_mis_bulk_update internal_server_error",
      });
    }
  }
);
router.post(
  "/download_site_slabbase_mis",
  isAuthenticatedUser,
  authorizeRoles("sitemanager"),
  async (req, res, next) => {
    try {
      const siteSlabBaseMIs = req?.body;
      const company = req?.body?.company;

      let siteSlabBaseMIsArray = [];
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
            siteSlabBaseMIsArray.push(...SlabBasedData);
          }
        }
      }

      console.log(siteSlabBaseMIsArray?.length);
      return res.json({
        success: true,
        message: "Get Mis Data successfully",
        siteSlabBaseMIsArray,
      });
    } catch (err) {
      console.error("vechicle-attendance-list error: ", err);
      res
        .status(500)
        .json({ success: false, message: "internal_server_error" });
    }
  }
);
router.get("/sitemis_missing_upload_date", async (req, res, next) => {
  let $agg;
  $agg = await SiteSlabBaseMisUploadModel.aggregate([
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

  let outputValue = [];
  $agg.forEach((element) => {
    let datesArray = element.company.map((item) => item.Date);
    const start = moment("2023-12-12").toDate();
    const end = moment("2023-12-20").toDate();
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
