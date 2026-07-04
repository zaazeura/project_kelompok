"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export interface Review {
  id: number;
  productId: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

interface ReviewContextType {
  reviews: Review[];
  addReview: (review: Omit<Review, "id" | "date">) => void;
  getReviews: (productId: number) => Review[];
  getAverageRating: (productId: number) => number;
}

const ReviewContext = createContext<ReviewContextType | null>(null);

const initialReviews: Review[] = [
  { id: 1, productId: 1, userName: "Andi", rating: 5, comment: "Nasi gorengnya enak banget! Bumbu meresap sempurna.", date: "2 Juli 2026" },
  { id: 2, productId: 1, userName: "Sari", rating: 4, comment: "Porsi besar, harga terjangkau. Recommended!", date: "1 Juli 2026" },
  { id: 3, productId: 2, userName: "Budi", rating: 5, comment: "Croissant paling enak yang pernah saya coba.", date: "30 Juni 2026" },
  { id: 4, productId: 5, userName: "Maya", rating: 4, comment: "Pizza-nya fresh, pepperoninya banyak.", date: "29 Juni 2026" },
  { id: 5, productId: 14, userName: "Rina", rating: 5, comment: "Boba-nya kenyal, milk tea-nya creamy. Favorit!", date: "28 Juni 2026" },
  { id: 6, productId: 18, userName: "Dedi", rating: 5, comment: "Ramen tonkotsu autentik! Kuahnya kaya rasa.", date: "27 Juni 2026" },
];

export function ReviewProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);

  const addReview = useCallback((review: Omit<Review, "id" | "date">) => {
    setReviews((prev) => [
      {
        ...review,
        id: prev.length + 1,
        date: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
      },
      ...prev,
    ]);
  }, []);

  const getReviews = useCallback((productId: number) => reviews.filter((r) => r.productId === productId), [reviews]);

  const getAverageRating = useCallback(
    (productId: number) => {
      const productReviews = reviews.filter((r) => r.productId === productId);
      if (productReviews.length === 0) return 0;
      return productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
    },
    [reviews]
  );

  return (
    <ReviewContext.Provider value={{ reviews, addReview, getReviews, getAverageRating }}>
      {children}
    </ReviewContext.Provider>
  );
}

export function useReviews() {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error("useReviews must be used within a ReviewProvider");
  }
  return context;
}
