# Fiscrap Tester 📈

Fiscrap Tester is a robust, real-time market intelligence dashboard built with React, Vite, Express, and Tailwind CSS. It allows you to track live stock prices, cryptocurrency exchange rates, and indices with low-latency fetching and an elegant, glassmorphic UI.

## ✨ Features

- **Real-Time Price Tracking**: accurately fetch up-to-the-minute data for a wide range of assets (Stocks, Crypto, Indices).
- **Zero-Latency Feel Backend**: A dedicated backend data aggregator that reliably bypasses frontend scraping limitations.
- **Glassmorphic Dashboard Design**: Premium, visually appealing UI with micro-interactions, responsive grids, and real-time status indicators.
- **Multi-Asset Support**: Track standard tickers (e.g., `AAPL`, `MSFT`), Crypto (`BTCUSD`), and indices (`DXY`).
- **Live Sync**: Update all tracked assets simultaneously with a single click.

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React (Icons).
- **Backend**: Node.js, Express.
- **Data Source**: Rapid, server-side data fetching for maximum reliability and precision.
- **Build Tool**: Vite & esbuild.

## 📂 Project Structure

```text
├── src/
│   ├── App.tsx          # Main React Application UI and state
│   ├── main.tsx         # React DOM Entry point
│   ├── index.css        # Tailwind global styling configuration
│   └── scraper.ts       # Backend scraper and data fetching logic
├── server.ts            # Full-stack Express application entry point
├── package.json         # Project dependencies and deployment scripts
├── vite.config.ts       # Vite configuration and plugins
└── index.html           # Main HTML entry file
```

## 🚀 Getting Started

Ensure you have Node.js (v18+) installed on your machine.

### 1. Installation

Install all required project dependencies:
```bash
npm install
```

### 2. Running in Development

Start the development server. This boots up the Express backend alongside the Vite frontend proxy:
```bash
npm run dev
```
The application will be accessible at `http://localhost:3000`.

### 3. Building for Production

Compile the project to static assets (for the frontend) and bundle the backend into a single CommonJS module:
```bash
npm run build
```
This prepares the optimized build files directly into the `dist/` folder.

### 4. Running in Production

Serve the compiled, production-ready application:
```bash
npm run start
```

## 📡 API Reference

### `GET /api/quote/:ticker`

Fetches real-time market data for the requested ticker.

**Parameters**
- `ticker` (string): The symbol of the asset (e.g., `AAPL`, `DXY`, `BTCUSD`).

**Response format (JSON)**
```json
{
  "success": true,
  "cached": false,
  "data": {
    "ticker": "AAPL",
    "timestamp": "2026-05-14T11:22:42.000Z",
    "price": "298.87",
    "previousClose": "294.80",
    "change": "+4.07",
    "changePercent": "+1.38%",
    "news": []
  }
}
```

## 💡 How it Works & Data Fetching

The application uses an integrated Node.js Express server (`server.ts`) to resolve cross-origin constraints normally faced by client-only configurations.
The backend logic (`src/scraper.ts`) routes requests explicitly for US New York Wall Street datasets. By transitioning from unstable HTML web scraping to secure, latency-optimized raw JSON endpoints, the data stream guarantees 100% precision, ensuring prices sync predictably and accurately in real-time.

## 📝 License

This project is open-source and easily adaptable for further financial data scraping setups.
