/**
 * VarunaX - Order History Component
 *
 * Displays order history with status and filled details.
 */

import React from 'react';
import { useTradingStore } from './store';

interface OrderHistoryProps {
  className?: string;
}

export const OrderHistory: React.FC<OrderHistoryProps> = ({ className = '' }) => {
  const { orderHistory } = useTradingStore();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'filled':
        return 'var(--color-success)';
      case 'cancelled':
        return 'var(--color-warning)';
      case 'rejected':
        return 'var(--color-error)';
      default:
        return 'var(--text-secondary)';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (orderHistory.length === 0) {
    return (
      <div className={className} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        No orders yet. Place an order to see it here.
      </div>
    );
  }

  return (
    <div className={className} style={{ padding: '16px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Order History</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {orderHistory.map((order) => (
          <div
            key={order.id}
            style={{
              padding: '12px',
              background: 'var(--surface-elevated)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '11px',
                    fontWeight: 600,
                    background: order.side === 'buy' ? 'var(--color-success-light)' : 'var(--color-error-light)',
                    color: order.side === 'buy' ? 'var(--color-success-dark)' : 'var(--color-error-dark)',
                  }}
                >
                  {order.side.toUpperCase()}
                </span>
                <span style={{ fontWeight: 600 }}>{order.symbol}</span>
                <span style={{ color: 'var(--text-secondary)' }}>{order.quantity} shares</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {order.type.toUpperCase()} {order.filledPrice ? `@ $${order.filledPrice.toFixed(2)}` : ''}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 500,
                  color: getStatusColor(order.status),
                  textTransform: 'capitalize',
                }}
              >
                {order.status}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                {formatDate(order.createdAt)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

OrderHistory.displayName = 'OrderHistory';

export default OrderHistory;
