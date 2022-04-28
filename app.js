const express = require('express');
const app = express();

const { getCategories } = require('./controllers/category-controller');

app.use('/api/categories', getCategories);

app.all('/*', (req, res, next) => {
  res.status(404).send({ msg: 'Path not found' });
});

module.exports = app;
