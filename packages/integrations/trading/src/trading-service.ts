/**
 * VarunaX - Trading Service
 *
 * Trading execution service with paper trading logic.
 */

import type { Order, OrderRequest, Position, Portfolio, TradingMode } from './types';
import { useTradingStore } from './store';

// Generate unique order ID
const generateOrderId = (): string => {
  return `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Simulate price variation for mock fills
const getMockFillPrice = (limitPrice: number | undefined, side: 'buy' | 'sell'): number => {
  if (limitPrice) {
    // Randomly vary by up to 0.5%
    const variation = limitPrice * 0.005 * (Math.random() - 0.5);
    return side === 'buy' ? limitPrice + variation : limitPrice - variation;
  }
  // For market orders, use a base price with variation
  return 100 + Math.random() * 100;
};

export const executeOrder = async (
  request: OrderRequest,
  currentPrice: number,
  mode: TradingMode
): Promise<Order> => {
  const store = useTradingStore.getState();

  // Validate order
  if (!Number.isInteger(request.quantity) || request.quantity <= 0) {
    throw new Error('Invalid quantity. Must be a positive integer.');
  }

  const orderId = generateOrderId();
  const now = new Date().toISOString();

  // Create pending order
  const order: Order = {
    id: orderId,
    symbol: request.symbol.toUpperCase(),
    side: request.side,
    type: request.type,
    quantity: request.quantity,
    limitPrice: request.limitPrice,
    stopPrice: request.stopPrice,
    status: 'pending',
    createdAt: now,
    mode,
  };

  // Add order to store
  store.addOrder(order);

  // Log the order
  store.addAuditLog({
    action: 'order.placed',
    symbol: order.symbol,
    side: order.side,
    quantity: order.quantity,
    price: order.limitPrice || currentPrice,
    orderType: order.type,
    mode,
  });

  // Simulate order fill (immediate for market orders)
  const shouldFill = request.type === 'market' ||
    (request.type === 'limit' && currentPrice <= (request.limitPrice || 0));

  if (shouldFill) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));

    const fillPrice = getMockFillPrice(request.limitPrice, request.side);
    const filledOrder: Order = {
      ...order,
      status: 'filled',
      filledPrice: Math.round(fillPrice * 100) / 100,
      filledQuantity: request.quantity,
      filledAt: new Date().toISOString(),
    };

    store.updateOrder(orderId, filledOrder);
    store.addToHistory(filledOrder);

    // Update portfolio
    updatePortfolioAfterFill(filledOrder, mode);

    // Log fill
    store.addAuditLog({
      action: 'order.filled',
      symbol: filledOrder.symbol,
      side: filledOrder.side,
      quantity: filledOrder.filledQuantity,
      price: filledOrder.filledPrice,
      orderType: filledOrder.type,
      mode,
    });

    return filledOrder;
  }

  return order;
};

const updatePortfolioAfterFill = (order: Order, mode: TradingMode): void => {
  const store = useTradingStore.getState();
  const { portfolio } = store;

  if (!order.filledPrice || !order.filledQuantity) return;

  const fillValue = order.filledPrice * order.filledQuantity;
  const existingPosition = portfolio.positions.find(p => p.symbol === order.symbol);

  if (order.side === 'buy') {
    // Deduct cash
    let newCash = portfolio.cash - fillValue;

    if (existingPosition) {
      // Update existing position (average down/up)
      const totalShares = existingPosition.quantity + order.filledQuantity;
      const totalCost = (existingPosition.averagePrice * existingPosition.quantity) + fillValue;
      const newAvgPrice = totalCost / totalShares;

      existingPosition.quantity = totalShares;
      existingPosition.averagePrice = Math.round(newAvgPrice * 100) / 100;
      existingPosition.marketValue = existingPosition.quantity * existingPosition.currentPrice;
      existingPosition.unrealizedPL = existingPosition.marketValue - (existingPosition.averagePrice * existingPosition.quantity);
      existingPosition.unrealizedPLPercent = (existingPosition.unrealizedPL / (existingPosition.averagePrice * existingPosition.quantity)) * 100;
    } else {
      // Create new position
      const newPosition: Position = {
        symbol: order.symbol,
        quantity: order.filledQuantity,
        averagePrice: order.filledPrice,
        currentPrice: order.filledPrice,
        marketValue: fillValue,
        unrealizedPL: 0,
        unrealizedPLPercent: 0,
      };
      portfolio.positions.push(newPosition);
    }

    store.setPortfolio({
      cash: Math.round(newCash * 100) / 100,
      buyingPower: Math.round(newCash * 2 * 100) / 100,
    });
  } else if (order.side === 'sell' && existingPosition) {
    // Add cash
    const newCash = portfolio.cash + fillValue;
    const realizedPL = (order.filledPrice - existingPosition.averagePrice) * order.filledQuantity;

    existingPosition.quantity -= order.filledQuantity;

    if (existingPosition.quantity <= 0) {
      // Remove position
      portfolio.positions = portfolio.positions.filter(p => p.symbol !== order.symbol);
    } else {
      existingPosition.marketValue = existingPosition.quantity * existingPosition.currentPrice;
      existingPosition.unrealizedPL = existingPosition.marketValue - (existingPosition.averagePrice * existingPosition.quantity);
      existingPosition.unrealizedPLPercent = (existingPosition.unrealizedPL / (existingPosition.averagePrice * existingPosition.quantity)) * 100;
    }

    store.setPortfolio({
      cash: Math.round(newCash * 100) / 100,
      buyingPower: Math.round(newCash * 2 * 100) / 100,
    });
  }

  // Recalculate total portfolio value
  const positionsValue = portfolio.positions.reduce((sum, p) => sum + p.marketValue, 0);
  const totalPL = portfolio.positions.reduce((sum, p) => sum + p.unrealizedPL, 0);
  const totalCost = portfolio.positions.reduce((sum, p) => sum + (p.averagePrice * p.quantity), 0);

  store.setPortfolio({
    totalValue: Math.round((portfolio.cash + positionsValue) * 100) / 100,
    totalPL: Math.round(totalPL * 100) / 100,
    totalPLPercent: totalCost > 0 ? Math.round((totalPL / totalCost) * 10000) / 100 : 0,
  });
};

export const cancelPendingOrder = (orderId: string): void => {
  const store = useTradingStore.getState();
  store.cancelOrder(orderId);
};

export const getOrderHistory = (): Order[] => {
  return useTradingStore.getState().orderHistory;
};

export const getAuditLog = () => {
  return useTradingStore.getState().auditLog;
};
