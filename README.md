# Crypto Tracker

Real-time cryptocurrency tracker. Prices update every 60 seconds, you can track favorites and build a portfolio.

## Features

- Top 50+ coins by market cap with pagination
- Live price updates (auto-refresh every 60s)
- Search and sort — applies to favorites too
- Coin detail page with 1D / 7D / 30D price chart
- Favorites with localStorage persistence
- Portfolio tracker with value breakdown
- Fully responsive dark UI

## Stack

React 19 · TypeScript · Tailwind CSS v4 · Vite · React Router v7 · Recharts · CoinGecko API

## Getting Started

```bash
cp .env.example .env        # add your CoinGecko API key (optional)
npm install
npm run dev
```

API key is optional — the app works without one but may hit rate limits on the free tier.

## Commands

```bash
npm run dev          # dev server
npm run build        # production build
npm test             # unit tests (70 tests)
npm run test:e2e     # E2E tests with Playwright
npm run lint         # ESLint
```

## Project Structure

```
src/
  api.ts           # all API calls in one place
  hooks/           # useFavorites, usePortfolio, useCoins
  components/      # CoinCard, Portfolio, CoinChart, AddToPortfolio, ...
  pages/           # Home, CoinDetail, NotFound
  test/            # unit tests
e2e/               # Playwright E2E tests
```

## Live Demo

[crypto-tracker-matin.vercel.app](https://crypto-tracker-matin.vercel.app)
