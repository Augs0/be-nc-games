const { selectSingleReview } = require('../models/review-model');

const getSingleReview = async (req, res, next) => {
  const { review_id } = req.params;
  try {
    const review = await selectSingleReview(review_id);
    res.status(200).send(review);
  } catch (error) {
    next(error);
  }
};

module.exports = { getSingleReview };
