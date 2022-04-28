const db = require('../db/connection');

const selectAllCategories = () => {
  return db.query(`SELECT * FROM categories;`).then((result) => result.rows);
};

module.exports = { selectAllCategories };
