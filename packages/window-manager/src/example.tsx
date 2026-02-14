/**
 * VarunaX Window Manager - Usage Example
 *
 * This demonstrates how to use the Window Manager package in your app.
 */

import React, { useEffect } from 'react';
import {
  useWindowManager,
  Window,
  Dock,
  MenuBar,
  AppLauncher,
} from './src';

// Sample dock apps
const sampleDockApps = [
  { id: 'finder', name: 'Finder', icon: '📁', isRunning: false, hasWindows: false },
  { id: 'safari', name: 'Browser', icon: '🌐', isRunning: false, hasWindows: false },
  { id: 'terminal', name: 'Terminal', icon: '⬛', isRunning: false, hasWindows: false },
  { id: 'vscode', name: 'Code', icon: '💻', isRunning: false, hasWindows: false },
  { id: 'trading', name: 'Trading', icon: '📈', isRunning: false, hasWindows: false },
  { id: 'settings', name: 'Settings', icon: '⚙️', isRunning: false, hasWindows: false },
];

// Sample app launcher items
const sampleLauncherItems = [
  { id: 'finder', name: 'Finder', icon: '📁', description: 'File browser', category: 'Utilities' },
  { id: 'browser', name: 'Browser', icon: '🌐', description: 'Web browser', category: 'Apps' },
  { id: 'terminal', name: 'Terminal', icon: '⬛', description: 'Command line', category: 'Developer' },
  { id: 'vscode', name: 'Visual Studio Code', icon: '💻', description: 'Code editor', category: 'Developer' },
  { id: 'trading', name: 'Trading Dashboard', icon: '📈', description: 'Financial trading', category: 'Finance' },
  { id: 'settings', name: 'Settings', icon: '⚙️', description: 'System preferences', category: 'System' },
  { id: 'dexter', name: 'Dexter AI', icon: '🤖', description: 'Financial research assistant', category: 'Finance' },
];

// Sample menu items
const sampleMenuItems = [
  {
    id: 'file',
    label: 'File',
    items: [
      { id: 'new-window', label: 'New Window', shortcut: '⌘N', action: () => {} },
      { id: 'new-tab', label: 'New Tab', shortcut: '⌘T', action: () => {} },
      { id: 'sep1', label: '', separator: true },
      { id: 'open', label: 'Open...', shortcut: '⌘O', action: () => {} },
      { id: 'close', label: 'Close Window', shortcut: '⌘W', action: () => {} },
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
      { id: 'fullscreen', label: 'Toggle Fullscreen', shortcut: '⌃⌘F', action: () => {} },
    ],
  },
  {
    id: 'window',
    label: 'Window',
    items: [
      { id: 'minimize', label: 'Minimize', shortcut: '⌘M', action: () => {} },
      { id: 'zoom', label: 'Zoom', action: () => {} },
    ],
  },
  {
    id: 'help',
    label: 'Help',
    items: [
      { id: 'docs', label: 'VarunaX Help', action: () => {} },
    ],
  },
];

export const VarunaXOS: React.FC = () => {
  const {
    windows,
    setDockApps,
    setAppLauncherItems,
    setMenuBarItems,
  } = useWindowManager();

  // Initialize apps
  useEffect(() => {
    setDockApps(sampleDockApps);
    setAppLauncherItems(sampleLauncherItems);
    setMenuBarItems(sampleMenuItems);
  }, [setDockApps, setAppLauncherItems, setMenuBarItems]);

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      {/* Menu Bar */}
      <MenuBar />

      {/* Windows */}
      {windows.map((win) => (
        <Window key={win.id} window={win}>
          <div style={{ padding: '20px' }}>
            <h2>{win.title}</h2>
            <p>Window content goes here...</p>
          </div>
        </Window>
      ))}

      {/* Dock */}
      <Dock />

      {/* App Launcher (hidden by default) */}
      <AppLauncher />
    </div>
  );
};

export default VarunaXOS;
