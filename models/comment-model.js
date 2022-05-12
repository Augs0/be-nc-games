const db = require('../db/connection');

const insertComment = (review_id, { author, body }) => {
  return db
    .query(
      'INSERT INTO comments (review_id, author, body) VALUES ($1, $2, $3) RETURNING *;',
      [review_id, author, body]
    )
    .then((result) => result.rows[0]);
};

const removeComment = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1;`, [comment_id])
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({ status: 404, msg: 'No comment found' });
      }
    });
};

module.exports = { insertComment, removeComment };
