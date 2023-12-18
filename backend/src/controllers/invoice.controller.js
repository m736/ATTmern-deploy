const express = require("express");
const router = express.Router();
const catchAsyncError = require("../middleware/catchAsyncError");
const {
  BackDatedInvoice,
  SlabBaseMisUploadData,
  OnCallMisUploadData,
  DayBaseMisUploadData,
  TripBaseMisUploadData,
  InvoiceNumberModel,
} = require("../utils/models");
router.post(
  "/backdated_invoice",

  catchAsyncError(async (req, res, next) => {
    let last_invoice_number = req.body.invoiceNum;
    let next_invoice_number;

    const findInvoiceNo = await InvoiceNumberModel.findOne();

    // if (findInvoiceNo) {
    //   last_invoice_number = Number(findInvoiceNo?.next_invoice_no);
    // }

    const results = await SlabBaseMisUploadData.aggregate([
      {
        $unionWith: {
          coll: "on_call_mis_tables",
          coll: "trip_base_mis_tables",
          coll: "day_base_mis_tables",
        },
      },

      {
        $project: {
          Client: 1,
          Location: 1,
          Date: 1,
          Sales_Nett: 1,
          Invoice_No: 1,
        },
      },
      {
        $match: {
          $and: [
            { Client: req.body.Client },
            { Location: req.body.Location },
            {
              Date: {
                $gte: req.body.Fromdate,
                $lte: req.body.Todate,
              },
            },
            { Invoice_No: { $eq: 0 } },
          ],
        },
      },
      { $sort: { Date: 1 } },
      {
        $group: {
          _id: null,
          salesTotalAmount: { $sum: "$Sales_Nett" },
          updated_date: { $first: "$Date" },
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $addFields: {
          Client: req.body.Client,
          Location: req.body.Location,
          Invoice_No: last_invoice_number,
          Invoice_Date: req.body.invoiceDate,
          from_date: req.body.Fromdate,
          to_date: req.body.Todate,
          trips_between: `${req.body.updated_date} - ${req.body.Todate}`,
        },
      },
    ]);

    if (results.length > 0) {
      const backdatedInvoiceInput = await BackDatedInvoice.create(results);
      res.status(201).json({
        success: true,
        backdatedInvoiceInput,
      });
      if (backdatedInvoiceInput) {
        const update = {
          last_invoice_no: Number(last_invoice_number),
          next_invoice_no: Number(last_invoice_number) + 1,
        };

        await InvoiceNumberModel.updateOne(update);

        // const findDuplicateInvoiceNo = await BackDatedInvoice.findOne(
        //   { $expr: { $eq: ["$invoice_no", "$$targetNo"] } },
        //   { _id: 0 },
        //   { let: { targetNo: next_invoice_number } }
        // );

        await SlabBaseMisUploadData.updateMany(
          {
            $and: [
              { Client: req.body.Client },
              { Location: req.body.Location },
              {
                Date: {
                  $gte: req.body.Fromdate,
                  $lte: req.body.Todate,
                },
              },
              { Invoice_No: { $eq: 0 } },
            ],
          },
          { $set: { Invoice_No: last_invoice_number } }
        );
        await OnCallMisUploadData.updateMany(
          {
            $and: [
              { Client: req.body.Client },
              { Location: req.body.Location },
              {
                Date: {
                  $gte: req.body.Fromdate,
                  $lte: req.body.Todate,
                },
              },
              { Invoice_No: { $eq: 0 } },
            ],
          },
          { $set: { Invoice_No: last_invoice_number } }
        );
        await DayBaseMisUploadData.updateMany(
          {
            $and: [
              { Client: req.body.Client },
              { Location: req.body.Location },
              {
                Date: {
                  $gte: req.body.Fromdate,
                  $lte: req.body.Todate,
                },
              },
              { Invoice_No: { $eq: 0 } },
            ],
          },
          { $set: { Invoice_No: last_invoice_number } }
        );
        await TripBaseMisUploadData.updateMany(
          {
            $and: [
              { Client: req.body.Client },
              { Location: req.body.Location },
              {
                Date: {
                  $gte: req.body.Fromdate,
                  $lte: req.body.Todate,
                },
              },
              { Invoice_No: { $eq: 0 } },
            ],
          },
          { $set: { Invoice_No: last_invoice_number } }
        );
      }
    } else {
      res.status(404).json({
        success: true,
        message: "Data Not found",
      });
    }
  })
);
// router.post(
//   "/merge_invoice_api",

//   catchAsyncError(async (req, res, next) => {
//     let last_invoice_number;
//     let next_invoice_number;

//     const findInvoiceNo = await InvoiceNumberModel.findOne();

//     if (findInvoiceNo) {
//       last_invoice_number = Number(findInvoiceNo?.next_invoice_no);
//     }
//     let resultArray = [];
//     if (req.body.length) {
//       for await (const body of req.body) {
//         const results = await SlabBaseMisUploadData.aggregate([
//           { $unionWith: { coll: "on_call_mis_tables" } },
//           {
//             $project: {
//               Client: 1,
//               location: 1,
//               date: 1,
//               salesNett: 1,
//               Invoice_No: 1,
//             },
//           },
//           {
//             $match: {
//               $and: [
//                 { Client: body.selectedClient },
//                 { location: body.selectedClientLocation },
//                 {
//                   date: {
//                     $gte: body.selectedFromAndToDate[0],
//                     $lte: body.selectedFromAndToDate[1],
//                   },
//                 },
//                 { Invoice_No: { $eq: 0 } },
//               ],
//             },
//           },
//           { $sort: { date: 1 } },
//           {
//             $group: {
//               _id: null,
//               salesTotalAmount: { $sum: "$salesNett" },
//               updated_date: { $first: "$date" },
//             },
//           },
//           {
//             $project: {
//               _id: 0,
//             },
//           },
//           {
//             $addFields: {
//               Client: body.selectedClient,
//               location: body.selectedClientLocation,
//               invoice_no: last_invoice_number,
//               from_date: body.selectedFromAndToDate[0],
//               to_date: body.selectedFromAndToDate[1],
//               trips_between: `${body.selectedFromAndToDate[0]} - ${body.selectedFromAndToDate[1]}`,
//             },
//           },
//         ]);
//         // console.log(results);
//         if (results.length) {
//           // if (findInvoiceNo) {
//           //   last_invoice_number = Number(findInvoiceNo?.next_invoice_no);
//           //   next_invoice_number = Number(findInvoiceNo?.next_invoice_no) + 1;
//           //   const update = {
//           //     last_invoice_no: last_invoice_number,
//           //     next_invoice_no: next_invoice_number,
//           //   };

//           //   await InvoiceNumberModel.updateOne(update);
//           // }
//           resultArray.push(results[0]);

//           // await SlabBaseMisUploadData.updateMany(
//           //   {
//           //     $and: [
//           //       { client: body.selectedClient },
//           //       { location: body.selectedClientLocation },
//           //       {
//           //         date: {
//           //           $gte: body.selectedFromAndToDate[0],
//           //           $lte: body.selectedFromAndToDate[1],
//           //         },
//           //       },
//           //       { Invoice_No: { $eq: 0 } },
//           //     ],
//           //   },
//           //   { $set: { Invoice_No: last_invoice_number } }
//           // );
//           // await OnCallMisUploadData.updateMany(
//           //   {
//           //     $and: [
//           //       { client: body.selectedClient },
//           //       { location: body.selectedClientLocation },
//           //       {
//           //         date: {
//           //           $gte: body.selectedFromAndToDate[0],
//           //           $lte: body.selectedFromAndToDate[1],
//           //         },
//           //       },
//           //       { Invoice_No: { $eq: 0 } },
//           //     ],
//           //   },
//           //   { $set: { Invoice_No: last_invoice_number } }
//           // );
//         }
//       }
//     }

//     var categories = [];
//     if (resultArray.length) {
//       // console.log(resultArray);

//       var client = resultArray.map(function (data) {
//         console.log(data.client);
//         const dataClient = data.client;
//         return dataClient;
//       });
//       var sum = resultArray.reduce(function (acc, val) {
//         console.log(acc, val["salesTotalAmount"]);
//         return acc + val["salesTotalAmount"];
//       }, 0);
//       // console.log(sum);
//       var allCategory = {
//         salesTotalAmount: sum,
//         client: client,
//       };
//       console.log(allCategory);
//       // resultArray.unshift(allCategory);
//       // callback(resultArray);
//       // console.log("resultArray");
//       // console.log(resultArray);

//       // const mergeInvoiceInput = await BackDatedInvoice.create(resultArray);
//       // console.log(mergeInvoiceInput);
//       res.status(201).json({
//         success: true,
//         mergeInvoiceInput,
//       });
//     } else {
//       res.status(404).json({
//         success: true,
//         message: "Data Not found",
//       });
//     }
//   })
// );
router.get(
  "/invoice_list_api",
  catchAsyncError(async (req, res, next) => {
    const getInvoiceList = await BackDatedInvoice.find();
    res.status(201).json({
      success: true,
      getInvoiceList,
    });
  })
);
router.delete(
  "/delete_invoice",
  catchAsyncError(async (req, res, next) => {
    const id = req.body._id;
    if (id) {
      await BackDatedInvoice.deleteOne({ _id: id });
      await SlabBaseMisUploadData.updateMany(
        {
          $and: [
            { Client: req?.body?.Client },
            { Location: req?.body?.Location },
            {
              Date: {
                $gte: req?.body?.from_date,
                $lte: req?.body?.to_date,
              },
            },
            { Invoice_No: { $ne: 0 } },
          ],
        },
        { $set: { Invoice_No: 0 } }
      );
      await OnCallMisUploadData.updateMany(
        {
          $and: [
            { Client: req?.body?.Client },
            { Location: req?.body?.Location },
            {
              Date: {
                $gte: req?.body?.from_date,
                $lte: req?.body?.to_date,
              },
            },
            { Invoice_No: { $ne: 0 } },
          ],
        },
        { $set: { Invoice_No: 0 } }
      );
      await TripBaseMisUploadData.updateMany(
        {
          $and: [
            { Client: req?.body?.Client },
            { Location: req?.body?.Location },
            {
              Date: {
                $gte: req?.body?.from_date,
                $lte: req?.body?.to_date,
              },
            },
            { Invoice_No: { $ne: 0 } },
          ],
        },
        { $set: { Invoice_No: 0 } }
      );
      await DayBaseMisUploadData.updateMany(
        {
          $and: [
            { Client: req?.body?.Client },
            { Location: req?.body?.Location },
            {
              Date: {
                $gte: req?.body?.from_date,
                $lte: req?.body?.to_date,
              },
            },
            { Invoice_No: { $ne: 0 } },
          ],
        },
        { $set: { Invoice_No: 0 } }
      );
      res.status(201).json({
        success: true,
        message: "invoice list deleted successfully",
      });
    } else {
      res.status(404).json({
        success: true,
        message: "We can not delete this invoice list",
      });
    }
  })
);
router.get(
  "/get_single_invoice/:id",
  catchAsyncError(async (req, res, next) => {
    const id = req.params.id;

    if (id) {
      const singleInvoice = await BackDatedInvoice.findById(id);

      res.status(201).json({
        success: true,
        singleInvoice,
        message: "Get Single Invoice successfully",
      });
    } else {
      res.status(404).json({
        success: true,
        message: "We can not get Invoice",
      });
    }
  })
);
router.delete(
  "/delete_trips_exceldata",
  catchAsyncError(async (req, res, next) => {
    const results = await SlabBaseMisUploadData.aggregate([
      {
        $unionWith: {
          coll: "on_call_mis_tables",
          coll: "trip_base_mis_tables",
          coll: "day_base_mis_tables",
        },
      },
      {
        $match: {
          $and: [
            { Client: req.body.Client },
            { Location: req.body.Location },
            {
              Date: {
                $gte: req.body.Fromdate,
                $lte: req.body.Todate,
              },
            },
            { Invoice_No: { $eq: 0 } },
          ],
        },
      },
    ]);
    console.log(results.length);
    if (results.length > 0) {
      ids = results.map(function (doc) {
        return doc._id;
      });
      if (ids.length) {
        await SlabBaseMisUploadData.deleteMany({
          _id: { $in: ids },
        });
        await OnCallMisUploadData.deleteMany({
          _id: { $in: ids },
        });
        await TripBaseMisUploadData.deleteMany({
          _id: { $in: ids },
        });
        await DayBaseMisUploadData.deleteMany({
          _id: { $in: ids },
        });
      }

      res.status(201).json({
        success: true,
        message: "deleted successfully",
      });
    } else {
      res.status(404).json({
        success: true,
        message:
          "We cann't delete because Invoice is raised for this Date or No data found on selected date",
      });
    }
  })
);
router.get(
  "/invoice_no_api",
  catchAsyncError(async (req, res, next) => {
    const getInvoiceNumber = await InvoiceNumberModel.findOne();
    res.status(201).json({
      success: true,
      getInvoiceNumber,
    });
  })
);
router.put(
  "/update_invoice_no_api",
  catchAsyncError(async (req, res, next) => {
    const update = { next_invoice_no: req.body.invoice_no };

    const updateInvoiceNumber = await InvoiceNumberModel.updateOne(update);
    res.status(201).json({
      success: true,
      updateInvoiceNumber,
    });
  })
);

module.exports = router;
