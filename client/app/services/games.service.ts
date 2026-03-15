const API_BASE_URL = "http://localhost:8000/api/v1";

export const getGamesIdsByDateRange = async (from: string, to: string) => {
  const response = await $fetch(`${API_BASE_URL}/games/by-date-range`, {
    params: { from, to },
  });
  return response;
};

export const getGameDetails = async (id: number) => {
  const response: any = await $fetch(`${API_BASE_URL}/games/${id}`);
  return response?.data;
};
