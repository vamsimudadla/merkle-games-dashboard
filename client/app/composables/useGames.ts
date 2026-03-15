import {
  getGameDetails,
  getGamesIdsByDateRange,
} from "~/services/games.service";
import { SORT_OPTION, type IGame, type IReview } from "~/types";

export const useGames = () => {
  const games = useState<IGame[]>("games", () => []);
  const isLoading = useState<boolean>("games-loading", () => false);
  const error = useState<string | null>("games-error", () => null);
  const sortOption = useState<SORT_OPTION>(
    "games-sort",
    () => SORT_OPTION.RATING,
  );

  const calculateAverageRating = (reviews?: IReview[]): number => {
    if (!reviews?.length) return 0;

    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    const avg = total / reviews.length;

    return Number(avg.toFixed(2));
  };

  const sortByRating = (games: IGame[]): IGame[] => {
    return [...games].sort((a, b) => b.average_rating - a.average_rating);
  };

  const sortByReleaseDate = (data: IGame[]): IGame[] => {
    return [...data].sort(
      (a, b) =>
        new Date(b.release_date).getTime() - new Date(a.release_date).getTime(),
    );
  };

  const getRandomIds = (ids: number[], count: number = 15): number[] => {
    return [...ids].sort(() => Math.random() - 0.5).slice(0, count);
  };

  const getGamesDetailsByIds = async (ids: number[]) => {
    return await Promise.all(ids.map((id) => getGameDetails(id)));
  };

  const getGames = async () => {
    if (games.value.length > 0) return;

    isLoading.value = true;
    error.value = null;

    try {
      const data: any = await getGamesIdsByDateRange(
        "2015-01-01",
        "2017-12-31",
      );
      const randomIds = getRandomIds(data?.ids as number[], 15);
      const gamesData = (await getGamesDetailsByIds(randomIds)) as IGame[];
      gamesData.forEach((game) => {
        game.average_rating = calculateAverageRating(game.reviews);
      });
      games.value = sortByRating(gamesData as IGame[]);
    } catch (err) {
      error.value = "Failed to load games. Please try again.";
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  };

  const applySort = (option: SORT_OPTION) => {
    sortOption.value = option;
    if (option === SORT_OPTION.RATING) {
      games.value = sortByRating(games.value);
    } else {
      games.value = sortByReleaseDate(games.value);
    }
  };

  return {
    games,
    isLoading,
    error,
    sortOption,
    calculateAverageRating,
    getGames,
    applySort,
    sortByRating,
    sortByReleaseDate,
  };
};
