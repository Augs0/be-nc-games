const db = require('../db/connection');

const selectAllReviews = ({
  sort_by = 'created_at',
  order = 'desc',
  category,
}) => {
  let queryString = `
  SELECT * FROM reviews
  
  `;
  const paramsArr = [];
  const validSort = [
    'created_at',
    'votes',
    'title',
    'comment_count',
    'owner',
    'designer',
  ];
  const validOrder = ['asc', 'desc'];
  if (!validSort.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: 'Invalid sort query' });
  }
  if (!validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: 'Invalid order query' });
  }
  if (category) {
    queryString += `WHERE reviews.category = $1`;
    paramsArr.push(category);
  }
  queryString += ` ORDER BY ${sort_by} ${order}`;
  return db.query(queryString, paramsArr).then((result) => {
    if (result.rowCount === 0) {
      return Promise.reject({
        status: 404,
        msg: 'That category does not exist yet',
      });
    } else {
      return result.rows;
    }
  });
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
  selectAllReviews,
};
