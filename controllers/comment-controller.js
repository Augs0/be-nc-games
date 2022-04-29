const { insertComment } = require('../models/comment-model');

const postComment = async (req, res, next) => {
  const { review_id } = req.params;
  const { username: author, body } = req.body;

  try {
    const newComment = await insertComment(review_id, { author, body });
    res.status(201).send({ newComment });
  } catch (error) {
    next(error);
  }
};

module.exports = { postComment };
