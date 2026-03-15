import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ReviewItem from "~/components/ReviewItem.vue";
import type { IReview } from "~/types";

const mockReview: IReview = {
  id: 1,
  game_id: 1,
  user_id: 1,
  rating: 8,
  review_text: "Amazing game with great storyline.",
  review_date: "2016-01-01",
  createdAt: "2016-01-01",
  updatedAt: "2016-01-01",
  user: {
    id: 1,
    username: "john_doe",
  },
};

describe("ReviewItem", () => {
  it("renders the review item", () => {
    const reviewItem = mount(ReviewItem, { props: { review: mockReview } });
    expect(reviewItem.find('[data-testid="review-item"]').exists()).toBe(true);
  });

  it("renders username correctly", () => {
    const reviewItem = mount(ReviewItem, { props: { review: mockReview } });
    expect(reviewItem.find('[data-testid="review-username"]').text()).toBe(
      "john_doe",
    );
  });

  it("renders first letter of username in avatar", () => {
    const reviewItem = mount(ReviewItem, { props: { review: mockReview } });
    expect(reviewItem.find('[data-testid="review-avatar"]').text().trim()).toBe(
      "J",
    );
  });

  it("renders review text correctly", () => {
    const reviewItem = mount(ReviewItem, { props: { review: mockReview } });
    expect(reviewItem.find('[data-testid="review-text"]').text()).toBe(
      "Amazing game with great storyline.",
    );
  });

  it("renders different username avatar correctly", () => {
    const reviewItem = mount(ReviewItem, {
      props: { review: { ...mockReview, user: { id: 2, username: "alice" } } },
    });
    expect(reviewItem.find('[data-testid="review-avatar"]').text().trim()).toBe(
      "A",
    );
  });
});
