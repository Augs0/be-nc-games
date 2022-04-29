const db = require('../db/connection');

const selectAllReviews = () => {
  return db
    .query(
      `
  SELECT * FROM reviews
  ORDER BY created_at DESC
  ;
  `
    )
    .then((result) => result.rows);
};

const selectSingleReview = (review_id) => {
  return db
    .query(
      `SELECT reviews.*, 
      COUNT(comments.comment_id) AS comment_count 
      FROM reviews 
      LEFT JOIN comments on comments.review_id = reviews.review_id 
      WHERE reviews.review_id = $1
      GROUP BY reviews.review_id;`,
      [review_id]
    )
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: 'No review found with that ID',
        });
      } else {
        return result.rows[0];
      }
    });
};

const patchSingleReview = (review_id, { inc_votes = 0 }) => {
  return db
    .query(
      `UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *;`,
      [inc_votes, review_id]
    )
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: 'No review found with that ID',
        });
      } else {
        return result.rows[0];
      }
    });
};


const selectReviewComments = (review_id) => {
  return db
    .query(
      `SELECT comment_id, votes, created_at, author, body FROM comments WHERE comments.review_id = $1`,
      [review_id]
    )
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: 'No review found with that ID',
        });
      } else {
        return result.rows;
      }
    });
};

module.exports = {
  selectSingleReview,
  patchSingleReview,
  selectReviewComments,
  selectAllReviews
};

