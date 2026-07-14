const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const tokenBlackListModel = require("../models/blackList.model");
/**
 * @name registerUserController
 *  @description register a new user
 *@access Public
 */

async function registerUserController(req, res) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long" });
  }

  const emailExists = await userModel.findOne({ email });
  if (emailExists) {
    return res.status(400).json({ message: "Email already registered" });
  }

  const usernameExists = await userModel.findOne({ username });
  if (usernameExists) {
    return res.status(400).json({ message: "Username already taken" });
  }

  const hash = await bcrypt.hash(password, 10);

  const newUser = await userModel.create({
    username,
    email,
    password: hash,
  });
  const token = jwt.sign(
    { id: newUser._id, username: newUser.username },
    process.env.SECRET_KEY,
    { expiresIn: "1h" },
  );

  res.cookie("token", token);
  res.status(201).json({
    message: "User registered successfully",
    newUser: {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      token: token,
    },
  });
}

/**
 * @name loginUserController
 *  @description login a user
 *@access Public
 */

async function loginUserController(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.SECRET_KEY,
    { expiresIn: "1h" },
  );
  res.cookie("token", token);
  res.status(200).json({
    message: "Login successful",
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      token: token,
    },
  });
}

/**
 * @name logoutUserController
 * @description logout a user
 * @access Public
 */

async function logoutUserController(req, res) {
  const token = req.cookies.token;
  if (token) {
    await tokenBlackListModel.create({ token });
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
  } else {
    res.status(400).json({ message: "No token found" });
  }

  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
}

/**
 * @name getMeController
 * @description get current user
 * @access Private
 */

async function getMeController(req, res) {
  const user = await userModel.findById(req.user.id);

  res.status(200).json({
    message: "User fetched successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

module.exports = {
  registerUserController,
  loginUserController,
  getMeController,
  logoutUserController,
};
