/**
 * VarunaX - Trading Integration
 *
 * A comprehensive trading system with paper trading, order management, and audit logging.
 *
 * @example
 * import { useTradingStore, TradingPanel } from '@varunax/trading';
 */

export { useTradingStore } from './store';
export { TradingPanel } from './TradingPanel';

export type {
  Order,
  OrderSide,
  OrderType,
  OrderStatus,
  OrderRequest,
  TradingMode,
  Position,
  Portfolio,
  PositionSizingResult,
  TradeAuditLog,
} from './types';

export {
  TradingError,
  InsufficientFundsError,
  InvalidQuantityError,
  PositionNotFoundError,
} from './types';
