const {
  selectSingleReview,
  patchSingleReview,
} = require('../models/review-model');

const getSingleReview = async (req, res, next) => {
  const { review_id } = req.params;
  try {
    const review = await selectSingleReview(review_id);
    res.status(200).send(review);
  } catch (error) {
    next(error);
  }
};

const updateSingleReview = async (req, res, next) => {
  const { review_id } = req.params;
  const inc_votes = req.body;
  try {
    const review = await patchSingleReview(review_id, inc_votes);
    res.status(200).send({ review });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSingleReview, updateSingleReview };
