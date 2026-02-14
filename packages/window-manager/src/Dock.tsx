/**
 * VarunaX Dock Component
 *
 * macOS-style dock with magnification effect, running indicators, and context menu.
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import type { DockApp } from './types';
import { useWindowManager } from './store';

export interface DockProps {
  apps?: DockApp[];
  className?: string;
}

export const Dock: React.FC<DockProps> = ({ apps, className = '' }) => {
  const {
    dockApps: storeDockApps,
    dockPosition,
    dockMagnification,
    setDockApps,
    openWindow,
    focusWindow,
    minimizeWindow,
  } = useWindowManager();

  const appsList = apps || storeDockApps;
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; app: DockApp } | null>(null);
  const dockRef = useRef<HTMLDivElement>(null);

  // Close context menu on click outside
  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    if (contextMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [contextMenu]);

  // Handle app click
  const handleAppClick = useCallback((app: DockApp) => {
    if (app.isRunning && app.hasWindows) {
      // Focus existing window - for now just open a new one
      openWindow(app.id, { title: app.name });
    } else {
      openWindow(app.id, { title: app.name });
    }
  }, [openWindow]);

  // Handle right-click for context menu
  const handleContextMenu = useCallback((e: React.MouseEvent, app: DockApp) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, app });
  }, []);

  // Calculate scale based on hover position
  const getScale = useCallback((index: number) => {
    if (!dockMagnification || hoveredIndex === null) return 1;

    const distance = Math.abs(index - hoveredIndex);
    const maxScale = 1.5;
    const scaleFactor = 0.25;

    if (distance === 0) return maxScale;
    if (distance === 1) return maxScale - scaleFactor;
    if (distance === 2) return maxScale - scaleFactor * 2;
    return 1;
  }, [hoveredIndex, dockMagnification]);

  // Get vertical offset for magnification effect
  const getTranslateY = useCallback((index: number) => {
    if (!dockMagnification || hoveredIndex === null) return 0;

    const distance = Math.abs(index - hoveredIndex);
    const maxOffset = 20;

    if (distance === 0) return -maxOffset;
    if (distance === 1) return -maxOffset * 0.6;
    if (distance === 2) return -maxOffset * 0.3;
    return 0;
  }, [hoveredIndex, dockMagnification]);

  return (
    <>
      <div
        ref={dockRef}
        className={`varunax-dock ${className}`}
        style={{
          position: 'fixed',
          bottom: '8px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'flex-end',
          gap: '4px',
          padding: '4px 8px',
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(20px)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-dock)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          zIndex: 'var(--z-index-dock)',
        }}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {appsList.map((app, index) => (
          <div
            key={app.id}
            className="varunax-dock-item"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'transform var(--transition-dock-magnify)',
              transform: `scale(${getScale(index)}) translateY(${getTranslateY(index)}px)`,
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onClick={() => handleAppClick(app)}
            onContextMenu={(e) => handleContextMenu(e, app)}
          >
            {/* App Icon */}
            <div
              className="varunax-dock-icon"
              style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--surface-elevated)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--border-default)',
              }}
            >
              {app.icon}
            </div>

            {/* Running Indicator */}
            {app.isRunning && (
              <div
                className="varunax-dock-running-indicator"
                style={{
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: 'var(--color-primary-500)',
                  marginTop: '2px',
                }}
              />
            )}

            {/* App Label on Hover */}
            {hoveredIndex === index && (
              <div
                className="varunax-dock-tooltip"
                style={{
                  position: 'absolute',
                  top: '-32px',
                  padding: '4px 8px',
                  background: 'rgba(0, 0, 0, 0.8)',
                  color: 'white',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12px',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                }}
              >
                {app.name}
              </div>
            )}
          </div>
        ))}

        {/* Separator */}
        <div
          style={{
            width: '1px',
            height: '40px',
            background: 'var(--border-default)',
            margin: '0 4px',
          }}
        />

        {/* System Apps (Settings, Trash, etc.) */}
        <div
          className="varunax-dock-system-apps"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--surface-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              cursor: 'pointer',
            }}
            title="Settings"
          >
            ⚙️
          </div>
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="varunax-dock-context-menu"
          style={{
            position: 'fixed',
            left: contextMenu.x,
            top: contextMenu.y,
            minWidth: '180px',
            background: 'var(--surface-base)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid var(--border-default)',
            padding: '4px 0',
            zIndex: 'var(--z-index-menu)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              padding: '8px 12px',
              fontWeight: 600,
              fontSize: '13px',
              borderBottom: '1px solid var(--border-default)',
            }}
          >
            {contextMenu.app.name}
          </div>
          <div
            style={{
              padding: '8px 12px',
              fontSize: '13px',
              cursor: 'pointer',
            }}
            onClick={() => {
              openWindow(contextMenu.app.id, { title: contextMenu.app.name });
              setContextMenu(null);
            }}
          >
            Open
          </div>
          {contextMenu.app.isRunning && (
            <div
              style={{
                padding: '8px 12px',
                fontSize: '13px',
                cursor: 'pointer',
              }}
              onClick={() => {
                // Hide all windows for this app
                setContextMenu(null);
              }}
            >
              Hide
            </div>
          )}
          <div
            style={{
              padding: '8px 12px',
              fontSize: '13px',
              cursor: 'pointer',
              opacity: 0.5,
            }}
          >
            Options...
          </div>
          <div
            style={{
              height: '1px',
              background: 'var(--border-default)',
              margin: '4px 0',
            }}
          />
          <div
            style={{
              padding: '8px 12px',
              fontSize: '13px',
              cursor: 'pointer',
            }}
            onClick={() => setContextMenu(null)}
          >
            Quit
          </div>
        </div>
      )}
    </>
  );
};

Dock.displayName = 'Dock';

export default Dock;
