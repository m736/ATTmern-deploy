const express = require("express");
const router = express.Router();
const models = require("./../utils/models");
const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middleware/authenticate");
// Api Routes
router.use("/jokes", require("src/helpers/base.crud")(models.Vehicle));
router.use(
  "/invoice_no_api",
  require("src/helpers/base.crud")(models.InvoiceNumberModel)
);
// router.use(
//   "/invoice_list_api",
//   require("src/helpers/base.crud")(models.BackDatedInvoice)
// );
router.use(
  "/area_list_api",
  isAuthenticatedUser,
  // authorizeRoles("user"),
  require("src/helpers/base.crud")(models.AreaListModel)
);
router.use(
  "/vehicle_type_api",
  require("src/helpers/base.crud")(models.VehicleTypeModel)
);
router.use(
  "/oncall_mis_data",
  require("src/helpers/base.crud")(models.OnCallMisUploadData)
);
router.use(
  "/slabbase_mis_data",
  require("src/helpers/base.crud")(models.SlabBaseMisUploadData)
);
router.use(
  "/get_site_slabbase_mis_data_api",
  require("src/helpers/base.crud")(models.SiteSlabBaseMisUploadModel)
);
router.use(
  "/get_site_oncallbase_mis_data_api",
  require("src/helpers/base.crud")(models.SiteOnCallBaseMisUploadModel)
);
router.use(
  "/get_site_tripbase_mis_data_api",
  require("src/helpers/base.crud")(models.SiteTripBaseMisUploadModel)
);
router.use(
  "/get_site_daybase_mis_data_api",
  require("src/helpers/base.crud")(models.SiteDayBaseMisUploadModel)
);
router.use(
  "/tripbase_mis_data",
  require("src/helpers/base.crud")(models.TripBaseMisUploadData)
);
router.use(
  "/daybase_mis_data",
  require("src/helpers/base.crud")(models.DayBaseMisUploadData)
);
router.use(
  "/vehicle_list",
  require("src/helpers/base.crud")(models.AddVehicle)
);
// router.use(
//   "/list_tarrif",
//   require("src/helpers/base.crud")(models.Createtarrif)
// );
router.use(
  "/delete_tarrif",
  require("src/helpers/base.crud")(models.Createtarrif)
);
router.use(
  "/update_tarrif",
  require("src/helpers/base.crud")(models.Createtarrif)
);
router.use(
  "/create_new_tripsheet_entry",
  require("src/helpers/base.crud")(models.NewTripSheetEntry)
);
router.use(
  "/get_tripsheet_list",
  require("src/helpers/base.crud")(models.NewTripSheetEntry)
);

module.exports = router;
