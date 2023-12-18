const express = require("express");
const { SiteSlabBaseMisUploadModel } = require("../utils/models");
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
    const siteSlabBaseMIs = req.body;
    console.log(siteSlabBaseMIs);
    var SlabBasedData = await SiteSlabBaseMisUploadModel.find({
      $and: [
        { Company_Name: { $in: [siteSlabBaseMIs?.company] } },
        {
          Date: {
            $gte: siteSlabBaseMIs.startJourney,
            $lte: siteSlabBaseMIs.endJourney,
          },
        },
      ],
    }).exec();
    console.log(SlabBasedData?.length);
    // return res.json(
    //   res.json({
    //     success: true,
    //     message: "vechicle list delete successfully",
    //     SlabBasedData,
    //   })
    // );
  } catch (err) {
    console.error("vechicle-attendance-list error: ", err);
    res.status(500).json({ success: false, message: "internal_server_error" });
  }
});

module.exports = router;
