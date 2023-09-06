const express = require("express");
const { DayBaseMisUploadData } = require("../utils/models");
const router = express.Router();
const cors = require("cors");

router.post("/daybase_mis_bulk_insert", async (req, res, next) => {
  try {
    const dayBaseMisData = req.body;
    await DayBaseMisUploadData.insertMany(dayBaseMisData, (error, docs) => {
      if (docs) {
        res
          .status(200)
          .json({ success: true, message: "daybase_mis_bulk_insert success" });
      }
      if (error) {
        console.log("daybase_mis_bulk_insert insertMany error: ", error);
        res.status(400).json({
          success: false,
          error: error,
          message: "daybase_mis_bulk_insert failed",
        });
      }
    });
  } catch (err) {
    console.error("jokes-bulk-insert error: ", err);
    res.status(500).json({ success: false, message: "internal_server_error" });
  }
});

router.post("/daybase_mis_bulk_update", async (req, res, next) => {
  try {
    const dayBaseMisData = req.body;

    const promises = dayBaseMisData.map(async (item) => {
      const res = await DayBaseMisUploadData.findByIdAndUpdate(item._id, {
        $set: { ...item },
      });

      return res;
    });

    Promise.all(promises)
      .then(() =>
        res.json({ success: true, message: "daybase_mis_bulk_update success" })
      )
      .catch((err) => res.status(400).json(err));
  } catch (err) {
    console.error("daybase_mis_bulk_update error: ", err);
    res.status(500).json({
      success: false,
      message: "daybase_mis_bulk_update internal_server_error",
    });
  }
});
router.post("/download_dayBase_misdata", async (req, res, next) => {
  try {
    const searchData = req.body;

    let findDayData = await DayBaseMisUploadData.find({
      $and: [
        { Company: searchData.company },
        {
          Usage_Date: {
            $gte: searchData.startJourney,
            $lte: searchData.endJourney,
          },
        },
      ],
    }).exec();

    return res.json(findDayData);
  } catch (err) {
    console.error("download_dayBase_misdata error: ", err);
    res.status(500).json({ success: false, message: "internal_server_error" });
  }
});

module.exports = router;
