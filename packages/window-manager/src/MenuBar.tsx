/**
 * VarunaX MenuBar Component
 *
 * Global menu bar with app menus, keyboard shortcuts, and system controls.
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import type { MenuBarItem, MenuItem } from './types';
import { useWindowManager } from './store';

export interface MenuBarProps {
  items?: MenuBarItem[];
  className?: string;
}

export const MenuBar: React.FC<MenuBarProps> = ({ items: propItems, className = '' }) => {
  const {
    menuBarItems: storeMenuItems,
    activeMenuId,
    setMenuBarItems,
    openMenu,
    closeMenu,
    openAppLauncher,
  } = useWindowManager();

  const items = propItems || storeMenuItems;
  const menuBarRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuBarRef.current && !menuBarRef.current.contains(e.target as Node)) {
        closeMenu();
      }
    };

    if (activeMenuId) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [activeMenuId, closeMenu]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+Space to open app launcher
      if ((e.metaKey || e.ctrlKey) && e.code === 'Space') {
        e.preventDefault();
        openAppLauncher();
      }

      // Escape to close menu
      if (e.key === 'Escape' && activeMenuId) {
        closeMenu();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [openAppLauncher, activeMenuId, closeMenu]);

  // Handle menu item click
  const handleMenuItemClick = useCallback((item: MenuItem) => {
    if (item.disabled || item.separator) return;
    if (item.action) {
      item.action();
    }
    closeMenu();
  }, [closeMenu]);

  // Render menu item
  const renderMenuItem = (item: MenuItem, index: number) => {
    if (item.separator) {
      return (
        <div
          key={index}
          style={{
            height: '1px',
            background: 'var(--border-default)',
            margin: '4px 0',
          }}
        />
      );
    }

    return (
      <div
        key={item.id}
        className="varunax-menu-item"
        onClick={() => handleMenuItemClick(item)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '6px 12px',
          cursor: item.disabled ? 'default' : 'pointer',
          opacity: item.disabled ? 0.5 : 1,
          fontSize: '13px',
        }}
        onMouseEnter={(e) => {
          if (!item.disabled) {
            e.currentTarget.style.background = 'var(--color-primary-50)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
      >
        <span>{item.label}</span>
        {item.shortcut && (
          <span style={{ color: 'var(--text-secondary)', marginLeft: '24px', fontSize: '12px' }}>
            {item.shortcut}
          </span>
        )}
      </div>
    );
  };

  return (
    <div
      ref={menuBarRef}
      className={`varunax-menubar ${className}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 12px',
        background: 'var(--surface-elevated)',
        borderBottom: '1px solid var(--border-default)',
        zIndex: 'var(--z-index-menubar)',
        fontSize: '13px',
        fontFamily: 'var(--font-family-sans)',
      }}
    >
      {/* Left side - App menu and menus */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {/* Apple/VarunaX menu (or first menu) */}
        <div style={{ position: 'relative' }}>
          <div
            onClick={() => activeMenuId === 'varunax' ? closeMenu() : openMenu('varunax')}
            style={{
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontWeight: 600,
              background: activeMenuId === 'varunax' ? 'var(--color-primary-100)' : 'transparent',
            }}
          >
            VarunaX
          </div>

          {/* VarunaX Menu Dropdown */}
          {activeMenuId === 'varunax' && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                minWidth: '220px',
                background: 'var(--surface-base)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid var(--border-default)',
                padding: '4px 0',
              }}
            >
              <div style={{ padding: '8px 12px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                VarunaX v1.0.0
              </div>
              <div style={{ height: '1px', background: 'var(--border-default)', margin: '4px 0' }} />
              {[
                { id: 'about', label: 'About VarunaX' },
                { id: 'sep1', label: '', separator: true },
                { id: 'settings', label: 'Settings...', shortcut: '⌘,' },
                { id: 'sep2', label: '', separator: true },
                { id: 'hide', label: 'Hide VarunaX', shortcut: '⌘H' },
                { id: 'hide-others', label: 'Hide Others', shortcut: '⌥⌘H' },
                { id: 'show-all', label: 'Show All' },
                { id: 'sep3', label: '', separator: true },
                { id: 'quit', label: 'Quit VarunaX', shortcut: '⌘Q' },
              ].map((item, i) => renderMenuItem(
                { ...item, action: item.id === 'quit' ? () => {} : undefined },
                i
              ))}
            </div>
          )}
        </div>

        {/* Dynamic Menus */}
        {items.map((menu) => (
          <div key={menu.id} style={{ position: 'relative' }}>
            <div
              onClick={() => activeMenuId === menu.id ? closeMenu() : openMenu(menu.id)}
              style={{
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                background: activeMenuId === menu.id ? 'var(--color-primary-100)' : 'transparent',
              }}
            >
              {menu.label}
            </div>

            {/* Menu Dropdown */}
            {activeMenuId === menu.id && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  minWidth: '200px',
                  background: 'var(--surface-base)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-xl)',
                  border: '1px solid var(--border-default)',
                  padding: '4px 0',
                }}
              >
                {menu.items.map((item, index) => renderMenuItem(item, index))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Right side - System status items */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Battery, WiFi, etc. - placeholder icons */}
        <span style={{ fontSize: '14px' }}>📶</span>
        <span style={{ fontSize: '14px' }}>🔋</span>
        <span style={{ fontSize: '14px' }}>🔍</span>
        <div
          onClick={openAppLauncher}
          style={{
            padding: '2px 8px',
            background: 'var(--surface-subtle)',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontSize: '12px',
            color: 'var(--text-secondary)',
          }}
        >
          ⌘Space
        </div>
      </div>
    </div>
  );
};

MenuBar.displayName = 'MenuBar';

export default MenuBar;
