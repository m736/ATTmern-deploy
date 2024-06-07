const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// =====Vehicle Model=====
const purchaseMemoSchema = new Schema(
  {
    Vehicle_No: String,
    Company_Name: Array,
    Invoice_No: Array,
    Purchase_Memo_No: Array,
    salesGross: Number,
    purchase_memo_id: String,
    Purchase_Memo_Date: String,
  },
  { strict: false, timestamps: true }
);

module.exports = {
  PurchaseMemoModel: mongoose.model("purchase_memo_table", purchaseMemoSchema),
};
