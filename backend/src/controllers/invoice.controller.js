const express = require("express");
const router = express.Router();
const catchAsyncError = require("../middleware/catchAsyncError");
const {
  BackDatedInvoice,
  SlabBaseMisUploadData,
  OnCallMisUploadData,
  DayBaseMisUploadData,
  TripBaseMisUploadData,
} = require("../utils/models");
router.post(
  "/backdated_invoice",

  catchAsyncError(async (req, res, next) => {
    let invoice_number = 1;
    // console.log(req.body.Client);
    // console.log(req.body.Location);
    // console.log(req.body.Fromdate);
    // console.log(req.body.Todate);
    const findInvoiceNo = await BackDatedInvoice.findOne()
      .sort({
        invoice_no: -1,
      })
      .limit(1);
    console.log(findInvoiceNo);
    if (findInvoiceNo?.invoice_no) {
      invoice_number = findInvoiceNo.invoice_no + 1;
    }
    const results = await SlabBaseMisUploadData.aggregate([
      { $unionWith: { coll: "on_call_mis_tables" } },
      {
        $project: {
          client: 1,
          location: 1,
          date: 1,
          salesTotal: 1,
          Invoice_No: 1,
        },
      },
      {
        $match: {
          $and: [
            { client: req.body.Client },
            { location: req.body.Location },
            {
              date: {
                $gte: req.body.Fromdate,
                $lte: req.body.Todate,
              },
            },
            { Invoice_No: { $eq: 0 } },
          ],
        },
      },
      {
        $group: {
          _id: null,
          salesTotalAmount: { $sum: "$salesTotal" },
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $addFields: {
          client: req.body.Client,
          location: req.body.Location,
          invoice_no: invoice_number,
          from_date: req.body.Fromdate,
          to_date: req.body.Todate,
          trips_between: `${req.body.Fromdate} - ${req.body.Todate}`,
        },
      },
    ]);
    console.log("results");
    console.log(results);
    if (results.length) {
      const backdatedInvoiceInput = await BackDatedInvoice.create(results);
      const slabBaseResponse = await SlabBaseMisUploadData.updateMany(
        {
          $and: [
            { client: req.body.Client },
            { location: req.body.Location },
            {
              date: {
                $gte: req.body.Fromdate,
                $lte: req.body.Todate,
              },
            },
            { Invoice_No: { $eq: 0 } },
          ],
        },
        { $set: { Invoice_No: invoice_number } }
      );
      const onCallResponse = await OnCallMisUploadData.updateMany(
        {
          $and: [
            { client: req.body.Client },
            { location: req.body.Location },
            {
              date: {
                $gte: req.body.Fromdate,
                $lte: req.body.Todate,
              },
            },
            { Invoice_No: { $eq: 0 } },
          ],
        },
        { $set: { Invoice_No: invoice_number } }
      );
      // console.log(response);
      // console.log(backdatedInvoiceInput);
      res.status(201).json({
        success: true,
        backdatedInvoiceInput,
      });
    } else {
      res.status(404).json({
        success: true,
        message: "Data Not found",
      });
    }
  })
);
router.delete("/delete_invoice/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    // console.log(id);
    // console.log(req);
    // const jokes = req.body;
    // const promises = jokes.map(async (item) => {
    //   const res = await Vehicle.remove({
    //     _id: { $in: item._id },
    //   });
    //   return res;
    // });
    const promises = await BackDatedInvoice.findByIdAndRemove(id);

    Promise.all(promises)
      .then(() => {
        res.json({
          success: true,
          message: "invoice list delete successfully",
        });
      })
      .catch((err) => res.status(400).json(err));
    await BackDatedInvoice.findById(id, async function (err, docs) {
      if (err) {
        console.log(err);
      } else {
        console.log("Result : ", docs);
        const slabBaseResponse = await SlabBaseMisUploadData.updateMany(
          {
            $and: [
              { client: docs.client },
              { location: docs.location },
              {
                date: {
                  $gte: docs.from_date,
                  $lte: docs.to_date,
                },
              },
              { Invoice_No: { $ne: 0 } },
            ],
          },
          { $set: { Invoice_No: 0 } }
        );
        const onCallResponse = await OnCallMisUploadData.updateMany(
          {
            $and: [
              { client: docs.client },
              { location: docs.location },
              {
                date: {
                  $gte: docs.from_date,
                  $lte: docs.to_date,
                },
              },
              { Invoice_No: { $ne: 0 } },
            ],
          },
          { $set: { Invoice_No: 0 } }
        );
      }
    });
  } catch (err) {
    console.error("invoice-delete-list error: ", err);
    res.status(500).json({ success: false, message: "internal_server_error" });
  }
});
module.exports = router;
