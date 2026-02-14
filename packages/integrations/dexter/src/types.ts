/**
 * VarunaX - Dexter Integration Types
 *
 * TypeScript types for the Dexter AI financial research client.
 */

export interface StockPrice {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  high52Week: number;
  low52Week: number;
  peRatio: number;
  dividendYield: number;
  exchange: string;
  currency: string;
  lastUpdated: string;
}

export interface CompanyFinancials {
  symbol: string;
  name: string;
  sector: string;
  industry: string;
  beta: number;
  marketCap: number;
  peRatio: number;
  eps: number;
  revenue: number;
  revenueGrowth: number;
  grossProfit: number;
  operatingIncome: number;
  netIncome: number;
  totalAssets: number;
  totalLiabilities: number;
  shareholdersEquity: number;
  returnOnEquity: number;
  returnOnAssets: number;
  debtToEquity: number;
  currentRatio: number;
  quickRatio: number;
}

export interface IncomeStatement {
  symbol: string;
  period: 'annual' | 'quarterly';
  fiscalDate: string;
  revenue: number;
  costOfRevenue: number;
  grossProfit: number;
  operatingExpenses: number;
  operatingIncome: number;
  interestExpense: number;
  incomeBeforeTax: number;
  incomeTaxExpense: number;
  netIncome: number;
  eps: number;
  epsDiluted: number;
}

export interface BalanceSheet {
  symbol: string;
  period: 'annual' | 'quarterly';
  fiscalDate: string;
  cashAndEquivalents: number;
  shortTermInvestments: number;
  accountsReceivable: number;
  inventory: number;
  totalCurrentAssets: number;
  propertyPlantEquipment: number;
  intangibleAssets: number;
  totalAssets: number;
  accountsPayable: number;
  shortTermDebt: number;
  longTermDebt: number;
  totalLiabilities: number;
  totalEquity: number;
}

export interface CashFlowStatement {
  symbol: string;
  period: 'annual' | 'quarterly';
  fiscalDate: string;
  operatingCashFlow: number;
  capitalExpenditures: number;
  freeCashFlow: number;
  dividendsPaid: number;
  stockRepurchased: number;
  financingCashFlow: number;
}

export interface Filing {
  symbol: string;
  formType: string;
  filingDate: string;
  acceptedDate: string;
  periodOfReport: string;
  documentUrl: string;
  description: string;
}

export interface DCFAssumptions {
  revenueGrowthRate: number;
  terminalGrowthRate: number;
  discountRate: number;
  taxRate: number;
}

export interface DCFResult {
  symbol: string;
  companyName: string;
  currentPrice: number;
  dcfPrice: number;
  upside: number;
  assumptions: DCFAssumptions;
  intrinsicValue: number;
  terminalValue: number;
  pvOfFCF: number;
  methodology: string;
}

export interface ComparableCompany {
  symbol: string;
  name: string;
  marketCap: number;
  peRatio: number;
  pbRatio: number;
  psRatio: number;
  evEbitda: number;
  dividendYield: number;
  beta: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: string;
  symbols: string[];
  sentiment?: 'positive' | 'negative' | 'neutral';
}

export interface InsiderTrade {
  symbol: string;
  insiderName: string;
  title: string;
  transactionType: string;
  shares: number;
  price: number;
  value: number;
  filingDate: string;
  transactionDate: string;
}

export interface CryptoPrice {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  marketCap: number;
  volume24h: number;
  high24h: number;
  low24h: number;
}

export interface DexterConfig {
  apiKey?: string;
  baseUrl?: string;
  timeout?: number;
}

export type DexterErrorCode =
  | 'AUTH_ERROR'
  | 'RATE_LIMIT'
  | 'NOT_FOUND'
  | 'INVALID_PARAMS'
  | 'NETWORK_ERROR'
  | 'SERVER_ERROR';

export class DexterError extends Error {
  code: DexterErrorCode;
  statusCode?: number;

  constructor(message: string, code: DexterErrorCode, statusCode?: number) {
    super(message);
    this.name = 'DexterError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

export class DexterRateLimitError extends DexterError {
  retryAfter: number;

  constructor(retryAfter: number) {
    super(`Rate limit exceeded. Try again in ${retryAfter} seconds.`, 'RATE_LIMIT');
    this.name = 'DexterRateLimitError';
    this.retryAfter = retryAfter;
  }
}

export class DexterAuthError extends DexterError {
  constructor(message: string = 'Authentication failed. Please check your API key.') {
    super(message, 'AUTH_ERROR', 401);
    this.name = 'DexterAuthError';
  }
}
