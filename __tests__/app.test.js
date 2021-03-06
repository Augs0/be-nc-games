const request = require('supertest');

const app = require('../app');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data');

beforeEach(() => seed(data));
afterAll(() => db.end());

describe('GET /api/categories', () => {
  test('GET returns 200 status while serving an array of categories', async () => {
    const { body } = await request(app).get('/api/categories').expect(200);
    expect(body.categories).toBeArray();
    expect(body.categories.length).toBe(4);
    body.categories.forEach((category) => {
      expect(category).toEqual({
        slug: expect.any(String),
        description: expect.any(String),
      });
    });
  });
});

describe('GET /api/reviews/:review_id', () => {
  test('GET returns 200 status while serving a single review object with the expected properties ', async () => {
    const { body } = await request(app).get('/api/reviews/1').expect(200);
    expect(body).toEqual({
      review_id: 1,
      title: 'Agricola',
      designer: 'Uwe Rosenberg',
      owner: 'mallionaire',
      review_img_url:
        'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
      review_body: 'Farmyard fun!',
      category: 'euro game',
      created_at: '2021-01-18T10:00:20.514Z',
      votes: 1,
      comment_count: '2',
    });
  });
  test('should return a status 404 if valid a number that does not match a review is passed ', async () => {
    const { body } = await request(app).get('/api/reviews/1000').expect(404);
    expect(body.msg).toBe('No review found with that ID');
  });
  test('should return a status 400 if something other than a number is passed as the ID', async () => {
    const { body } = await request(app).get('/api/reviews/abc').expect(400);
    expect(body.msg).toBe('Bad request');
  });
});

describe('GET /api/users', () => {
  test('should return a 200 status code with an array of users', async () => {
    const { body } = await request(app).get('/api/users').expect(200);
    expect(body.users).toBeArray();
    expect(body.users.length).toBe(4);
    body.users.forEach((user) => {
      expect(user).toEqual({
        username: expect.any(String),
        name: expect.any(String),
        avatar_url: expect.any(String),
      });
    });
  });
});

describe('PATCH /api/reviews/:review_id', () => {
  test('PATCH returns a status code of 200 with review object. The votes should have increased as expected.', async () => {
    const { body } = await request(app)
      .patch('/api/reviews/1')
      .send({ inc_votes: 1 })
      .expect(200);
    expect(body.review.votes).toBe(2);
  });
  test('PATCH returns a status code of 200 with review object. The votes should have decreased as expected when passed a negaitve number.', async () => {
    const { body } = await request(app)
      .patch('/api/reviews/1')
      .send({ inc_votes: -1 })
      .expect(200);

    expect(body.review.votes).toBe(0);
  });
  test('PATCH returns a status code of 200 with review object unchanged when an empty object is sent in the body.', async () => {
    const { body } = await request(app)
      .patch('/api/reviews/1')
      .send({})
      .expect(200);
    expect(body.review.votes).toBe(1);
  });
  test('PATCH returns a status code of 200 with review object. Votes should be incremented from previous changes i.e. data persists.', async () => {
    await request(app)
      .patch('/api/reviews/1')
      .send({ inc_votes: 3 })
      .expect(200);
    const { body } = await request(app)
      .patch('/api/reviews/1')
      .send({ inc_votes: 1 })
      .expect(200);
    expect(body.review.votes).toBe(5);
  });
  test('should return a status 404 if valid number that does not match a review is passed in path ', async () => {
    const { body } = await request(app)
      .patch('/api/reviews/1000')
      .send({ inc_votes: 1 })
      .expect(404);
    expect(body.msg).toBe('No review found with that ID');
  });
  test('should return a status 400 if something that is not a number is passed in path', async () => {
    const { body } = await request(app)
      .patch('/api/reviews/abc')
      .send({ inc_votes: 1 })
      .expect(400);
    expect(body.msg).toBe('Bad request');
  });
  test('should return a status 400 if something not a number is passed with inc_votes in body ', async () => {
    const { body } = await request(app)
      .patch('/api/reviews/abc')
      .send({ inc_votes: 'hello' })
      .expect(400);
    expect(body.msg).toBe('Bad request');
  });
});

describe('POST /api/reviews/:review_id/comments', () => {
  test('should return status 201 and the posted comment with expected keys', async () => {
    const { body } = await request(app)
      .post('/api/reviews/1/comments')
      .send({ username: 'philippaclaire9', body: 'hi I am a comment' })
      .expect(201);

    expect(body.newComment).toContainKeys([
      'comment_id',
      'body',
      'author',
      'created_at',
      'votes',
      'review_id',
    ]);
    expect(body.newComment.body).toBe('hi I am a comment');
    expect(body.newComment.author).toBe('philippaclaire9');
    expect(body.newComment.votes).toBe(0);
    expect(body.newComment.review_id).toBe(1);
  });
  test('should return status 400 when posted comment does not have all expected keys', async () => {
    const { body } = await request(app)
      .post('/api/reviews/1/comments')
      .send({ username: 'philippaclaire9' })
      .expect(400);
    expect(body.msg).toBe('Bad request');
  });
  test('should return a 404 status code if valid number that does not match a review is passed in path', async () => {
    const { body } = await request(app)
      .post('/api/reviews/1000/comments')
      .send({ username: 'philippaclaire9', body: 'howdy' })
      .expect(404);
    expect(body.msg).toBe('Not found');
  });
  test('should not allow a user not in the database to post a comment', async () => {
    const { body } = await request(app)
      .post('/api/reviews/1/comments')
      .send({ username: 'augiebear', body: 'halllooo' })
      .expect(404);
    expect(body.msg).toBe('Not found');
  });
});

describe('GET /api/reviews/:review_id/comments', () => {
  test('should return a status code of 200 and an array of comments linked to the passed ID ', async () => {
    const { body } = await request(app)
      .get('/api/reviews/1/comments')
      .expect(200);
    expect(body).toBeArray();
    expect(body.length).toBe(2);
    body.forEach((comment) => {
      expect(comment).toEqual({
        comment_id: expect.any(Number),
        votes: expect.any(Number),
        created_at: expect.any(String),
        author: expect.any(String),
        body: expect.any(String),
      });
    });
  });
  test('should return a status 404 if valid a number that does not match a review is passed ', async () => {
    const { body } = await request(app).get('/api/reviews/1000').expect(404);
    expect(body.msg).toBe('No review found with that ID');
  });
  test('should return a status 400 if something other than a number is passed as the ID', async () => {
    const { body } = await request(app).get('/api/reviews/abc').expect(400);
    expect(body.msg).toBe('Bad request');
  });
});

describe('GET /api/reviews', () => {
  test('should return a status code of 200 with an array of all reviews. All review objects should have the expected keys', async () => {
    const { body } = await request(app).get('/api/reviews').expect(200);
    expect(body.reviews).toBeArray();
    expect(body.reviews.length).toBe(13);
    body.reviews.forEach((review) => {
      expect(review).toEqual({
        review_id: expect.any(Number),
        title: expect.any(String),
        designer: expect.any(String),
        owner: expect.any(String),
        review_img_url: expect.any(String),
        review_body: expect.any(String),
        category: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        comment_count: expect.any(Number),
      });
    });
  });
  test('reviews sorted by date order, descending by default', async () => {
    const { body } = await request(app).get('/api/reviews').expect(200);
    expect(body.reviews).toBeSortedBy('created_at', { descending: true });
  });
  test('reviews can take a sort by query', async () => {
    const { body } = await request(app)
      .get('/api/reviews?sort_by=votes')
      .expect(200);
    expect(body.reviews).toBeSortedBy('votes', { descending: true });
  });
  test('reviews can take an order by query', async () => {
    const { body } = await request(app)
      .get('/api/reviews?order=asc')
      .expect(200);
    expect(body.reviews).toBeSortedBy('created_at', { descending: false });
  });
  test('reviews can take a category query', async () => {
    const { body } = await request(app)
      .get('/api/reviews?category=dexterity')
      .expect(200);
    const { reviews } = body;
    reviews.forEach((review) => {
      expect(review.category).toBe('dexterity');
    });
  });
  test('400 - returns 400 status code when invalid sort query used', async () => {
    const { body } = await request(app)
      .get('/api/reviews?sort_by=not-a-column')
      .expect(400);
    expect(body.msg).toBe('Invalid sort query');
  });
  test('400 - returns 400 status code when invalid order query used', async () => {
    const { body } = await request(app)
      .get('/api/reviews?order=invalid')
      .expect(400);
    expect(body.msg).toBe('Invalid order query');
  });
  test('404 - returns 404 status code when invalid category query used', async () => {
    const { body } = await request(app)
      .get('/api/reviews?category=notacategory')
      .expect(404);
    expect(body.msg).toBe('That category does not exist yet');
  });
});

describe('DELETE /api/comments/:comment_id', () => {
  test('return 204 and no content', async () => {
    await request(app).delete('/api/comments/1').expect(204);
  });
  test('return 400 if something other than a comment id passed in path', async () => {
    const { body } = await request(app)
      .delete('/api/comments/nonsense')
      .expect(400);
    expect(body.msg).toBe('Bad request');
  });
  test('return 404 if comment id is non-existent', async () => {
    const { body } = await request(app)
      .delete('/api/comments/3000')
      .expect(404);
    expect(body.msg).toBe('No comment found');
  });
});

describe('GET /api', () => {
  test('returns list of all endpoints a user can access', async () => {
    const { body } = await request(app).get('/api').expect(200);

    expect(typeof body.endpoints).toBe('object');
  });
});

describe('error handling for all API paths', () => {
  test('should return 404 status code if user attempts to visit non-existent path', async () => {
    await request(app)
      .get('/api/not-a-path')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Path not found');
      });
  });
});
