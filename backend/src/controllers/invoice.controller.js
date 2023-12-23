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
  ClientMasterModel,
  MyModel,
} = require("../utils/models");
// Invoice Generate
router.post(
  "/backdated_invoice",

  catchAsyncError(async (req, res, next) => {
    let last_invoice_number = req.body.invoiceNum;
    let clientDetails = req.body.Client;
    let clientLocationDetails = req.body.Location;
    // console.log(clientLocationDetails);
    const findClientDetails = await ClientMasterModel.findOne({
      Company_Name: clientDetails,
    });
    let findClientLocationDetails = findClientDetails?.Location?.filter(
      (loc) => {
        return loc?.Client_Location == clientLocationDetails;
      }
    );
    console.log(findClientLocationDetails);
    let resultArray = [];
    // if (findInvoiceNo) {
    //   last_invoice_number = Number(findInvoiceNo?.next_invoice_no);
    // }

    // const results = await SlabBaseMisUploadData.aggregate([
    //   {
    //     $unionWith: {
    //       coll: "on_call_mis_tables",
    //       coll: "trip_base_mis_tables",
    //       coll: "day_base_mis_tables",
    //     },
    //   },

    //   {
    //     $project: {
    //       Client: 1,
    //       Location: 1,
    //       Date: 1,
    //       Sales_Nett: 1,
    //       Invoice_No: 1,
    //     },
    //   },
    //   {
    //     $match: {
    //       $and: [
    //         { Client: req.body.Client },
    //         { Location: req.body.Location },
    //         {
    //           Date: {
    //             $gte: req.body.Fromdate,
    //             $lte: req.body.Todate,
    //           },
    //         },
    //         { Invoice_No: { $eq: 0 } },
    //       ],
    //     },
    //   },
    //   { $sort: { Date: 1 } },
    //   {
    //     $group: {
    //       _id: null,
    //       salesTotalAmount: { $sum: "$Sales_Nett" },
    //       updated_date: { $first: "$Date" },
    //     },
    //   },
    //   {
    //     $project: {
    //       _id: 0,
    //     },
    //   },
    //   {
    //     $addFields: {
    //       Client: req.body.Client,
    //       Location: req.body.Location,
    //       Invoice_No: last_invoice_number,
    //       Invoice_Date: req.body.invoiceDate,
    //       from_date: req.body.Fromdate,
    //       to_date: req.body.Todate,
    //       trips_between: `${req.body.updated_date} - ${req.body.Todate}`,
    //     },
    //   },
    // ]);
    const slabResults = await SlabBaseMisUploadData.aggregate([
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
    ]);
    const tripResults = await OnCallMisUploadData.aggregate([
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
    ]);
    const oncallResults = await TripBaseMisUploadData.aggregate([
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
    ]);
    const dayResults = await DayBaseMisUploadData.aggregate([
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
    ]);
    // console.log(slabResults[0]);
    // console.log(tripResults[0]);
    // console.log(oncallResults[0]);
    // console.log(dayResults[0]);

    if (slabResults[0]) {
      resultArray.push(slabResults[0]);
    }
    if (tripResults[0]) {
      resultArray.push(tripResults[0]);
    }
    if (oncallResults[0]) {
      resultArray.push(oncallResults[0]);
    }
    if (dayResults[0]) {
      resultArray.push(dayResults[0]);
    }

    if (resultArray.length > 0) {
      var sum = resultArray.reduce(function (acc, val) {
        return acc + val["salesTotalAmount"];
      }, 0);
      let allCategory = {
        salesTotalAmount: sum,
        Client: req.body.Client,
        Address: findClientDetails?.Address,
        City: findClientDetails?.City,
        Pincode: findClientDetails?.Pincode,
        Locdetail: findClientLocationDetails[0],
        Location: req.body.Location,
        Invoice_No: last_invoice_number,
        Invoice_Date: req.body.invoiceDate,
        from_date: req.body.Fromdate,
        to_date: req.body.Todate,
        tripsBetween: `${req.body.Fromdate}-${req.body.Todate}`,
      };
      console.log(allCategory);
      const backdatedInvoiceInput = await BackDatedInvoice.create(allCategory);
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
// Merge Invoice Generate
router.post(
  "/merge_invoice_api",

  catchAsyncError(async (req, res, next) => {
    let last_invoice_number = req.body.invoiceNum;
    let clientDetails = req.body?.MGIInputArr[0]?.selectedClient;
    let mergeLocArr = [];
    let mergerentalTypeArr = [];
    let clientLocationDetails =
      req.body?.MGIInputArr[0]?.selectedClientLocation;

    // req.body?.MGIInputArr.forEach((item) => {
    //   if (item?.selectedClientLocation) {
    //     mergeLocArr.push(item?.selectedClientLocation);
    //   }
    //   if (item?.selectedRentalType) {
    //     mergerentalTypeArr.push(item?.selectedRentalType);
    //   }
    // });
    const result = [];
    const levels = { result };
    const keys = ["selectedClientLocation", "selectedRentalType"];

    req.body?.MGIInputArr.forEach((o) => {
      keys.reduce((r, k, i, a) => {
        const label = o[k];

        if (!r[label]) {
          const value = { label };

          if (a[i + 1]) {
            r[label] = { result: [] };

            value.children = r[label].result;
          }

          r.result.push(value);
        }

        return r[label];
      }, levels);
    });

    console.log(result);
    // function removeDuplicateValue(data) {
    //   return [...new Set(data)];
    // }

    // console.log(clientLocationDetails);
    const findClientDetails = await ClientMasterModel.findOne({
      Company_Name: clientDetails,
    });
    let findClientLocationDetails = findClientDetails?.Location?.filter(
      (loc) => {
        return loc?.Client_Location == clientLocationDetails;
      }
    );
    // console.log(findClientLocationDetails);
    let resultArray = [];
    // console.log(req.body);
    if (req?.body?.MGIInputArr.length) {
      for await (const body of req?.body?.MGIInputArr) {
        const slabResults = await SlabBaseMisUploadData.aggregate([
          {
            $match: {
              $and: [
                { Client: body.selectedClient },
                { Location: body.selectedClientLocation },
                { Rental: body?.selectedRentalType },
                {
                  Date: {
                    $gte: body.selectedFromAndToDate[0],
                    $lte: body.selectedFromAndToDate[1],
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
        ]);
        const tripResults = await OnCallMisUploadData.aggregate([
          {
            $match: {
              $and: [
                { Client: body.selectedClient },
                { Location: body.selectedClientLocation },
                { Rental: body?.selectedRentalType },
                {
                  Date: {
                    $gte: body.selectedFromAndToDate[0],
                    $lte: body.selectedFromAndToDate[1],
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
        ]);
        const oncallResults = await TripBaseMisUploadData.aggregate([
          {
            $match: {
              $and: [
                { Client: body.selectedClient },
                { Location: body.selectedClientLocation },
                { Rental: body?.selectedRentalType },
                {
                  Date: {
                    $gte: body.selectedFromAndToDate[0],
                    $lte: body.selectedFromAndToDate[1],
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
        ]);
        const dayResults = await DayBaseMisUploadData.aggregate([
          {
            $match: {
              $and: [
                { Client: body.selectedClient },
                { Location: body.selectedClientLocation },
                { Rental: body?.selectedRentalType },
                {
                  Date: {
                    $gte: body.selectedFromAndToDate[0],
                    $lte: body.selectedFromAndToDate[1],
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
        ]);
        if (slabResults[0]) {
          resultArray.push(slabResults[0]);
        }
        if (tripResults[0]) {
          resultArray.push(tripResults[0]);
        }
        if (oncallResults[0]) {
          resultArray.push(oncallResults[0]);
        }
        resultArray;
        if (dayResults[0]) {
          resultArray.push(dayResults[0]);
        }
      }
    }

    if (resultArray.length) {
      var sum = resultArray.reduce(function (acc, val) {
        return acc + val["salesTotalAmount"];
      }, 0);

      let allCategory = {
        // rentalArrMerge: removeDuplicateValue(mergerentalTypeArr),
        // locArrMerge: removeDuplicateValue(mergeLocArr),
        results: result,
        salesTotalAmount: sum,
        Client: req.body?.MGIInputArr[0]?.selectedClient,
        Address: findClientDetails?.Address,
        City: findClientDetails?.City,
        Pincode: findClientDetails?.Pincode,
        Locdetail: findClientLocationDetails[0],
        Location: req.body?.MGIInputArr[0]?.selectedClientLocation,
        Invoice_No: last_invoice_number,
        Invoice_Date: req.body.invoiceDate,
        from_date: req.body?.MGIInputArr[0]?.selectedFromAndToDate[0],
        to_date: req.body?.MGIInputArr[0]?.selectedFromAndToDate[1],
        tripsBetween: `${req.body?.MGIInputArr[0]?.selectedFromAndToDate[0]}-${req.body?.MGIInputArr[0]?.selectedFromAndToDate[1]}`,
      };
      console.log(allCategory);
      const backdatedInvoiceInput = await BackDatedInvoice.create(allCategory);
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
        for await (const body of req?.body?.MGIInputArr) {
          await SlabBaseMisUploadData.updateMany(
            {
              $and: [
                { Client: body.selectedClient },
                { Location: body.selectedClientLocation },
                { Rental: body?.selectedRentalType },
                {
                  Date: {
                    $gte: body.selectedFromAndToDate[0],
                    $lte: body.selectedFromAndToDate[1],
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
                { Client: body.selectedClient },
                { Location: body.selectedClientLocation },
                { Rental: body?.selectedRentalType },
                {
                  Date: {
                    $gte: body.selectedFromAndToDate[0],
                    $lte: body.selectedFromAndToDate[1],
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
                { Client: body.selectedClient },
                { Location: body.selectedClientLocation },
                { Rental: body?.selectedRentalType },
                {
                  Date: {
                    $gte: body.selectedFromAndToDate[0],
                    $lte: body.selectedFromAndToDate[1],
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
                { Client: body.selectedClient },
                { Location: body.selectedClientLocation },
                { Rental: body?.selectedRentalType },
                {
                  Date: {
                    $gte: body.selectedFromAndToDate[0],
                    $lte: body.selectedFromAndToDate[1],
                  },
                },
                { Invoice_No: { $eq: 0 } },
              ],
            },
            { $set: { Invoice_No: last_invoice_number } }
          );
        }
      }
    } else {
      res.status(404).json({
        success: true,
        message: "Data Not found",
      });
    }
  })
);
// Invoice list api
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
// delete Invoice Api
router.delete(
  "/delete_invoice",
  catchAsyncError(async (req, res, next) => {
    console.log(req?.body);
    const id = req.body._id;
    console.log(id);
    if (id) {
      if (req?.body?.results > 0) {
        req?.body?.results.map(async (loc) => {
          const LocationType = loc?.label;
          loc?.children?.map(async (rental) => {
            const rentalType = rental?.label;
            await BackDatedInvoice.deleteOne({ _id: id });
            await OnCallMisUploadData.updateMany(
              {
                $and: [
                  { Client: req?.body?.Client },
                  { Location: LocationType },
                  { Rental: rentalType },
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
                  { Location: LocationType },
                  { Rental: rentalType },
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
            await SlabBaseMisUploadData.updateMany(
              {
                $and: [
                  { Client: req?.body?.Client },
                  { Location: LocationType },
                  { Rental: rentalType },
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
                  { Location: LocationType },
                  { Rental: rentalType },
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
          });
        });
      } else {
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
      }
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
// get Single Invoice
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
// delete Excel Data
router.delete(
  "/delete_trips_exceldata",
  catchAsyncError(async (req, res, next) => {
    console.log(req.body);
    let resultArray = [];
    const slabResults = await SlabBaseMisUploadData.aggregate([
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
    ]);
    const tripResults = await OnCallMisUploadData.aggregate([
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
    ]);
    const oncallResults = await TripBaseMisUploadData.aggregate([
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
    ]);
    const dayResults = await DayBaseMisUploadData.aggregate([
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
    ]);
    console.log(slabResults?.length);
    console.log(tripResults?.length);
    console.log(oncallResults?.length);
    console.log(dayResults?.length);
    if (slabResults?.length) {
      resultArray.push(...slabResults);
    }
    if (tripResults?.length) {
      resultArray.push(...tripResults);
    }
    if (oncallResults?.length) {
      resultArray.push(...oncallResults);
    }
    if (dayResults?.length) {
      resultArray.push(...dayResults);
    }
    console.log(resultArray?.length);
    if (resultArray.length > 0) {
      ids = resultArray.map(function (doc) {
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
// get Invoice Number
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
// update Invoice Number
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
