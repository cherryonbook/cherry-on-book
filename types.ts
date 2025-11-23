export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  rating: number;
  coverUrl: string;
  description: string;
  tags: string[];
}

export interface CartItem extends Book {
  quantity: number;
}

export interface AIRecommendation {
  bookId: string;
  reason: string;
}

export interface SearchState {
  query: string;
  isSearching: boolean;
  results: string[] | null; // null means showing all, array means filtered IDs
  aiMessage: string | null;
}
