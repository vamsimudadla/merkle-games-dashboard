<script setup lang="ts">
import { useGames } from "~/composables/useGames";
import { SORT_OPTION } from "~/types";

const { games, error, sortOption, applySort } = useGames();
const { getGames } = useGames();

await getGames();
</script>

<template>
  <main class="games-page">
    <div class="page-header">
      <h1 class="page-title">Explore Games</h1>

      <div
        v-if="games.length"
        class="sort-actions"
        role="group"
        aria-label="Sort games by"
      >
        <button
          class="sort-btn"
          :class="{ active: sortOption === SORT_OPTION.RATING }"
          @click="applySort(SORT_OPTION.RATING)"
          :aria-pressed="sortOption === SORT_OPTION.RATING"
        >
          Top Rated
        </button>
        <button
          class="sort-btn"
          :class="{ active: sortOption === SORT_OPTION.DATE }"
          @click="applySort(SORT_OPTION.DATE)"
          :aria-pressed="sortOption === SORT_OPTION.DATE"
        >
          Latest
        </button>
      </div>
    </div>

    <div
      v-if="error"
      class="status-message error"
      role="alert"
      aria-live="assertive"
    >
      <p>{{ error }}</p>
    </div>

    <div v-else-if="!games?.length" class="status-message">
      <p>No games found.</p>
    </div>

    <section
      v-else
      class="games-grid"
      aria-label="`Showing ${games.length} games`"
    >
      <GameCard v-for="game in games" :key="game.id" :game="game" />
    </section>
  </main>
</template>

<style scoped lang="scss">
.games-page {
  margin: 0 auto;
  padding: 32px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: $color-text-primary;
}

.sort-actions {
  display: flex;
  gap: 8px;
}

.sort-btn {
  padding: 8px 20px;
  border: 2px solid $color-primary;
  background: transparent;
  color: $color-text-primary;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease;
  outline: none;

  &:hover {
    background: $color-primary;
    color: $color-text-inverse;
  }

  &:focus-visible {
    box-shadow: $shadow-focus;
  }

  &.active {
    background: $color-primary;
    color: $color-text-inverse;
  }
}

.status-message {
  text-align: center;
  padding: 64px 16px;
  color: $color-text-secondary;
  font-size: 1rem;

  &.error {
    color: $color-error;
  }
}

.games-grid {
  display: grid;
  gap: 24px;
  grid-template-columns: 1fr;

  @media (min-width: 640px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}
</style>
