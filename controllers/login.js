const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(201).json({ status: false, message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(201)
        .json({ status: false, message: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    if (user.role === "user") {
      return res.status(201).send({
        success: false,
        message: "Admin only",
      });
    }

    res.json({ status: true, message: "Login Successfully", token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "Server Error" });
  }
};
exports.userLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(201).json({ status: false, message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(201)
        .json({ status: false, message: "Invalid credentials" });
    }
    const token = user.generateToken();;

    if (user.role !== "user") {
      return res.status(201).send({
        success: false,
        message: "Admin not allowed",
      });
    }

    res.json({ status: true, message: "Login Successfully", token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "Server Error" });
  }
};

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(201).send({
        success: false,
        message: "Please Provide All Fields",
      });
    }

    const exisitingUSer = await User.findOne({ username });

    if (exisitingUSer) {
      return res.status(201).send({
        success: false,
        message: "username already taken",
      });
    }
    const user = await User.create({
      username,
      password
    });
    res.status(201).send({
      success: true,
      message: "Registeration Success, please login",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Register API",
      error,
    });
  }
};

