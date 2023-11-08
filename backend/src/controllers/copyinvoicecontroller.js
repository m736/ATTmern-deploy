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
    const invoice_number = 10;
    await BackDatedInvoice.find({
      $and: [
        { Client: req.body.Client },
        { Location: req.body.Location },
        {
          Rangedate: {
            $gte: req.body.Fromdate,
            $lte: req.body.Todate,
          },
        },
      ],
    }).then((res) => {
      console.log(res);
    });
    // async function (err, example) {
    //   if (err) console.log(err);
    //   if (example) {
    //     console.log("This has already been saved");
    //   } else {
    //     const results = await SlabBaseMisUploadData.aggregate([
    //       { $unionWith: { coll: "on_call_mis_tables" } },
    //       {
    //         $project: {
    //           client: 1,
    //           location: 1,
    //           date: 1,
    //           salesTotal: 1,
    //         },
    //       },
    //       {
    //         $match: {
    //           $and: [
    //             { client: req.body.Client },
    //             { location: req.body.Location },
    //             {
    //               date: {
    //                 $gte: req.body.Fromdate,
    //                 $lte: req.body.Todate,
    //               },
    //             },
    //           ],
    //         },
    //       },
    //       {
    //         $group: {
    //           _id: null,
    //           salesTotalAmount: { $sum: "$salesTotal" },
    //         },
    //       },
    //       {
    //         $project: {
    //           _id: 0,
    //         },
    //       },
    //       {
    //         $addFields: {
    //           client: req.body.Client,
    //           location: req.body.Location,
    //           invoice_no: invoice_number,
    //           trips_between: `${req.body.Fromdate} - ${req.body.Todate}`,
    //         },
    //       },
    //     ]);
    //     // var example = new Example(req.body);
    //     const backdatedInvoiceInput = await BackDatedInvoice(results);
    //     backdatedInvoiceInput.save(function (err, example) {
    //       if (err) console.log(err);
    //       console.log("New invoice generated successfully");
    //     });
    //   }
    // }
    // console.log(req.body.Fromdate);
    // const results = await SlabBaseMisUploadData.aggregate([
    //   { $unionWith: { coll: "on_call_mis_tables" } },
    //   {
    //     $project: {
    //       client: 1,
    //       location: 1,
    //       date: 1,
    //       salesTotal: 1,
    //     },
    //   },
    //   {
    //     $match: {
    //       $and: [
    //         { client: req.body.Client },
    //         { location: req.body.Location },
    //         {
    //           date: {
    //             $gte: req.body.Fromdate,
    //             $lte: req.body.Todate,
    //           },
    //         },
    //       ],
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: null,

    //       salesTotalAmount: { $sum: "$salesTotal" },
    //     },
    //   },
    //   {
    //     $project: {
    //       _id: 0,
    //     },
    //   },
    //   {
    //     $addFields: {
    //       client: req.body.Client,
    //       location: req.body.Location,
    //       invoice_no: invoice_number,
    //       trips_between: `${req.body.Fromdate} - ${req.body.Todate}`,
    //     },
    //   },
    // ]);

    // console.log(ex);
    // const invoice_no = await SlabBaseMisUploadData.aggregate([
    //   { $unionWith: { coll: "on_call_mis_tables" } },
    //   {
    //     $match: {
    //       $and: [
    //         { client: req.body.Client },
    //         { location: req.body.Location },
    //         {
    //           date: {
    //             $gte: req.body.Fromdate,
    //             $lte: req.body.Todate,
    //           },
    //         },
    //       ],
    //     },
    //   },
    //   {
    //     $project: {
    //       _id: 0,
    //       client: 1,
    //       Invoice_No: 1,
    //     },
    //   },
    // ]);
    // console.log(invoice_no);
    // for await (const doc of invoice_no) {
    //   console.log(doc.Invoice_No);
    //   const invoiceNo_notzero=doc.Invoice_No
    //   if(invoiceNo_notzero!=0){

    //   }
    // }
    // const backdatedInvoiceInput = await BackDatedInvoice.create(results);
    // if (backdatedInvoiceInput.length) {
    //   const res = await SlabBaseMisUploadData.updateMany(
    //     { client: req.body.Client },
    //     { $set: { Invoice_No: invoice_number } }
    //   );
    //   console.log(res);
    // }

    // console.log(backdatedInvoiceInput);
    //     // res.status(201).json({
    //     //   success: true,
    //     //   backdatedInvoiceInput,
    //     // });
  })
);
module.exports = router;
