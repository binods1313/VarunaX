/**
 * VarunaX OSShell - Demo Application
 *
 * A complete OS shell demonstrating the window manager, dock, menu bar, and app launcher.
 * This is the main entry point for the VarunaX Browser OS.
 */

import React, { useEffect } from 'react';
import { useWindowManager, Window, Dock, MenuBar, AppLauncher } from './index';
import type { DockApp, AppLauncherItem, MenuBarItem } from './types';

// Default dock apps
const DEFAULT_DOCK_APPS: DockApp[] = [
  { id: 'finder', name: 'Finder', icon: '📁', isRunning: false, hasWindows: false },
  { id: 'safari', name: 'Browser', icon: '🌐', isRunning: false, hasWindows: false },
  { id: 'mail', name: 'Mail', icon: '✉️', isRunning: false, hasWindows: false },
  { id: 'messages', name: 'Messages', icon: '💬', isRunning: false, hasWindows: false },
  { id: 'photos', name: 'Photos', icon: '🖼️', isRunning: false, hasWindows: false },
  { id: 'music', name: 'Music', icon: '🎵', isRunning: false, hasWindows: false },
  { id: 'terminal', name: 'Terminal', icon: '⬛', isRunning: false, hasWindows: false },
  { id: 'trading', name: 'Trading', icon: '📈', isRunning: false, hasWindows: false },
  { id: 'dexter', name: 'Dexter AI', icon: '🤖', isRunning: false, hasWindows: false },
];

// App launcher items
const APP_LAUNCHER_ITEMS: AppLauncherItem[] = [
  { id: 'finder', name: 'Finder', icon: '📁', description: 'File manager', category: 'Utilities' },
  { id: 'browser', name: 'Browser', icon: '🌐', description: 'Web browser', category: 'Internet' },
  { id: 'mail', name: 'Mail', icon: '✉️', description: 'Email client', category: 'Internet' },
  { id: 'messages', name: 'Messages', icon: '💬', description: 'Messaging app', category: 'Social' },
  { id: 'photos', name: 'Photos', icon: '🖼️', description: 'Photo viewer', category: 'Media' },
  { id: 'music', name: 'Music', icon: '🎵', description: 'Music player', category: 'Media' },
  { id: 'terminal', name: 'Terminal', icon: '⬛', description: 'Command line', category: 'Developer' },
  { id: 'trading', name: 'Trading Dashboard', icon: '📈', description: 'Financial trading platform', category: 'Finance' },
  { id: 'dexter', name: 'Dexter AI', icon: '🤖', description: 'AI financial research', category: 'Finance' },
  { id: 'settings', name: 'Settings', icon: '⚙️', description: 'System preferences', category: 'System' },
  { id: 'calculator', name: 'Calculator', icon: '🧮', description: 'Calculator app', category: 'Utilities' },
  { id: 'calendar', name: 'Calendar', icon: '📅', description: 'Calendar app', category: 'Productivity' },
];

// Menu bar items
const MENU_BAR_ITEMS: MenuBarItem[] = [
  {
    id: 'file',
    label: 'File',
    items: [
      { id: 'new-window', label: 'New Window', shortcut: '⌘N', action: () => {} },
      { id: 'open', label: 'Open...', shortcut: '⌘O', action: () => {} },
      { id: 'sep1', label: '', separator: true },
      { id: 'close', label: 'Close Window', shortcut: '⌘W', action: () => {} },
      { id: 'sep2', label: '', separator: true },
      { id: 'save', label: 'Save', shortcut: '⌘S', action: () => {} },
    ],
  },
  {
    id: 'edit',
    label: 'Edit',
    items: [
      { id: 'undo', label: 'Undo', shortcut: '⌘Z', action: () => {} },
      { id: 'redo', label: 'Redo', shortcut: '⇧⌘Z', action: () => {} },
      { id: 'sep1', label: '', separator: true },
      { id: 'cut', label: 'Cut', shortcut: '⌘X', action: () => {} },
      { id: 'copy', label: 'Copy', shortcut: '⌘C', action: () => {} },
      { id: 'paste', label: 'Paste', shortcut: '⌘V', action: () => {} },
    ],
  },
  {
    id: 'view',
    label: 'View',
    items: [
      { id: 'reload', label: 'Reload', shortcut: '⌘R', action: () => {} },
      { id: 'fullscreen', label: 'Enter Full Screen', shortcut: '⌃⌘F', action: () => {} },
      { id: 'sep1', label: '', separator: true },
      { id: 'zoom-in', label: 'Zoom In', shortcut: '⌘+', action: () => {} },
      { id: 'zoom-out', label: 'Zoom Out', shortcut: '⌘-', action: () => {} },
    ],
  },
  {
    id: 'window',
    label: 'Window',
    items: [
      { id: 'minimize', label: 'Minimize', shortcut: '⌘M', action: () => {} },
      { id: 'zoom', label: 'Zoom', action: () => {} },
      { id: 'sep1', label: '', separator: true },
      { id: 'bring-front', label: 'Bring All to Front', action: () => {} },
    ],
  },
  {
    id: 'help',
    label: 'Help',
    items: [
      { id: 'help', label: 'VarunaX Help', action: () => {} },
    ],
  },
];

export interface OSShellProps {
  children?: React.ReactNode;
}

export const OSShell: React.FC<OSShellProps> = ({ children }) => {
  const {
    windows,
    dockApps,
    setDockApps,
    setAppLauncherItems,
    setMenuBarItems,
  } = useWindowManager();

  // Initialize default apps
  useEffect(() => {
    setDockApps(DEFAULT_DOCK_APPS);
    setAppLauncherItems(APP_LAUNCHER_ITEMS);
    setMenuBarItems(MENU_BAR_ITEMS);
  }, [setDockApps, setAppLauncherItems, setMenuBarItems]);

  return (
    <div
      className="varunax-os-shell"
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
      }}
    >
      {/* Desktop Background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(76, 175, 80, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
            linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)
          `,
        }}
      />

      {/* Menu Bar */}
      <MenuBar />

      {/* Desktop Area - where windows live */}
      <div
        className="varunax-desktop"
        style={{
          position: 'absolute',
          top: '28px',
          left: 0,
          right: 0,
          bottom: '80px',
          overflow: 'hidden',
        }}
      >
        {/* Render all windows */}
        {windows.map((window) => (
          <Window key={window.id} window={window}>
            {children || (
              <div
                style={{
                  padding: '40px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  color: 'var(--text-primary)',
                }}
              >
                <div style={{ fontSize: '64px', marginBottom: '20px' }}>
                  {window.appId === 'trading' ? '📈' :
                   window.appId === 'dexter' ? '🤖' :
                   window.appId === 'terminal' ? '⬛' :
                   window.appId === 'browser' ? '🌐' : '📁'}
                </div>
                <h2 style={{ marginBottom: '10px' }}>{window.title}</h2>
                <p style={{ color: 'var(--text-secondary)' }}>
                  This is a {window.title} window. Content goes here.
                </p>
              </div>
            )}
          </Window>
        ))}
      </div>

      {/* Dock */}
      <Dock />

      {/* App Launcher (Spotlight-style) */}
      <AppLauncher />
    </div>
  );
};

OSShell.displayName = 'OSShell';

export default OSShell;
