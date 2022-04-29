const db = require('../db/connection');

const selectSingleReview = (review_id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1;`, [review_id])
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

module.exports = { selectSingleReview, patchSingleReview };
