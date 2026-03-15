import { describe, it, expect, vi } from "vitest";
import type { IGame, IReview } from "~/types";
import { useGames } from "~/composables/useGames";

vi.mock("~/services/games.service", () => ({
  getGamesIdsByDateRange: vi.fn(),
  getGameDetails: vi.fn(),
}));

const mockReviews: IReview[] = [
  {
    id: 1,
    game_id: 1,
    user_id: 1,
    rating: 8,
    review_text: "Great!",
    review_date: null,
    createdAt: "",
    updatedAt: "",
    user: { id: 1, username: "user1" },
  },
  {
    id: 2,
    game_id: 1,
    user_id: 2,
    rating: 6,
    review_text: "Good.",
    review_date: null,
    createdAt: "",
    updatedAt: "",
    user: { id: 2, username: "user2" },
  },
];

const mockGames: IGame[] = [
  { id: 1, average_rating: 9, release_date: "2017-06-15" } as IGame,
  { id: 2, average_rating: 6, release_date: "2015-01-01" } as IGame,
  { id: 3, average_rating: 7, release_date: "2016-03-10" } as IGame,
];

describe("useGames - calculateAverageRating", () => {
  it("returns 0 when reviews are empty", () => {
    const { calculateAverageRating } = useGames();
    expect(calculateAverageRating([])).toBe(0);
  });

  it("returns 0 when reviews are undefined", () => {
    const { calculateAverageRating } = useGames();
    expect(calculateAverageRating(undefined)).toBe(0);
  });

  it("calculates average rating correctly", () => {
    const { calculateAverageRating } = useGames();
    expect(calculateAverageRating(mockReviews)).toBe(7);
  });

  it("rounds to 2 decimal places", () => {
    const { calculateAverageRating } = useGames();
    const reviews = [
      { ...mockReviews[0], rating: 7.9 },
      { ...mockReviews[0], rating: 8.4 },
      { ...mockReviews[0], rating: 9.9 },
    ];
    expect(calculateAverageRating(reviews as IReview[])).toBe(8.73);
  });
});

describe("useGames - sortByRating", () => {
  it("sorts games by average rating descending", () => {
    const { sortByRating } = useGames();
    const sorted = sortByRating(mockGames);
    expect(sorted).toHaveLength(3);
    expect(sorted[0]!.average_rating).toBe(9);
    expect(sorted[1]!.average_rating).toBe(7);
    expect(sorted[2]!.average_rating).toBe(6);
  });
});

describe("useGames - sortByReleaseDate", () => {
  it("sorts games by release date descending", () => {
    const { sortByReleaseDate } = useGames();
    const sorted = sortByReleaseDate(mockGames);
    expect(sorted[0]!.id).toBe(1);
    expect(sorted[1]!.id).toBe(3);
    expect(sorted[2]!.id).toBe(2);
  });
});
