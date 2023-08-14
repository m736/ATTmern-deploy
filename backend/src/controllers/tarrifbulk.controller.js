//Create Product - /api/v1/product/new
const express = require("express");
const { Createtarrif } = require("../utils/models");
const catchAsyncError = require("../middleware/catchAsyncError");
const router = express.Router();

router.post("/tarrif_bulk_insert", async (req, res, next) => {
  try {
    const tarrifInsert = req.body;
    await Createtarrif.insertMany(tarrifInsert, (error, docs) => {
      if (docs) {
        res
          .status(200)
          .json({ success: true, message: "tarrif_bulk_insert success" });
      }
      if (error) {
        console.log("insertMany error: ", error);
        res.status(400).json({
          success: false,
          error: error,
          message: "tarrif_bulk_insert failed",
        });
      }
    });
  } catch (err) {
    console.error("tarrif_bulk_insert error: ", err);
    res.status(500).json({ success: false, message: "internal_server_error" });
  }
});
router.post("/tarrif_bulk_update", async (req, res, next) => {
  try {
    const tarrifUpdate = req.body;

    const promises = tarrifUpdate.map(async (item) => {
      const res = await Createtarrif.findByIdAndUpdate(item._id, {
        $set: { ...item },
      });

      return res;
    });

    Promise.all(promises)
      .then(() =>
        res.json({ success: true, message: "tarrif_bulk_update success" })
      )
      .catch((err) => res.status(400).json(err));
  } catch (err) {
    console.error("tarrif_bulk_update error: ", err);
    res.status(500).json({ success: false, message: "internal_server_error" });
  }
});
module.exports = router;
