const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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

  const isUserAlreadyExist = await userModel.findOne({
    $or: [{ email }, { username }],
  });
  if (isUserAlreadyExist) {
    return res.status(400).json({ message: "User already exists" });
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
  res
    .status(200)
    .json({
      message: "Login successful",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        token: token,
      },
    });
}

module.exports = { registerUserController, loginUserController };
