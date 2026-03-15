<script setup lang="ts">
import type { IReview } from "~/types";

defineProps<{
  review: IReview;
}>();
</script>

<template>
  <article class="review-item" data-testid="review-item">
    <div class="review-header">
      <div class="review-avatar" data-testid="review-avatar">
        {{ review.user.username?.charAt(0).toUpperCase() }}
      </div>
      <div class="review-meta">
        <span class="review-username" data-testid="review-username">{{
          review.user.username
        }}</span>
        <div class="rating" data-testid="review-rating">
          <span class="review-star">★</span>
          <span class="review-text">{{ review.rating }}</span>
        </div>
      </div>
    </div>
    <p class="review-text" data-testid="review-text">
      {{ review.review_text }}
    </p>
  </article>
</template>

<style scoped lang="scss">
.review-item {
  background: $color-bg-card;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid $color-border;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: $shadow-review-hover;
  }
}

.review-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.review-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: $color-primary;
  color: $color-text-inverse;
  font-size: 1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.review-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.review-username {
  font-size: 0.875rem;
  font-weight: 700;
  color: $color-text-primary;
}

.rating {
  display: flex;
  align-items: center;
  gap: 4px;
}

.review-star {
  font-size: 0.85rem;
  color: $color-accent;
}

.review-text {
  font-size: 0.875rem;
  color: $color-text-secondary;
  line-height: 1.6;
}
</style>
