const express = require("express");
const router = express.Router();
const models = require("./../utils/models");

// Api Routes
router.use("/jokes", require("src/helpers/base.crud")(models.Vehicle));
router.use(
  "/vehicle_list",
  require("src/helpers/base.crud")(models.AddVehicle)
);
router.use("/books", require("src/helpers/base.crud")(models.Book));
// router.use("/accounts", require("src/collections/account/account.controller"));

module.exports = router;
