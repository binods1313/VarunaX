/**
 * VarunaX Window Component
 *
 * A draggable, resizable window component with macOS-style controls.
 */

import React, { useRef, useState, useCallback, useEffect } from 'react';
import type { Window as WindowType, Position, Size } from './types';
import { useWindowManager } from './store';

export interface WindowProps {
  window: WindowType;
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  children?: React.ReactNode;
  className?: string;
}

type ResizeHandle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';

const RESIZE_HANDLES: ResizeHandle[] = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];

export const Window: React.FC<WindowProps> = ({
  window: win,
  onClose,
  onMinimize,
  onMaximize,
  children,
  className = '',
}) => {
  const {
    focusWindow,
    updateWindowPosition,
    updateWindowSize,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    closeWindow,
  } = useWindowManager();

  const windowRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<ResizeHandle | null>(null);
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });
  const [windowStart, setWindowStart] = useState<Position>({ x: 0, y: 0 });
  const [sizeStart, setSizeStart] = useState<Size>({ width: 0, height: 0 });

  // Handle window focus on click
  const handleMouseDown = useCallback(() => {
    focusWindow(win.id);
  }, [focusWindow, win.id]);

  // Handle drag start from titlebar
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if (!win.isDraggable || win.state !== 'normal') return;

    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setWindowStart({ x: win.position.x, y: win.position.y });
  }, [win.isDraggable, win.state, win.position]);

  // Handle resize start from handle
  const handleResizeStart = useCallback((e: React.MouseEvent, handle: ResizeHandle) => {
    e.stopPropagation();
    if (!win.isResizable || win.state !== 'normal') return;

    setIsResizing(true);
    setResizeHandle(handle);
    setDragStart({ x: e.clientX, y: e.clientY });
    setWindowStart({ x: win.position.x, y: win.position.y });
    setSizeStart({ width: win.size.width, height: win.size.height });
  }, [win.isResizable, win.state, win.position, win.size]);

  // Handle mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;
        const newX = Math.max(0, windowStart.x + deltaX);
        const newY = Math.max(0, windowStart.y + deltaY);
        updateWindowPosition(win.id, { x: newX, y: newY });
      }

      if (isResizing && resizeHandle) {
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;
        const minWidth = win.constraints?.minWidth || 300;
        const minHeight = win.constraints?.minHeight || 200;

        let newWidth = sizeStart.width;
        let newHeight = sizeStart.height;
        let newX = windowStart.x;
        let newY = windowStart.y;

        // Calculate new size and position based on handle
        if (resizeHandle.includes('e')) {
          newWidth = Math.max(minWidth, sizeStart.width + deltaX);
        }
        if (resizeHandle.includes('w')) {
          newWidth = Math.max(minWidth, sizeStart.width - deltaX);
          if (newWidth > minWidth) {
            newX = windowStart.x + deltaX;
          }
        }
        if (resizeHandle.includes('s')) {
          newHeight = Math.max(minHeight, sizeStart.height + deltaY);
        }
        if (resizeHandle.includes('n')) {
          newHeight = Math.max(minHeight, sizeStart.height - deltaY);
          if (newHeight > minHeight) {
            newY = windowStart.y + deltaY;
          }
        }

        updateWindowSize(win.id, { width: newWidth, height: newHeight });
        if (resizeHandle.includes('w') || resizeHandle.includes('n')) {
          updateWindowPosition(win.id, { x: newX, y: newY });
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeHandle(null);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, resizeHandle, dragStart, windowStart, sizeStart, win, updateWindowPosition, updateWindowSize]);

  // Handle double-click to maximize/restore
  const handleDoubleClick = useCallback(() => {
    if (!win.canMaximize) return;
    if (win.state === 'maximized') {
      restoreWindow(win.id);
    } else {
      maximizeWindow(win.id);
    }
  }, [win.canMaximize, win.state, win.id, restoreWindow, maximizeWindow]);

  // Handle close
  const handleClose = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    closeWindow(win.id);
    onClose?.();
  }, [closeWindow, win.id, onClose]);

  // Handle minimize
  const handleMinimize = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    minimizeWindow(win.id);
    onMinimize?.();
  }, [minimizeWindow, win.id, onMinimize]);

  // Handle maximize
  const handleMaximize = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (win.state === 'maximized') {
      restoreWindow(win.id);
    } else {
      maximizeWindow(win.id);
    }
    onMaximize?.();
  }, [win.state, win.id, restoreWindow, maximizeWindow, onMaximize]);

  // Don't render if minimized
  if (win.state === 'minimized') {
    return null;
  }

  // Calculate position and size based on state
  const isMaximized = win.state === 'maximized';
  const position = isMaximized ? { x: 0, y: 0 } : win.position;
  const size = isMaximized ? { width: window.innerWidth, height: window.innerHeight - 28 } : win.size;

  return (
    <div
      ref={windowRef}
      className={`varunax-window ${className}`}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y + 28, // Account for menu bar
        width: size.width,
        height: size.height,
        zIndex: win.zIndex,
      }}
      onMouseDown={handleMouseDown}
      data-window-id={win.id}
      data-window-state={win.state}
    >
      {/* Title Bar */}
      <div
        className="varunax-window-titlebar"
        onMouseDown={handleDragStart}
        onDoubleClick={handleDoubleClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          height: '38px',
          padding: '0 12px',
          background: win.isFocused ? 'var(--surface-elevated)' : 'var(--surface-subtle)',
          borderBottom: '1px solid var(--border-default)',
          cursor: win.isDraggable && !isMaximized ? 'move' : 'default',
          userSelect: 'none',
          borderRadius: isMaximized ? '0' : 'var(--radius-xl) var(--radius-xl) 0 0',
        }}
      >
        {/* Window Controls (macOS-style) */}
        <div style={{ display: 'flex', gap: '8px', marginRight: '12px' }}>
          {win.canClose && (
            <button
              className="varunax-window-control varunax-window-control-close"
              onClick={handleClose}
              aria-label="Close window"
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                border: 'none',
                background: '#FF5F57',
                cursor: 'pointer',
              }}
            />
          )}
          {win.canMinimize && (
            <button
              className="varunax-window-control varunax-window-control-minimize"
              onClick={handleMinimize}
              aria-label="Minimize window"
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                border: 'none',
                background: '#FEBC2E',
                cursor: 'pointer',
              }}
            />
          )}
          {win.canMaximize && (
            <button
              className="varunax-window-control varunax-window-control-maximize"
              onClick={handleMaximize}
              aria-label={isMaximized ? 'Restore window' : 'Maximize window'}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                border: 'none',
                background: '#28C840',
                cursor: 'pointer',
              }}
            />
          )}
        </div>

        {/* Window Title */}
        <div
          className="varunax-window-title"
          style={{
            flex: 1,
            textAlign: 'center',
            fontSize: '13px',
            fontWeight: 500,
            color: 'var(--text-primary)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {win.icon && <span style={{ marginRight: '6px' }}>{win.icon}</span>}
          {win.title}
        </div>
      </div>

      {/* Window Content */}
      <div
        className="varunax-window-content"
        style={{
          flex: 1,
          overflow: 'auto',
          background: 'var(--surface-base)',
          borderRadius: isMaximized ? '0' : '0 0 var(--radius-xl) var(--radius-xl)',
        }}
      >
        {children}
      </div>

      {/* Resize Handles */}
      {win.isResizable && !isMaximized && RESIZE_HANDLES.map((handle) => (
        <div
          key={handle}
          className={`varunax-resize-handle varunax-resize-handle-${handle}`}
          onMouseDown={(e) => handleResizeStart(e, handle)}
          style={{
            position: 'absolute',
            ...(handle.includes('n') ? { top: 0, left: '10px', right: '10px', height: '4px', cursor: 'ns-resize' } : {}),
            ...(handle.includes('s') ? { bottom: 0, left: '10px', right: '10px', height: '4px', cursor: 'ns-resize' } : {}),
            ...(handle.includes('e') ? { right: 0, top: '10px', bottom: '10px', width: '4px', cursor: 'ew-resize' } : {}),
            ...(handle.includes('w') ? { left: 0, top: '10px', bottom: '10px', width: '4px', cursor: 'ew-resize' } : {}),
            ...(handle === 'nw' ? { top: 0, left: 0, width: '10px', height: '10px', cursor: 'nwse-resize' } : {}),
            ...(handle === 'ne' ? { top: 0, right: 0, width: '10px', height: '10px', cursor: 'nesw-resize' } : {}),
            ...(handle === 'sw' ? { bottom: 0, left: 0, width: '10px', height: '10px', cursor: 'nesw-resize' } : {}),
            ...(handle === 'se' ? { bottom: 0, right: 0, width: '10px', height: '10px', cursor: 'nwse-resize' } : {}),
          }}
        />
      ))}
    </div>
  );
};

Window.displayName = 'Window';

export default Window;
