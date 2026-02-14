/**
 * VarunaX Window Manager - Zustand Store
 */

import { create } from 'zustand';
import type { Window, WindowState, Position, Size, DockApp, MenuBarItem, AppLauncherItem } from './types';

interface WindowManagerState {
  // Window state
  windows: Window[];
  activeWindowId: string | null;
  highestZIndex: number;

  // Dock state
  dockApps: DockApp[];
  dockPosition: 'bottom' | 'left' | 'right';
  dockMagnification: boolean;

  // Menu bar state
  menuBarItems: MenuBarItem[];
  activeMenuId: string | null;

  // App launcher state
  appLauncherOpen: boolean;
  appLauncherQuery: string;
  appLauncherItems: AppLauncherItem[];

  // Window actions
  openWindow: (appId: string, config?: Partial<Window>) => string;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindowPosition: (id: string, position: Position) => void;
  updateWindowSize: (id: string, size: Size) => void;
  setWindowState: (id: string, state: WindowState) => void;

  // Dock actions
  setDockApps: (apps: DockApp[]) => void;
  updateDockApp: (id: string, updates: Partial<DockApp>) => void;
  setDockPosition: (position: 'bottom' | 'left' | 'right') => void;
  toggleDockMagnification: () => void;

  // Menu bar actions
  setMenuBarItems: (items: MenuBarItem[]) => void;
  openMenu: (id: string) => void;
  closeMenu: () => void;

  // App launcher actions
  openAppLauncher: () => void;
  closeAppLauncher: () => void;
  setAppLauncherQuery: (query: string) => void;
  setAppLauncherItems: (items: AppLauncherItem[]) => void;
}

const defaultWindowConfig: Partial<Window> = {
  state: 'normal',
  isActive: false,
  isFocused: false,
  isResizable: true,
  isDraggable: true,
  canMinimize: true,
  canMaximize: true,
  canClose: true,
  constraints: {
    minWidth: 300,
    minHeight: 200,
  },
};

export const useWindowManager = create<WindowManagerState>((set, get) => ({
  // Initial state
  windows: [],
  activeWindowId: null,
  highestZIndex: 1000,

  dockApps: [],
  dockPosition: 'bottom',
  dockMagnification: true,

  menuBarItems: [],
  activeMenuId: null,

  appLauncherOpen: false,
  appLauncherQuery: '',
  appLauncherItems: [],

  // Window actions
  openWindow: (appId, config = {}) => {
    const id = `window-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const { highestZIndex } = get();

    const newWindow: Window = {
      id,
      appId,
      title: config.title || 'New Window',
      icon: config.icon,
      position: config.position || { x: 100 + Math.random() * 50, y: 100 + Math.random() * 50 },
      size: config.size || { width: 800, height: 600 },
      state: 'normal',
      zIndex: highestZIndex + 1,
      isActive: true,
      isFocused: true,
      isResizable: config.isResizable ?? true,
      isDraggable: config.isDraggable ?? true,
      canMinimize: config.canMinimize ?? true,
      canMaximize: config.canMaximize ?? true,
      canClose: config.canClose ?? true,
      constraints: config.constraints,
      metadata: config.metadata,
      ...defaultWindowConfig,
      ...config,
    };

    set((state) => ({
      windows: [...state.windows, newWindow],
      activeWindowId: id,
      highestZIndex: highestZIndex + 1,
    }));

    // Update dock app state
    set((state) => ({
      dockApps: state.dockApps.map((app) =>
        app.id === appId ? { ...app, isRunning: true, hasWindows: true } : app
      ),
    }));

    return id;
  },

  closeWindow: (id) => {
    const window = get().windows.find((w) => w.id === id);
    const appId = window?.appId;

    set((state) => {
      const newWindows = state.windows.filter((w) => w.id !== id);
      const newActiveId = state.activeWindowId === id
        ? newWindows[newWindows.length - 1]?.id || null
        : state.activeWindowId;

      return {
        windows: newWindows,
        activeWindowId: newActiveId,
      };
    });

    // Update dock app if no more windows
    if (appId) {
      const hasWindows = get().windows.some((w) => w.appId === appId);
      if (!hasWindows) {
        set((state) => ({
          dockApps: state.dockApps.map((app) =>
            app.id === appId ? { ...app, hasWindows: false } : app
          ),
        }));
      }
    }
  },

  minimizeWindow: (id) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, state: 'minimized', isFocused: false } : w
      ),
      activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
    }));
  },

  maximizeWindow: (id) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, state: 'maximized', isFocused: true } : w
      ),
      activeWindowId: id,
    }));
  },

  restoreWindow: (id) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, state: 'normal', isFocused: true } : w
      ),
      activeWindowId: id,
    }));
  },

  focusWindow: (id) => {
    const { highestZIndex } = get();
    const window = get().windows.find((w) => w.id === id);

    if (!window) return;

    set((state) => ({
      windows: state.windows.map((w) => ({
        ...w,
        isFocused: w.id === id,
        isActive: w.id === id,
        zIndex: w.id === id ? highestZIndex + 1 : w.zIndex,
      })),
      activeWindowId: id,
      highestZIndex: highestZIndex + 1,
    }));
  },

  updateWindowPosition: (id, position) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id && w.state === 'normal' ? { ...w, position } : w
      ),
    }));
  },

  updateWindowSize: (id, size) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id && w.state === 'normal' ? { ...w, size } : w
      ),
    }));
  },

  setWindowState: (id, state) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, state } : w
      ),
    }));
  },

  // Dock actions
  setDockApps: (apps) => set({ dockApps: apps }),

  updateDockApp: (id, updates) => {
    set((state) => ({
      dockApps: state.dockApps.map((app) =>
        app.id === id ? { ...app, ...updates } : app
      ),
    }));
  },

  setDockPosition: (position) => set({ dockPosition: position }),

  toggleDockMagnification: () => set((state) => ({ dockMagnification: !state.dockMagnification })),

  // Menu bar actions
  setMenuBarItems: (items) => set({ menuBarItems: items }),

  openMenu: (id) => set({ activeMenuId: id }),

  closeMenu: () => set({ activeMenuId: null }),

  // App launcher actions
  openAppLauncher: () => set({ appLauncherOpen: true, appLauncherQuery: '' }),

  closeAppLauncher: () => set({ appLauncherOpen: false, appLauncherQuery: '' }),

  setAppLauncherQuery: (query) => set({ appLauncherQuery: query }),

  setAppLauncherItems: (items) => set({ appLauncherItems: items }),
}));

export default useWindowManager;
