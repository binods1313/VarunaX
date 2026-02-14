/**
 * VarunaX Window Manager - Zustand Store
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { Window, WindowState, Position, Size, DockApp, MenuBarItem, AppLauncherItem } from './types';

interface WindowManagerState {
  // Windows
  windows: Window[];
  activeWindowId: string | null;
  nextZIndex: number;

  // Dock
  dockApps: DockApp[];
  dockPosition: 'bottom' | 'left' | 'right';
  dockMagnification: boolean;

  // Menu Bar
  menuBarItems: MenuBarItem[];
  activeMenu: string | null;

  // App Launcher
  appLauncherOpen: boolean;
  appLauncherQuery: string;
  appLauncherItems: AppLauncherItem[];

  // Window Actions
  openWindow: (appId: string, config?: Partial<Window>) => string;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindowPosition: (id: string, position: Position) => void;
  updateWindowSize: (id: string, size: Size) => void;
  setWindowState: (id: string, state: WindowState) => void;

  // Dock Actions
  setDockApps: (apps: DockApp[]) => void;
  updateDockApp: (id: string, updates: Partial<DockApp>) => void;
  toggleDockMagnification: () => void;

  // Menu Bar Actions
  setMenuBarItems: (items: MenuBarItem[]) => void;
  openMenu: (menuId: string) => void;
  closeMenu: () => void;

  // App Launcher Actions
  openAppLauncher: () => void;
  closeAppLauncher: () => void;
  setAppLauncherQuery: (query: string) => void;
  setAppLauncherItems: (items: AppLauncherItem[]) => void;
}

let windowIdCounter = 0;

const DEFAULT_WINDOW_CONFIG: Partial<Window> = {
  state: 'normal',
  isResizable: true,
  isDraggable: true,
  canMinimize: true,
  canMaximize: true,
  canClose: true,
  constraints: {
    minWidth: 400,
    minHeight: 300,
  },
};

export const useWindowManager = create<WindowManagerState>()(
  subscribeWithSelector((set, get) => ({
    // Initial State
    windows: [],
    activeWindowId: null,
    nextZIndex: 1000,

    dockApps: [],
    dockPosition: 'bottom',
    dockMagnification: true,

    menuBarItems: [],
    activeMenu: null,

    appLauncherOpen: false,
    appLauncherQuery: '',
    appLauncherItems: [],

    // Window Actions
    openWindow: (appId: string, config = {}) => {
      const id = `window-${++windowIdCounter}`;
      const { nextZIndex, windows } = get();

      const newWindow: Window = {
        id,
        appId,
        title: config.title || 'Untitled',
        icon: config.icon,
        position: config.position || { x: 100 + windows.length * 30, y: 100 + windows.length * 30 },
        size: config.size || { width: 800, height: 600 },
        state: 'normal',
        zIndex: nextZIndex,
        isActive: true,
        isFocused: true,
        ...DEFAULT_WINDOW_CONFIG,
        ...config,
      };

      // Update all other windows to not focused
      const updatedWindows = windows.map(w => ({
        ...w,
        isFocused: false,
        isActive: false,
      }));

      set({
        windows: [...updatedWindows, newWindow],
        activeWindowId: id,
        nextZIndex: nextZIndex + 1,
      });

      return id;
    },

    closeWindow: (id: string) => {
      const { windows, activeWindowId } = get();
      const windowToClose = windows.find(w => w.id === id);
      if (!windowToClose) return;

      const newWindows = windows.filter(w => w.id !== id);
      let newActiveId = activeWindowId;

      if (activeWindowId === id) {
        // Focus the last window or null
        newActiveId = newWindows.length > 0 ? newWindows[newWindows.length - 1].id : null;
        if (newActiveId) {
          const lastWindow = newWindows.find(w => w.id === newActiveId);
          if (lastWindow) {
            lastWindow.isFocused = true;
            lastWindow.isActive = true;
          }
        }
      }

      set({ windows: newWindows, activeWindowId: newActiveId });
    },

    minimizeWindow: (id: string) => {
      set(state => ({
        windows: state.windows.map(w =>
          w.id === id ? { ...w, state: 'minimized' as WindowState, isFocused: false, isActive: false } : w
        ),
        activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
      }));
    },

    maximizeWindow: (id: string) => {
      set(state => ({
        windows: state.windows.map(w =>
          w.id === id ? { ...w, state: 'maximized' as WindowState } : w
        ),
      }));
    },

    restoreWindow: (id: string) => {
      set(state => ({
        windows: state.windows.map(w =>
          w.id === id ? { ...w, state: 'normal' as WindowState } : w
        ),
      }));
    },

    focusWindow: (id: string) => {
      const { nextZIndex, windows } = get();
      const window = windows.find(w => w.id === id);
      if (!window) return;

      set({
        windows: windows.map(w => ({
          ...w,
          isFocused: w.id === id,
          isActive: w.id === id,
          zIndex: w.id === id ? nextZIndex : w.zIndex,
        })),
        activeWindowId: id,
        nextZIndex: nextZIndex + 1,
      });
    },

    updateWindowPosition: (id: string, position: Position) => {
      set(state => ({
        windows: state.windows.map(w =>
          w.id === id ? { ...w, position } : w
        ),
      }));
    },

    updateWindowSize: (id: string, size: Size) => {
      set(state => ({
        windows: state.windows.map(w => {
          if (w.id !== id) return w;
          const { minWidth = 0, minHeight = 0 } = w.constraints || {};
          return {
            ...w,
            size: {
              width: Math.max(size.width, minWidth),
              height: Math.max(size.height, minHeight),
            },
          };
        }),
      }));
    },

    setWindowState: (id: string, state: WindowState) => {
      set(state => ({
        windows: state.windows.map(w =>
          w.id === id ? { ...w, state } : w
        ),
      }));
    },

    // Dock Actions
    setDockApps: (apps: DockApp[]) => {
      set({ dockApps: apps });
    },

    updateDockApp: (id: string, updates: Partial<DockApp>) => {
      set(state => ({
        dockApps: state.dockApps.map(app =>
          app.id === id ? { ...app, ...updates } : app
        ),
      }));
    },

    toggleDockMagnification: () => {
      set(state => ({ dockMagnification: !state.dockMagnification }));
    },

    // Menu Bar Actions
    setMenuBarItems: (items: MenuBarItem[]) => {
      set({ menuBarItems: items });
    },

    openMenu: (menuId: string) => {
      set({ activeMenu: menuId });
    },

    closeMenu: () => {
      set({ activeMenu: null });
    },

    // App Launcher Actions
    openAppLauncher: () => {
      set({ appLauncherOpen: true, appLauncherQuery: '' });
    },

    closeAppLauncher: () => {
      set({ appLauncherOpen: false, appLauncherQuery: '' });
    },

    setAppLauncherQuery: (query: string) => {
      set({ appLauncherQuery: query });
    },

    setAppLauncherItems: (items: AppLauncherItem[]) => {
      set({ appLauncherItems: items });
    },
  }))
);

export default useWindowManager;
