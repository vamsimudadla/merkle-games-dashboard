export interface IGame {
  id: number;
  title: string;
  description: string;
  genre_id: number;
  platform: string;
  release_date: string;
  developer_id: number;
  publisher_id: number;
  createdAt: string;
  updatedAt: string;
  genre: IGenre;
  developer: ICompany;
  publisher: ICompany;
  reviews: IReview[];
  images: IImage[];
  average_rating: number;
}

export interface IGenre {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICompany {
  id: number;
  name: string;
  country: string;
  founded_year: number;
  logo: string | null;
  company_type: string;
  createdAt: string;
  updatedAt: string;
}

export interface IReview {
  id: number;
  game_id: number;
  user_id: number;
  rating: number;
  review_text: string;
  review_date: string | null;
  createdAt: string;
  updatedAt: string;
  user: IReviewUser;
}

export interface IReviewUser {
  id: number;
  username: string;
}

export interface IImage {
  id: number;
  image_url: string;
  image_type: string;
  createdAt: string;
  updatedAt: string;
  relations: ImageRelation[];
}

export interface ImageRelation {
  id: number;
  image_id: number;
  related_type: string;
  related_id: number;
  created_at: string;
  createdAt: string;
  updatedAt: string;
}

export enum SORT_OPTION {
  RATING = "rating",
  DATE = "date",
}
