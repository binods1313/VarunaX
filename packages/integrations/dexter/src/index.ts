/**
 * VarunaX - Dexter Integration
 *
 * A client library for the Dexter AI financial research assistant.
 * Provides mock data for development and testing.
 *
 * @example
 * import { createDexterClient } from '@varunax/dexter';
 *
 * const dexter = createDexterClient({ apiKey: 'your-api-key' });
 * const price = await dexter.getStockPrice('AAPL');
 */

export { createDexterClient, default } from './dexter-client';
export { FinancialDashboard } from './FinancialDashboard';
export type {
  StockPrice,
  CompanyFinancials,
  IncomeStatement,
  BalanceSheet,
  CashFlowStatement,
  Filing,
  DCFAssumptions,
  DCFResult,
  ComparableCompany,
  NewsArticle,
  InsiderTrade,
  CryptoPrice,
  DexterConfig,
} from './types';
export { DexterError, DexterRateLimitError, DexterAuthError } from './types';
