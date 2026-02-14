/**
 * VarunaX - Financial Dashboard Component
 *
 * A sample dashboard demonstrating the Dexter integration with stock data.
 */

import React, { useState, useEffect } from 'react';
import { createDexterClient } from './dexter-client';
import type { StockPrice, NewsArticle } from './types';

// Create Dexter client instance
const dexter = createDexterClient();

interface DashboardProps {
  className?: string;
}

export const FinancialDashboard: React.FC<DashboardProps> = ({ className = '' }) => {
  const [prices, setPrices] = useState<StockPrice[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicker, setSelectedTicker] = useState<string>('AAPL');

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [priceData, newsData] = await Promise.all([
          dexter.getStockPrices(['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA', 'JPM']),
          dexter.getMarketNews(),
        ]);
        setPrices(priceData);
        setNews(newsData);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Refresh every 60 seconds
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (value: number): string => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toFixed(2)}`;
  };

  const formatPrice = (price: number): string => {
    return `$${price.toFixed(2)}`;
  };

  const getChangeColor = (change: number): string => {
    if (change > 0) return 'var(--color-gain)';
    if (change < 0) return 'var(--color-loss)';
    return 'var(--text-secondary)';
  };

  if (loading) {
    return (
      <div className={className} style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '24px', marginBottom: '16px' }}>Loading...</div>
        <div style={{ color: 'var(--text-secondary)' }}>Fetching market data...</div>
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        padding: '24px',
        fontFamily: 'var(--font-family-sans)',
        background: 'var(--surface-base)',
        minHeight: '100%',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '4px' }}>
          Financial Dashboard
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Powered by Dexter AI • Real-time market data
        </p>
      </div>

      {/* Market Summary */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        }}
      >
        {prices.slice(0, 4).map((stock) => (
          <div
            key={stock.symbol}
            onClick={() => setSelectedTicker(stock.symbol)}
            style={{
              padding: '16px',
              background: selectedTicker === stock.symbol ? 'var(--color-primary-50)' : 'var(--surface-elevated)',
              borderRadius: 'var(--radius-lg)',
              border: `1px solid ${selectedTicker === stock.symbol ? 'var(--color-primary-200)' : 'var(--border-default)'}`,
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontWeight: 600 }}>{stock.symbol}</span>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{stock.exchange}</span>
            </div>
            <div style={{ fontSize: '20px', fontWeight: 600, marginBottom: '4px' }}>
              {formatPrice(stock.price)}
            </div>
            <div style={{ fontSize: '14px', color: getChangeColor(stock.change) }}>
              {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Stock Table */}
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Market Watch</h2>
          <div style={{ background: 'var(--surface-elevated)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-default)' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '13px' }}>Symbol</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, fontSize: '13px' }}>Price</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, fontSize: '13px' }}>Change</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, fontSize: '13px' }}>Volume</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, fontSize: '13px' }}>Mkt Cap</th>
                </tr>
              </thead>
              <tbody>
                {prices.map((stock) => (
                  <tr
                    key={stock.symbol}
                    onClick={() => setSelectedTicker(stock.symbol)}
                    style={{
                      cursor: 'pointer',
                      background: selectedTicker === stock.symbol ? 'var(--color-primary-50)' : 'transparent',
                      transition: 'background var(--transition-fast)',
                    }}
                  >
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 600 }}>{stock.symbol}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{stock.name}</div>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 500 }}>
                      {formatPrice(stock.price)}
                    </td>
                    <td
                      style={{
                        padding: '12px 16px',
                        textAlign: 'right',
                        color: getChangeColor(stock.change),
                        fontWeight: 500,
                      }}
                    >
                      {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--text-secondary)' }}>
                      {(stock.volume / 1e6).toFixed(1)}M
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--text-secondary)' }}>
                      {formatCurrency(stock.marketCap)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* News Feed */}
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Market News</h2>
          <div style={{ background: 'var(--surface-elevated)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            {news.slice(0, 5).map((article, index) => (
              <div
                key={article.id}
                style={{
                  padding: '16px',
                  borderBottom: index < 4 ? '1px solid var(--border-default)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span
                    style={{
                      padding: '2px 6px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '10px',
                      fontWeight: 600,
                      background:
                        article.sentiment === 'positive'
                          ? 'var(--color-success-light)'
                          : article.sentiment === 'negative'
                          ? 'var(--color-error-light)'
                          : 'var(--surface-subtle)',
                      color:
                        article.sentiment === 'positive'
                          ? 'var(--color-success-dark)'
                          : article.sentiment === 'negative'
                          ? 'var(--color-error-dark)'
                          : 'var(--text-secondary)',
                    }}
                  >
                    {article.source}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </span>
                </div>
                <div style={{ fontWeight: 500, fontSize: '14px', marginBottom: '4px', lineHeight: 1.4 }}>
                  {article.title}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {article.summary.substring(0, 100)}...
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

FinancialDashboard.displayName = 'FinancialDashboard';

export default FinancialDashboard;
