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
    let last_invoice_number;
    let next_invoice_number;

    const findInvoiceNo = await InvoiceNumberModel.findOne();

    if (findInvoiceNo) {
      last_invoice_number = Number(findInvoiceNo?.next_invoice_no);
    }

    const results = await SlabBaseMisUploadData.aggregate([
      { $unionWith: { coll: "on_call_mis_tables" } },
      {
        $project: {
          client: 1,
          location: 1,
          date: 1,
          salesNett: 1,
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
      { $sort: { date: 1 } },
      {
        $group: {
          _id: null,
          salesTotalAmount: { $sum: "$salesNett" },
          updated_date: { $first: "$date" },
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
          invoice_no: last_invoice_number,
          from_date: req.body.Fromdate,
          to_date: req.body.Todate,
          trips_between: `${req.body.Fromdate} - ${req.body.Todate}`,
        },
      },
    ]);

    if (results.length) {
      if (findInvoiceNo) {
        last_invoice_number = Number(findInvoiceNo?.next_invoice_no);
        next_invoice_number = Number(findInvoiceNo?.next_invoice_no) + 1;
        const update = {
          last_invoice_no: last_invoice_number,
          next_invoice_no: next_invoice_number,
        };

        await InvoiceNumberModel.updateOne(update);
      }

      // const findDuplicateInvoiceNo = await BackDatedInvoice.findOne(
      //   { $expr: { $eq: ["$invoice_no", "$$targetNo"] } },
      //   { _id: 0 },
      //   { let: { targetNo: next_invoice_number } }
      // );

      const backdatedInvoiceInput = await BackDatedInvoice.create(results);

      await SlabBaseMisUploadData.updateMany(
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
        { $set: { Invoice_No: last_invoice_number } }
      );
      await OnCallMisUploadData.updateMany(
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
        { $set: { Invoice_No: last_invoice_number } }
      );

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
router.post(
  "/merge_invoice_api",

  catchAsyncError(async (req, res, next) => {
    let last_invoice_number;
    let next_invoice_number;

    const findInvoiceNo = await InvoiceNumberModel.findOne();

    if (findInvoiceNo) {
      last_invoice_number = Number(findInvoiceNo?.next_invoice_no);
    }
    let resultArray = [];
    if (req.body.length) {
      for await (const body of req.body) {
        const results = await SlabBaseMisUploadData.aggregate([
          { $unionWith: { coll: "on_call_mis_tables" } },
          {
            $project: {
              client: 1,
              location: 1,
              date: 1,
              salesNett: 1,
              Invoice_No: 1,
            },
          },
          {
            $match: {
              $and: [
                { client: body.selectedClient },
                { location: body.selectedClientLocation },
                {
                  date: {
                    $gte: body.selectedFromAndToDate[0],
                    $lte: body.selectedFromAndToDate[1],
                  },
                },
                { Invoice_No: { $eq: 0 } },
              ],
            },
          },
          { $sort: { date: 1 } },
          {
            $group: {
              _id: null,
              salesTotalAmount: { $sum: "$salesNett" },
              updated_date: { $first: "$date" },
            },
          },
          {
            $project: {
              _id: 0,
            },
          },
          {
            $addFields: {
              client: body.selectedClient,
              location: body.selectedClientLocation,
              invoice_no: last_invoice_number,
              from_date: body.selectedFromAndToDate[0],
              to_date: body.selectedFromAndToDate[1],
              trips_between: `${body.selectedFromAndToDate[0]} - ${body.selectedFromAndToDate[1]}`,
            },
          },
        ]);
        // console.log(results);
        if (results.length) {
          // if (findInvoiceNo) {
          //   last_invoice_number = Number(findInvoiceNo?.next_invoice_no);
          //   next_invoice_number = Number(findInvoiceNo?.next_invoice_no) + 1;
          //   const update = {
          //     last_invoice_no: last_invoice_number,
          //     next_invoice_no: next_invoice_number,
          //   };

          //   await InvoiceNumberModel.updateOne(update);
          // }
          resultArray.push(results[0]);

          // await SlabBaseMisUploadData.updateMany(
          //   {
          //     $and: [
          //       { client: body.selectedClient },
          //       { location: body.selectedClientLocation },
          //       {
          //         date: {
          //           $gte: body.selectedFromAndToDate[0],
          //           $lte: body.selectedFromAndToDate[1],
          //         },
          //       },
          //       { Invoice_No: { $eq: 0 } },
          //     ],
          //   },
          //   { $set: { Invoice_No: last_invoice_number } }
          // );
          // await OnCallMisUploadData.updateMany(
          //   {
          //     $and: [
          //       { client: body.selectedClient },
          //       { location: body.selectedClientLocation },
          //       {
          //         date: {
          //           $gte: body.selectedFromAndToDate[0],
          //           $lte: body.selectedFromAndToDate[1],
          //         },
          //       },
          //       { Invoice_No: { $eq: 0 } },
          //     ],
          //   },
          //   { $set: { Invoice_No: last_invoice_number } }
          // );
        }
      }
    }

    var categories = [];
    if (resultArray.length) {
      // console.log(resultArray);

      var client = resultArray.map(function (data) {
        console.log(data.client);
        const dataClient = data.client;
        return dataClient;
      });
      var sum = resultArray.reduce(function (acc, val) {
        console.log(acc, val["salesTotalAmount"]);
        return acc + val["salesTotalAmount"];
      }, 0);
      // console.log(sum);
      var allCategory = {
        salesTotalAmount: sum,
        client: client,
      };
      console.log(allCategory);
      // resultArray.unshift(allCategory);
      // callback(resultArray);
      // console.log("resultArray");
      // console.log(resultArray);

      // const mergeInvoiceInput = await BackDatedInvoice.create(resultArray);
      // console.log(mergeInvoiceInput);
      res.status(201).json({
        success: true,
        mergeInvoiceInput,
      });
    } else {
      res.status(404).json({
        success: true,
        message: "Data Not found",
      });
    }
  })
);
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
            { client: req?.body?.client },
            { location: req?.body?.location },
            {
              date: {
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
            { client: req?.body?.client },
            { location: req?.body?.location },
            {
              date: {
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
        message: "deleted successfully",
      });
    } else {
      res.status(404).json({
        success: true,
        message: "We can not delete this invoice list",
      });
    }

    // await BackDatedInvoice.findById(id, async function (err, docs) {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     const checking = await BackDatedInvoice.deleteOne({ _id: id });
    //     console.log(checking);

    //     const slabBaseResponse = await SlabBaseMisUploadData.updateMany(
    //       {
    //         $and: [
    //           { client: docs?.client },
    //           { location: docs?.location },
    //           {
    //             date: {
    //               $gte: docs?.from_date,
    //               $lte: docs?.to_date,
    //             },
    //           },
    //           { Invoice_No: { $ne: 0 } },
    //         ],
    //       },
    //       { $set: { Invoice_No: 0 } }
    //     );
    //     const onCallResponse = await OnCallMisUploadData.updateMany(
    //       {
    //         $and: [
    //           { client: docs?.client },
    //           { location: docs?.location },
    //           {
    //             date: {
    //               $gte: docs?.from_date,
    //               $lte: docs?.to_date,
    //             },
    //           },
    //           { Invoice_No: { $ne: 0 } },
    //         ],
    //       },
    //       { $set: { Invoice_No: 0 } }
    //     );
    //   }
    // });
  })
);
router.delete(
  "/delete_trips_exceldata",
  catchAsyncError(async (req, res, next) => {
    const results = await SlabBaseMisUploadData.aggregate([
      { $unionWith: { coll: "on_call_mis_tables" } },
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
    ]);
    if (results.length) {
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
      }

      res.status(201).json({
        success: true,
        message: "deleted successfully",
      });
    } else {
      res.status(404).json({
        success: true,
        message:
          "We can not delete why because invoice is raised already for this date",
      });
    }
  })
);
router.get(
  "/invoice_no_api",
  catchAsyncError(async (req, res, next) => {
    const getInvoiceNumber = await InvoiceNumberModel.find();
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
