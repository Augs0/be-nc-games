const { selectAllCategories } = require('../models/category-model');

const getCategories = async (req, res, next) => {
  try {
    const categories = await selectAllCategories(req.query);
    res.status(200).send({ categories });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories };
