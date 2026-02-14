/**
 * VarunaX App Launcher Component
 *
 * Spotlight-style app launcher with search functionality.
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import type { AppLauncherItem } from './types';
import { useWindowManager } from './store';

export interface AppLauncherProps {
  className?: string;
}

export const AppLauncher: React.FC<AppLauncherProps> = ({ className = '' }) => {
  const {
    appLauncherOpen,
    appLauncherQuery,
    appLauncherItems,
    closeAppLauncher,
    setAppLauncherQuery,
    setAppLauncherItems,
    openWindow,
  } = useWindowManager();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter items based on query
  const filteredItems = appLauncherQuery
    ? appLauncherItems.filter(
        (item) =>
          item.name.toLowerCase().includes(appLauncherQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(appLauncherQuery.toLowerCase())
      )
    : appLauncherItems;

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [appLauncherQuery]);

  // Focus input when launcher opens
  useEffect(() => {
    if (appLauncherOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [appLauncherOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!appLauncherOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, filteredItems.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredItems[selectedIndex]) {
            handleLaunchApp(filteredItems[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          closeAppLauncher();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [appLauncherOpen, filteredItems, selectedIndex, closeAppLauncher]);

  // Handle app launch
  const handleLaunchApp = useCallback((item: AppLauncherItem) => {
    openWindow(item.id, { title: item.name });
    closeAppLauncher();
  }, [openWindow, closeAppLauncher]);

  // Handle query change
  const handleQueryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setAppLauncherQuery(e.target.value);
  }, [setAppLauncherQuery]);

  if (!appLauncherOpen) return null;

  return (
    <div
      className={`varunax-app-launcher ${className}`}
      style={{
        position: 'fixed',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        maxWidth: '90vw',
        background: 'var(--surface-base)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-xl)',
        border: '1px solid var(--border-default)',
        overflow: 'hidden',
        zIndex: 'var(--z-index-app-launcher)',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Search Input */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px 16px',
          borderBottom: '1px solid var(--border-default)',
        }}
      >
        <span style={{ fontSize: '20px', marginRight: '12px' }}>🔍</span>
        <input
          ref={inputRef}
          type="text"
          value={appLauncherQuery}
          onChange={handleQueryChange}
          placeholder="Search apps, files, and more..."
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: '16px',
            fontFamily: 'var(--font-family-sans)',
            background: 'transparent',
            color: 'var(--text-primary)',
          }}
        />
        <span
          style={{
            padding: '4px 8px',
            background: 'var(--surface-subtle)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '11px',
            color: 'var(--text-secondary)',
          }}
        >
          esc to close
        </span>
      </div>

      {/* Results List */}
      <div style={{ maxHeight: '400px', overflow: 'auto' }}>
        {filteredItems.length === 0 ? (
          <div
            style={{
              padding: '24px',
              textAlign: 'center',
              color: 'var(--text-secondary)',
            }}
          >
            No results found for "{appLauncherQuery}"
          </div>
        ) : (
          filteredItems.map((item, index) => (
            <div
              key={item.id}
              className="varunax-app-launcher-item"
              onClick={() => handleLaunchApp(item)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px 16px',
                cursor: 'pointer',
                background: index === selectedIndex ? 'var(--color-primary-50)' : 'transparent',
                borderLeft: index === selectedIndex ? '3px solid var(--color-primary-500)' : '3px solid transparent',
              }}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              {/* App Icon */}
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--surface-elevated)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  marginRight: '12px',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                {item.icon}
              </div>

              {/* App Info */}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: '14px' }}>{item.name}</div>
                {item.description && (
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {item.description}
                  </div>
                )}
              </div>

              {/* Category Tag */}
              {item.category && (
                <div
                  style={{
                    padding: '2px 8px',
                    background: 'var(--surface-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '11px',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {item.category}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 16px',
          borderTop: '1px solid var(--border-default)',
          background: 'var(--surface-elevated)',
          fontSize: '11px',
          color: 'var(--text-secondary)',
        }}
      >
        <div>
          <span style={{ marginRight: '12px' }}>↑↓ Navigate</span>
          <span style={{ marginRight: '12px' }}>↵ Select</span>
          <span>esc Close</span>
        </div>
        <div>VarunaX App Launcher</div>
      </div>
    </div>
  );
};

AppLauncher.displayName = 'AppLauncher';

export default AppLauncher;
