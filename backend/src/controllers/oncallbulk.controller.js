const express = require("express");
const {
  OnCallMisUploadData,
  OnCallMisUploadCalculationListData,
} = require("../utils/models");
const router = express.Router();
const cors = require("cors");

router.post("/oncallmis_bulk_insert", async (req, res, next) => {
  try {
    const onCallMisData = req.body;
    await OnCallMisUploadData.insertMany(onCallMisData, (error, docs) => {
      if (docs) {
        res
          .status(200)
          .json({ success: true, message: "oncallmis_bulk_insert success" });
      }
      if (error) {
        console.log("oncallmis_bulk_insert insertMany error: ", error);
        res.status(400).json({
          success: false,
          error: error,
          message: "oncallmis_bulk_insert failed",
        });
      }
    });
  } catch (err) {
    console.error("jokes-bulk-insert error: ", err);
    res.status(500).json({ success: false, message: "internal_server_error" });
  }
});

router.post("/oncallmis_bulk_update", async (req, res, next) => {
  try {
    const OnCallMisData = req.body;

    const promises = OnCallMisData.map(async (item) => {
      const res = await OnCallMisUploadData.findByIdAndUpdate(item._id, {
        $set: { ...item },
      });

      return res;
    });

    Promise.all(promises)
      .then(() =>
        res.json({ success: true, message: "oncallmis_bulk_update success" })
      )
      .catch((err) => res.status(400).json(err));
  } catch (err) {
    console.error("oncallmis_bulk_update error: ", err);
    res.status(500).json({
      success: false,
      message: "oncallmis_bulk_update internal_server_error",
    });
  }
});
router.post("/download_oncall_misdata", async (req, res, next) => {
  try {
    const searchData = req.body;
    let singlePerson = await OnCallMisUploadData.find({
      $and: [
        { Company_Name: searchData.company },
        {
          Usage_Date: {
            $gte: searchData.startJourney,
            $lte: searchData.endJourney,
          },
        },
      ],
    }).exec();

    return res.json(singlePerson);
  } catch (err) {
    console.error("company-vice-list error: ", err);
    res.status(500).json({ success: false, message: "internal_server_error" });
  }
});
module.exports = router;
