"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { products, type Product } from "@/data/products";

interface ViewHistory {
  productId: number;
  timestamp: string;
}

interface RecommendationContextType {
  getSimilarProducts: (productId: number, limit?: number) => Product[];
  getRecentlyViewed: (limit?: number) => Product[];
  getTrendingProducts: (limit?: number) => Product[];
  getRecommendedForYou: (limit?: number) => Product[];
  trackProductView: (productId: number) => void;
  recentlyViewed: ViewHistory[];
}

const RecommendationContext = createContext<RecommendationContextType | null>(null);

const VIEW_HISTORY_KEY = "foodsaver_view_history";

function getViewHistory(): ViewHistory[] {
  try {
    const raw = localStorage.getItem(VIEW_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveViewHistory(history: ViewHistory[]) {
  localStorage.setItem(VIEW_HISTORY_KEY, JSON.stringify(history.slice(-50))); // Keep last 50
}

function calculateSimilarity(a: Product, b: Product): number {
  let score = 0;

  // Same category = +3
  if (a.categorySlug === b.categorySlug) score += 3;

  // Same shop = +2
  if (a.shopId === b.shopId) score += 2;

  // Similar price range (within 30%) = +1
  const priceDiff = Math.abs(a.discountPrice - b.discountPrice) / Math.max(a.discountPrice, b.discountPrice);
  if (priceDiff < 0.3) score += 1;

  // Similar rating (within 0.5) = +1
  if (Math.abs(a.rating - b.rating) < 0.5) score += 1;

  // Shared tags = +1 per tag
  const sharedTags = a.tags.filter((t) => b.tags.includes(t));
  score += Math.min(sharedTags.length, 2);

  // Same product type = +1
  if (a.productType === b.productType) score += 1;

  return score;
}

export function RecommendationProvider({ children }: { children: ReactNode }) {
  const [recentlyViewed, setRecentlyViewed] = useState<ViewHistory[]>([]);

  useEffect(() => {
    setRecentlyViewed(getViewHistory());
  }, []);

  const trackProductView = useCallback((productId: number) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((v) => v.productId !== productId);
      const updated = [...filtered, { productId, timestamp: new Date().toISOString() }];
      saveViewHistory(updated);
      return updated;
    });
  }, []);

  const getSimilarProducts = useCallback(
    (productId: number, limit = 6): Product[] => {
      const sourceProduct = products.find((p) => p.id === productId);
      if (!sourceProduct) return [];

      return products
        .filter((p) => p.id !== productId && p.inStock)
        .map((p) => ({
          product: p,
          similarity: calculateSimilarity(sourceProduct, p),
        }))
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit)
        .map((item) => item.product);
    },
    []
  );

  const getRecentlyViewed = useCallback(
    (limit = 10): Product[] => {
      return recentlyViewed
        .slice(-limit)
        .reverse()
        .map((v) => products.find((p) => p.id === v.productId))
        .filter((p): p is Product => p !== undefined);
    },
    [recentlyViewed]
  );

  const getTrendingProducts = useCallback((limit = 8): Product[] => {
    // Simulate trending based on rating and review count
    return [...products]
      .filter((p) => p.inStock)
      .sort((a, b) => {
        const scoreA = a.rating * 10 + Math.log(a.reviewCount + 1);
        const scoreB = b.rating * 10 + Math.log(b.reviewCount + 1);
        return scoreB - scoreA;
      })
      .slice(0, limit);
  }, []);

  const getRecommendedForYou = useCallback(
    (limit = 10): Product[] => {
      if (recentlyViewed.length === 0) {
        // If no history, return trending
        return getTrendingProducts(limit);
      }

      // Get products viewed recently
      const viewedIds = recentlyViewed.slice(-5).map((v) => v.productId);

      // Find similar products to viewed ones
      const candidates: { product: Product; score: number }[] = [];

      products
        .filter((p) => p.inStock && !viewedIds.includes(p.id))
        .forEach((product) => {
          let totalScore = 0;
          viewedIds.forEach((viewedId) => {
            const viewedProduct = products.find((p) => p.id === viewedId);
            if (viewedProduct) {
              totalScore += calculateSimilarity(product, viewedProduct);
            }
          });
          candidates.push({ product, score: totalScore });
        });

      return candidates
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((c) => c.product);
    },
    [recentlyViewed, getTrendingProducts]
  );

  return (
    <RecommendationContext.Provider
      value={{
        getSimilarProducts,
        getRecentlyViewed,
        getTrendingProducts,
        getRecommendedForYou,
        trackProductView,
        recentlyViewed,
      }}
    >
      {children}
    </RecommendationContext.Provider>
  );
}

export function useRecommendation() {
  const context = useContext(RecommendationContext);
  if (!context) {
    throw new Error("useRecommendation must be used within a RecommendationProvider");
  }
  return context;
}
