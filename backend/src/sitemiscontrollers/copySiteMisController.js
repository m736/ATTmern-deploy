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
          date: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          company: "$Company_Name",
        },
        Count: {
          $sum: 1,
        },
      },
    },
    {
      $project: {
        _id: 0,
        date: "$_id.date",
        company: "$_id.company",
        Count: 1,
      },
    },
    {
      $sort: {
        company: 1,
        date: -1,
      },
    },
    // {
    //   $match: {
    //     createdAt: {
    //       $gte: moment("2023-11-20").toDate(),
    //       $lte: moment().toDate(),
    //     },
    //   },
    // },

    // {
    //   $group: {
    //     _id: {
    //       $dateToString: {
    //         format: "%Y-%m-%d",
    //         date: "$createdAt",
    //       },
    //       company: "$Company_Name",
    //     },

    //     count: { $sum: 1 },
    //   },
    // },
    // {
    //   $project: {
    //     _id: false,
    //     sortKey: {
    //       $dateFromString: {
    //         dateString: "$_id",
    //       },
    //     },
    //     company: 1,
    //     Count: "$count",
    //     Date: "$_id",
    //   },
    // },
    // {
    //   $sort: {
    //     sortKey: 1,
    //   },
    // },
    // {
    //   $project: {
    //     sortKey: false,
    //   },
    // },
  ]);
  console.log($agg);
  function fillEmptyDates($agg, $defaultData, from, to) {
    const $aggObj = {}; //Taking this as an object for easy checking
    console.log($agg);
    $agg.map((agg) => {
      $aggObj[agg.Date] = agg; //Making an object from array entries with Date as key
    });

    const $loopDate = moment(from);
    const $endDate = moment(to);

    //Starting from from date to to date, checking if any date does not have entry in $aggObje
    while ($endDate.isSameOrAfter($loopDate)) {
      let $aggDate = $loopDate.format("YYYY-MM-DD");

      if (!$aggObj.hasOwnProperty($aggDate)) {
        //If any date does not have entry, creating a new entry from default aggregates and giving it the date as current date
        $aggObj[$aggDate] = {
          ...$defaultData,
          Date: $aggDate,
        };
      }
      $loopDate.add(1, "day"); //Incrementing aggregate date
    }

    //Converting back to array and sorting by date
    return Object.values($aggObj).sort((a, b) =>
      moment(a.Date).isBefore(moment(b.Date)) ? -1 : 1
    );
  }

  //You can call this function like so
  $agg = fillEmptyDates(
    $agg,
    { Count: 0 },
    moment("2023-11-20").toDate(),
    moment().toDate()
  );

  // const filterEmptyDates = $agg.filter((item) => {
  //   return item?.Count == 0;
  // });
  // return res.json({
  //   success: true,
  //   message: "Missing Dates",
  //   $agg,
  //   filterEmptyDates,
  // });
});

router.get("/sitemis_missing_upload_date", async (req, res, next) => {
  let $agg;
  $agg = await SiteSlabBaseMisUploadModel.aggregate([
    {
      $group: {
        _id: {
          date: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          company: "$Company_Name",
        },
        Count: {
          $sum: 1,
        },
      },
    },
    {
      $project: {
        _id: 0,
        date: "$_id.date",
        company: "$_id.company",
        Count: 1,
      },
    },
    {
      $sort: {
        company: 1,
        date: -1,
      },
    },
  ]);

  function fillEmptyDates(item, $defaultData, from, to) {
    const $aggObj = {}; //Taking this as an object for easy checking

    item.map((agg) => {
      $aggObj[agg.date] = agg;
      $aggObj[agg.company] = agg; //Making an object from array entries with Date as key
    });
    console.log($aggObj);
    const $loopDate = moment(from);
    const $endDate = moment(to);

    //Starting from from date to to date, checking if any date does not have entry in $aggObje
    while ($endDate.isSameOrAfter($loopDate)) {
      let $aggDate = $loopDate.format("YYYY-MM-DD");

      if (!$aggObj.hasOwnProperty($aggDate)) {
        //If any date does not have entry, creating a new entry from default aggregates and giving it the date as current date
        $aggObj[$aggDate] = {
          ...$defaultData,
          date: $aggDate,
        };
      }
      $loopDate.add(1, "day"); //Incrementing aggregate date
    }

    //Converting back to array and sorting by date
    return Object.values($aggObj).sort((a, b) =>
      moment(a.Date).isBefore(moment(b.Date)) ? -1 : 1
    );
  }

  // //You can call this function like so
  // $agg = fillEmptyDates(
  //   $agg,
  //   { Count: 0 },
  //   moment("2023-12-25").toDate(),
  //   moment().toDate()
  // );
  // console.log($agg);
  $agg = fillEmptyDates(
    $agg,
    { Count: 0 },
    moment("2023-11-20").toDate(),
    moment().toDate()
  );
  // console.log($agg);

  // const filterEmptyDates = $agg.filter((item) => {
  //   return item?.Count == 0;
  // });
  // return res.json({
  //   success: true,
  //   message: "Missing Dates",
  //   $agg,
  //   filterEmptyDates,
  // });
});
module.exports = router;
