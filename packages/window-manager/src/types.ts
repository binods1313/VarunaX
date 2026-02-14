/**
 * VarunaX Window Manager - Types
 */

export type WindowState = 'normal' | 'minimized' | 'maximized' | 'fullscreen';

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface WindowConstraints {
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
}

export interface Window {
  id: string;
  appId: string;
  title: string;
  icon?: string;
  position: Position;
  size: Size;
  state: WindowState;
  zIndex: number;
  isActive: boolean;
  isFocused: boolean;
  isResizable: boolean;
  isDraggable: boolean;
  canMinimize: boolean;
  canMaximize: boolean;
  canClose: boolean;
  constraints?: WindowConstraints;
  metadata?: Record<string, unknown>;
}

export interface DockApp {
  id: string;
  name: string;
  icon: string;
  isRunning: boolean;
  hasWindows: boolean;
}

export interface MenuItem {
  id: string;
  label: string;
  shortcut?: string;
  action?: () => void;
  disabled?: boolean;
  separator?: boolean;
  children?: MenuItem[];
}

export interface MenuBarItem {
  id: string;
  label: string;
  items: MenuItem[];
}

export interface AppLauncherItem {
  id: string;
  name: string;
  icon: string;
  description?: string;
  category?: string;
}
