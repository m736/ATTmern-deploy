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
const corsOptions = {
  origin: "http://localhost:3000", // frontend URI (ReactJS)
};
app.use(cors(corsOptions));

// // Database configuration
require("src/utils/database");

// // Api Routes
app.get("/", (req, res) => res.json("Server working..."));
app.use("/api/v1", require("src/helpers/router"));
app.use("/bulk", require("src/controllers/bulk.controller"));

app.use("/vehicle", require("src/controllers/vehicle.controller"));
app.get("*", (req, res) => res.status(404).json("API route not found"));

// // Global error handler
app.use(errorHandler);

// Start server
app.listen(port, () => console.log(`Server listening on port ${port}`));
