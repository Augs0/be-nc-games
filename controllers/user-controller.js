const { selectAllUsers } = require('../models/user-model');

const getAllUsers = async (req, res, next) => {
  const users = await selectAllUsers();
  res.status(200).send({ users });
};

module.exports = { getAllUsers };
