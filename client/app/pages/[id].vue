<script setup lang="ts">
import type { IGame } from "~/types";
import { useGames } from "~/composables/useGames";
import { getGameDetails } from "~/services/games.service";
import { formatDate, getImageWithBaseURL } from "~/utils";

const route = useRoute();
const router = useRouter();
const id = Number(route.params.id);

const { games, calculateAverageRating } = useGames();

const getGameById = async (id: number): Promise<IGame> => {
  const game = games.value.find((g) => g.id === id);
  if (game) return game;
  return await getGameDetails(id);
};

const { data: game, error } = await useAsyncData<IGame>(`game-${id}`, () =>
  getGameById(id),
);

const onImageError = (e: string | Event) => {
  const img = (e as Event).target as HTMLImageElement;
  img.srcset = "";
  img.src = "/fallback-image.webp";
};

const goBack = () => {
  router.back();
};

const getCoverImage = () => {
  const url = game.value?.images.find(
    (image) => image.image_type === "Cover",
  )?.image_url;
  return url ? getImageWithBaseURL(url) : "";
};
</script>

<template>
  <main class="detail-page">
    <div
      v-if="error"
      class="status-message error"
      role="alert"
      aria-live="assertive"
    >
      <p>Failed to load game. Please try again.</p>
    </div>

    <template v-else-if="game">
      <div class="back-wrapper">
        <button
          class="back-btn"
          @click="goBack"
          aria-label="Go back to games list"
        >
          <span aria-hidden="true">←</span>
          Back
        </button>
      </div>

      <div class="cover-image">
        <NuxtImg
          :src="getCoverImage()"
          :alt="`${game.title} featured image`"
          sizes="100vw"
          class="cover-img"
          @error="onImageError"
        />
      </div>

      <div class="detail-container">
        <div class="detail-header">
          <h1 class="game-title">{{ game.title }}</h1>

          <div class="badge-container" aria-label="Genre">
            <p class="genre-badge">{{ game.genre.name }}</p>
          </div>

          <div class="game-stats" aria-label="Game details">
            <div
              class="game-rating"
              :aria-label="`Rated ${calculateAverageRating(game.reviews)} out of 10 based on ${game.reviews?.length ?? 0} reviews`"
            >
              <span class="stat-star" aria-hidden="true">★</span>
              <span class="stat-value" aria-hidden="true">{{
                calculateAverageRating(game.reviews)
              }}</span>
              <span class="stat-label" aria-hidden="true"
                >({{ game.reviews?.length ?? 0 }} reviews)</span
              >
            </div>

            <div class="stat-divider" aria-hidden="true" />

            <div class="stat-info">
              <span class="stat-label" id="release-label">Released</span>
              <time
                class="stat-value"
                :datetime="game.release_date"
                aria-labelledby="release-label"
              >
                {{ formatDate(game.release_date, "long") }}
              </time>
            </div>

            <div class="stat-divider" aria-hidden="true" />

            <div class="stat-info">
              <span class="stat-label" id="developer-label">Developer</span>
              <span class="stat-value" aria-labelledby="developer-label">{{
                game.developer.name
              }}</span>
            </div>
          </div>
        </div>

        <section class="detail-section" aria-labelledby="description-heading">
          <h2 class="section-title" id="description-heading">Description</h2>
          <p class="game-description">{{ game.description }}</p>
        </section>

        <section class="detail-section" aria-labelledby="reviews-heading">
          <h2 class="section-title" id="reviews-heading">
            Reviews
            <span
              class="reviews-count"
              :aria-label="`${game.reviews?.length ?? 0} total reviews`"
            >
              {{ game.reviews?.length ?? 0 }}
            </span>
          </h2>

          <div
            v-if="game.reviews?.length"
            class="reviews-grid"
            :aria-label="`${game.reviews.length} reviews for ${game.title}`"
          >
            <ReviewItem
              v-for="review in game.reviews"
              :key="review.id"
              :review="review"
            />
          </div>

          <p v-else class="no-reviews">No reviews yet.</p>
        </section>
      </div>
    </template>
  </main>
</template>

<style scoped lang="scss">
.detail-page {
  background: $color-bg-page;
}

.back-wrapper {
  position: absolute;
  top: 24px;
  left: 24px;
  z-index: 10;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  color: $color-text-inverse;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
  outline: none;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
  }

  &:focus-visible {
    box-shadow: $shadow-focus;
  }
}

.cover-image {
  width: 100%;
  height: 480px;
  overflow: hidden;
  background: $color-primary;

  @media (max-width: 768px) {
    height: 280px;
  }
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.7;
}

.detail-container {
  max-width: 960px;
  margin: 0 auto;
  padding: 40px 24px;
  display: flex;
  flex-direction: column;
  gap: 48px;
}

.detail-header {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.game-title {
  font-size: 2.25rem;
  font-weight: 700;
  color: $color-text-primary;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
}

.badge-container {
  display: flex;
}

.genre-badge {
  padding: 4px 12px;
  background: $color-primary;
  color: $color-text-inverse;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border-radius: 9999px;
}

.game-stats {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  padding: 20px;
  background: $color-bg-card;
  border-radius: 12px;
  border: 1px solid $color-border;
}

.game-rating {
  display: flex;
  align-items: center;
  gap: 6px;
}

.stat-star {
  color: $color-accent;
  font-size: 1.1rem;
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-value {
  font-size: 1rem;
  font-weight: 700;
  color: $color-text-primary;
}

.stat-label {
  font-size: 0.75rem;
  color: $color-text-secondary;
}

.stat-divider {
  width: 1px;
  height: 32px;
  background: $color-border;

  @media (max-width: 640px) {
    display: none;
  }
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: $color-text-primary;
  display: flex;
  align-items: center;
  gap: 10px;
}

.reviews-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 24px;
  padding: 0 8px;
  background: $color-secondary;
  color: $color-text-inverse;
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 9999px;
}

.game-description {
  font-size: 1rem;
  color: $color-text-secondary;
  line-height: 1.8;
}

.reviews-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.no-reviews {
  color: $color-text-hint;
  font-size: 0.875rem;
}

.status-message {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  color: $color-text-secondary;

  &.error {
    color: $color-error;
  }
}
</style>
