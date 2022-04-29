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
