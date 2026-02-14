/**
 * VarunaX - Trading Panel Component
 *
 * A comprehensive trading panel with order entry, position sizing, and confirmation.
 */

import React, { useState, useCallback, useMemo } from 'react';
import { useTradingStore } from './store';
import type { OrderSide, OrderType, OrderRequest } from './types';

interface TradingPanelProps {
  currentPrice?: number;
  symbol?: string;
  className?: string;
}

export const TradingPanel: React.FC<TradingPanelProps> = ({
  currentPrice = 150.00,
  symbol = 'AAPL',
  className = '',
}) => {
  const {
    mode,
    setMode,
    portfolio,
    orders,
    pendingOrder,
    setPendingOrder,
    addOrder,
    addAuditLog,
    calculatePositionSize,
  } = useTradingStore();

  // Form state
  const [ticker, setTicker] = useState(symbol);
  const [orderSide, setOrderSide] = useState<OrderSide>('buy');
  const [orderType, setOrderType] = useState<OrderType>('limit');
  const [quantity, setQuantity] = useState<string>('100');
  const [limitPrice, setLimitPrice] = useState<string>(currentPrice.toFixed(2));
  const [stopPrice, setStopPrice] = useState<string>((currentPrice * 0.95).toFixed(2));

  // Position sizing
  const [riskAmount, setRiskAmount] = useState<string>('1000');
  const [stopLossPercent, setStopLossPercent] = useState<string>('5');

  // Confirmation modal
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderToConfirm, setOrderToConfirm] = useState<OrderRequest | null>(null);

  // Calculate estimated cost
  const estimatedCost = useMemo(() => {
    const qty = parseInt(quantity) || 0;
    const price = orderType === 'market' ? currentPrice : parseFloat(limitPrice) || 0;
    return qty * price;
  }, [quantity, orderType, currentPrice, limitPrice]);

  // Calculate position sizing
  const positionSizing = useMemo(() => {
    const risk = parseFloat(riskAmount) || 0;
    const stop = parseFloat(stopLossPercent) || 0;
    return calculatePositionSize(ticker.toUpperCase(), currentPrice, risk, stop);
  }, [ticker, currentPrice, riskAmount, stopLossPercent, calculatePositionSize]);

  // Validate order
  const validationError = useMemo(() => {
    const qty = parseInt(quantity);
    if (!qty || qty <= 0) return 'Please enter a valid quantity';
    if (orderSide === 'buy' && estimatedCost > portfolio.buyingPower) {
      return 'Insufficient buying power';
    }
    if (orderSide === 'sell') {
      const position = portfolio.positions.find((p) => p.symbol === ticker.toUpperCase());
      if (!position || position.quantity < qty) {
        return 'Insufficient shares to sell';
      }
    }
    return null;
  }, [quantity, orderSide, estimatedCost, portfolio.buyingPower, ticker, portfolio.positions]);

  // Handle place order click
  const handlePlaceOrder = useCallback(() => {
    const qty = parseInt(quantity);
    const price = orderType === 'market' ? currentPrice : parseFloat(limitPrice);

    const order: OrderRequest = {
      symbol: ticker.toUpperCase(),
      side: orderSide,
      type: orderType,
      quantity: qty,
      limitPrice: orderType === 'limit' || orderType === 'stop_limit' ? price : undefined,
      stopPrice: orderType === 'stop' || orderType === 'stop_limit' ? parseFloat(stopPrice) : undefined,
    };

    setOrderToConfirm(order);
    setShowConfirmation(true);
  }, [ticker, orderSide, orderType, quantity, limitPrice, stopPrice, currentPrice]);

  // Handle confirm order
  const handleConfirmOrder = useCallback(() => {
    if (!orderToConfirm) return;

    // Create the order
    const newOrder = {
      ...orderToConfirm,
      id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'filled' as const,
      filledPrice: orderToConfirm.type === 'market' ? currentPrice : orderToConfirm.limitPrice,
      filledQuantity: orderToConfirm.quantity,
      createdAt: new Date().toISOString(),
      filledAt: new Date().toISOString(),
      mode,
    };

    // Add order
    addOrder(newOrder);

    // Update portfolio
    const cost = (newOrder.filledPrice || 0) * newOrder.quantity;
    if (newOrder.side === 'buy') {
      // Deduct from cash
      useTradingStore.getState().setPortfolio({
        cash: portfolio.cash - cost,
        buyingPower: portfolio.buyingPower - cost,
      });
    } else {
      // Add to cash
      useTradingStore.getState().setPortfolio({
        cash: portfolio.cash + cost,
        buyingPower: portfolio.buyingPower + cost,
      });
    }

    // Audit log
    addAuditLog({
      action: 'order.placed',
      symbol: newOrder.symbol,
      side: newOrder.side,
      quantity: newOrder.quantity,
      price: newOrder.filledPrice,
      orderType: newOrder.type,
      mode,
    });

    // Close modal
    setShowConfirmation(false);
    setOrderToConfirm(null);
  }, [orderToConfirm, currentPrice, mode, addOrder, addAuditLog, portfolio]);

  // Handle use position sizing
  const handleUsePositionSizing = useCallback(() => {
    setQuantity(positionSizing.suggestedShares.toString());
  }, [positionSizing.suggestedShares]);

  return (
    <div
      className={className}
      style={{
        padding: '20px',
        background: 'var(--surface-base)',
        borderRadius: 'var(--radius-lg)',
        fontFamily: 'var(--font-family-sans)',
      }}
    >
      {/* Paper Trading Banner */}
      {mode === 'paper' && (
        <div
          style={{
            padding: '8px 12px',
            background: 'var(--color-success-light)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span style={{ fontSize: '16px' }}>📄</span>
          <span style={{ fontWeight: 500, color: 'var(--color-success-dark)' }}>
            Paper Trading Mode - No real money will be used
          </span>
          <button
            onClick={() => setMode('live')}
            style={{
              marginLeft: 'auto',
              padding: '4px 12px',
              border: '1px solid var(--color-success-dark)',
              borderRadius: 'var(--radius-sm)',
              background: 'transparent',
              color: 'var(--color-success-dark)',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            Switch to Live
          </button>
        </div>
      )}

      {mode === 'live' && (
        <div
          style={{
            padding: '8px 12px',
            background: 'var(--color-error-light)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span style={{ fontSize: '16px' }}>⚠️</span>
          <span style={{ fontWeight: 500, color: 'var(--color-error-dark)' }}>
            LIVE TRADING - Real money is at risk!
          </span>
          <button
            onClick={() => setMode('paper')}
            style={{
              marginLeft: 'auto',
              padding: '4px 12px',
              border: '1px solid var(--color-error-dark)',
              borderRadius: 'var(--radius-sm)',
              background: 'transparent',
              color: 'var(--color-error-dark)',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            Switch to Paper
          </button>
        </div>
      )}

      {/* Market Data */}
      <div
        style={{
          padding: '12px',
          background: 'var(--surface-elevated)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 600 }}>{ticker.toUpperCase()}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>AAPL Inc.</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '24px', fontWeight: 600 }}>${currentPrice.toFixed(2)}</div>
            <div style={{ color: 'var(--color-gain)', fontSize: '13px' }}>+1.33%</div>
          </div>
        </div>
      </div>

      {/* Order Entry Form */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>Order Entry</h3>

        {/* Ticker */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>
            Ticker Symbol
          </label>
          <input
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              fontSize: '14px',
              fontWeight: 500,
            }}
            placeholder="AAPL"
          />
        </div>

        {/* Side */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>
            Side
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setOrderSide('buy')}
              style={{
                flex: 1,
                padding: '10px',
                border: `2px solid ${orderSide === 'buy' ? 'var(--color-success)' : 'var(--border-default)'}`,
                borderRadius: 'var(--radius-md)',
                background: orderSide === 'buy' ? 'var(--color-success)' : 'transparent',
                color: orderSide === 'buy' ? 'white' : 'var(--text-primary)',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Buy
            </button>
            <button
              onClick={() => setOrderSide('sell')}
              style={{
                flex: 1,
                padding: '10px',
                border: `2px solid ${orderSide === 'sell' ? 'var(--color-error)' : 'var(--border-default)'}`,
                borderRadius: 'var(--radius-md)',
                background: orderSide === 'sell' ? 'var(--color-error)' : 'transparent',
                color: orderSide === 'sell' ? 'white' : 'var(--text-primary)',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Sell
            </button>
          </div>
        </div>

        {/* Order Type */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>
            Order Type
          </label>
          <select
            value={orderType}
            onChange={(e) => setOrderType(e.target.value as OrderType)}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              fontSize: '14px',
              background: 'var(--surface-base)',
            }}
          >
            <option value="market">Market</option>
            <option value="limit">Limit</option>
            <option value="stop">Stop</option>
            <option value="stop_limit">Stop Limit</option>
          </select>
        </div>

        {/* Quantity */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>
            Quantity (shares)
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              fontSize: '14px',
            }}
            min="1"
          />
        </div>

        {/* Limit Price */}
        {(orderType === 'limit' || orderType === 'stop_limit') && (
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>
              Limit Price
            </label>
            <input
              type="number"
              value={limitPrice}
              onChange={(e) => setLimitPrice(e.target.value)}
              step="0.01"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
              }}
            />
          </div>
        )}

        {/* Stop Price */}
        {(orderType === 'stop' || orderType === 'stop_limit') && (
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>
              Stop Price
            </label>
            <input
              type="number"
              value={stopPrice}
              onChange={(e) => setStopPrice(e.target.value)}
              step="0.01"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
              }}
            />
          </div>
        )}

        {/* Estimated Cost */}
        <div
          style={{
            padding: '12px',
            background: 'var(--surface-subtle)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Estimated Cost</span>
            <span style={{ fontWeight: 600 }}>${estimatedCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Buying Power</span>
            <span>${portfolio.buyingPower.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        {/* Validation Error */}
        {validationError && (
          <div
            style={{
              padding: '8px 12px',
              background: 'var(--color-error-light)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '16px',
              color: 'var(--color-error-dark)',
              fontSize: '13px',
            }}
          >
            {validationError}
          </div>
        )}

        {/* Place Order Button */}
        <button
          onClick={handlePlaceOrder}
          disabled={!!validationError}
          style={{
            width: '100%',
            padding: '14px',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            background: validationError ? 'var(--text-disabled)' : orderSide === 'buy' ? 'var(--color-success)' : 'var(--color-error)',
            color: 'white',
            fontSize: '16px',
            fontWeight: 600,
            cursor: validationError ? 'not-allowed' : 'pointer',
            opacity: validationError ? 0.6 : 1,
          }}
        >
          {orderSide === 'buy' ? 'Buy' : 'Sell'} {ticker.toUpperCase()}
        </button>
      </div>

      {/* Position Sizing Calculator */}
      <div>
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>Position Sizing</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Risk Amount ($)
            </label>
            <input
              type="number"
              value={riskAmount}
              onChange={(e) => setRiskAmount(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '13px',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Stop Loss (%)
            </label>
            <input
              type="number"
              value={stopLossPercent}
              onChange={(e) => setStopLossPercent(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '13px',
              }}
            />
          </div>
        </div>

        <div
          style={{
            padding: '12px',
            background: 'var(--color-primary-50)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '12px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span>Suggested Shares:</span>
            <span style={{ fontWeight: 600 }}>{positionSizing.suggestedShares}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span>Stop Loss:</span>
            <span style={{ fontWeight: 600 }}>${positionSizing.stopLoss.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Max Loss:</span>
            <span style={{ fontWeight: 600, color: 'var(--color-error)' }}>
              ${positionSizing.maxLoss.toFixed(2)}
            </span>
          </div>
        </div>

        <button
          onClick={handleUsePositionSizing}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid var(--color-primary-500)',
            borderRadius: 'var(--radius-md)',
            background: 'transparent',
            color: 'var(--color-primary-700)',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Use Suggested Quantity
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && orderToConfirm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowConfirmation(false)}
        >
          <div
            style={{
              background: 'var(--surface-base)',
              borderRadius: 'var(--radius-xl)',
              padding: '24px',
              width: '400px',
              maxWidth: '90vw',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <span style={{ fontSize: '32px' }}>⚠️</span>
              <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Confirm Order</h2>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                You are about to place:
              </div>
              <div
                style={{
                  padding: '16px',
                  background: 'var(--surface-elevated)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>
                  {orderToConfirm.side.toUpperCase()} {orderToConfirm.quantity} shares of {orderToConfirm.symbol}
                </div>
                <div style={{ color: 'var(--text-secondary)' }}>
                  at {orderToConfirm.type.toUpperCase()} {orderToConfirm.limitPrice ? `$${orderToConfirm.limitPrice.toFixed(2)}` : 'Market Price'}
                </div>
              </div>
            </div>

            <div
              style={{
                padding: '12px',
                background: 'var(--surface-subtle)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '20px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>Estimated Cost:</span>
                <span style={{ fontWeight: 600 }}>${estimatedCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>Commission:</span>
                <span style={{ fontWeight: 600 }}>$0.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid var(--border-default)' }}>
                <span style={{ fontWeight: 600 }}>Total:</span>
                <span style={{ fontWeight: 600, fontSize: '18px' }}>${estimatedCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {mode === 'paper' && (
              <div
                style={{
                  padding: '12px',
                  background: 'var(--color-warning-light)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '20px',
                  textAlign: 'center',
                  color: 'var(--color-warning-dark)',
                  fontWeight: 500,
                }}
              >
                This is a PAPER TRADE (No real money will be used)
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowConfirmation(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-md)',
                  background: 'transparent',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmOrder}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  background: orderToConfirm.side === 'buy' ? 'var(--color-success)' : 'var(--color-error)',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

TradingPanel.displayName = 'TradingPanel';

export default TradingPanel;
