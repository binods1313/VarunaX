/**
 * Trading Store Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useTradingStore } from '../packages/integrations/trading/src/store';

describe('Trading Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    useTradingStore.setState({
      portfolio: {
        cash: 100000,
        buyingPower: 200000,
        positions: [],
        totalValue: 100000,
        totalPL: 0,
        totalPLPercent: 0,
      },
      orders: [],
      orderHistory: [],
      auditLog: [],
    });
  });

  describe('Portfolio', () => {
    it('should have default cash of $100,000', () => {
      const { portfolio } = useTradingStore.getState();
      expect(portfolio.cash).toBe(100000);
    });

    it('should have buying power of $200,000 (2x)', () => {
      const { portfolio } = useTradingStore.getState();
      expect(portfolio.buyingPower).toBe(200000);
    });

    it('should update portfolio cash', () => {
      const { setPortfolio } = useTradingStore.getState();
      setPortfolio({ cash: 50000 });
      const { portfolio } = useTradingStore.getState();
      expect(portfolio.cash).toBe(50000);
    });
  });

  describe('Position Sizing', () => {
    it('should calculate position size correctly', () => {
      const { calculatePositionSize } = useTradingStore.getState();

      const result = calculatePositionSize('AAPL', 150, 1000, 5);

      expect(result.suggestedShares).toBeGreaterThan(0);
      expect(result.maxShares).toBeGreaterThan(0);
      expect(result.stopLoss).toBeLessThan(150);
      expect(result.riskAmount).toBe(1000);
    });

    it('should respect buying power limits', () => {
      const { calculatePositionSize, setPortfolio } = useTradingStore.getState();

      // Set low buying power
      setPortfolio({ buyingPower: 1000 });

      const result = calculatePositionSize('AAPL', 150, 10000, 5);

      // Should be limited by buying power (maxShares = 1000/150 = 6)
      expect(result.maxShares).toBe(6);
    });
  });

  describe('Order Management', () => {
    it('should add an order', () => {
      const { addOrder } = useTradingStore.getState();

      const order = {
        id: 'test-order-1',
        symbol: 'AAPL',
        side: 'buy' as const,
        type: 'market' as const,
        quantity: 100,
        status: 'filled' as const,
        filledPrice: 150,
        filledQuantity: 100,
        createdAt: new Date().toISOString(),
        filledAt: new Date().toISOString(),
        mode: 'paper' as const,
      };

      addOrder(order);

      const { orders } = useTradingStore.getState();
      expect(orders).toHaveLength(1);
      expect(orders[0].symbol).toBe('AAPL');
    });

    it('should cancel an order', () => {
      const { addOrder, cancelOrder } = useTradingStore.getState();

      const order = {
        id: 'test-order-2',
        symbol: 'AAPL',
        side: 'buy' as const,
        type: 'limit' as const,
        quantity: 100,
        limitPrice: 145,
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
        mode: 'paper' as const,
      };

      addOrder(order);
      cancelOrder('test-order-2');

      const { orders } = useTradingStore.getState();
      expect(orders[0].status).toBe('cancelled');
    });
  });

  describe('Audit Logging', () => {
    it('should log actions', () => {
      const { addAuditLog } = useTradingStore.getState();

      addAuditLog({
        action: 'test.action',
        mode: 'paper',
      });

      const { auditLog } = useTradingStore.getState();
      expect(auditLog).toHaveLength(1);
      expect(auditLog[0].action).toBe('test.action');
      expect(auditLog[0].timestamp).toBeDefined();
    });
  });
});
