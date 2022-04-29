const express = require('express');
const app = express();

const { getCategories } = require('./controllers/category-controller');
const {
  getSingleReview,
  updateSingleReview,
} = require('./controllers/review-controller');
const { postComment } = require('./controllers/comment-controller');

app.use(express.json());

app.get('/api/categories', getCategories);

app.get('/api/reviews/:review_id', getSingleReview);

app.patch('/api/reviews/:review_id', updateSingleReview);

app.post('/api/reviews/:review_id/comments', postComment);

app.all('/*', (req, res, next) => {
  res.status(404).send({ msg: 'Path not found' });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  const sqlCodes = ['22P02', '23502'];
  const nullValue = '23503';
  if (sqlCodes.includes(err.code)) {
    res.status(400).send({ msg: 'Bad request' });
  } else if (err.code === nullValue) {
    res.status(404).send({ msg: 'Not found' });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
});

module.exports = app;
