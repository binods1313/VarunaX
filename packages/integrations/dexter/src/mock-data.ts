/**
 * VarunaX - Dexter Mock Data
 *
 * Mock data for development and testing.
 */

import type {
  StockPrice,
  CompanyFinancials,
  IncomeStatement,
  BalanceSheet,
  CashFlowStatement,
  Filing,
  DCFResult,
  ComparableCompany,
  NewsArticle,
  InsiderTrade,
  CryptoPrice,
} from './types';

// Helper to add random variation
const vary = (base: number, percent: number = 0.05): number => {
  const variation = base * percent * (Math.random() - 0.5) * 2;
  return Math.round((base + variation) * 100) / 100;
};

// Stock prices mock data
export const MOCK_STOCKS: Record<string, StockPrice> = {
  AAPL: {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 178.72,
    change: 2.34,
    changePercent: 1.33,
    volume: 52438291,
    marketCap: 2780000000000,
    high52Week: 198.23,
    low52Week: 124.17,
    peRatio: 28.45,
    dividendYield: 0.51,
    exchange: 'NASDAQ',
    currency: 'USD',
    lastUpdated: new Date().toISOString(),
  },
  MSFT: {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 378.91,
    change: -1.23,
    changePercent: -0.32,
    volume: 21345678,
    marketCap: 2810000000000,
    high52Week: 420.82,
    low52Week: 245.61,
    peRatio: 35.67,
    dividendYield: 0.74,
    exchange: 'NASDAQ',
    currency: 'USD',
    lastUpdated: new Date().toISOString(),
  },
  GOOGL: {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 141.80,
    change: 0.89,
    changePercent: 0.63,
    volume: 18234567,
    marketCap: 1780000000000,
    high52Week: 153.78,
    low52Week: 83.45,
    peRatio: 24.89,
    dividendYield: 0.0,
    exchange: 'NASDAQ',
    currency: 'USD',
    lastUpdated: new Date().toISOString(),
  },
  AMZN: {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    price: 178.25,
    change: 3.45,
    changePercent: 1.97,
    volume: 45678234,
    marketCap: 1850000000000,
    high52Week: 189.77,
    low52Week: 81.43,
    peRatio: 62.34,
    dividendYield: 0.0,
    exchange: 'NASDAQ',
    currency: 'USD',
    lastUpdated: new Date().toISOString(),
  },
  NVDA: {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 495.22,
    change: 12.34,
    changePercent: 2.56,
    volume: 38234567,
    marketCap: 1220000000000,
    high52Week: 505.48,
    low52Week: 138.84,
    peRatio: 65.78,
    dividendYield: 0.04,
    exchange: 'NASDAQ',
    currency: 'USD',
    lastUpdated: new Date().toISOString(),
  },
  META: {
    symbol: 'META',
    name: 'Meta Platforms Inc.',
    price: 505.67,
    change: -4.23,
    changePercent: -0.83,
    volume: 15234567,
    marketCap: 1300000000000,
    high52Week: 542.81,
    low52Week: 167.66,
    peRatio: 32.45,
    dividendYield: 0.0,
    exchange: 'NASDAQ',
    currency: 'USD',
    lastUpdated: new Date().toISOString(),
  },
  TSLA: {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    price: 248.50,
    change: 8.67,
    changePercent: 3.62,
    volume: 89234567,
    marketCap: 789000000000,
    high52Week: 299.29,
    low52Week: 152.37,
    peRatio: 78.23,
    dividendYield: 0.0,
    exchange: 'NASDAQ',
    currency: 'USD',
    lastUpdated: new Date().toISOString(),
  },
  JPM: {
    symbol: 'JPM',
    name: 'JPMorgan Chase & Co.',
    price: 195.42,
    change: 1.23,
    changePercent: 0.63,
    volume: 8234567,
    marketCap: 567000000000,
    high52Week: 205.88,
    low52Week: 123.11,
    peRatio: 11.23,
    dividendYield: 2.45,
    exchange: 'NYSE',
    currency: 'USD',
    lastUpdated: new Date().toISOString(),
  },
};

// Company financials mock data
export const MOCK_FINANCIALS: Record<string, CompanyFinancials> = {
  AAPL: {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    sector: 'Technology',
    industry: 'Consumer Electronics',
    beta: 1.28,
    marketCap: 2780000000000,
    peRatio: 28.45,
    eps: 6.28,
    revenue: 383290000000,
    revenueGrowth: 0.08,
    grossProfit: 169760000000,
    operatingIncome: 114060000000,
    netIncome: 97099000000,
    totalAssets: 352755000000,
    totalLiabilities: 290437000000,
    shareholdersEquity: 62318000000,
    returnOnEquity: 1.56,
    returnOnAssets: 0.27,
    debtToEquity: 1.98,
    currentRatio: 0.89,
    quickRatio: 0.69,
  },
  MSFT: {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    sector: 'Technology',
    industry: 'Software',
    beta: 0.91,
    marketCap: 2810000000000,
    peRatio: 35.67,
    eps: 10.63,
    revenue: 211915000000,
    revenueGrowth: 0.15,
    grossProfit: 135605000000,
    operatingIncome: 87432000000,
    netIncome: 72362000000,
    totalAssets: 411976000000,
    totalLiabilities: 205361000000,
    shareholdersEquity: 206615000000,
    returnOnEquity: 0.35,
    returnOnAssets: 0.18,
    debtToEquity: 0.44,
    currentRatio: 1.56,
    quickRatio: 1.52,
  },
  GOOGL: {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    sector: 'Technology',
    industry: 'Internet Services',
    beta: 1.05,
    marketCap: 1780000000000,
    peRatio: 24.89,
    eps: 5.70,
    revenue: 282110000000,
    revenueGrowth: 0.10,
    grossProfit: 156870000000,
    operatingIncome: 84270000000,
    netIncome: 72836000000,
    totalAssets: 373360000000,
    totalLiabilities: 113010000000,
    shareholdersEquity: 260350000000,
    returnOnEquity: 0.28,
    returnOnAssets: 0.20,
    debtToEquity: 0.07,
    currentRatio: 2.35,
    quickRatio: 2.32,
  },
};

// SEC Filings mock data
export const MOCK_FILINGS: Record<string, Filing[]> = {
  AAPL: [
    {
      symbol: 'AAPL',
      formType: '10-K',
      filingDate: '2024-10-28',
      acceptedDate: '2024-10-28',
      periodOfReport: '2024-09-28',
      documentUrl: 'https://www.sec.gov/Archives/edgar/data/320193/000032019323000012/a10-k2023.htm',
      description: 'Annual report for fiscal year 2024',
    },
    {
      symbol: 'AAPL',
      formType: '8-K',
      filingDate: '2024-11-15',
      acceptedDate: '2024-11-15',
      periodOfReport: '2024-11-14',
      documentUrl: 'https://www.sec.gov/Archives/edgar/data/320193/000032019323000015/a8-k2024.htm',
      description: 'Current report - Material event',
    },
    {
      symbol: 'AAPL',
      formType: 'DEF 14A',
      filingDate: '2024-09-20',
      acceptedDate: '2024-09-20',
      periodOfReport: '2024-09-20',
      documentUrl: 'https://www.sec.gov/Archives/edgar/data/320193/000032019323000009/def14a2024.htm',
      description: 'Proxy statement',
    },
  ],
  MSFT: [
    {
      symbol: 'MSFT',
      formType: '10-K',
      filingDate: '2024-07-30',
      acceptedDate: '2024-07-30',
      periodOfReport: '2024-06-30',
      documentUrl: 'https://www.sec.gov/Archives/edgar/data/789019/000078901923000015/msft10-k2023.htm',
      description: 'Annual report for fiscal year 2024',
    },
    {
      symbol: 'MSFT',
      formType: '10-Q',
      filingDate: '2024-10-23',
      acceptedDate: '2024-10-23',
      periodOfReport: '2024-09-30',
      documentUrl: 'https://www.sec.gov/Archives/edgar/data/789019/000078901923000018/msft10-q2024.htm',
      description: 'Quarterly report for Q1 FY2025',
    },
  ],
};

// News articles mock data
export const MOCK_NEWS: NewsArticle[] = [
  {
    id: '1',
    title: 'Apple Announces New AI Features for iPhone',
    summary: 'Apple unveiled new artificial intelligence capabilities coming to iPhone, including enhanced Siri and on-device processing.',
    source: 'Reuters',
    url: 'https://example.com/news/1',
    publishedAt: '2024-11-15T14:30:00Z',
    symbols: ['AAPL'],
    sentiment: 'positive',
  },
  {
    id: '2',
    title: 'Microsoft Cloud Revenue Beats Expectations',
    summary: 'Microsoft Azure revenue growth exceeded analyst expectations, driven by AI services demand.',
    source: 'Bloomberg',
    url: 'https://example.com/news/2',
    publishedAt: '2024-11-14T16:45:00Z',
    symbols: ['MSFT'],
    sentiment: 'positive',
  },
  {
    id: '3',
    title: 'NVIDIA Reports Record Data Center Revenue',
    summary: 'NVIDIA announced record quarterly revenue as AI chip demand continues to surge.',
    source: 'CNBC',
    url: 'https://example.com/news/3',
    publishedAt: '2024-11-13T09:15:00Z',
    symbols: ['NVDA'],
    sentiment: 'positive',
  },
  {
    id: '4',
    title: 'Federal Reserve Signals Rate Decision',
    summary: 'The Federal Reserve indicated it may pause interest rate hikes as inflation shows signs of cooling.',
    source: 'WSJ',
    url: 'https://example.com/news/4',
    publishedAt: '2024-11-12T18:00:00Z',
    symbols: ['JPM'],
    sentiment: 'neutral',
  },
  {
    id: '5',
    title: 'Tesla Faces Production Challenges in Germany',
    summary: 'Tesla experiencing supply chain issues at Berlin Gigafactory, may impact Q4 deliveries.',
    source: 'Financial Times',
    url: 'https://example.com/news/5',
    publishedAt: '2024-11-11T11:30:00Z',
    symbols: ['TSLA'],
    sentiment: 'negative',
  },
];

// Insider trades mock data
export const MOCK_INSIDER_TRADES: Record<string, InsiderTrade[]> = {
  AAPL: [
    {
      symbol: 'AAPL',
      insiderName: 'Tim Cook',
      title: 'CEO',
      transactionType: 'Sale',
      shares: 50000,
      price: 175.50,
      value: 8775000,
      filingDate: '2024-11-01',
      transactionDate: '2024-10-30',
    },
    {
      symbol: 'AAPL',
      insiderName: 'Luca Maestri',
      title: 'CFO',
      transactionType: 'Sale',
      shares: 25000,
      price: 176.20,
      value: 4405000,
      filingDate: '2024-10-28',
      transactionDate: '2024-10-25',
    },
  ],
  MSFT: [
    {
      symbol: 'MSFT',
      insiderName: 'Satya Nadella',
      title: 'CEO',
      transactionType: 'Purchase',
      shares: 10000,
      price: 370.00,
      value: 3700000,
      filingDate: '2024-11-05',
      transactionDate: '2024-11-04',
    },
  ],
};

// Crypto prices mock data
export const MOCK_CRYPTOS: Record<string, CryptoPrice> = {
  BTC: {
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 43250.00,
    change: 1250.00,
    changePercent: 2.98,
    marketCap: 847000000000,
    volume: 28500000000,
    high24h: 44100.00,
    low24h: 41800.00,
  },
  ETH: {
    symbol: 'ETH',
    name: 'Ethereum',
    price: 2280.00,
    change: -45.00,
    changePercent: -1.94,
    marketCap: 274000000000,
    volume: 15200000000,
    high24h: 2350.00,
    low24h: 2240.00,
  },
  SOL: {
    symbol: 'SOL',
    name: 'Solana',
    price: 98.50,
    change: 8.75,
    changePercent: 9.75,
    marketCap: 42000000000,
    volume: 3200000000,
    high24h: 102.00,
    low24h: 89.00,
  },
};

// Comparable companies mock data
export const MOCK_COMPARABLES: Record<string, ComparableCompany[]> = {
  AAPL: [
    { symbol: 'MSFT', name: 'Microsoft', marketCap: 2810000000000, peRatio: 35.67, pbRatio: 12.45, psRatio: 13.25, evEbitda: 24.56, dividendYield: 0.74, beta: 0.91 },
    { symbol: 'GOOGL', name: 'Alphabet', marketCap: 1780000000000, peRatio: 24.89, pbRatio: 6.78, psRatio: 6.31, evEbitda: 17.23, dividendYield: 0.0, beta: 1.05 },
    { symbol: 'AMZN', name: 'Amazon', marketCap: 1850000000000, peRatio: 62.34, pbRatio: 8.92, psRatio: 6.56, evEbitda: 28.45, dividendYield: 0.0, beta: 1.22 },
  ],
};

// Generate DCF mock result
export const generateDCFResult = (symbol: string): DCFResult => {
  const stock = MOCK_STOCKS[symbol];
  if (!stock) {
    throw new Error(`No mock data for symbol: ${symbol}`);
  }

  const dcfPrice = vary(stock.price * 1.2);
  const upside = ((dcfPrice - stock.price) / stock.price) * 100;

  return {
    symbol,
    companyName: stock.name,
    currentPrice: stock.price,
    dcfPrice,
    upside,
    assumptions: {
      revenueGrowthRate: 0.08,
      terminalGrowthRate: 0.025,
      discountRate: 0.10,
      taxRate: 0.21,
    },
    intrinsicValue: dcfPrice * 0.85,
    terminalValue: stock.marketCap * 1.5,
    pvOfFCF: stock.marketCap * 0.6,
    methodology: '10-year DCF with 2.5% terminal growth rate and 10% WACC',
  };
};

// Get random news for a symbol
export const getNewsForSymbol = (symbol: string): NewsArticle[] => {
  return MOCK_NEWS.filter(article => article.symbols.includes(symbol));
};

// Get insider trades for a symbol
export const getInsiderTradesForSymbol = (symbol: string): InsiderTrade[] => {
  return MOCK_INSIDER_TRADES[symbol] || [];
};
