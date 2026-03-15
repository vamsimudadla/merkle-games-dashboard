# Merkle Games

A responsive Nuxt/TypeScript web application for exploring games using REST APIs.

---

## Overview

Merkle Games allows users to browse 15 random games released between 2015 and 2017, sorted by average rating. Users can navigate to a detail page for each game to view full information including reviews.

---

## Project Structure

```
client
├── app/
│   ├── styles/
│   │   ├── _variables.scss            # SCSS color/shadow variables
│   │   └── main.scss                  # Global reset + base styles
│   ├── components/
│   │   ├── GameCard.vue               # Individual game card
│   │   └── ReviewItem.vue             # Individual review card
│   ├── composables/
│   │   └── useGames.ts                # State + game logic
│   ├── pages/
│   │   ├── index.vue                  # Games listing page
│   │   └── [id].vue                   # Game detail page
│   ├── services/
│   │   └── games.service.ts           # API calls
│   ├── types.ts                       # TypeScript interfaces + enums
│   └── utils.ts                       # Utility functions
├── public/
│   └── fallback-image.webp            # Fallback for broken images
├── tests/
│   ├── components/
│   │   └── ReviewItem.test.ts
│   ├── composables/
│   │   └── useGames.test.ts
│   ├── setup.ts                       # Vitest global mocks
├── nuxt.config.ts
├── vitest.config.ts
└── tsconfig.json
```

---

## Getting Started

### Prerequisites

- Merkle Games API running locally

### 1. Start the API

Navigate to the `/server` folder and follow the instructions in the root `README.md` to start the API container. The API will be available at:

```
http://localhost:8000
```

Swagger documentation is available at:

```
http://localhost:8000/api-docs
```

### 2. Install dependencies

```bash
cd client
npm install
```

### 3. Start the development server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## Features

### Index Page (`/`)

- Displays 15 randomly selected games released between 2015 and 2017
- Games are sorted by average rating (descending) by default
- Sort buttons to switch between **Top Rated** and **Latest**
- Responsive multi-column grid layout
- Each game card shows:
  - Cover image with fallback
  - Title
  - Genre badge
  - Formatted release date
  - Average rating with review count

### Detail Page (`/[id]`)

- Full-width hero cover image
- Game title and description
- Genre badge
- average rating, release date, developer name
- Complete review list with username, rating, and review text
- Back button for navigation

---

## Implementation Approach

### API Layer

Two endpoints from the Games API are used:

```
GET /api/v1/games/by-date-range?from=2015-01-01&to=2017-12-31
GET /api/v1/games/:id
```

The date range endpoint returns only game IDs. Full details are then fetched in parallel using `Promise.all`.

### State Management

`useState` (Nuxt built-in) is used instead of Pinia. The application state is simple enough — a flat list of games plus a sort preference — that a dedicated store would be unnecessary overhead.

```ts
const games = useState<IGame[]>("games", () => []);
const sortOption = useState<SORT_OPTION>(
  "games-sort",
  () => SORT_OPTION.RATING,
);
```

State is shared globally across pages. This means navigating from the index page to a detail page reuses already-fetched game data without an additional API call.

### Data Fetching

`useAsyncData` is used on both pages. It runs the fetch on the server (SSR), serializes the result into the HTML payload, and hydrates the client without re-fetching. This improves both performance and SEO.

### Average Rating

The Games API does not return a pre-calculated average rating. It is computed on the client from the reviews array and stored directly on the game object before saving to state.

### Image Handling

`@nuxt/image` is used via `<NuxtImg>` for automatic resizing, lazy loading, and WebP conversion. A fallback image is shown whenever an image URL fails to load!

### Styling

All styles are written in scoped SCSS per component. A global `_variables.scss` partial contains all color variables and shadow definitions, auto-imported into every component via `nuxt.config.ts`:

---

## Accessibility

The application targets **WCAG 2.2 AA** compliance. Key measures taken:

- Semantic HTML throughout (`<main>`, `<article>`, `<section>`, `<time>`)
- All interactive elements have `aria-label` or `aria-labelledby`
- All images have descriptive `alt` text
- Keyboard navigation supported on all clickable cards via `tabindex="0"` and `@keydown.enter`
- Focus states use `focus-visible` to avoid showing outlines on mouse click
- Sort buttons use `aria-pressed` to communicate active state to screen readers
- Loading and error states use `aria-live` and `role="alert"`
- Heading hierarchy is maintained: `h1` → `h2` with no skipped levels

---

## Testing

Tests are written with **Vitest** and **@vue/test-utils**.

### Run tests

```bash
npx vitest run          # single run
npx vitest              # watch mode
```

## Time Spent

| Phase                         | Time       |
| ----------------------------- | ---------- |
| Project setup + configuration | 30 min     |
| Design and Implementation     | 30 hr      |
| API integration + composable  | 45 min     |
| Index page + GameCard         | 45 min     |
| Detail page + ReviewItem      | 45 min     |
| Unit tests                    | 30 min     |
| Documentation                 | 30 min     |
| **Total**                     | **~4 hrs** |
