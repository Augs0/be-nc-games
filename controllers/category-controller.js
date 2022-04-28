const { selectAllCategories } = require('../models/category-model');

const getCategories = async (req, res) => {
  const categories = await selectAllCategories(req.query);

  res.send({ categories });
};

module.exports = { getCategories };
