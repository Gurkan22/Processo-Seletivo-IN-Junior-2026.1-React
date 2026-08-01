export interface Genre {
  id: number;
  name: string;
}

export interface MovieLight {
  id: number;
  title: string;
  posterImageUrl: string | null;
  releaseYear: number;
  genres: Genre[];
}

export interface MovieDetail {
  id: number;
  title: string;
  synopsis: string;
  posterImageUrl: string | null;
  bannerImageUrl: string | null;
  releaseYear: number;
  durationMinutes: number | null;
  ageRating: string | null;
  contentWarning: string | null;
  cast: string | null;
  avgRating: number | null;
  reviewCount: number;
  isFavorite: boolean;
  isWatched: boolean;
  genres: Genre[];
}

export interface PublicUser {
  id: number;
  fullName: string | null;
  avatarUrl: string | null;
  initials: string;
}

export interface Review {
  id: number;
  rating: number;
  text: string;
  createdAt: string;
  updatedAt: string;
  user: PublicUser;
  movie: {
    id: number;
    title: string;
    posterImageUrl: string | null;
    releaseYear: number;
  };
}

export interface Metadata {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  firstPage: number;
  firstPageUrl: string;
  lastPageUrl: string;
  nextPageUrl: string | null;
  previousPageUrl: string | null;
}

export interface Paginated<T> {
  data: T[];
  metadata: Metadata;
}

export interface ApiErrorItem {
  message: string;
  field?: string;
  rule?: string;
}
