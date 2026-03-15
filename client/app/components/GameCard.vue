<script setup lang="ts">
import type { IGame } from "~/types";
import { formatDate, getImageWithBaseURL } from "~/utils";

const props = defineProps<{
  game: IGame;
}>();

const router = useRouter();

const navigateToGameDetails = () => {
  router.push(`/${props.game.id}`);
};

const onImageError = (e: string | Event) => {
  const img = (e as Event).target as HTMLImageElement;
  img.srcset = "";
  img.src = "/fallback-image.webp";
};

const coverImage = computed(() => {
  const url = props.game.images.find(
    (image) => image.image_type === "Cover",
  )?.image_url;
  return url ? getImageWithBaseURL(url) : "";
});
</script>

<template>
  <article class="game-card" @click="navigateToGameDetails">
    <div class="game-image">
      <NuxtImg
        :src="coverImage"
        :alt="`${game.title} cover`"
        width="400"
        height="225"
        loading="lazy"
        @error="onImageError"
      />
      <span class="game-genre">{{ game.genre.name }}</span>
    </div>

    <div class="game-body">
      <h2 class="game-title">{{ game.title }}</h2>

      <div class="game-meta">
        <time class="game-date" :datetime="game.release_date">
          {{ formatDate(game.release_date) }}
        </time>

        <div class="game-rating">
          <span class="star-text">★</span>
          <span class="rating">{{ game.average_rating }}</span>
          <span class="reviews-count">({{ game.reviews?.length ?? 0 }})</span>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss">
.game-card {
  width: 100%;
  background: $color-bg-card;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  outline: none;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-card-hover;
  }

  &:focus-visible {
    box-shadow: $shadow-focus-solid;
  }
}

.game-image {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: $color-image-bg;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;

    .game-card:hover & {
      transform: scale(1.04);
    }
  }
}

.game-genre {
  position: absolute;
  top: 8px;
  left: 8px;
  background: $color-primary;
  color: $color-text-inverse;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06rem;
  padding: 4px 10px;
  border-radius: 20px;
}

.game-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.game-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: $color-text-primary;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
}

.game-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.game-date {
  font-size: 0.8rem;
  color: $color-text-secondary;
}

.game-rating {
  display: flex;
  align-items: center;
  gap: 3px;
}

.star-text {
  color: $color-accent;
  font-size: 0.9rem;
}

.rating {
  font-size: 0.85rem;
  font-weight: 700;
  color: $color-text-primary;
}

.reviews-count {
  font-size: 0.75rem;
  color: $color-text-secondary;
}
</style>
