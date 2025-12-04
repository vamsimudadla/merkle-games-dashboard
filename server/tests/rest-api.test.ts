import request from 'supertest';
import { Response } from 'supertest';
import { Server } from 'http';
import {
  GameAttributes,
  GenreAttributes,
  CompanyAttributes,
  UserReviewAttributes,
  UserAttributes
} from '@/types';

interface PaginatedGamesResponse {
  data: (GameAttributes & {
    id: number;
    genre: GenreAttributes;
    developer: CompanyAttributes;
    publisher: CompanyAttributes;
  })[];
  _metadata: {
    total: number;
    page: number;
    totalPages: number;
    limit: number;
  };
  _links: any[];
}

interface GameWithRelationsResponse {
  data: GameAttributes & {
    id: number;
    genre: GenreAttributes;
    developer: CompanyAttributes;
    publisher: CompanyAttributes;
  };
  _links: any[];
  _embedded: any;
}

interface GenreWithGamesResponse {
  data: GenreAttributes & {
    id: number;
    games: GameAttributes[];
  };
  _links: any[];
  _embedded: any;
}

interface CompanyResponse {
  data: CompanyAttributes & {
    id: number;
  };
  _links?: any[];
}

interface ReviewWithRelationsResponse {
  data: UserReviewAttributes & {
    id: number;
    user: UserAttributes;
    game: GameAttributes;
  };
  _links?: any[];
}

interface HealthResponse {
  status: string;
  timestamp: string;
}

interface ErrorResponse {
  error: string;
}

describe('REST API GET Endpoints', () => {
  let server: Server | undefined;
  const baseURL = 'http://localhost:8000';

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
      const response: Response = await request(baseURL)
        .get('/health')
        .expect(200);

      const healthResponse: HealthResponse = response.body;
      expect(healthResponse).toHaveProperty('status', 'ok');
      expect(healthResponse).toHaveProperty('timestamp');
    });
  });

  describe('Games Endpoints', () => {
    test('GET /api/v1/games should return paginated games', async () => {
      const response: Response = await request(baseURL)
        .get('/api/v1/games')
        .expect(200);

      const gamesResponse: PaginatedGamesResponse = response.body;
      expect(gamesResponse).toHaveProperty('data');
      expect(gamesResponse).toHaveProperty('_metadata');
      expect(gamesResponse._metadata).toHaveProperty('total');
      expect(gamesResponse._metadata).toHaveProperty('page');
      expect(gamesResponse._metadata).toHaveProperty('totalPages');
      expect(Array.isArray(gamesResponse.data)).toBe(true);
      expect(gamesResponse._metadata.total).toBeGreaterThan(0);
    });

    test('GET /api/v1/games with pagination', async () => {
      const response: Response = await request(baseURL)
        .get('/api/v1/games?page=1&limit=5')
        .expect(200);

      const gamesResponse: PaginatedGamesResponse = response.body;
      expect(gamesResponse.data.length).toBeLessThanOrEqual(5);
      expect(gamesResponse._metadata.page).toBe(1);
    });

    test('GET /api/v1/games/:id should return specific game', async () => {
      const response: Response = await request(baseURL)
        .get('/api/v1/games/1')
        .expect(200);

      const game: GameWithRelationsResponse = response.body;
      expect(game.data).toHaveProperty('id', 1);
      expect(game.data).toHaveProperty('title');
      expect(game.data).toHaveProperty('genre');
      expect(game.data).toHaveProperty('developer');
      expect(game.data).toHaveProperty('publisher');
    });

    test('GET /api/v1/games/:id with invalid ID should return 404', async () => {
      const response: Response = await request(baseURL)
        .get('/api/v1/games/999999')
        .expect(404);

      const errorResponse: ErrorResponse = response.body;
      expect(errorResponse).toHaveProperty('error');
    });
  });

  describe('Genres Endpoints', () => {
    test('GET /api/v1/genres should return all genres', async () => {
      const response: Response = await request(baseURL)
        .get('/api/v1/genres')
        .expect(200);

      const genresResponse: { data: GenreAttributes[] } = response.body;
      expect(genresResponse).toHaveProperty('data');
      expect(Array.isArray(genresResponse.data)).toBe(true);
      expect(genresResponse.data.length).toBeGreaterThan(0);
      expect(genresResponse.data[0]).toHaveProperty('id');
      expect(genresResponse.data[0]).toHaveProperty('name');
    });

    test('GET /api/v1/genres/:id should return specific genre with games', async () => {
      const response: Response = await request(baseURL)
        .get('/api/v1/genres/1')
        .expect(200);

      const genre: GenreWithGamesResponse = response.body;
      expect(genre.data).toHaveProperty('id', 1);
      expect(genre.data).toHaveProperty('name');
      expect(genre.data).toHaveProperty('games');
      expect(Array.isArray(genre.data.games)).toBe(true);
    });

    test('GET /api/v1/genres/:id with invalid ID should return 404', async () => {
      const response: Response = await request(baseURL)
        .get('/api/v1/genres/999999')
        .expect(404);

      const errorResponse: ErrorResponse = response.body;
      expect(errorResponse).toHaveProperty('error');
    });
  });

  describe('Companies Endpoints', () => {
    test('GET /api/v1/companies should return all companies', async () => {
      const response: Response = await request(baseURL)
        .get('/api/v1/companies')
        .expect(200);

      const companiesResponse: { data: CompanyAttributes[] } = response.body;
      expect(companiesResponse).toHaveProperty('data');
      expect(Array.isArray(companiesResponse.data)).toBe(true);
      expect(companiesResponse.data.length).toBeGreaterThan(0);
      expect(companiesResponse.data[0]).toHaveProperty('id');
      expect(companiesResponse.data[0]).toHaveProperty('name');
      expect(companiesResponse.data[0]).toHaveProperty('company_type');
    });

    test('GET /api/v1/companies/:id should return specific company', async () => {
      const response: Response = await request(baseURL)
        .get('/api/v1/companies/1')
        .expect(200);

      const company: CompanyResponse = response.body;
      expect(company.data).toHaveProperty('id', 1);
      expect(company.data).toHaveProperty('name');
      expect(company.data).toHaveProperty('company_type');
    });

    test('GET /api/v1/companies/:id with invalid ID should return 404', async () => {
      const response: Response = await request(baseURL)
        .get('/api/v1/companies/999999')
        .expect(404);

      const errorResponse: ErrorResponse = response.body;
      expect(errorResponse).toHaveProperty('error');
    });
  });

  describe('Reviews Endpoints', () => {
    test('GET /api/v1/reviews should return all reviews', async () => {
      const response: Response = await request(baseURL)
        .get('/api/v1/reviews')
        .expect(200);

      const reviewsResponse: { data: any[] } = response.body;
      expect(reviewsResponse).toHaveProperty('data');
      expect(Array.isArray(reviewsResponse.data)).toBe(true);
      expect(reviewsResponse.data.length).toBeGreaterThan(0);
      expect(reviewsResponse.data[0]).toHaveProperty('id');
      expect(reviewsResponse.data[0]).toHaveProperty('rating');
      expect(reviewsResponse.data[0]).toHaveProperty('review_text');
      expect(reviewsResponse.data[0]).toHaveProperty('user');
      expect(reviewsResponse.data[0]).toHaveProperty('game');
    });

    test('GET /api/v1/reviews/:id should return specific review', async () => {
      const response: Response = await request(baseURL)
        .get('/api/v1/reviews/1')
        .expect(200);

      const review: ReviewWithRelationsResponse = response.body;
      expect(review.data).toHaveProperty('id', 1);
      expect(review.data).toHaveProperty('rating');
      expect(review.data).toHaveProperty('review_text');
      expect(review.data).toHaveProperty('user');
      expect(review.data).toHaveProperty('game');
    });

    test('GET /api/v1/reviews/:id with invalid ID should return 404', async () => {
      const response: Response = await request(baseURL)
        .get('/api/v1/reviews/999999')
        .expect(404);

      const errorResponse: ErrorResponse = response.body;
      expect(errorResponse).toHaveProperty('error');
    });
  });

  describe('Static Endpoints', () => {
    test('GET /api-docs/ should return API documentation', async () => {
      const response: Response = await request(baseURL)
        .get('/api-docs/')
        .expect(200);

      expect(response.text).toContain('swagger');
    });

    test('GET /graphql-sandbox should return GraphQL sandbox', async () => {
      const response: Response = await request(baseURL)
        .get('/graphql-sandbox')
        .expect(200);

      expect(response.text).toContain('GraphQL Sandbox');
      expect(response.text).toContain('embeddable-sandbox');
    });
  });
});