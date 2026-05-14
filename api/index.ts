import express from "express";
import cors from "cors";
import { GoogleFinanceScraper } from "../src/scraper";

// In-memory cache
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCacheKey(ticker: string, endpoint: string) {
  return `${ticker}_${endpoint}`;
}

function isCacheValid(cacheEntry: any) {
  if (!cacheEntry) return false;
  return Date.now() - cacheEntry.timestamp < CACHE_TTL;
}

function setCache(key: string, data: any) {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
}

function getCache(key: string) {
  const entry = cache.get(key);
  if (isCacheValid(entry)) {
    return entry.data;
  }
  cache.delete(key);
  return null;
}

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.get(["/api/quote/:ticker", "/quote/:ticker"], async (req, res) => {
  const { ticker } = req.params;
  const { nocache } = req.query;

  try {
    if (!nocache) {
      const cached = getCache(getCacheKey(ticker, "quote"));
      if (cached) {
        return res.json({
          success: true,
          cached: true,
          data: cached
        });
      }
    }

    const scraper = new GoogleFinanceScraper(ticker);
    const data = await scraper.scrape();
    
    setCache(getCacheKey(ticker, "quote"), data);

    res.json({
      success: true,
      cached: false,
      data
    });
  } catch (error: any) {
    res.status(200).json({
      success: false,
      error: error.message
    });
  }
});

app.get(["/api/news/:ticker", "/news/:ticker"], async (req, res) => {
  const { ticker } = req.params;
  try {
    const cached = getCache(getCacheKey(ticker, "quote"));
    if (cached && cached.news) {
      return res.json({
        success: true,
        cached: true,
        ticker,
        count: cached.news.length,
        news: cached.news
      });
    }

    const scraper = new GoogleFinanceScraper(ticker);
    const data = await scraper.scrape();
    setCache(getCacheKey(ticker, "quote"), data);

    res.json({
      success: true,
      cached: false,
      ticker,
      count: data.news.length,
      news: data.news
    });
  } catch (error: any) {
    res.status(200).json({
      success: false,
      error: error.message
    });
  }
});

app.post(["/api/batch", "/batch"], async (req, res) => {
  const { tickers } = req.body;

  if (!Array.isArray(tickers) || tickers.length === 0) {
    return res.status(400).json({
      success: false,
      error: "tickers must be a non-empty array"
    });
  }

  if (tickers.length > 10) {
    return res.status(400).json({
      success: false,
      error: "Maximum 10 tickers per batch request"
    });
  }

  try {
    const results: any = {};
    for (const ticker of tickers) {
      try {
        const scraper = new GoogleFinanceScraper(ticker);
        const data = await scraper.scrape();
        results[ticker] = { success: true, data };
        setCache(getCacheKey(ticker, "quote"), data);
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error: any) {
        results[ticker] = { success: false, error: error.message };
      }
    }
    res.json({ success: true, results });
  } catch (error: any) {
    res.status(200).json({ success: false, error: error.message });
  }
});

app.get(["/api/health", "/health"], (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    uptime: process.uptime(),
    cacheSize: cache.size
  });
});

export default app;
