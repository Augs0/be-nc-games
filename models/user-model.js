const db = require('../db/connection');

const selectAllUsers = () => {
  return db.query(`SELECT * FROM users;`).then((result) => result.rows);
};

module.exports = { selectAllUsers };
