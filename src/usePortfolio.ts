import { useState } from "react";

export type PortfolioItem = {
  id: string;
  name: string;
  symbol: string;
  amount: number;
  image: string;
};

export function usePortfolio() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(() => {
    const saved = localStorage.getItem("portfolio");
    return saved ? JSON.parse(saved) : [];
  });

  const addToPortfolio = (item: PortfolioItem) => {
    setPortfolio((prev) => {
      const exists = prev.find((p) => p.id === item.id);
      let updated;
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
