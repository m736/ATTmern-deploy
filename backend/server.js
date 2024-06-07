require("rootpath")();
const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "config/config.env") });

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

// // Custom Imports
const errorHandler = require("src/middleware/error-handler");

// // Initial Config
const app = express();
const port = process.env.SERVER_PORT;
// // Middleware
app.use(
  bodyParser.json({
    limit: "50mb",
  })
);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// allow cors requests from any origin and with credentials
app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  })
);

// // Database configuration
require("src/utils/database");

// // Api Routes
app.get("/", (req, res) => res.json("Server working..."));
app.use("/api/v1", require("src/helpers/router"));
app.use(
  "/api/v1/induction",
  require("src/controllers/induction.controller.js")
);
app.use(
  "/api/v1/client",
  require("src/clientcontrollers/client.basecrud.controller")
);
app.use(
  "/api/v1/owners",
  require("src/clientcontrollers/owner.basecrud.controller")
);
app.use(
  "/api/v1/agencies",
  require("src/clientcontrollers/agency.basecrud.controller")
);
app.use(
  "/api/v1/drivers",
  require("src/clientcontrollers/driver.basecrud.controller")
);
app.use("/auth", require("src/controllers/auth.controller"));
app.use(
  "/api/v1/site_mis",
  require("src/sitemiscontrollers/site.mis.controller")
);
app.use("/api/v1/purchase", require("src/controllers/purchasememo.controller"));
app.use("/invoice", require("src/controllers/invoice.controller"));
app.use("/api/v1/tripsheet_entry", require("src/helpers/router"));
app.use("/bulk", require("src/controllers/bulk.controller"));
app.use("/oncall_bulk", require("src/controllers/oncallbulk.controller"));
app.use("/slabmis_bulk", require("src/controllers/slabmis.controller"));
app.use("/tripmis_bulk", require("src/controllers/tripmis.controller"));
app.use("/daymis_bulk", require("src/controllers/daymis.controller"));
app.use("/tarrifexcel_bulk", require("src/controllers/tarrifbulk.controller"));
app.use("/vehicle", require("src/controllers/vehicle.controller"));
app.use("/tarrif", require("src/controllers/tarrif.controller"));

app.get("*", (req, res) => res.status(404).json("API route not found"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build/index.html"));
  });
}

// // Global error handler
app.use(errorHandler);

// Start server
app.listen(port, () => console.log(`Server listening on port ${port}`));
