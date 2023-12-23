const express = require("express");
const { SiteSlabBaseMisUploadModel } = require("../utils/models");
var moment = require("moment");
const router = express.Router();
const cors = require("cors");

router.post("/site_slabbase_mis_bulk_insert", async (req, res, next) => {
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
});

router.post("/site_slabbase_mis_bulk_update", async (req, res, next) => {
  try {
    const siteSlabBaseMisData = req.body;

    const promises = siteSlabBaseMisData.map(async (item) => {
      const res = await SiteSlabBaseMisUploadModel.findByIdAndUpdate(item._id, {
        $set: { ...item },
      });

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
});
router.post("/download_site_slabbase_mis", async (req, res, next) => {
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
    res.status(500).json({ success: false, message: "internal_server_error" });
  }
});
router.get("/sitemis_missing_upload_date", async (req, res, next) => {
  console.log(moment("2023-12-15").toDate());
  let $agg;
  $agg = await SiteSlabBaseMisUploadModel.aggregate([
    {
      $match: {
        createdAt: {
          $gte: moment("2023-10-12").toDate(),
          $lte: moment().toDate(),
        },
      },
    },

    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt",
          },
        },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: false,
        sortKey: {
          $dateFromString: {
            dateString: "$_id",
          },
        },
        Dates: "$_id",
        Count: "$count",
      },
    },
    {
      $sort: {
        sortKey: 1,
      },
    },
    {
      $project: {
        sortKey: false,
      },
    },
  ]);

  function fillEmptyDates($agg, $defaultData, from, to) {
    const $aggObj = {}; //Taking this as an object for easy checking

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
    { Count: 0, AverageIncome: 0 },
    moment("2023-10-12").toDate(),
    moment().toDate()
  );
  console.log($agg);
  return res.json({
    success: true,
    message: "Missing Dates",
    $agg,
  });
});

module.exports = router;
