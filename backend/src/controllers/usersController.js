const User = require("../models/User");

const getAllUsers = async (_req, res, next) => {
  try {
    const users = await User.find().select("_id name email").sort({ name: 1 });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllUsers };
