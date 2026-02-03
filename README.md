# 🎮 Merkle Games API

Backend API for frontend technical assignments.

## 🚀 Quick Start

```bash
# Clone and start
git clone git@github.com:merkle-ne-tools/merkle-games-api.git game-api
cd game-api/server
cp .env.example .env   # Optional: customize environment variables
docker-compose up --build
```

**API Endpoints:**
- 🔗 **REST API**: `http://localhost:8000/api/v1`
- ⚡ **GraphQL**: `http://localhost:8000/graphql`
- 🛠️ **GraphQL Playground**: `http://localhost:8000/graphql-sandbox`
- 📖 **Swagger Documentation**: `http://localhost:8000/api-docs`
- 🎨 **Media Generator**: `http://localhost:8000/media/{seed}?w=400&h=300`

## 🎯 For Frontend Developers

**👉 Add your frontend project to the `client/` folder.**

Build a frontend application (Next.js, Nuxt, React, Vue, etc.) that connects to this API to display games, reviews, companies, and genres.

**Available Data:**
- 520 games
- 200 companies (developers/publishers)
- 30 genres
- 2400 user reviews
- 1038 images

**Documentation:**
- REST API: Visit the [Swagger UI](http://localhost:8000/api-docs) for interactive documentation
- GraphQL: Use the [GraphQL Playground](http://localhost:8000/graphql-sandbox) to explore the schema

## 📋 Prerequisites

- Docker and Docker Compose
- That's it!

## 🔌 Database Access (Optional)

**Database Type:** SQLite

**File Location:** `./server/data/gameapi.sqlite`

**Compatible Tools:** DB Browser for SQLite, TablePlus, DBeaver, DataGrip

## 🐳 Docker/Podman Commands

```bash
# From the server/ directory
# cd server

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

### Project Structure

```
game-api/
├── client/             # 👉 Your frontend project goes here
└── server/             # Backend API
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
    ├── data/               # SQLite database
    └── docker-compose.yml  # Docker config
```