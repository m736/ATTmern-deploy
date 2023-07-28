const express = require("express");
const router = express.Router();
const models = require("./../utils/models");

// Api Routes
router.use("/jokes", require("src/helpers/base.crud")(models.Vehicle));
router.use(
  "/vehicle_list",
  require("src/helpers/base.crud")(models.AddVehicle)
);
router.use(
  "/list_tarrif",
  require("src/helpers/base.crud")(models.Createtarrif)
);
router.use(
  "/delete_tarrif",
  require("src/helpers/base.crud")(models.Createtarrif)
);
router.use(
  "/update_tarrif",
  require("src/helpers/base.crud")(models.Createtarrif)
);

module.exports = router;
