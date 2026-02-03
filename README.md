# 🎮 Merkle Games API

Backend API for frontend technical assignments.

## 🚀 Quick Start

```bash
# Clone and start
git clone git@github.com:merkle-ne-tools/frontend-interview-games-api.git game-db
cd game-db
docker-compose up --build
```

**API Endpoints:**
- 🔗 **REST API**: `http://localhost:8000/api/v1`
- ⚡ **GraphQL**: `http://localhost:8000/graphql`
- 🛠️ **GraphQL Playground**: `http://localhost:8000/graphql-sandbox`
- 📖 **Swagger Documentation**: `http://localhost:8000/api-docs`
- 🎨 **Media Generator**: `http://localhost:8000/media/{seed}?w=400&h=300`

## 🎯 For Frontend Developers

Build a frontend application (NextJS, NuxtJS, etc.) that connects to this API to display games, reviews, companies, and genres.

**Available Data:**
- 260+ games
- 100 companies (developers/publishers)
- 15 genres
- 1200+ user reviews
- 1000+ images

**Documentation:**
- REST API: Visit the [Swagger UI](http://localhost:8000/api-docs) for interactive documentation
- GraphQL: Use the [GraphQL Playground](http://localhost:8000/graphql-sandbox) to explore the schema

## 📋 Prerequisites

- Docker and Docker Compose
- That's it!

## 🔌 Database Access (Optional)

**Connection Details:**
- Host: `localhost`
- Port: `5432`
- Database: `gamedb`
- Username: `gamedb_user`
- Password: `gamedb_pass`

**Compatible Tools:** TablePlus, pgAdmin, DBeaver, Postico, DataGrip

## 🐳 Docker Commands

```bash
# Run in background
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop
docker-compose down

# Full reset
docker-compose down -v && docker-compose up --build
```

---

## 📚 Additional Information

### Database Schema

- `games` - Video game information
- `companies` - Developers and publishers
- `genres` - Game categories
- `users` - User profiles
- `user_reviews` - Ratings and reviews
- `images` - Screenshots and covers
- `image_relations` - Polymorphic image relationships

### Local Development (Without Docker)

```bash
npm install
cp .env.example .env
npm run migrate
npm run seed
npm run dev
```

### Testing

```bash
npm test              # All tests
npm run test:coverage # Coverage report
npm run test:rest     # REST tests only
npm run test:graphql  # GraphQL tests only
```

### Media/Image Generator

The API includes a deterministic pattern generator for placeholder images. Each seed produces a unique, reproducible pattern.

**Endpoint:** `GET /media/:seed`

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `w` | number | 400 | Image width (10-2000px) |
| `h` | number | 400 | Image height (10-2000px) |

**Behavior:**
- If only `w` is provided, generates a square image (`w` × `w`)
- If only `h` is provided, generates a square image (`h` × `h`)
- If neither is provided, defaults to 400×400
- Pattern maintains 1:1 aspect ratio (center-cropped for non-square dimensions)
- Same seed always produces the same pattern regardless of dimensions
- Returns WebP format with aggressive caching headers

**Examples:**
```bash
# Default 400x400 pattern
GET /media/my-game-title

# Custom square (only width)
GET /media/my-game-title?w=200

# Custom dimensions
GET /media/my-game-title?w=800&h=450

# Using game title as seed (deterministic)
GET /media/The%20Legend%20of%20Zelda?w=300&h=400
```

**Usage in Frontend:**
```html
<!-- Use game title or ID as seed for consistent images -->
<img src="http://localhost:8000/media/game-123?w=300&h=200" alt="Game cover" />

<!-- Relative URL (recommended) -->
<img src="/media/game-123?w=300&h=200" alt="Game cover" />
```

**Features:**
- Deterministic: Same seed = same pattern (great for caching)
- Fast: Generated on-the-fly, no storage needed
- Cacheable: Returns `Cache-Control: immutable` headers
- Variety: 5 pattern types (geometric, gradient, circles, stripes, mosaic)

### Project Structure

```
game-db/
├── src/
│   ├── config/         # Database config
│   ├── controllers/    # REST controllers
│   ├── graphql/        # GraphQL schema
│   ├── models/         # Sequelize models
│   ├── routes/         # API routes
│   ├── utils/          # Utilities (pattern generator)
│   └── index.ts        # Entry point
├── scripts/            # Seed generation
├── seeders/            # Database seeders
├── migrations/         # Migrations
├── tests/              # Test suites
├── public/             # GraphQL Playground
└── docker-compose.yml  # Docker config
```