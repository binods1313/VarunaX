/**
 * VarunaX - Trading Store
 *
 * Zustand store for managing trading state, portfolio, and orders.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Order,
  Portfolio,
  Position,
  OrderRequest,
  TradingMode,
  TradeAuditLog,
  PositionSizingResult,
} from './types';

// Default portfolio values
const DEFAULT_CASH = 100000;
const DEFAULT_BUYING_POWER = DEFAULT_CASH * 2; // 2x margin

interface TradingState {
  // Trading mode
  mode: TradingMode;
  setMode: (mode: TradingMode) => void;

  // Portfolio
  portfolio: Portfolio;
  setPortfolio: (portfolio: Partial<Portfolio>) => void;

  // Orders
  orders: Order[];
  pendingOrder: OrderRequest | null;
  addOrder: (order: Order) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  cancelOrder: (id: string) => void;
  setPendingOrder: (order: OrderRequest | null) => void;

  // Order history
  orderHistory: Order[];
  addToHistory: (order: Order) => void;

  // Audit log
  auditLog: TradeAuditLog[];
  addAuditLog: (entry: Omit<TradeAuditLog, 'id' | 'timestamp'>) => void;

  // Position sizing
  calculatePositionSize: (
    symbol: string,
    currentPrice: number,
    riskAmount: number,
    stopLossPercent: number
  ) => PositionSizingResult;

  // Helpers
  getPosition: (symbol: string) => Position | undefined;
  getOrdersBySymbol: (symbol: string) => Order[];
}

export const useTradingStore = create<TradingState>()(
  persist(
    (set, get) => ({
      // Initial state
      mode: 'paper',
      portfolio: {
        cash: DEFAULT_CASH,
        buyingPower: DEFAULT_BUYING_POWER,
        positions: [],
        totalValue: DEFAULT_CASH,
        totalPL: 0,
        totalPLPercent: 0,
      },
      orders: [],
      pendingOrder: null,
      orderHistory: [],
      auditLog: [],

      // Actions
      setMode: (mode) => {
        set({ mode });
        get().addAuditLog({
          action: 'mode_changed',
          mode,
          metadata: { previousMode: get().mode },
        });
      },

      setPortfolio: (portfolioUpdates) => {
        set((state) => ({
          portfolio: { ...state.portfolio, ...portfolioUpdates },
        }));
      },

      addOrder: (order) => {
        set((state) => ({
          orders: [...state.orders, order],
        }));
      },

      updateOrder: (id, updates) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id ? { ...o, ...updates } : o
          ),
        }));
      },

      cancelOrder: (id) => {
        const order = get().orders.find((o) => o.id === id);
        if (order) {
          set((state) => ({
            orders: state.orders.map((o) =>
              o.id === id ? { ...o, status: 'cancelled' } : o
            ),
          }));
          get().addAuditLog({
            action: 'order.cancelled',
            symbol: order.symbol,
            side: order.side,
            quantity: order.quantity,
            price: order.limitPrice,
            orderType: order.type,
            mode: order.mode,
          });
        }
      },

      setPendingOrder: (order) => {
        set({ pendingOrder: order });
      },

      addToHistory: (order) => {
        set((state) => ({
          orderHistory: [order, ...state.orderHistory].slice(0, 100), // Keep last 100
        }));
      },

      addAuditLog: (entry) => {
        const log: TradeAuditLog = {
          ...entry,
          id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString(),
        };
        set((state) => ({
          auditLog: [log, ...state.auditLog].slice(0, 1000), // Keep last 1000
        }));
      },

      calculatePositionSize: (symbol, currentPrice, riskAmount, stopLossPercent) => {
        const { portfolio } = get();

        // Calculate shares based on risk
        const riskPerShare = currentPrice * (stopLossPercent / 100);
        const suggestedShares = Math.floor(riskAmount / riskPerShare);

        // Maximum shares based on buying power
        const maxShares = Math.floor(portfolio.buyingPower / currentPrice);

        // Risk/reward calculation (assuming 2:1)
        const targetReward = riskAmount * 2;
        const targetPrice = currentPrice + (targetReward / suggestedShares);

        const maxLoss = suggestedShares * riskPerShare;

        return {
          suggestedShares: Math.min(suggestedShares, maxShares),
          maxShares,
          riskAmount,
          stopLoss: currentPrice * (1 - stopLossPercent / 100),
          maxLoss,
          riskRewardRatio: 2,
        };
      },

      getPosition: (symbol) => {
        return get().portfolio.positions.find((p) => p.symbol === symbol);
      },

      getOrdersBySymbol: (symbol) => {
        return get().orders.filter(
          (o) => o.symbol === symbol && o.status === 'pending'
        );
      },
    }),
    {
      name: 'varunax-trading-storage',
      partialize: (state) => ({
        mode: state.mode,
        portfolio: state.portfolio,
        orderHistory: state.orderHistory,
        auditLog: state.auditLog,
      }),
    }
  )
);

export default useTradingStore;
