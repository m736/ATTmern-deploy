const express = require("express");
const catchAsyncError = require("../middleware/catchAsyncError");
const router = express.Router();
const sendToken = require("../utils/jwt");
const User = require("../utils/userModel");
const ErrorHandler = require("../utils/errorHandler");
const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middleware/authenticate");
router.post(
  "/register_api",
  catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;

    const user = await User.create({
      name,
      email,
      password,
    });

    sendToken(user, 201, res);
  })
);
router.post(
  "/login_api",
  catchAsyncError(async (req, res, next) => {
    console.log(req.body);
    const { email, password } = req.body.formData;

    if (!email || !password) {
      return next(new ErrorHandler("Please enter email & password", 400));
    }

    //finding the user database
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    if (!(await user.isValidPassword(password))) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    sendToken(user, 201, res);
  })
);
router.get(
  "/myprofile",
  isAuthenticatedUser,
  catchAsyncError(async (req, res, next) => {
    console.log(req.body);
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user,
    });
  })
);
router.get(
  "/logout",

  catchAsyncError(async (req, res, next) => {
    res
      .cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      })
      .status(200)
      .json({
        success: true,
        message: "Loggedout",
      });
  })
);
module.exports = router;
