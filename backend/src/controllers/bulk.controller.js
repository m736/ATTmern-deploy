const express = require("express");
const { Vehicle } = require("../utils/models");
const router = express.Router();
const cors = require("cors");

router.post("/jokes-bulk-insert", async (req, res, next) => {
  try {
    const vehicles = req.body;
    await Vehicle.insertMany(vehicles, (error, docs) => {
      if (docs) {
        res
          .status(200)
          .json({ success: true, message: "jokes-bulk-insert success" });
      }
      if (error) {
        console.log("insertMany error: ", error);
        res.status(400).json({
          success: false,
          error: error,
          message: "jokes-bulk-insert failed",
        });
      }
    });
  } catch (err) {
    console.error("jokes-bulk-insert error: ", err);
    res.status(500).json({ success: false, message: "internal_server_error" });
  }
});

router.post("/jokes-bulk-update", async (req, res, next) => {
  try {
    const jokes = req.body;

    const promises = jokes.map(async (item) => {
      const res = await Vehicle.findByIdAndUpdate(item._id, {
        $set: { ...item },
      });

      return res;
    });

    Promise.all(promises)
      .then(() =>
        res.json({ success: true, message: "jokes-bulk-update success" })
      )
      .catch((err) => res.status(400).json(err));
  } catch (err) {
    console.error("jokes-bulk-update error: ", err);
    res.status(500).json({ success: false, message: "internal_server_error" });
  }
});

router.post("/vechicle-attendance-list", async (req, res, next) => {
  try {
    const jokes = req.body;
    var singlePerson;
    const arr1 = jokes.example.vechicle_no?.length || 0;
    const arr2 = jokes.example.company?.length || 0;
    const startTime = jokes.example.startTime;
    const EndTime = jokes.example.endTime;

    if (arr1 && arr2) {
      singlePerson = await Vehicle.find({
        $and: [
          { vechicle_no: jokes.example.vechicle_no },
          { company: jokes.example.company },
          {
            date: {
              $gte: jokes.example.startDate,
              $lte: jokes.example.endDate,
            },
          },
          // { time: { $gte: jokes.example.startTime, $lte: jokes.example.endTime } }
        ],
      }).exec();
    } else if (arr1) {
      singlePerson = await Vehicle.find({
        $and: [
          { vechicle_no: jokes.example.vechicle_no },
          {
            date: {
              $gte: jokes.example.startDate,
              $lte: jokes.example.endDate,
            },
          },
          // { time: { $gte: jokes.example.startTime, $lte: jokes.example.endTime } }
        ],
      }).exec();
    } else if (arr2) {
      singlePerson = await Vehicle.find({
        $and: [
          { company: jokes.example.company },
          {
            date: {
              $gte: jokes.example.startDate,
              $lte: jokes.example.endDate,
            },
          },
          // { time: { $gte: jokes.example.startTime, $lte: jokes.example.endTime } }
        ],
      }).exec();
    } else {
      singlePerson = await Vehicle.find({
        $and: [
          {
            date: {
              $gte: jokes.example.startDate,
              $lte: jokes.example.endDate,
            },
          },
          // { time: { $gte: jokes.example.startTime, $lte: jokes.example.endTime } }
        ],
      }).exec();
    }

    return res.json(singlePerson);
  } catch (err) {
    console.error("vechicle-attendance-list error: ", err);
    res.status(500).json({ success: false, message: "internal_server_error" });
  }
});

router.post("/company-vice-list", async (req, res, next) => {
  try {
    const jokes = req.body;

    let singlePerson = await Vehicle.find({
      $and: [
        { company: jokes.example1.company },
        {
          date: {
            $gte: jokes.example1.startDate,
            $lte: jokes.example1.endDate,
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

router.delete("/delete-vehiclelist", async (req, res, next) => {
  try {
    const jokes = req.body;
    const promises = jokes.map(async (item) => {
      const res = await Vehicle.remove({
        _id: { $in: item._id },
      });
      return res;
    });

    Promise.all(promises)
      .then(() => {
        res.json({
          success: true,
          message: "vechicle list delete successfully",
        });
      })
      .catch((err) => res.status(400).json(err));
  } catch (err) {
    console.error("vechicle-delete-list error: ", err);
    res.status(500).json({ success: false, message: "internal_server_error" });
  }
});

module.exports = router;
