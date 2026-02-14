/**
 * VarunaX Window Manager
 *
 * A comprehensive window management system for VarunaX Browser OS.
 * Includes window state management, dock, menu bar, and app launcher.
 *
 * @example
 * import { useWindowManager, Window, Dock, MenuBar, OSShell } from '@varunax/window-manager';
 */

export { useWindowManager } from './store';
export type {
  Window,
  WindowState,
  Position,
  Size,
  WindowConstraints,
  DockApp,
  MenuItem,
  MenuBarItem,
  AppLauncherItem,
} from './types';

export { Window } from './Window';
export { Dock } from './Dock';
export { MenuBar } from './MenuBar';
export { AppLauncher } from './AppLauncher';
export { OSShell } from './OSShell';
export { OSShell } from './OSShell';
