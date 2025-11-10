const request = require('supertest');
const app = require('../src/index');

describe('REST API GET Endpoints', () => {
  let server;

  beforeAll(async () => {
    // Wait for server to be ready
    await new Promise(resolve => setTimeout(resolve, 2000));
  });

  afterAll(async () => {
    if (server) {
      server.close();
    }
  });

  describe('Health Check', () => {
    test('GET /health should return status ok', async () => {
      const response = await request('http://localhost:3000')
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('Games Endpoints', () => {
    test('GET /api/v1/games should return paginated games', async () => {
      const response = await request('http://localhost:3000')
        .get('/api/v1/games')
        .expect(200);

      expect(response.body).toHaveProperty('games');
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('totalPages');
      expect(Array.isArray(response.body.games)).toBe(true);
      expect(response.body.total).toBeGreaterThan(0);
    });

    test('GET /api/v1/games with pagination', async () => {
      const response = await request('http://localhost:3000')
        .get('/api/v1/games?page=1&limit=5')
        .expect(200);

      expect(response.body.games.length).toBeLessThanOrEqual(5);
      expect(response.body.page).toBe(1);
    });

    test('GET /api/v1/games/:id should return specific game', async () => {
      const response = await request('http://localhost:3000')
        .get('/api/v1/games/1')
        .expect(200);

      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('title');
      expect(response.body).toHaveProperty('genre');
      expect(response.body).toHaveProperty('developer');
      expect(response.body).toHaveProperty('publisher');
    });

    test('GET /api/v1/games/:id with invalid ID should return 404', async () => {
      const response = await request('http://localhost:3000')
        .get('/api/v1/games/999999')
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Genres Endpoints', () => {
    test('GET /api/v1/genres should return all genres', async () => {
      const response = await request('http://localhost:3000')
        .get('/api/v1/genres')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('genreName');
    });

    test('GET /api/v1/genres/:id should return specific genre with games', async () => {
      const response = await request('http://localhost:3000')
        .get('/api/v1/genres/1')
        .expect(200);

      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('genreName');
      expect(response.body).toHaveProperty('games');
      expect(Array.isArray(response.body.games)).toBe(true);
    });

    test('GET /api/v1/genres/:id with invalid ID should return 404', async () => {
      const response = await request('http://localhost:3000')
        .get('/api/v1/genres/999999')
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Companies Endpoints', () => {
    test('GET /api/v1/companies should return all companies', async () => {
      const response = await request('http://localhost:3000')
        .get('/api/v1/companies')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('companyType');
    });

    test('GET /api/v1/companies/:id should return specific company', async () => {
      const response = await request('http://localhost:3000')
        .get('/api/v1/companies/1')
        .expect(200);

      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('companyType');
    });

    test('GET /api/v1/companies/:id with invalid ID should return 404', async () => {
      const response = await request('http://localhost:3000')
        .get('/api/v1/companies/999999')
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Reviews Endpoints', () => {
    test('GET /api/v1/reviews should return all reviews', async () => {
      const response = await request('http://localhost:3000')
        .get('/api/v1/reviews')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('ratingScore');
      expect(response.body[0]).toHaveProperty('reviewText');
      expect(response.body[0]).toHaveProperty('user');
      expect(response.body[0]).toHaveProperty('game');
    });

    test('GET /api/v1/reviews/:id should return specific review', async () => {
      const response = await request('http://localhost:3000')
        .get('/api/v1/reviews/1')
        .expect(200);

      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('ratingScore');
      expect(response.body).toHaveProperty('reviewText');
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('game');
    });

    test('GET /api/v1/reviews/:id with invalid ID should return 404', async () => {
      const response = await request('http://localhost:3000')
        .get('/api/v1/reviews/999999')
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Static Endpoints', () => {
    test('GET /api-docs/ should return API documentation', async () => {
      const response = await request('http://localhost:3000')
        .get('/api-docs/')
        .expect(200);

      expect(response.text).toContain('swagger');
    });

    test('GET /graphql-sandbox should return GraphQL sandbox', async () => {
      const response = await request('http://localhost:3000')
        .get('/graphql-sandbox')
        .expect(200);

      expect(response.text).toContain('GraphQL Sandbox');
      expect(response.text).toContain('embeddable-sandbox');
    });
  });
});