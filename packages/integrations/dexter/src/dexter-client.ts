/**
 * VarunaX - Dexter Client
 *
 * A client library for the Dexter AI financial research assistant.
 * Provides mock data for development and testing.
 */

import type {
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

import {
  MOCK_STOCKS,
  MOCK_FINANCIALS,
  MOCK_FILINGS,
  MOCK_CRYPTOS,
  MOCK_COMPARABLES,
  MOCK_NEWS,
  MOCK_INSIDER_TRADES,
  generateDCFResult,
  getNewsForSymbol,
  getInsiderTradesForSymbol,
} from './mock-data';

/**
 * Create a configured Dexter client
 */
export function createDexterClient(config: DexterConfig = {}) {
  const baseUrl = config.baseUrl || 'http://localhost:8000';
  const apiKey = config.apiKey || '';
  const timeout = config.timeout || 30000;

  // Simulate network delay
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  return {
    /**
     * Get current stock price for a ticker
     */
    async getStockPrice(ticker: string): Promise<StockPrice> {
      await delay(200);
      const upperTicker = ticker.toUpperCase();
      const stock = MOCK_STOCKS[upperTicker];

      if (!stock) {
        // Generate a random stock if not in mock data
        const basePrice = 50 + Math.random() * 200;
        return {
          symbol: upperTicker,
          name: `${upperTicker} Inc.`,
          price: Math.round(basePrice * 100) / 100,
          change: Math.round((Math.random() - 0.5) * 10 * 100) / 100,
          changePercent: Math.round((Math.random() - 0.5) * 5 * 100) / 100,
          volume: Math.floor(Math.random() * 50000000),
          marketCap: Math.floor(Math.random() * 500000000000),
          high52Week: Math.round((basePrice * 1.3) * 100) / 100,
          low52Week: Math.round((basePrice * 0.7) * 100) / 100,
          peRatio: Math.round((10 + Math.random() * 40) * 100) / 100,
          dividendYield: Math.round(Math.random() * 3 * 100) / 100,
          exchange: 'NYSE',
          currency: 'USD',
          lastUpdated: new Date().toISOString(),
        };
      }

      return stock;
    }

    /**
     * Get multiple stock prices
     */
    async getStockPrices(tickers: string[]): Promise<StockPrice[]> {
      await delay(300);
      return Promise.all(tickers.map(ticker => this.getStockPrice(ticker)));
    }

    /**
     * Get company financials
     */
    async getCompanyFinancials(ticker: string): Promise<CompanyFinancials> {
      await delay(250);
      const upperTicker = ticker.toUpperCase();
      const financials = MOCK_FINANCIALS[upperTicker];

      if (!financials) {
        // Generate mock financials
        const marketCap = 100000000000 + Math.random() * 500000000000;
        return {
          symbol: upperTicker,
          name: `${upperTicker} Inc.`,
          sector: 'Technology',
          industry: 'Software',
          beta: Math.round((0.8 + Math.random() * 0.8) * 100) / 100,
          marketCap: Math.floor(marketCap),
          peRatio: Math.round((15 + Math.random() * 40) * 100) / 100,
          eps: Math.round((2 + Math.random() * 8) * 100) / 100,
          revenue: Math.floor(marketCap * 0.1),
          revenueGrowth: Math.round(Math.random() * 0.3 * 100) / 100,
          grossProfit: Math.floor(marketCap * 0.05),
          operatingIncome: Math.floor(marketCap * 0.03),
          netIncome: Math.floor(marketCap * 0.02),
          totalAssets: Math.floor(marketCap * 0.8),
          totalLiabilities: Math.floor(marketCap * 0.4),
          shareholdersEquity: Math.floor(marketCap * 0.4),
          returnOnEquity: Math.round(Math.random() * 0.4 * 100) / 100,
          returnOnAssets: Math.round(Math.random() * 0.15 * 100) / 100,
          debtToEquity: Math.round(Math.random() * 2 * 100) / 100,
          currentRatio: Math.round((1 + Math.random() * 2) * 100) / 100,
          quickRatio: Math.round((0.8 + Math.random() * 2) * 100) / 100,
        };
      }

      return financials;
    }

    /**
     * Get income statement
     */
    async getIncomeStatement(ticker: string, period: 'annual' | 'quarterly' = 'annual'): Promise<IncomeStatement> {
      await delay(200);
      const upperTicker = ticker.toUpperCase();
      const revenue = 50000000000 + Math.random() * 100000000000;

      return {
        symbol: upperTicker,
        period,
        fiscalDate: period === 'annual' ? '2024-09-30' : '2024-06-30',
        revenue: Math.floor(revenue),
        costOfRevenue: Math.floor(revenue * 0.55),
        grossProfit: Math.floor(revenue * 0.45),
        operatingExpenses: Math.floor(revenue * 0.25),
        operatingIncome: Math.floor(revenue * 0.20),
        interestExpense: Math.floor(revenue * 0.02),
        incomeBeforeTax: Math.floor(revenue * 0.18),
        incomeTaxExpense: Math.floor(revenue * 0.04),
        netIncome: Math.floor(revenue * 0.14),
        eps: Math.round((2 + Math.random() * 8) * 100) / 100,
        epsDiluted: Math.round((1.8 + Math.random() * 7) * 100) / 100,
      };
    }

    /**
     * Get balance sheet
     */
    async getBalanceSheet(ticker: string, period: 'annual' | 'quarterly' = 'annual'): Promise<BalanceSheet> {
      await delay(200);
      const upperTicker = ticker.toUpperCase();
      const totalAssets = 100000000000 + Math.random() * 200000000000;

      return {
        symbol: upperTicker,
        period,
        fiscalDate: period === 'annual' ? '2024-09-30' : '2024-06-30',
        cashAndEquivalents: Math.floor(totalAssets * 0.15),
        shortTermInvestments: Math.floor(totalAssets * 0.1),
        accountsReceivable: Math.floor(totalAssets * 0.08),
        inventory: Math.floor(totalAssets * 0.05),
        totalCurrentAssets: Math.floor(totalAssets * 0.35),
        propertyPlantEquipment: Math.floor(totalAssets * 0.3),
        intangibleAssets: Math.floor(totalAssets * 0.1),
        totalAssets: Math.floor(totalAssets),
        accountsPayable: Math.floor(totalAssets * 0.08),
        shortTermDebt: Math.floor(totalAssets * 0.1),
        longTermDebt: Math.floor(totalAssets * 0.2),
        totalLiabilities: Math.floor(totalAssets * 0.5),
        totalEquity: Math.floor(totalAssets * 0.5),
      };
    }

    /**
     * Get cash flow statement
     */
    async getCashFlow(ticker: string, period: 'annual' | 'quarterly' = 'annual'): Promise<CashFlowStatement> {
      await delay(200);
      const upperTicker = ticker.toUpperCase();
      const operatingCashFlow = 10000000000 + Math.random() * 20000000000;

      return {
        symbol: upperTicker,
        period,
        fiscalDate: period === 'annual' ? '2024-09-30' : '2024-06-30',
        operatingCashFlow: Math.floor(operatingCashFlow),
        capitalExpenditures: Math.floor(operatingCashFlow * 0.2),
        freeCashFlow: Math.floor(operatingCashFlow * 0.8),
        dividendsPaid: Math.floor(operatingCashFlow * 0.25),
        stockRepurchased: Math.floor(operatingCashFlow * 0.3),
        financingCashFlow: Math.floor(operatingCashFlow * 0.1),
      };
    }

    /**
     * Get SEC filings for a ticker
     */
    async getFilings(ticker: string, formType?: string): Promise<Filing[]> {
      await delay(200);
      const upperTicker = ticker.toUpperCase();
      const filings = MOCK_FILINGS[upperTicker] || [];

      if (formType) {
        return filings.filter(f => f.formType === formType);
      }

      return filings;
    }

    /**
     * Get filing content (mock - returns placeholder)
     */
    async getFilingContent(filingUrl: string): Promise<string> {
      await delay(300);
      return `
# SEC Filing Document

This is mock content for: ${filingUrl}

## Summary
Lorem ipsum dolor sit amet, consectetur adipiscing elit.

## Financial Highlights
- Revenue: $XX billion
- Net Income: $X billion
- EPS: $X.XX

Note: This is mock data for development purposes.
      `.trim();
    }

    /**
     * Get DCF valuation
     */
    async getDCFValuation(ticker: string, assumptions?: Partial<DCFAssumptions>): Promise<DCFResult> {
      await delay(500);
      const upperTicker = ticker.toUpperCase();
      const result = generateDCFResult(upperTicker);

      if (assumptions) {
        result.assumptions = { ...result.assumptions, ...assumptions };
        // Recalculate
        result.dcfPrice = Math.round(result.dcfPrice * (0.9 + Math.random() * 0.2) * 100) / 100;
        result.upside = Math.round(((result.dcfPrice - result.currentPrice) / result.currentPrice) * 100 * 100) / 100;
      }

      return result;
    }

    /**
     * Get comparable companies
     */
    async getComparables(ticker: string): Promise<ComparableCompany[]> {
      await delay(250);
      const upperTicker = ticker.toUpperCase();
      return MOCK_COMPARABLES[upperTicker] || [];
    }

    /**
     * Get market news
     */
    async getMarketNews(query?: string): Promise<NewsArticle[]> {
      await delay(200);

      if (query) {
        const lowerQuery = query.toLowerCase();
        return MOCK_NEWS.filter(
          article =>
            article.title.toLowerCase().includes(lowerQuery) ||
            article.summary.toLowerCase().includes(lowerQuery)
        );
      }

      return MOCK_NEWS;
    }

    /**
     * Get insider trading data
     */
    async getInsiderTrading(ticker: string): Promise<InsiderTrade[]> {
      await delay(200);
      return getInsiderTradesForSymbol(ticker.toUpperCase());
    }

    /**
     * Get cryptocurrency price
     */
    async getCryptoPrice(symbol: string): Promise<CryptoPrice> {
      await delay(150);
      const upperSymbol = symbol.toUpperCase();
      const crypto = MOCK_CRYPTOS[upperSymbol];

      if (!crypto) {
        // Generate random crypto data
        const price = 10 + Math.random() * 500;
        return {
          symbol: upperSymbol,
          name: upperSymbol,
          price: Math.round(price * 100) / 100,
          change: Math.round((Math.random() - 0.5) * 20 * 100) / 100,
          changePercent: Math.round((Math.random() - 0.5) * 10 * 100) / 100,
          marketCap: Math.floor(Math.random() * 10000000000),
          volume: Math.floor(Math.random() * 1000000000),
          high24h: Math.round(price * 1.1 * 100) / 100,
          low24h: Math.round(price * 0.9 * 100) / 100,
        };
      }

      return crypto;
    }

    /**
     * Search for companies
     */
    async searchCompanies(query: string): Promise<{ symbol: string; name: string }[]> {
      await delay(200);
      const lowerQuery = query.toLowerCase();

      return Object.values(MOCK_STOCKS)
        .filter(stock =>
          stock.symbol.toLowerCase().includes(lowerQuery) ||
          stock.name.toLowerCase().includes(lowerQuery)
        )
        .map(stock => ({
          symbol: stock.symbol,
          name: stock.name,
        }));
    }
  };
}

// Default export
export default createDexterClient();
