import React, { useEffect, useState } from 'react';
import { RefreshCw, Search, Activity, X, Plus, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { cn } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const API_BASE_URL = ''; // Same origin in production

interface Article {
  headline: string;
  source?: string;
  time?: string;
  url: string;
}

interface TickerData {
  ticker: string;
  timestamp: string;
  price: string;
  change: string;
  changePercent: string;
  previousClose?: string;
  dayRange?: string;
  yearRange?: string;
  marketCap?: string;
  peRatio?: string;
  news?: Article[];
  cached?: boolean;
}

export default function App() {
  const [tickers, setTickers] = useState<string[]>([]);
  const [tickerInput, setTickerInput] = useState('');
  const [data, setData] = useState<Record<string, TickerData>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);
  const [globalLoading, setGlobalLoading] = useState(false);

  useEffect(() => {
    refreshAll();
    const interval = setInterval(refreshAll, 10000); // 10s sync
    return () => clearInterval(interval);
  }, [tickers]);

  const fetchTickerData = async (ticker: string) => {
    setLoading(prev => ({ ...prev, [ticker]: true }));
    setErrors(prev => ({ ...prev, [ticker]: '' }));
    try {
      const res = await fetch(`${API_BASE_URL}/api/quote/${ticker}`);
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.error || 'Failed to fetch');
      setData(prev => ({ ...prev, [ticker]: result.data }));
    } catch (err: any) {
      setErrors(prev => ({ ...prev, [ticker]: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, [ticker]: false }));
    }
  };

  const refreshAll = async () => {
    if (tickers.length === 0) return;
    setGlobalLoading(true);
    await Promise.all(tickers.map(ticker => fetchTickerData(ticker)));
    setLastUpdate(Date.now());
    setGlobalLoading(false);
  };

  const addTicker = (tInput: string) => {
    const t = tInput.toUpperCase().trim();
    if (!t) return;
    if (tickers.includes(t)) return;
    setTickers(prev => [...prev, t]);
    setTickerInput('');
  };

  const removeTicker = (ticker: string) => {
    setTickers(prev => prev.filter(t => t !== ticker));
    setData(prev => {
      const newData = { ...prev };
      delete newData[ticker];
      return newData;
    });
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white/30 pb-12">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        {/* Controls */}
        <section className="panel rounded-xl p-5 mb-6 relative overflow-hidden">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-white transition-colors" />
              <input
                type="text"
                value={tickerInput}
                onChange={e => setTickerInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addTicker(tickerInput)}
                placeholder="Enter ticker (e.g. AAPL, XAUUSD, TSLA, BBCA)"
                className="w-full input-field rounded-lg pl-12 pr-4 py-3 outline-none transition-all font-mono placeholder:normal-case placeholder:tracking-normal placeholder:text-white/30 text-sm focus:ring-1 focus:ring-white/20 text-white"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => addTicker(tickerInput)}
              className="bg-white text-black font-semibold px-6 py-3 rounded-lg hover:bg-white/90 transition-colors text-sm flex items-center gap-2 justify-center"
            >
              <Plus className="w-4 h-4" /> Add
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={refreshAll}
              disabled={globalLoading}
              className="bg-[#111] border border-white/10 text-white font-semibold px-4 py-3 rounded-lg hover:bg-[#1A1A1A] transition-colors flex items-center justify-center gap-2"
              title="Refresh All"
            >
              <RefreshCw className={cn("w-4 h-4", globalLoading && "animate-spin")} />
            </motion.button>
          </div>
        </section>

        {/* Tickers Grid */}
        {tickers.length === 0 ? (
          <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="text-center py-24 panel rounded-xl">
            <div className="w-16 h-16 bg-[#111] rounded-full mx-auto mb-4 flex items-center justify-center border border-white/10">
              <Activity className="text-white/50 w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white">Empty Watchlist</h3>
            <p className="text-white/40 text-sm max-w-sm mx-auto">Add a symbol above to start monitoring live market data.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {tickers.map(ticker => (
                <TickerCard
                  key={ticker}
                  ticker={ticker}
                  data={data[ticker]}
                  loading={loading[ticker]}
                  error={errors[ticker]}
                  onRemove={() => removeTicker(ticker)}
                  onRetry={() => fetchTickerData(ticker)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}

const TickerCard: React.FC<{
  ticker: string;
  data?: TickerData;
  loading?: boolean;
  error?: string;
  onRemove: () => void;
  onRetry: () => void | Promise<void>;
}> = ({ ticker, data, loading, error, onRemove, onRetry }) => {
  const isPositive = data?.changePercent?.includes('+');
  const isNegative = data?.changePercent?.includes('-');
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="group relative rounded-xl p-6 overflow-hidden transition-all duration-300 panel hover:border-white/20 flex flex-col min-h-[220px]"
    >
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-5">
          <h3 className="text-2xl font-bold font-mono tracking-tight text-white">{ticker}</h3>
          <button 
            onClick={onRemove} 
            className="text-white/20 hover:text-red-500 transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {loading && !data ? (
          <div className="flex-1 flex flex-col items-center justify-center py-8 gap-3">
            <RefreshCw className="w-5 h-5 text-white/50 animate-spin" />
            <p className="text-[10px] font-bold tracking-widest text-white/30 uppercase">Syncing</p>
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-6 border border-white/5 bg-[#111] rounded-lg">
            <Activity className="w-6 h-6 text-red-500/80 mb-3" />
            <div className="text-red-400 font-bold tracking-wide mb-1 uppercase text-[10px]">Error Data</div>
            <p className="text-[10px] text-white/40 mb-4 line-clamp-2 px-2 font-mono">{error}</p>
            <button 
              onClick={onRetry} 
              className="text-[10px] font-bold uppercase tracking-widest bg-[#1A1A1A] border border-white/10 px-4 py-2 rounded-md hover:bg-white/10 transition-colors text-white"
            >
              Retry
            </button>
          </div>
        ) : data ? (
          <>
            <div className="mb-6">
              <div className="flex items-center gap-4">
                <div className="text-[36px] font-bold tracking-tighter text-white font-mono leading-none">
                  {data.price || 'N/A'}
                </div>
                {data && (
                  <div className={cn(
                    "px-2.5 py-1 rounded text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5 border",
                    data.cached ? "bg-white/5 text-white/50 border-white/10" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                  )}>
                    {!data.cached && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 live-indicator-green shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                    )}
                    {data.cached ? "Cached" : "LIVE"}
                  </div>
                )}
              </div>
              <div className="mt-3 flex items-center">
                <span className={cn(
                  "text-[14px] font-medium font-mono tracking-tight flex items-center gap-1.5",
                  isPositive ? "text-emerald-400" : isNegative ? "text-rose-500" : "text-white/60"
                )}>
                  {isPositive && <ArrowUpRight className="w-4 h-4" />}
                  {isNegative && <ArrowDownRight className="w-4 h-4" />}
                  {!isPositive && !isNegative && <Minus className="w-4 h-4" />}
                  {data.change || '0'} ({data.changePercent || '0%'})
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {data.previousClose && (
                <div className="bg-[#111] rounded-lg p-3 border border-white/5">
                  <div className="text-white/40 text-[9px] font-bold mb-1 uppercase tracking-widest">
                    Prev Close
                  </div>
                  <div className="font-semibold font-mono tracking-tight text-sm text-white/90">{data.previousClose}</div>
                </div>
              )}
              {data.dayRange && (
                <div className="bg-[#111] rounded-lg p-3 border border-white/5">
                  <div className="text-white/40 text-[9px] font-bold mb-1 uppercase tracking-widest">
                    Day Range
                  </div>
                  <div className="font-semibold font-mono tracking-tight text-[11px] mt-0.5 text-white/90 whitespace-nowrap overflow-hidden text-ellipsis">{data.dayRange}</div>
                </div>
              )}
            </div>

            {data.news && data.news.length > 0 && (
              <div className="mt-auto pt-3">
                <div className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-2 px-1 border-b border-white/10 pb-1">
                  News
                </div>
                <div className="space-y-1">
                  {data.news.slice(0, 2).map((article, idx) => (
                    <a key={idx} href={article.url} target="_blank" rel="noreferrer" className="block py-2 group/article hover:bg-[#111] px-1 rounded transition-colors">
                      <div className="text-[13px] font-medium line-clamp-2 mb-1 group-hover/article:text-white transition-colors text-white/80 leading-snug">{article.headline}</div>
                      <div className="text-[9px] text-white/40 font-mono tracking-wider uppercase">
                        {article.source || 'Market News'} {article.time && new Date(article.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>
    </motion.div>
  );
}
