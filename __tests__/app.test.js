const request = require('supertest');

const app = require('../app');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data');

beforeEach(() => seed(data));
afterAll(() => db.end());

describe('/api/categories', () => {
  test('GET returns 200 status while serving an array of categories', async () => {
    const { body } = await request(app).get('/api/categories');
    expect(200); // status code
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
