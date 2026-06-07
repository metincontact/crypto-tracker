import { useState } from "react";
import type { PortfolioItem } from "./types";

function loadPortfolio(): PortfolioItem[] {
  try {
    const saved = localStorage.getItem("portfolio");
    return saved ? (JSON.parse(saved) as PortfolioItem[]) : [];
  } catch {
    return [];
  }
}

export function usePortfolio() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(loadPortfolio);

  const addToPortfolio = (item: PortfolioItem) => {
    setPortfolio((prev) => {
      const exists = prev.find((p) => p.id === item.id);
      let updated: PortfolioItem[];
      if (exists) {
        updated = prev.map((p) =>
          p.id === item.id ? { ...p, amount: p.amount + item.amount } : p,
        );
      } else {
        updated = [...prev, item];
      }
      localStorage.setItem("portfolio", JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromPortfolio = (id: string) => {
    setPortfolio((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      localStorage.setItem("portfolio", JSON.stringify(updated));
      return updated;
    });
  };

  return { portfolio, addToPortfolio, removeFromPortfolio };
}
