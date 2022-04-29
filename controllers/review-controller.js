const {
  selectSingleReview,
  patchSingleReview,

  selectReviewComments,

  selectAllReviews,

} = require('../models/review-model');

const getReviews = async (req, res, next) => {
  try {
    const reviews = await selectAllReviews(req.query);
    res.status(200).send({ reviews });
  } catch (error) {
    next(error);
  }
};

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

const getReviewComments = async (req, res, next) => {
  const { review_id } = req.params;
  try {
    const reviewComments = await selectReviewComments(review_id);
    res.status(200).send(reviewComments);
  } catch (error) {
    next(error);
  }
};


module.exports = { getSingleReview, updateSingleReview, getReviews, getReviewComments };

