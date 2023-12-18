const express = require("express");
const { TripBaseMisUploadData } = require("../utils/models");
const router = express.Router();
const cors = require("cors");

router.post("/tripbase_mis_bulk_insert", async (req, res, next) => {
  try {
    const tripBaseMisData = req.body;
    await TripBaseMisUploadData.insertMany(tripBaseMisData, (error, docs) => {
      if (docs) {
        res
          .status(200)
          .json({ success: true, message: "tripbase_mis_bulk_insert success" });
      }
      if (error) {
        console.log("tripbase_mis_bulk_insert insertMany error: ", error);
        res.status(400).json({
          success: false,
          error: error,
          message: "tripbase_mis_bulk_insert failed",
        });
      }
    });
  } catch (err) {
    console.error("jokes-bulk-insert error: ", err);
    res.status(500).json({ success: false, message: "internal_server_error" });
  }
});

router.post("/tripbase_mis_bulk_update", async (req, res, next) => {
  try {
    const tripBaseMisData = req.body;

    const promises = tripBaseMisData.map(async (item) => {
      const res = await TripBaseMisUploadData.findByIdAndUpdate(item._id, {
        $set: { ...item },
      });

      return res;
    });

    Promise.all(promises)
      .then(() =>
        res.json({ success: true, message: "tripbase_mis_bulk_update success" })
      )
      .catch((err) => res.status(400).json(err));
  } catch (err) {
    console.error("tripbase_mis_bulk_update error: ", err);
    res.status(500).json({
      success: false,
      message: "tripbase_mis_bulk_update internal_server_error",
    });
  }
});
router.post("/download_tripBase_misdata", async (req, res, next) => {
  try {
    const searchData = req.body;
    console.log(searchData);
    let singleTripData = await TripBaseMisUploadData.find({
      $and: [
        { Client: searchData.company },
        { Location: searchData.location },
        {
          Date: {
            $gte: searchData.startJourney,
            $lte: searchData.endJourney,
          },
        },
      ],
    }).exec();

    return res.json(singleTripData);
  } catch (err) {
    console.error("download_tripBase_misdata error: ", err);
    res.status(500).json({ success: false, message: "internal_server_error" });
  }
});

module.exports = router;
