import YahooFinance from 'yahoo-finance2';

const yf = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

export class GoogleFinanceScraper {
  ticker: string;
  data: any;

  constructor(ticker: string) {
    this.ticker = ticker.toUpperCase().trim();
    this.data = {
      ticker: this.ticker,
      timestamp: new Date().toISOString(),
      price: null,
      change: null,
      changePercent: null,
      previousClose: null,
      dayRange: null,
      yearRange: null,
      news: []
    };
  }

  async scrape() {
    let yfTicker = this.ticker;
    const hardcoded: Record<string, string> = {
      'DXY': 'DX-Y.NYB',
      'XAUUSD': 'GC=F',
      'BTCUSD': 'BTC-USD',
      'GOLD': 'GC=F',
      'BBCA': 'BBCA.JK',
      'BBRI': 'BBRI.JK',
      'BBNI': 'BBNI.JK',
      'BMRI': 'BMRI.JK',
      'BUMI': 'BUMI.JK',
      'GOTO': 'GOTO.JK',
      'ANTM': 'ANTM.JK',
      'PGAS': 'PGAS.JK',
      'UNTR': 'UNTR.JK',
      'TLKM': 'TLKM.JK',
      'ASII': 'ASII.JK',
      'ICBP': 'ICBP.JK',
      'INDF': 'INDF.JK',
      'ADRO': 'ADRO.JK',
      'PTBA': 'PTBA.JK',
      'UNVR': 'UNVR.JK',
      'CPIN': 'CPIN.JK',
      'KLBF': 'KLBF.JK',
      'INKP': 'INKP.JK',
    };

    if (hardcoded[this.ticker]) yfTicker = hardcoded[this.ticker];

    try {
      let result;
      let newsResults: any[] = [];
      try {
        result = await yf.quote(yfTicker);
        if (!result || !result.regularMarketPrice) {
           throw new Error("Missing result");
        }
        try {
          const searchData = await yf.search(yfTicker, { newsCount: 3 });
          if (searchData && searchData.news) {
             newsResults = searchData.news;
          }
        } catch (e) {
          // ignore news errors
        }
      } catch (err: any) {
        if (!hardcoded[this.ticker]) {
          const searchRes = await yf.search(this.ticker, { newsCount: 3 });
          const exactMatch = searchRes?.quotes?.find(q => {
            const sym = String(q.symbol).toUpperCase();
            const t = this.ticker;
            return sym === t || sym === `${t}.JK` || sym === `^${t}`;
          });

          if (exactMatch && exactMatch.symbol) {
            yfTicker = String(exactMatch.symbol);
            result = await yf.quote(yfTicker);
            if (searchRes.news) {
                newsResults = searchRes.news;
            }
          } else {
             throw new Error(`Ticker '${this.ticker}' not found or invalid.`);
          }
        } else {
          throw new Error(`Ticker '${this.ticker}' not found or invalid.`);
        }
      }

      if (!result || !result.regularMarketPrice) {
        throw new Error(`Could not extract price data for ${this.ticker}.`);
      }

      const currentPrice = result.regularMarketPrice;
      const previousClose = result.regularMarketPreviousClose || currentPrice;
      const change = currentPrice - previousClose;
      const changePercent = (change / previousClose) * 100;
      
      this.data.price = currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 });
      this.data.previousClose = previousClose.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 });
      this.data.change = (change > 0 ? '+' : '') + change.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 });
      this.data.changePercent = (changePercent > 0 ? '+' : '') + changePercent.toFixed(2) + '%';
      
      if (result.regularMarketDayLow && result.regularMarketDayHigh) {
        this.data.dayRange = `${result.regularMarketDayLow.toLocaleString()} - ${result.regularMarketDayHigh.toLocaleString()}`;
      }
      
      if (result.fiftyTwoWeekLow && result.fiftyTwoWeekHigh) {
        this.data.yearRange = `${result.fiftyTwoWeekLow.toLocaleString()} - ${result.fiftyTwoWeekHigh.toLocaleString()}`;
      }
      
      if (newsResults && newsResults.length > 0) {
        this.data.news = newsResults.map(n => ({
           headline: n.title,
           source: n.publisher,
           time: n.providerPublishTime,
           url: n.link
        }));
      }

      return this.data;
    } catch (error: any) {
      throw new Error(`Scraping failed: ${error.message}`);
    }
  }
}


