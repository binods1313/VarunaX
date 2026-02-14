/**
 * VarunaX - Trading Engine
 *
 * A paper trading engine with portfolio management, order execution, and audit logging.
 */

import type {
  Order,
  OrderRequest,
  OrderSide,
  OrderType,
  OrderStatus,
  TradingMode,
  Position,
  Portfolio,
  PositionSizingResult,
  TradeAuditLog,
} from './types';

import {
  InsufficientFundsError,
  InvalidQuantityError,
  PositionNotFoundError,
} from './types';

/**
 * Create a trading engine instance
 */
export function createTradingEngine(initialCash: number = 100000) {
  // State
  let cash = initialCash;
  let buyingPower = initialCash;
  const positions: Map<string, Position> = new Map();
  const orders: Order[] = [];
  const auditLog: TradeAuditLog[] = [];

  // Generate unique IDs
  const generateId = (): string => `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Add to audit log
  const log = (action: string, details: Partial<TradeAuditLog> = {}) => {
    const entry: TradeAuditLog = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      action,
      mode: 'paper',
      ...details,
    };
    auditLog.push(entry);
    return entry;
  };

  // Get current price (mock - in real app, would fetch from API)
  const getCurrentPrice = async (symbol: string): Promise<number> => {
    // Mock prices - in real app, would call Dexter or market data API
    const mockPrices: Record<string, number> = {
      AAPL: 178.72,
      MSFT: 378.91,
      GOOGL: 141.80,
      AMZN: 178.25,
      NVDA: 495.22,
      META: 505.67,
      TSLA: 248.50,
      JPM: 195.42,
    };
    return mockPrices[symbol.toUpperCase()] || 100 + Math.random() * 100;
  };

  return {
    // Get current trading mode
    getMode: (): TradingMode => 'paper',

    // Get current portfolio state
    getPortfolio: async (): Promise<Portfolio> => {
      const positionArray = Array.from(positions.values());

      // Update current prices and calculate totals
      let totalMarketValue = cash;
      let totalCost = cash;

      for (const position of positionArray) {
        const currentPrice = await getCurrentPrice(position.symbol);
        position.currentPrice = currentPrice;
        position.marketValue = position.quantity * currentPrice;
        position.unrealizedPL = (currentPrice - position.averagePrice) * position.quantity;
        position.unrealizedPLPercent = ((currentPrice - position.averagePrice) / position.averagePrice) * 100;
        totalMarketValue += position.marketValue;
        totalCost += position.averagePrice * position.quantity;
      }

      const totalPL = totalMarketValue - initialCash;
      const totalPLPercent = (totalPL / initialCash) * 100;

      return {
        cash,
        buyingPower,
        positions: positionArray,
        totalValue: totalMarketValue,
        totalPL,
        totalPLPercent,
      };
    },

    // Get position for a symbol
    getPosition: (symbol: string): Position | undefined => {
      return positions.get(symbol.toUpperCase());
    },

    // Get all orders
    getOrders: (): Order[] => [...orders],

    // Get order history
    getOrderHistory: (symbol?: string): Order[] => {
      if (symbol) {
        return orders.filter(o => o.symbol === symbol.toUpperCase());
      }
      return [...orders];
    },

    // Get audit log
    getAuditLog: (): TradeAuditLog[] => [...auditLog],

    // Calculate position size
    calculatePositionSize: async (
      symbol: string,
      riskAmount: number,
      stopLossPercent: number
    ): Promise<PositionSizingResult> => {
      const currentPrice = await getCurrentPrice(symbol);
      const stopLoss = currentPrice * (1 - stopLossPercent / 100);
      const riskPerShare = currentPrice - stopLoss;

      if (riskPerShare <= 0) {
        return {
          suggestedShares: 0,
          maxShares: 0,
          riskAmount: 0,
          stopLoss: 0,
          maxLoss: 0,
          riskRewardRatio: 0,
        };
      }

      const suggestedShares = Math.floor(riskAmount / riskPerShare);
      const maxShares = Math.floor(buyingPower / currentPrice);
      const maxLoss = suggestedShares * riskPerShare;

      // Assume 2:1 risk-reward
      const riskRewardRatio = 2;

      return {
        suggestedShares: Math.min(suggestedShares, maxShares),
        maxShares,
        riskAmount,
        stopLoss,
        maxLoss,
        riskRewardRatio,
      };
    },

    // Place an order
    placeOrder: async (request: OrderRequest): Promise<Order> => {
      const { symbol, side, type, quantity, limitPrice, stopPrice } = request;

      // Validate quantity
      if (!Number.isInteger(quantity) || quantity <= 0) {
        throw new InvalidQuantityError();
      }

      const upperSymbol = symbol.toUpperCase();
      const currentPrice = await getCurrentPrice(upperSymbol);
      const executionPrice = type === 'limit' && limitPrice ? limitPrice : currentPrice;

      // Calculate required funds
      const requiredFunds = executionPrice * quantity;

      // Check funds for buy orders
      if (side === 'buy' && requiredFunds > buyingPower) {
        throw new InsufficientFundsError(requiredFunds, buyingPower);
      }

      // Check position for sell orders
      if (side === 'sell') {
        const position = positions.get(upperSymbol);
        if (!position || position.quantity < quantity) {
          throw new PositionNotFoundError(upperSymbol);
        }
      }

      // Create order
      const order: Order = {
        id: generateId(),
        symbol: upperSymbol,
        side,
        type,
        quantity,
        limitPrice,
        stopPrice,
        status: 'pending',
        createdAt: new Date().toISOString(),
        mode: 'paper',
      };

      orders.push(order);

      // Log order placement
      log('order.placed', {
        symbol: upperSymbol,
        side,
        quantity,
        price: executionPrice,
        orderType: type,
      });

      // Execute immediately for market orders
      if (type === 'market') {
        return this.fillOrder(order.id, executionPrice);
      }

      return order;
    },

    // Fill an order
    fillOrder: async (orderId: string, fillPrice?: number): Promise<Order> => {
      const orderIndex = orders.findIndex(o => o.id === orderId);
      if (orderIndex === -1) {
        throw new Error(`Order not found: ${orderId}`);
      }

      const order = orders[orderIndex];
      const currentPrice = await getCurrentPrice(order.symbol);
      const executionPrice = fillPrice || currentPrice;

      // Update order status
      order.status = 'filled';
      order.filledPrice = executionPrice;
      order.filledQuantity = order.quantity;
      order.filledAt = new Date().toISOString();

      // Update positions and cash
      if (order.side === 'buy') {
        const cost = executionPrice * order.quantity;
        cash -= cost;
        buyingPower -= cost;

        const existingPosition = positions.get(order.symbol);
        if (existingPosition) {
          // Average down/up
          const totalQuantity = existingPosition.quantity + order.quantity;
          const totalCost = (existingPosition.averagePrice * existingPosition.quantity) + cost;
          existingPosition.quantity = totalQuantity;
          existingPosition.averagePrice = totalCost / totalQuantity;
        } else {
          positions.set(order.symbol, {
            symbol: order.symbol,
            quantity: order.quantity,
            averagePrice: executionPrice,
            currentPrice: executionPrice,
            marketValue: executionPrice * order.quantity,
            unrealizedPL: 0,
            unrealizedPLPercent: 0,
          });
        }
      } else {
        // Sell
        const proceeds = executionPrice * order.quantity;
        cash += proceeds;
        buyingPower += proceeds;

        const position = positions.get(order.symbol);
        if (position) {
          position.quantity -= order.quantity;
          if (position.quantity <= 0) {
            positions.delete(order.symbol);
          }
        }
      }

      // Log order fill
      log('order.filled', {
        symbol: order.symbol,
        side: order.side,
        quantity: order.quantity,
        price: executionPrice,
        orderType: order.type,
      });

      return order;
    },

    // Cancel an order
    cancelOrder: (orderId: string): Order => {
      const orderIndex = orders.findIndex(o => o.id === orderId);
      if (orderIndex === -1) {
        throw new Error(`Order not found: ${orderId}`);
      }

      const order = orders[orderIndex];
      if (order.status !== 'pending') {
        throw new Error(`Cannot cancel order with status: ${order.status}`);
      }

      order.status = 'cancelled';

      // Log cancellation
      log('order.cancelled', {
        symbol: order.symbol,
        side: order.side,
        quantity: order.quantity,
        orderType: order.type,
      });

      return order;
    },

    // Reset account (for testing)
    reset: (newCash: number = initialCash) => {
      cash = newCash;
      buyingPower = newCash;
      positions.clear();
      orders.length = 0;
      auditLog.length = 0;
      log('account.reset', { metadata: { newCash } });
    },

    // Get account value
    getAccountValue: async (): Promise<number> => {
      const portfolio = await this.getPortfolio();
      return portfolio.totalValue;
    },
  };
}

// Default export
export type TradingEngine = ReturnType<typeof createTradingEngine>;
export default createTradingEngine();
