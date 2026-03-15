export const formatDate = (
  date: string,
  type: "long" | "short" = "short",
): string => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: type,
    day: "numeric",
  }).format(new Date(date));
};

export const getImageWithBaseURL = (imageURL: string) => {
  return `http://localhost:8000${imageURL}`;
};
