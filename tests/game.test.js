const request = require('supertest');
const app = require('../src/index');
const db = require('../src/models');

describe('Game API Endpoints', () => {
  let authToken;
  let testGame;

  beforeAll(async () => {
    // Wait for database connection
    await db.sequelize.authenticate();

    // Register and login a test user
    const registerRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });

    authToken = registerRes.body.token;

    // Create a test game
    const gameRes = await request(app)
      .post('/api/v1/games')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Test Game',
        description: 'A test game',
        genre_id: 1,
        platform: 'PC'
      });

    testGame = gameRes.body;
  });

  afterAll(async () => {
    // Clean up test data
    if (testGame && testGame.id) {
      await request(app)
        .delete(`/api/v1/games/${testGame.id}`)
        .set('Authorization', `Bearer ${authToken}`);
    }

    // Delete test user
    await db.User.destroy({
      where: { email: 'test@example.com' }
    });

    await db.sequelize.close();
  });

  describe('GET /api/v1/games', () => {
    it('should return a list of games', async () => {
      const response = await request(app)
        .get('/api/v1/games')
        .expect(200);

      expect(response.body).toHaveProperty('games');
      expect(Array.isArray(response.body.games)).toBe(true);
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('totalPages');
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/v1/games?page=1&limit=5')
        .expect(200);

      expect(response.body.games.length).toBeLessThanOrEqual(5);
      expect(response.body.page).toBe(1);
    });
  });

  describe('GET /api/v1/games/:id', () => {
    it('should return a specific game', async () => {
      const response = await request(app)
        .get(`/api/v1/games/${testGame.id}`)
        .expect(200);

      expect(response.body.id).toBe(testGame.id);
      expect(response.body.title).toBe('Test Game');
    });

    it('should return 404 for non-existent game', async () => {
      await request(app)
        .get('/api/v1/games/99999')
        .expect(404);
    });
  });

  describe('POST /api/v1/games', () => {
    it('should create a new game when authenticated', async () => {
      const newGame = {
        title: 'New Test Game',
        description: 'Another test game',
        genre_id: 1,
        platform: 'PlayStation 5'
      };

      const response = await request(app)
        .post('/api/v1/games')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newGame)
        .expect(201);

      expect(response.body.title).toBe(newGame.title);
      expect(response.body.description).toBe(newGame.description);

      // Clean up
      await request(app)
        .delete(`/api/v1/games/${response.body.id}`)
        .set('Authorization', `Bearer ${authToken}`);
    });

    it('should reject creation without authentication', async () => {
      const newGame = {
        title: 'Unauthorized Game',
        genre_id: 1
      };

      await request(app)
        .post('/api/v1/games')
        .send(newGame)
        .expect(401);
    });

    it('should validate required fields', async () => {
      const invalidGame = {
        description: 'Missing title and genre'
      };

      await request(app)
        .post('/api/v1/games')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidGame)
        .expect(400);
    });
  });

  describe('PUT /api/v1/games/:id', () => {
    it('should update an existing game', async () => {
      const updates = {
        title: 'Updated Test Game',
        platform: 'PC, Xbox'
      };

      const response = await request(app)
        .put(`/api/v1/games/${testGame.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updates)
        .expect(200);

      expect(response.body.title).toBe(updates.title);
      expect(response.body.platform).toBe(updates.platform);
    });

    it('should return 404 for non-existent game', async () => {
      await request(app)
        .put('/api/v1/games/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Updated' })
        .expect(404);
    });
  });

  describe('DELETE /api/v1/games/:id', () => {
    it('should delete a game', async () => {
      // Create a game to delete
      const gameToDelete = await request(app)
        .post('/api/v1/games')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Game to Delete',
          genre_id: 1
        });

      await request(app)
        .delete(`/api/v1/games/${gameToDelete.body.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify it's deleted
      await request(app)
        .get(`/api/v1/games/${gameToDelete.body.id}`)
        .expect(404);
    });
  });
});