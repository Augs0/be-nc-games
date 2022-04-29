const db = require('../db/connection');

const insertComment = (review_id, { author, body }) => {
  return db
    .query(
      'INSERT INTO comments (review_id, author, body) VALUES ($1, $2, $3) RETURNING *;',
      [review_id, author, body]
    )
    .then((result) => result.rows[0]);
};

module.exports = { insertComment };
