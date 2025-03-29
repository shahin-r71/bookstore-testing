// Define interface for book parameters
export interface BookParams {
  region: string;
  seed: string;
  likes: number;
  reviews: number;
  page: number;
  limit: number;
}

// Define interface for book
export interface Book {
  id: string;
  isbn: string;
  title: string;
  authors: string[];
  publisher: string;
  coverUrl: string;
  likes: number;
  reviews: ReviewItem[];
}

// Define interface for review
export interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
}