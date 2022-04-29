const request = require('supertest');

const app = require('../app');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data');

beforeEach(() => seed(data));
afterAll(() => db.end());

describe('/api/categories', () => {
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

describe('/api/reviews/:review_id', () => {
  test.only('GET returns 200 status while serving a single review object with the expected properties ', async () => {
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
      comment_count: '1',
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
