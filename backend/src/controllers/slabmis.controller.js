const express = require("express");
const { SlabBaseMisUploadData } = require("../utils/models");
const router = express.Router();
const cors = require("cors");

router.post("/slabbase_mis_bulk_insert", async (req, res, next) => {
  try {
    const slabBaseMisData = req.body;
    await SlabBaseMisUploadData.insertMany(slabBaseMisData, (error, docs) => {
      if (docs) {
        res
          .status(200)
          .json({ success: true, message: "slabbase_mis_bulk_insert success" });
      }
      if (error) {
        console.log("slabbase_mis_bulk_insert insertMany error: ", error);
        res.status(400).json({
          success: false,
          error: error,
          message: "slabbase_mis_bulk_insert failed",
        });
      }
    });
  } catch (err) {
    console.error("jokes-bulk-insert error: ", err);
    res.status(500).json({ success: false, message: "internal_server_error" });
  }
});

router.post("/slabbase_mis_bulk_update", async (req, res, next) => {
  try {
    const slabBaseMisData = req.body;

    const promises = slabBaseMisData.map(async (item) => {
      const res = await SlabBaseMisUploadData.findByIdAndUpdate(item._id, {
        $set: { ...item },
      });

      return res;
    });

    Promise.all(promises)
      .then(() =>
        res.json({ success: true, message: "slabbase_mis_bulk_update success" })
      )
      .catch((err) => res.status(400).json(err));
  } catch (err) {
    console.error("slabbase_mis_bulk_update error: ", err);
    res.status(500).json({
      success: false,
      message: "slabbase_mis_bulk_update internal_server_error",
    });
  }
});
router.post("/download_slabBase_misdata", async (req, res, next) => {
  try {
    const searchData = req.body;
    console.log(searchData);
    let singleSlabData = await SlabBaseMisUploadData.find({
      $and: [
        { Company: searchData.company },
        {
          date: {
            $gte: searchData.startJourney,
            $lte: searchData.endJourney,
          },
        },
      ],
    }).exec();
    console.log(singleSlabData);
    return res.json(singleSlabData);
  } catch (err) {
    console.error("download_slabBase_misdata error: ", err);
    res.status(500).json({ success: false, message: "internal_server_error" });
  }
});

module.exports = router;
