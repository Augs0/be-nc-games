const express = require('express');
const app = express();

const { getCategories } = require('./controllers/category-controller');
const { getSingleReview } = require('./controllers/review-controller');
const { getAllUsers } = require('./controllers/user-controller');

app.use('/api/categories', getCategories);
app.use('/api/reviews/:review_id', getSingleReview);
app.use('/api/users', getAllUsers);

app.all('/*', (req, res, next) => {
  res.status(404).send({ msg: 'Path not found' });
});

app.use((err, req, res, next) => {
  console.log(err);
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else if (err.code === '22P02') {
    res.status(400).send({ msg: 'Bad request' });
  } else next(err);
});

module.exports = app;
