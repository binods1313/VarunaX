/**
 * VarunaX - Trading Types
 *
 * TypeScript types for the trading system.
 */

export type OrderSide = 'buy' | 'sell';
export type OrderType = 'market' | 'limit' | 'stop' | 'stop_limit';
export type OrderStatus = 'pending' | 'filled' | 'cancelled' | 'rejected';
export type TradingMode = 'paper' | 'live';

export interface Order {
  id: string;
  symbol: string;
  side: OrderSide;
  type: OrderType;
  quantity: number;
  limitPrice?: number;
  stopPrice?: number;
  status: OrderStatus;
  filledPrice?: number;
  filledQuantity?: number;
  createdAt: string;
  filledAt?: string;
  mode: TradingMode;
}

export interface Position {
  symbol: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  marketValue: number;
  unrealizedPL: number;
  unrealizedPLPercent: number;
}

export interface Portfolio {
  cash: number;
  buyingPower: number;
  positions: Position[];
  totalValue: number;
  totalPL: number;
  totalPLPercent: number;
}

export interface OrderRequest {
  symbol: string;
  side: OrderSide;
  type: OrderType;
  quantity: number;
  limitPrice?: number;
  stopPrice?: number;
}

export interface PositionSizingResult {
  suggestedShares: number;
  maxShares: number;
  riskAmount: number;
  stopLoss: number;
  maxLoss: number;
  riskRewardRatio: number;
}

export interface TradeAuditLog {
  id: string;
  timestamp: string;
  action: string;
  symbol?: string;
  side?: OrderSide;
  quantity?: number;
  price?: number;
  orderType?: OrderType;
  mode: TradingMode;
  metadata?: Record<string, unknown>;
}

// Error classes
export class TradingError extends Error {
  code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = 'TradingError';
    this.code = code;
  }
}

export class InsufficientFundsError extends TradingError {
  required: number;
  available: number;

  constructor(required: number, available: number) {
    super(`Insufficient funds. Required: $${required.toFixed(2)}, Available: $${available.toFixed(2)}`, 'INSUFFICIENT_FUNDS');
    this.name = 'InsufficientFundsError';
    this.required = required;
    this.available = available;
  }
}

export class InvalidQuantityError extends TradingError {
  constructor() {
    super('Invalid quantity. Must be a positive integer.', 'INVALID_QUANTITY');
    this.name = 'InvalidQuantityError';
  }
}

export class PositionNotFoundError extends TradingError {
  constructor(symbol: string) {
    super(`Position not found for symbol: ${symbol}`, 'POSITION_NOT_FOUND');
    this.name = 'PositionNotFoundError';
  }
}
