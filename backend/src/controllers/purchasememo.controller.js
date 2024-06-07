const express = require("express");
const router = express.Router();
const catchAsyncError = require("../middleware/catchAsyncError");
const {
  DayBaseMisUploadData,
  OnCallMisUploadData,
  SlabBaseMisUploadData,
  TripBaseMisUploadData,
} = require("../utils/models");
const { PurchaseMemoModel } = require("../utils/purchaseMemoModel");
const { VehicleList } = require("../utils/inductionModel");
const purchaseMemoModel = require("../utils/purchaseMemoModel");
router.post(
  "/create_purchase_memo_api",

  catchAsyncError(async (req, res, next) => {
    let findAllMisData = [];
    const onCallResults = await OnCallMisUploadData.aggregate([
      {
        $match: {
          $and: [
            {
              Date: {
                $gte: req.body.startDate,
                $lte: req.body.endDate,
              },
            },
            //   { Invoice_No: { $ne: 0 } },
          ],
        },
      },
    ]);
    const slabResults = await SlabBaseMisUploadData.aggregate([
      {
        $match: {
          $and: [
            {
              Date: {
                $gte: req.body.startDate,
                $lte: req.body.endDate,
              },
            },
            //   { Invoice_No: { $ne: 0 } },
          ],
        },
      },
    ]);
    const tripResults = await TripBaseMisUploadData.aggregate([
      {
        $match: {
          $and: [
            {
              Date: {
                $gte: req.body.startDate,
                $lte: req.body.endDate,
              },
            },
            //   { Invoice_No: { $ne: 0 } },
          ],
        },
      },
    ]);
    const dayResults = await DayBaseMisUploadData.aggregate([
      {
        $match: {
          $and: [
            {
              Date: {
                $gte: req.body.startDate,
                $lte: req.body.endDate,
              },
            },
            //   { Invoice_No: { $ne: 0 } },
          ],
        },
      },
    ]);

    if (onCallResults) {
      findAllMisData.push(...onCallResults);
    } else if (slabResults) {
      findAllMisData.push(...slabResults);
    } else if (tripResults) {
      findAllMisData.push(...tripResults);
    } else if (dayResults) {
      findAllMisData.push(...dayResults);
    }
    console.log("console.log 1");
    if (findAllMisData.length > 0) {
      const aggregate = (arr, on, who, price, inNum, memoNum) => {
        // using reduce() method to aggregate
        //   console.log(arr)
        const agg = arr.reduce((a, b) => {
          // get the value of both the keys

          const onValue = b[on];
          const whoValue = b[who];
          const inNo = b[inNum];
          const memoNo = b[memoNum];
          let priceValue = b[price];
          // console.log(`${onValue}-${whoValue}-${priceValue}`)
          // if there is already a key present
          // merge its value

          if (a[onValue]) {
            a[onValue] = {
              [on]: onValue,
              [who]: [...a[onValue][who], whoValue],
              [inNum]: [...a[onValue][inNum], inNo],
              [memoNum]: [...a[onValue][memoNum], memoNo],
              [price]: a[onValue][price] + priceValue,
            };
          }
          // create a new entry on the key
          else {
            a[onValue] = {
              [on]: onValue,
              [who]: [whoValue],
              [price]: priceValue,
              [inNum]: [inNo],
              [memoNum]: [memoNo],
            };
          }

          // return the aggregation
          return a;
        }, {});
        //   console.log(agg)

        // return only values after aggregation
        return Object.values(agg);
      };
      // console.log(aggregate(results, "Vehicle_No", "Company_Name", "salesGross"));
      const purchaseMemoList = aggregate(
        findAllMisData,
        "Vehicle_No",
        "Company_Name",
        "Purchase_Nett",
        "Invoice_No",
        "Purchase_Memo_No"
      );

      const randId = (size) => {
        const nums = Array.from({ length: 10 }, (_, i) =>
          String.fromCharCode("0".charCodeAt(0) + i)
        );
        const alphabets = Array.from({ length: 26 }, (_, i) =>
          String.fromCharCode("a".charCodeAt(0) + i)
        );
        const chars = [...nums, ...alphabets];
        const rand = (length) => Math.floor(Math.random() * length);
        return Array.from(
          { length: size },
          () => chars[rand(chars.length)]
        ).join("");
      };

      let proMemoUniqueId = [];
      await Promise.all(
        purchaseMemoList.map(async (value) => {
          const vehicleDetails = await VehicleList.findOne({
            vehicle_regnumber: value.Vehicle_No,
          }).exec();
          proMemoUniqueId.push({
            ...value,
            purchase_memo_id: randId(6),
            Purchase_Memo_Date: req.body.purchase_memo_date,
            vehicleDetails: vehicleDetails,
          });
        })
      );

      console.log("console 2");
      let invoiceNumNotEqualZeros = proMemoUniqueId?.filter(
        (proMemoUniqueId) => {
          return proMemoUniqueId?.Invoice_No?.every((item) => {
            return item !== 0;
          });
        }
      );

      console.log("console 3");
      let mempNumNoAllZeros = proMemoUniqueId?.filter((proMemoUniqueId) => {
        return proMemoUniqueId?.Purchase_Memo_No?.every((item) => {
          return item === "0";
        });
      });
      console.log(mempNumNoAllZeros);
      console.log("console 4");
      if (invoiceNumNotEqualZeros.length > 0) {
        console.log("console 5");
        if (mempNumNoAllZeros.length > 0) {
          console.log("console 6");
          const createPurchaseMemo = await PurchaseMemoModel.create(
            mempNumNoAllZeros
          );
          res.status(201).json({
            success: true,
            createPurchaseMemo,
          });
          if (createPurchaseMemo) {
            console.log("console 7");

            Promise.all(
              mempNumNoAllZeros.map(async (item) => {
                await OnCallMisUploadData.updateMany(
                  {
                    $and: [
                      { Vehicle_No: item.Vehicle_No },
                      {
                        Date: {
                          $gte: req.body.startDate,
                          $lte: req.body.endDate,
                        },
                      },
                      { Purchase_Memo_No: { $eq: "0" } },
                    ],
                  },
                  { $set: { Purchase_Memo_No: item.purchase_memo_id } }
                );
              })
            );
          }
        } else {
          res.status(404).json({
            success: true,
            message:
              "You Cann't Create Purchase Memo Because already raised purchase memo For This Particular Date",
          });
        }
      } else {
        res.status(404).json({
          success: true,
          message:
            "You Cann't Create Purchase Memo Because Your not raised Invoice For This Particular Date",
        });
      }
    } else {
      res.status(404).json({
        success: true,
        message: "No Data Found",
      });
    }
  })
);
router.get(
  "/get_purchase_memo_list",
  catchAsyncError(async (req, res, next) => {
    const getPurchaseMemoList = await PurchaseMemoModel.find();
    res.status(201).json({
      success: true,
      getPurchaseMemoList,
    });
  })
);
router.delete(
  "/delete_purchase_memo_list",
  catchAsyncError(async (req, res, next) => {
    console.log(req.body);
    const id = req.body._id;

    if (id) {
      await PurchaseMemoModel.findByIdAndDelete(id);

      await SlabBaseMisUploadData.updateMany(
        {
          $and: [
            { Vehicle_No: { $eq: req.body.Vehicle_No } },
            { Purchase_Memo_No: { $eq: req.body.purchase_memo_id } },
          ],
        },
        { $set: { Purchase_Memo_No: "0" } }
      );
      await OnCallMisUploadData.updateMany(
        {
          $and: [
            { Vehicle_No: { $eq: req.body.Vehicle_No } },
            { Purchase_Memo_No: { $eq: req.body.purchase_memo_id } },
          ],
        },
        { $set: { Purchase_Memo_No: "0" } }
      );
      await TripBaseMisUploadData.updateMany(
        {
          $and: [
            { Vehicle_No: { $eq: req.body.Vehicle_No } },
            { Purchase_Memo_No: { $eq: req.body.purchase_memo_id } },
          ],
        },
        { $set: { Purchase_Memo_No: "0" } }
      );
      await DayBaseMisUploadData.updateMany(
        {
          $and: [
            { Vehicle_No: { $eq: req.body.Vehicle_No } },
            { Purchase_Memo_No: { $eq: req.body.purchase_memo_id } },
          ],
        },
        { $set: { Purchase_Memo_No: "0" } }
      );
      res.status(201).json({
        success: true,
        message: "invoice list deleted successfully",
      });
    }
  })
);
router.get(
  "/get_single_purchase_memo/:id",
  catchAsyncError(async (req, res, next) => {
    const id = req.params.id;

    if (id) {
      const singlePurchase = await PurchaseMemoModel.findById(id);

      res.status(201).json({
        success: true,
        singlePurchase,
        message: "Get single Purchase successfully",
      });
    } else {
      res.status(404).json({
        success: true,
        message: "We can not get Purchase",
      });
    }
  })
);
module.exports = router;
