# VarunaX Browser OS - Enhanced Development Prompt

## 🎯 Executive Summary

You are tasked with transforming the VarunaX codebase into **VarunaX** - a production-ready, browser-based operating system that delivers a premium macOS-like experience with integrated financial research and trading capabilities. This is a complete rebrand with significant enhancements, not just a rename.

**Key Differentiators:**
- Original, legally-safe UI assets and branding
- Integrated Dexter AI financial research assistant
- Modular agent skills architecture (globally installed via npx)
- Professional trading engine with paper trading and security-first design
- Production-grade component library with exceptional aesthetics

---

## 📋 Project Context

### Current State
- **Source**: VarunaX codebase (browser OS clone)
- **Installed Skills**: Global agent skills from `vercel-labs/agent-skills`
  - `vercel-composition-patterns`
  - `vercel-react-best-practices`
  - `vercel-react-native-skills`
  - `web-design-guidelines`
  - These skills are globally available and your AI agent (Kiro) can access them
- **Dexter Integration**: v2026.2.6 CLI financial research assistant ready for integration

### Target State
- **Product**: VarunaX Browser OS v1.0.0
- **Identity**: Independent, original product with unique branding
- **Capabilities**: Desktop OS + Financial Research + Trading Platform
- **Quality Bar**: Production-ready, security-hardened, legally shippable

---

## 🎨 Design Philosophy & Aesthetic Direction

### Visual Identity

**Primary Brand Color**: Light Green Palette
```css
--varunax-green-50: #E8F5E9;   /* Backgrounds, hover states */
--varunax-green-200: #A5D6A7;  /* Secondary elements */
--varunax-green-500: #4CAF50;  /* Primary actions, focus */
--varunax-green-700: #388E3C;  /* Active states, accents */
```

**Design Direction** (Critical - Read Carefully):

You MUST create a distinctive, memorable aesthetic that avoids generic "AI slop" design. Reference the globally installed `web-design-guidelines` skill for best practices.

**Before coding any UI component, commit to a BOLD aesthetic direction:**

1. **Tone Options** (Pick ONE and execute with precision):
   - 🎯 **Recommended**: Modern Financial/Professional - Clean, data-dense, high-contrast, think Bloomberg Terminal meets Stripe Dashboard
   - 🌿 **Alternative 1**: Organic Minimalism - Soft curves, generous spacing, nature-inspired, calm and breathable
   - 🏗️ **Alternative 2**: Brutalist Precision - Grid-based, high contrast, technical, unapologetically functional
   - 🎨 **Alternative 3**: Retro-Futuristic - 80s-inspired color blocks, neon accents, geometric patterns

2. **Typography Strategy**:
   - **AVOID**: Inter, Roboto, Arial, system fonts (overused in AI-generated designs)
   - **PRIMARY OPTIONS**:
     - **IBM Plex Sans** + **IBM Plex Mono** (Professional, technical, open-source)
     - **Work Sans** + **Fira Code** (Modern, clean, excellent legibility)
     - **DM Sans** + **JetBrains Mono** (Geometric, friendly, developer-focused)
   - **Display Headers**: Consider adding a distinctive font like:
     - **Syne** (geometric, modern)
     - **Space Mono** (monospaced display)
     - **Manrope** (rounded, approachable)

3. **Motion & Interactions**:
   - Use the globally available `vercel-react-best-practices` skill
   - Implement CSS-only animations where possible for performance
   - Create ONE signature interaction (e.g., window morphing, dock ripple effect, fluid drag-and-drop)
   - Stagger animations on page load for polish (use `animation-delay`)
   - Add subtle micro-interactions: hover states, button press feedback, loading states

4. **Spatial Composition**:
   - **NOT** generic centered cards and grids
   - **YES** to: asymmetric layouts, overlapping panels, diagonal flow, generous negative space OR controlled density
   - Dashboard should feel like a professional trading floor, not a consumer app

5. **Backgrounds & Depth**:
   - Avoid solid white/black backgrounds
   - Add atmosphere: subtle gradients, noise textures, mesh gradients
   - Use CSS variables for theme consistency
   - Consider: `backdrop-filter: blur()` for glass-morphism effects on windows

**CRITICAL RULE**: Every component should feel intentionally designed for financial trading professionals. Think: "What would a Bloomberg Terminal designer create in 2026 if they had unlimited creative freedom?"

---

## 🏗️ Technical Architecture

### Monorepo Structure
```
varunax/
├── apps/
│   ├── ui/                    # Main browser OS application
│   ├── trading/               # Trading dashboard & execution
│   └── docs/                  # Documentation site
├── packages/
│   ├── components/            # UI component library
│   ├── design-tokens/         # Theme tokens (CSS variables)
│   ├── window-manager/        # Window system core
│   ├── integrations/
│   │   ├── dexter/           # Dexter AI research client
│   │   ├── skills-adapter/   # Agent skills integration
│   │   └── broker-connectors/# Trading adapters
│   └── utils/                # Shared utilities
├── scripts/
│   └── migrate-from-varunax.js # Automated migration script
└── .github/
    └── workflows/            # CI/CD pipelines
```

### Tech Stack
- **Framework**: React 18+ with TypeScript 5+
- **Build Tool**: Vite (fast HMR, optimized builds)
- **State Management**: Zustand (lightweight, performant)
- **Styling**: CSS Modules + CSS Variables (no Tailwind - we need custom design)
- **Animation**: Framer Motion for React components
- **Testing**: Vitest (unit) + Cypress (E2E) + Testing Library (React)
- **Documentation**: Storybook 8+
- **Linting**: ESLint + Prettier with `vercel-react-best-practices` rules

### Integration with Global Skills

The following skills are globally installed and accessible to your AI agent:

```bash
# Already installed globally
npx skills list
# Output:
# - vercel-composition-patterns
# - vercel-react-best-practices  
# - vercel-react-native-skills
# - web-design-guidelines
```

**How to leverage skills in development:**

1. **React Component Development**:
   ```bash
   # Your AI agent (Kiro) can analyze components using:
   # "Analyze this component with React best practices skill"
   # This will check for performance issues, accessibility, patterns
   ```

2. **Code Reviews**:
   - Before committing, ask Kiro to review code against `vercel-react-best-practices`
   - Check composition patterns against `vercel-composition-patterns`
   - Verify UI design against `web-design-guidelines`

3. **Performance Optimization**:
   - "Check this component for performance issues using React best practices"
   - Kiro will identify unnecessary re-renders, missing memoization, etc.

---

## 📦 Deliverable Breakdown

### Phase 1: Foundation & Rebrand (Week 1-2)

#### 1.1 Automated Migration
**Acceptance Criteria:**
- ✅ Script replaces ALL `varunax` → `varunax` (case-insensitive)
- ✅ Updates: package.json, package-lock.json, tsconfig.json, README.md, env files
- ✅ Renames: CLI commands, API endpoints, environment variables
- ✅ Git history preserved
- ✅ Rollback capability included

**Implementation:**
```javascript
// scripts/migrate-from-varunax.js
// Must handle:
// - File content replacement (code, configs, docs)
// - File/folder renaming
// - Import path updates
// - Git branch/tag prefix updates (optional)
```

#### 1.2 Design System & Tokens
**Acceptance Criteria:**
- ✅ `packages/design-tokens/` with CSS variables for:
  - Colors (primary, secondary, semantic, surface, borders)
  - Spacing scale (4px base, 0.25rem increments)
  - Typography scale (12px-48px)
  - Shadows (4 levels: sm, md, lg, xl)
  - Border radius (0, 4, 8, 12, 16px)
  - Z-index scale (modal, overlay, dropdown, tooltip)
  - Animation timings (fast: 150ms, base: 300ms, slow: 500ms)
  - Transition easings (ease-in-out, ease-out, spring)

**File Structure:**
```
packages/design-tokens/
├── colors.css
├── spacing.css
├── typography.css
├── motion.css
├── shadows.css
└── index.css (imports all)
```

**Example Token File:**
```css
/* colors.css */
:root {
  /* Brand Colors */
  --color-primary-50: #E8F5E9;
  --color-primary-500: #4CAF50;
  --color-primary-700: #388E3C;
  
  /* Semantic Colors */
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  --color-info: #3B82F6;
  
  /* Surface Colors */
  --surface-base: #FFFFFF;
  --surface-elevated: #F9FAFB;
  --surface-overlay: rgba(0, 0, 0, 0.4);
  
  /* Text Colors */
  --text-primary: #111827;
  --text-secondary: #6B7280;
  --text-tertiary: #9CA3AF;
  --text-inverse: #FFFFFF;
  
  /* Border Colors */
  --border-default: #E5E7EB;
  --border-focus: var(--color-primary-500);
}
```

#### 1.3 Component Library
**Priority Components (Build in order):**

1. **Core UI Components**:
   - `<Button>` - 4 variants (primary, secondary, ghost, danger)
   - `<Input>` - text, number, search, password
   - `<Select>` - native + custom dropdown
   - `<Checkbox>` / `<Radio>` / `<Switch>`
   - `<Modal>` - with backdrop, animations, focus trap
   - `<Toast>` - notification system with queue
   - `<Tooltip>` - hover + focus accessible
   - `<ContextMenu>` - right-click menus

2. **OS Components**:
   - `<Window>` - resizable, draggable, snap-to-edge
   - `<Titlebar>` - traffic lights, title, window controls
   - `<Dock>` - app icons, running indicators, magnification
   - `<MenuBar>` - app menus with keyboard shortcuts
   - `<AppLauncher>` - Spotlight-like search
   - `<NotificationCenter>` - system notifications panel
   - `<SystemSettings>` - preferences UI

3. **Financial/Data Components**:
   - `<DataTable>` - sortable, filterable, virtualized
   - `<Chart>` - candlestick, line, area (use Recharts or Lightweight Charts)
   - `<Ticker>` - real-time price display
   - `<OrderEntry>` - limit/market/stop order form
   - `<PortfolioCard>` - holdings summary
   - `<FilingViewer>` - SEC document renderer

**Component Quality Standards (Use vercel-react-best-practices):**
- ✅ TypeScript props with JSDoc comments
- ✅ Storybook stories with Docs, Controls, Actions
- ✅ Unit tests (>80% coverage for logic)
- ✅ Accessibility: ARIA labels, keyboard navigation, focus management
- ✅ Responsive: works on desktop, tablet (trading on mobile is secondary)
- ✅ Performance: React.memo for pure components, useMemo/useCallback for expensive operations

**Example Component Template:**
```typescript
// packages/components/src/Button/Button.tsx
import React from 'react';
import styles from './Button.module.css';

export interface ButtonProps {
  /**
   * Button display variant
   */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  
  /**
   * Button size
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Disabled state
   */
  disabled?: boolean;
  
  /**
   * Loading state (shows spinner)
   */
  loading?: boolean;
  
  /**
   * Click handler
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  
  /**
   * Button content
   */
  children: React.ReactNode;
}

/**
 * Primary button component for VarunaX
 * 
 * @example
 * ```tsx
 * <Button variant="primary" onClick={handleClick}>
 *   Execute Trade
 * </Button>
 * ```
 */
export const Button = React.memo<ButtonProps>(({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  children,
}) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${styles[size]}`}
      disabled={disabled || loading}
      onClick={onClick}
      aria-busy={loading}
    >
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      <span className={styles.content}>{children}</span>
    </button>
  );
});

Button.displayName = 'Button';
```

#### 1.4 Brand Assets
**Deliverables:**
- ✅ VarunaX Logo (SVG, original design)
  - Full logo (icon + wordmark)
  - Icon only (square, for favicons)
  - Horizontal lockup
  - Variants: color, monochrome, white
  
- ✅ CLI ASCII Art Banner
```
██╗   ██╗ █████╗ ██████╗ ██╗   ██╗███╗   ██╗ █████╗ ██╗  ██╗
██║   ██║██╔══██╗██╔══██╗██║   ██║████╗  ██║██╔══██╗╚██╗██╔╝
██║   ██║███████║██████╔╝██║   ██║██╔██╗ ██║███████║ ╚███╔╝ 
╚██╗ ██╔╝██╔══██║██╔══██╗██║   ██║██║╚██╗██║██╔══██║ ██╔██╗ 
 ╚████╔╝ ██║  ██║██║  ██║╚██████╔╝██║ ╚████║██║  ██║██╔╝ ██╗
  ╚═══╝  ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝  ╚═╝
```

- ✅ Favicons (16x16, 32x32, 192x192, 512x512)
- ✅ App icons for dock (128x128, 256x256, SVG)

**Legal Requirements:**
- ❌ NO Apple trademarks or copyrighted assets
- ❌ NO macOS system fonts (San Francisco, SF Pro, etc.)
- ❌ NO exact macOS icon reproductions
- ✅ YES to inspired-by interactions (dock magnification, window snapping)
- ✅ YES to open-source fonts and original icons

---

### Phase 2: Window Manager & OS Core (Week 3-4)

#### 2.1 Window Management System
**Core Features:**
- Resizable windows (drag from edges/corners)
- Draggable title bars with constraints (can't drag off-screen)
- Window states: normal, minimized, maximized, fullscreen
- Snap-to-edge zones (drag to edge to tile 50/50)
- Window focus management (click to bring to front)
- Multi-window z-index stacking
- Window animations (open: scale+fade, close: scale-down, minimize: genie effect)

**Acceptance Criteria:**
- ✅ Drag window to left edge → snaps to 50% width, left-aligned
- ✅ Drag window to top edge → maximizes to fullscreen
- ✅ Double-click titlebar → toggles maximize
- ✅ Click window anywhere → brings to front (z-index update)
- ✅ Minimize → animates to dock icon
- ✅ Close → fade-out animation, removes from window list
- ✅ Keyboard shortcuts: Cmd+W (close), Cmd+M (minimize), Cmd+H (hide)

**Implementation Hints:**
```typescript
// packages/window-manager/src/useWindowManager.ts
interface Window {
  id: string;
  appId: string;
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  state: 'normal' | 'minimized' | 'maximized' | 'fullscreen';
  zIndex: number;
  isActive: boolean;
}

// Zustand store
interface WindowManagerState {
  windows: Window[];
  activeWindowId: string | null;
  
  openWindow: (appId: string, config?: Partial<Window>) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindowPosition: (id: string, position: { x: number; y: number }) => void;
  updateWindowSize: (id: string, size: { width: number; height: number }) => void;
}
```

#### 2.2 Dock Component
**Features:**
- App icons with labels on hover
- Running indicator (small dot below icon)
- Click to open/focus app
- Right-click context menu:
  - Open / Show All Windows / Hide
  - Options (e.g., Open at Login)
  - Quit
- Drag to reorder icons
- Drag app to trash to uninstall
- Magnification effect on hover (icons scale up)
- Separator between apps and system items (trash, settings)

**Acceptance Criteria:**
- ✅ Hover over icon → magnification effect (1.5x scale)
- ✅ Click icon → opens app (if not running) or focuses (if running)
- ✅ Running apps show dot indicator below icon
- ✅ Right-click → shows context menu
- ✅ Drag icon → reorders in dock, persists on page reload
- ✅ System apps (Settings, App Store) are pinned and can't be removed

#### 2.3 Menu Bar
**Features:**
- Global menu bar at top of screen
- Dynamic menus based on active app
- System menus: VarunaX, File, Edit, View, Window, Help
- App-specific menus (e.g., "Trading" menu for trading app)
- Keyboard shortcuts displayed (e.g., "Save  ⌘S")
- Click menu → dropdown appears
- Keyboard navigation (Tab through menus, Enter to select)

**Acceptance Criteria:**
- ✅ Menu bar shows active app name
- ✅ Click menu title → dropdown opens
- ✅ Click outside → dropdown closes
- ✅ Keyboard: Alt opens menus, arrow keys navigate, Enter selects
- ✅ Shortcuts work globally (e.g., Cmd+Q quits active app)

#### 2.4 Gestures & Keyboard Shortcuts
**Trackpad Gestures (Web API):**
- Two-finger swipe left/right → navigate browser history (if applicable)
- Three-finger swipe up → show all windows (Exposé-style)
- Pinch to zoom → zoom web content (native browser)

**Keyboard Shortcuts:**
```
Global:
- Cmd+Space: Open app launcher (Spotlight-style search)
- Cmd+Tab: Switch between apps
- Cmd+Q: Quit active app
- Cmd+W: Close active window
- Cmd+M: Minimize active window
- Cmd+H: Hide active app

Window Management:
- Cmd+Ctrl+F: Toggle fullscreen
- Cmd+Arrow: Snap window (left/right to half-screen, up to maximize)

System:
- Cmd+Shift+5: Take screenshot
- Cmd+,: Open Settings
```

**Implementation:**
```typescript
// packages/window-manager/src/useKeyboardShortcuts.ts
const shortcuts = {
  'meta+space': () => openAppLauncher(),
  'meta+tab': () => showAppSwitcher(),
  'meta+q': () => quitActiveApp(),
  'meta+w': () => closeActiveWindow(),
  // etc.
};

// Use a library like react-hotkeys-hook
useHotkeys('meta+space', openAppLauncher);
```

---

### Phase 3: Dexter Integration & Financial UI (Week 5-6)

#### 3.1 Dexter Client Library
**Location:** `packages/integrations/dexter/`

**API Surface:**
```typescript
// dexter-client.ts
export interface DexterClient {
  // Financial Data
  getStockPrice(ticker: string): Promise<StockPrice>;
  getCompanyFinancials(ticker: string): Promise<Financials>;
  getIncomeStatement(ticker: string, period: 'quarterly' | 'annual'): Promise<IncomeStatement>;
  getBalanceSheet(ticker: string): Promise<BalanceSheet>;
  getCashFlow(ticker: string): Promise<CashFlowStatement>;
  
  // SEC Filings
  getFilings(ticker: string, formType?: string): Promise<Filing[]>;
  getFilingContent(filingUrl: string): Promise<string>;
  
  // Analysis
  getDCFValuation(ticker: string, assumptions?: DCFAssumptions): Promise<DCFResult>;
  getComparables(ticker: string): Promise<Comparable[]>;
  
  // Market Intelligence
  getMarketNews(query: string): Promise<NewsArticle[]>;
  getInsiderTrading(ticker: string): Promise<InsiderTrade[]>;
  getCryptoPrice(symbol: string): Promise<CryptoPrice>;
}

// Example usage
const dexter = createDexterClient({
  apiKey: process.env.DEXTER_API_KEY, // From secure storage
  baseUrl: 'http://localhost:8000', // Dexter CLI server
});

const financials = await dexter.getCompanyFinancials('AAPL');
```

**Connection Mode:**
- Development: Dexter runs locally (`dexter serve` on port 8000)
- Production: Dexter deployed as microservice (Docker container)

**Error Handling:**
```typescript
try {
  const data = await dexter.getStockPrice('AAPL');
} catch (error) {
  if (error instanceof DexterRateLimitError) {
    // Show toast: "Rate limit reached, try again in 60s"
  } else if (error instanceof DexterAuthError) {
    // Redirect to API key settings
  } else {
    // Generic error handling
  }
}
```

#### 3.2 Dashboard Templates
**Dashboard 1: Portfolio Overview**
```
┌─────────────────────────────────────────────────────┐
│ 💼 Portfolio Overview                   $1,234,567 │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────┐  ┌─────────────────┐         │
│  │ Total Value     │  │ Day P&L         │         │
│  │ $1,234,567      │  │ +$12,345 (1.0%) │  📈     │
│  └─────────────────┘  └─────────────────┘         │
│                                                     │
│  📊 Holdings (Top 10)                              │
│  ┌──────────────────────────────────────────────┐ │
│  │ AAPL  1,000 shares  $150,000  +2.5%  ████   │ │
│  │ MSFT    500 shares  $200,000  -1.2%  ██     │ │
│  │ GOOGL   300 shares  $90,000   +0.8%  ███    │ │
│  └──────────────────────────────────────────────┘ │
│                                                     │
│  📈 Performance (YTD)                              │
│  [Line chart showing portfolio vs S&P 500]        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Dashboard 2: Real-Time Ticker Wall**
```
┌─────────────────────────────────────────────────────┐
│ 🎯 Market Watch                                     │
├─────────────────────────────────────────────────────┤
│  ┌────────┬────────┬────────┬────────┐            │
│  │ AAPL   │ MSFT   │ GOOGL  │ AMZN   │            │
│  │ 150.25 │ 420.10 │ 140.50 │ 180.75 │            │
│  │ +2.5%  │ -1.2%  │ +0.8%  │ +3.1%  │            │
│  │ 🟢     │ 🔴     │ 🟢     │ 🟢     │            │
│  └────────┴────────┴────────┴────────┘            │
│                                                     │
│  📰 Latest News                                    │
│  • Apple announces new AI chip (5m ago)           │
│  • Microsoft beats earnings expectations (12m)     │
│  • Google faces antitrust hearing (1h ago)        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Dashboard 3: SEC Filings Summary**
```
┌─────────────────────────────────────────────────────┐
│ 📄 SEC Filings - AAPL                               │
├─────────────────────────────────────────────────────┤
│  Recent Filings:                                    │
│  ┌───────────────────────────────────────────────┐ │
│  │ 10-K Annual Report        2024-10-28  [View]  │ │
│  │ 8-K Current Report        2024-11-15  [View]  │ │
│  │ DEF 14A Proxy Statement   2024-09-20  [View]  │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  🔍 AI Summary (powered by Dexter):                │
│  Apple's Q4 2024 revenue grew 8% YoY to $90.8B.   │
│  iPhone revenue up 6%, Services up 12%.           │
│  Key risks: supply chain, China exposure.         │
│                                                     │
│  [Ask Dexter a question about this filing...]     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Dashboard 4: Strategy Backtest Results**
```
┌─────────────────────────────────────────────────────┐
│ 🧪 Backtest: Momentum Strategy                     │
├─────────────────────────────────────────────────────┤
│  Parameters:                                        │
│  • Lookback: 20 days                               │
│  • Top N: 10 stocks (S&P 500)                      │
│  • Rebalance: Monthly                              │
│  • Period: 2020-01-01 to 2024-12-31               │
│                                                     │
│  Results:                                          │
│  ┌──────────────────┐  ┌──────────────────┐       │
│  │ Total Return     │  │ Sharpe Ratio     │       │
│  │ +45.2%          │  │ 1.35             │       │
│  └──────────────────┘  └──────────────────┘       │
│                                                     │
│  📊 Equity Curve                                   │
│  [Chart: Strategy vs Buy-and-Hold S&P 500]        │
│                                                     │
│  📉 Drawdowns                                      │
│  Max: -12.5% (Mar 2020)                           │
│                                                     │
└─────────────────────────────────────────────────────┘
```

#### 3.3 Trading Panel
**Features:**
- Market data feed (price, volume, bid/ask)
- Order entry form (ticker, quantity, type, limit price)
- Order types: Market, Limit, Stop Loss, Stop Limit
- Position sizing calculator ("Risk $1000 on AAPL at $150 with stop at $145 = ? shares")
- Risk calculator (show max loss, R:R ratio)
- Paper trading toggle (prominent banner when in simulation mode)
- Order confirmation modal (requires explicit confirmation)

**UI Layout:**
```
┌─────────────────────────────────────────────────────┐
│ 🎯 Trading Panel                    [Paper Trading] │
├─────────────────────────────────────────────────────┤
│  Market Data:                                       │
│  ┌─────────────────────────────────────────────┐   │
│  │ AAPL                                        │   │
│  │ Last: $150.25   Bid: $150.24   Ask: $150.26│   │
│  │ Volume: 52.3M   Day Range: $148.50-$150.75 │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  Order Entry:                                      │
│  Ticker: [AAPL____]  Side: (•) Buy  ( ) Sell      │
│  Quantity: [100___]  Type: [Limit ▼]              │
│  Limit Price: [$150.00]                           │
│                                                     │
│  Position Sizing:                                  │
│  Risk Amount: [$1,000]  Stop Loss: [$145.00]     │
│  → Suggested Qty: 190 shares                      │
│  → Max Loss: $1,000 (5.2 shares × $5.25)         │
│                                                     │
│  [Calculate]  [Place Order]                       │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Order Confirmation Modal:**
```
┌───────────────────────────────────────┐
│ ⚠️  Confirm Order                     │
├───────────────────────────────────────┤
│                                       │
│  You are about to place:             │
│                                       │
│  BUY 100 shares of AAPL              │
│  at LIMIT $150.00                    │
│                                       │
│  Estimated Cost: $15,000.00          │
│  Commission: $0.00                   │
│  Total: $15,000.00                   │
│                                       │
│  ⚠️  This is a PAPER TRADE            │
│  (No real money will be used)        │
│                                       │
│  [Cancel]  [Confirm Order]           │
│                                       │
└───────────────────────────────────────┘
```

**Acceptance Criteria:**
- ✅ Paper trading mode is default (requires explicit toggle to live)
- ✅ Live trading shows prominent warning banner
- ✅ All orders require confirmation modal
- ✅ Position sizing calculator accurately computes shares based on risk
- ✅ Order history log (timestamp, ticker, side, qty, price, status)
- ✅ Integration with mock broker (returns fake order IDs, fills immediately)

---

### Phase 4: Skills Integration & Extensibility (Week 7)

#### 4.1 Agent Skills Adapter
**Purpose:** Make globally installed agent skills available to VarunaX apps

**Architecture:**
```
VarunaX App → Skills Adapter → Agent Skills (NPX Global)
                    ↓
              Skill Registry
                    ↓
              [React Best Practices]
              [Web Design Guidelines]
              [Composition Patterns]
              [Custom User Skills]
```

**Implementation:**
```typescript
// packages/integrations/skills-adapter/src/index.ts

export interface AgentSkill {
  id: string;
  name: string;
  description: string;
  version: string;
  execute: (input: any) => Promise<any>;
}

export class SkillsAdapter {
  private skills: Map<string, AgentSkill> = new Map();
  
  /**
   * Discover globally installed skills
   */
  async discoverSkills(): Promise<AgentSkill[]> {
    // Execute: npx skills list --json
    // Parse output and populate skills map
  }
  
  /**
   * Execute a skill
   */
  async executeSkill(skillId: string, input: any): Promise<any> {
    const skill = this.skills.get(skillId);
    if (!skill) throw new Error(`Skill not found: ${skillId}`);
    
    return skill.execute(input);
  }
  
  /**
   * Get skill manifest
   */
  getSkill(skillId: string): AgentSkill | undefined {
    return this.skills.get(skillId);
  }
  
  /**
   * List all available skills
   */
  listSkills(): AgentSkill[] {
    return Array.from(this.skills.values());
  }
}
```

**Example Usage in Dashboard:**
```typescript
// apps/trading/src/components/CodeReviewWidget.tsx
import { useSkills } from '@varunax/skills-adapter';

export function CodeReviewWidget({ code }: { code: string }) {
  const skills = useSkills();
  const [review, setReview] = useState<string | null>(null);
  
  const runCodeReview = async () => {
    const result = await skills.executeSkill('vercel-react-best-practices', {
      action: 'analyze',
      code: code,
    });
    
    setReview(result.feedback);
  };
  
  return (
    <div>
      <h3>Code Review (AI-Powered)</h3>
      <pre>{code}</pre>
      <button onClick={runCodeReview}>Analyze with React Best Practices</button>
      {review && <div className="review">{review}</div>}
    </div>
  );
}
```

#### 4.2 Custom Skills for VarunaX
**New Skill: Financial Analysis Automation**
```typescript
// Create a new skill: varunax-financial-analysis
// Install: npx skills add ./skills/varunax-financial-analysis

// skills/varunax-financial-analysis/index.ts
export default {
  name: 'varunax-financial-analysis',
  description: 'Automated financial statement analysis and DCF modeling',
  
  async execute(input: { ticker: string; action: string }) {
    switch (input.action) {
      case 'dcf':
        return runDCFModel(input.ticker);
      case 'comparables':
        return findComparables(input.ticker);
      case 'quality-score':
        return calculateQualityScore(input.ticker);
      default:
        throw new Error(`Unknown action: ${input.action}`);
    }
  },
};
```

**Skill Discovery UI:**
```
┌─────────────────────────────────────────────────────┐
│ 🧩 Installed Skills                                 │
├─────────────────────────────────────────────────────┤
│  ✅ vercel-composition-patterns (v1.2.0)            │
│  ✅ vercel-react-best-practices (v2.0.1)            │
│  ✅ web-design-guidelines (v1.5.0)                  │
│  ✅ varunax-financial-analysis (v1.0.0)             │
│                                                     │
│  [+ Add New Skill]  [Browse Skill Store]           │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

### Phase 5: Security & Production Hardening (Week 8)

#### 5.1 Credential Management
**Requirements:**
- ✅ Never store API keys or broker credentials in plain text
- ✅ Use browser `crypto.subtle` API for encryption
- ✅ Optional server-side vault (e.g., HashiCorp Vault) for production
- ✅ Credentials encrypted at rest, decrypted only in memory
- ✅ Auto-logout after 30min inactivity

**Implementation:**
```typescript
// packages/utils/src/encryption.ts
export class CredentialManager {
  private encryptionKey: CryptoKey | null = null;
  
  async init(userPassword: string) {
    // Derive encryption key from user password
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(userPassword),
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );
    
    this.encryptionKey = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode('varunax-salt-v1'),
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
  }
  
  async encrypt(data: string): Promise<string> {
    if (!this.encryptionKey) throw new Error('Not initialized');
    
    const encoder = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      this.encryptionKey,
      encoder.encode(data)
    );
    
    // Return base64: iv + encrypted data
    return btoa(String.fromCharCode(...iv) + String.fromCharCode(...new Uint8Array(encrypted)));
  }
  
  async decrypt(encryptedData: string): Promise<string> {
    if (!this.encryptionKey) throw new Error('Not initialized');
    
    const data = atob(encryptedData);
    const iv = new Uint8Array(data.slice(0, 12).split('').map(c => c.charCodeAt(0)));
    const encrypted = new Uint8Array(data.slice(12).split('').map(c => c.charCodeAt(0)));
    
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      this.encryptionKey,
      encrypted
    );
    
    return new TextDecoder().decode(decrypted);
  }
}

// Usage
const credManager = new CredentialManager();
await credManager.init('user-master-password');

// Store encrypted API key
const encrypted = await credManager.encrypt('sk-abc123...');
localStorage.setItem('dexter_api_key', encrypted);

// Retrieve and decrypt
const encrypted = localStorage.getItem('dexter_api_key');
const apiKey = await credManager.decrypt(encrypted);
```

#### 5.2 Audit Logging
**Requirements:**
- ✅ Log all trading actions (order placed, canceled, filled)
- ✅ Log authentication events (login, logout, failed attempts)
- ✅ Log admin actions (settings changed, users added)
- ✅ Logs are append-only (cannot be modified)
- ✅ Logs include: timestamp, user ID, action, metadata

**Implementation:**
```typescript
// packages/utils/src/audit-log.ts
export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  metadata: Record<string, any>;
  ipAddress?: string;
}

export class AuditLogger {
  private logs: AuditLogEntry[] = [];
  
  log(action: string, metadata: Record<string, any>) {
    const entry: AuditLogEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      userId: this.getCurrentUserId(),
      action,
      metadata,
      ipAddress: this.getClientIP(),
    };
    
    this.logs.push(entry);
    
    // Persist to backend
    this.persistLog(entry);
  }
  
  async getLogsByUser(userId: string): Promise<AuditLogEntry[]> {
    return this.logs.filter(log => log.userId === userId);
  }
  
  async getLogsByDateRange(start: Date, end: Date): Promise<AuditLogEntry[]> {
    return this.logs.filter(log => {
      const logDate = new Date(log.timestamp);
      return logDate >= start && logDate <= end;
    });
  }
}

// Usage
const auditLog = new AuditLogger();

// Log order placement
auditLog.log('order.placed', {
  ticker: 'AAPL',
  side: 'buy',
  quantity: 100,
  price: 150.00,
  orderType: 'limit',
  mode: 'paper', // or 'live'
});

// Log failed login
auditLog.log('auth.login.failed', {
  username: 'user@example.com',
  reason: 'invalid_password',
});
```

#### 5.3 Role-Based Access Control (RBAC)
**Roles:**
- `viewer` - Read-only access to dashboards
- `trader` - Can place paper trades
- `live_trader` - Can place live trades
- `admin` - Full system access

**Implementation:**
```typescript
// packages/utils/src/rbac.ts
export type Role = 'viewer' | 'trader' | 'live_trader' | 'admin';

export interface User {
  id: string;
  email: string;
  roles: Role[];
}

export class RBAC {
  private currentUser: User | null = null;
  
  setUser(user: User) {
    this.currentUser = user;
  }
  
  hasRole(role: Role): boolean {
    return this.currentUser?.roles.includes(role) ?? false;
  }
  
  canPlaceTrade(mode: 'paper' | 'live'): boolean {
    if (mode === 'paper') {
      return this.hasRole('trader') || this.hasRole('live_trader') || this.hasRole('admin');
    } else {
      return this.hasRole('live_trader') || this.hasRole('admin');
    }
  }
  
  canViewDashboard(): boolean {
    return this.hasRole('viewer') || this.hasRole('trader') || this.hasRole('live_trader') || this.hasRole('admin');
  }
  
  requireRole(role: Role) {
    if (!this.hasRole(role)) {
      throw new Error(`Access denied: requires role ${role}`);
    }
  }
}

// Usage in components
const rbac = useRBAC();

function PlaceOrderButton() {
  const canTrade = rbac.canPlaceTrade('live');
  
  return (
    <button disabled={!canTrade} onClick={placeOrder}>
      {canTrade ? 'Place Order' : 'Insufficient Permissions'}
    </button>
  );
}
```

#### 5.4 Input Validation & XSS/CSRF Protection
**Requirements:**
- ✅ Validate all user inputs (ticker symbols, quantities, prices)
- ✅ Sanitize HTML inputs to prevent XSS
- ✅ Use CSRF tokens for all state-changing requests
- ✅ Implement rate limiting for API endpoints

**Implementation:**
```typescript
// packages/utils/src/validation.ts
export const validators = {
  ticker: (value: string): boolean => {
    // 1-5 uppercase letters
    return /^[A-Z]{1,5}$/.test(value);
  },
  
  quantity: (value: number): boolean => {
    // Positive integer
    return Number.isInteger(value) && value > 0;
  },
  
  price: (value: number): boolean => {
    // Positive number, max 2 decimal places
    return value > 0 && /^\d+(\.\d{1,2})?$/.test(value.toString());
  },
  
  email: (value: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  },
};

// DOMPurify for HTML sanitization
import DOMPurify from 'dompurify';

export function sanitizeHTML(html: string): string {
  return DOMPurify.sanitize(html);
}

// CSRF token management
export class CSRFProtection {
  private token: string | null = null;
  
  generateToken(): string {
    this.token = crypto.randomUUID();
    return this.token;
  }
  
  validateToken(token: string): boolean {
    return token === this.token;
  }
}
```

---

### Phase 6: Developer Experience & Documentation (Week 9)

#### 6.1 Storybook Setup
**Configuration:**
```typescript
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../packages/components/src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y', // Accessibility testing
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
};

export default config;
```

**Example Story:**
```typescript
// packages/components/src/Button/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

export const Loading: Story = {
  args: {
    variant: 'primary',
    loading: true,
    children: 'Loading...',
  },
};

export const Disabled: Story = {
  args: {
    variant: 'primary',
    disabled: true,
    children: 'Disabled',
  },
};
```

#### 6.2 Testing Strategy
**Unit Tests (Vitest):**
```typescript
// packages/components/src/Button/Button.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });
  
  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it('is disabled when loading', () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
  
  it('shows spinner when loading', () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });
});
```

**E2E Tests (Cypress):**
```typescript
// cypress/e2e/trading-flow.cy.ts
describe('Paper Trading Flow', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.login('trader@example.com', 'password');
  });
  
  it('completes a paper trade from dashboard to confirmation', () => {
    // Open trading app from dock
    cy.get('[data-testid="dock-trading-app"]').click();
    
    // Wait for trading panel to load
    cy.get('[data-testid="trading-panel"]').should('be.visible');
    
    // Enter trade details
    cy.get('[data-testid="ticker-input"]').type('AAPL');
    cy.get('[data-testid="quantity-input"]').type('100');
    cy.get('[data-testid="order-type-select"]').select('Limit');
    cy.get('[data-testid="limit-price-input"]').type('150.00');
    
    // Click place order
    cy.get('[data-testid="place-order-button"]').click();
    
    // Confirmation modal appears
    cy.get('[data-testid="order-confirmation-modal"]').should('be.visible');
    cy.get('[data-testid="order-confirmation-modal"]').should('contain', 'BUY 100 shares of AAPL');
    cy.get('[data-testid="order-confirmation-modal"]').should('contain', 'PAPER TRADE');
    
    // Confirm order
    cy.get('[data-testid="confirm-order-button"]').click();
    
    // Success toast appears
    cy.get('[data-testid="toast"]').should('contain', 'Order placed successfully');
    
    // Order appears in history
    cy.get('[data-testid="order-history"]').should('contain', 'AAPL');
    cy.get('[data-testid="order-history"]').should('contain', '100 shares');
  });
});
```

#### 6.3 CI/CD Pipeline
**GitHub Actions Workflow:**
```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Type check
        run: npm run typecheck
      
      - name: Unit tests
        run: npm run test:unit
      
      - name: Build Storybook
        run: npm run build:storybook
      
      - name: E2E tests
        run: npm run test:e2e
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
  
  build:
    runs-on: ubuntu-latest
    needs: test
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/
```

#### 6.4 Developer Onboarding Documentation
**Location:** `docs/DEVELOPER_ONBOARDING.md`

**Content:**
```markdown
# VarunaX Developer Onboarding

Welcome to the VarunaX development team! This guide will get you up and running in 30 minutes.

## Prerequisites
- Node.js 20+ and npm 9+
- Git
- (Optional) Dexter CLI for financial data integration

## Quick Start

### 1. Clone and Install
```bash
git clone https://github.com/your-org/varunax.git
cd varunax
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
This starts:
- Main UI at http://localhost:3000
- Storybook at http://localhost:6006

### 3. Run Tests
```bash
npm run test:unit    # Unit tests with Vitest
npm run test:e2e     # E2E tests with Cypress
npm run lint         # ESLint
npm run typecheck    # TypeScript
```

### 4. (Optional) Connect Dexter
```bash
# Install Dexter CLI
npm install -g dexter-cli

# Start Dexter server
dexter serve --port 8000

# Set API key (get from Settings > Integrations)
export DEXTER_API_KEY=your-api-key-here
```

### 5. Enable Paper Trading
1. Open VarunaX
2. Click Settings in dock
3. Navigate to Trading > Mode
4. Toggle "Paper Trading" ON
5. (Optional) Set starting capital: $100,000

## Project Structure
```
varunax/
├── apps/
│   ├── ui/           # Main browser OS UI
│   └── trading/      # Trading dashboard
├── packages/
│   ├── components/   # Shared UI components
│   ├── window-manager/ # Window system core
│   └── integrations/ # Dexter, skills, brokers
├── docs/            # Documentation
└── scripts/         # Build/migration scripts
```

## Development Workflow

### Creating a New Component
```bash
# Generate component scaffold
npm run generate:component -- --name MyComponent

# Outputs:
# packages/components/src/MyComponent/
#   ├── MyComponent.tsx
#   ├── MyComponent.module.css
#   ├── MyComponent.test.tsx
#   └── MyComponent.stories.tsx
```

### Using Global Agent Skills
VarunaX integrates with globally installed agent skills. To use them:

```bash
# List available skills
npx skills list

# Add a new skill
npx skills add vercel-labs/agent-skills

# In your code:
import { useSkills } from '@varunax/skills-adapter';

const skills = useSkills();
const result = await skills.executeSkill('vercel-react-best-practices', {
  action: 'analyze',
  code: myComponentCode,
});
```

**Installed Skills:**
- `vercel-composition-patterns` - Component patterns
- `vercel-react-best-practices` - Performance & accessibility
- `web-design-guidelines` - UI/UX best practices

### Before Submitting a PR
1. Run full test suite: `npm run test`
2. Run linting: `npm run lint --fix`
3. Update Storybook if adding/modifying components
4. Add E2E test if changing user flows
5. Update CHANGELOG.md

## Troubleshooting

### Issue: Window won't drag
- Check if `pointer-events` is set correctly
- Verify z-index stacking
- Check console for JavaScript errors

### Issue: Dexter API calls failing
- Ensure Dexter server is running: `dexter serve`
- Check API key is set: `echo $DEXTER_API_KEY`
- Verify network connectivity

### Issue: Tests failing
- Clear test cache: `npm run test:unit -- --clear-cache`
- Check if Cypress binary is installed: `npx cypress verify`

## Need Help?
- Slack: #varunax-dev
- Docs: https://docs.varunax.io
- Issues: https://github.com/your-org/varunax/issues
```

---

## 🎯 Acceptance Criteria Summary

Before considering VarunaX v1.0.0 complete, verify ALL of the following:

### Branding & Assets
- [ ] All `varunax` references replaced with `varunax` (case-insensitive)
- [ ] Original VarunaX logo (SVG) created and included
- [ ] CLI ASCII banner displays on startup
- [ ] Favicons (all sizes) generated and installed
- [ ] No copyrighted Apple assets or trademarks used

### Design System
- [ ] Design tokens (colors, spacing, typography) defined in CSS variables
- [ ] Light-green primary palette with 4 shades implemented
- [ ] All components documented in Storybook
- [ ] WCAG AA color contrast compliance verified
- [ ] Motion system implemented (window animations, hover states)

### Window Manager
- [ ] Windows are resizable, draggable, and remember position
- [ ] Snap-to-edge tiling works (left, right, top for fullscreen)
- [ ] Window focus management (click to front) works
- [ ] Minimize/maximize/close animations smooth
- [ ] Keyboard shortcuts work (Cmd+W, Cmd+M, etc.)

### Dock
- [ ] Dock displays app icons with running indicators
- [ ] Click to launch/focus app works
- [ ] Right-click context menu functional
- [ ] Drag to reorder icons persists
- [ ] Magnification effect on hover

### Menu Bar
- [ ] Menu bar shows active app name
- [ ] Menus open on click, close on outside click
- [ ] Keyboard navigation works (Alt, arrows, Enter)
- [ ] Shortcuts displayed and functional

### Dexter Integration
- [ ] Dexter client library connects to local/remote server
- [ ] Stock prices, financials, SEC filings fetch successfully
- [ ] Error handling (rate limits, auth errors) implemented
- [ ] Mock data mode for development/testing

### Dashboards
- [ ] Portfolio Overview displays holdings and performance
- [ ] Ticker Wall shows real-time prices (or mock data)
- [ ] SEC Filings Summary displays recent filings with AI summary
- [ ] Charts render (candlesticks, line graphs)

### Trading Panel
- [ ] Paper trading mode is default
- [ ] Order entry form validates inputs
- [ ] Position sizing calculator computes correct quantities
- [ ] Order confirmation modal requires explicit confirmation
- [ ] Order history log displays all trades
- [ ] Live trading toggle shows prominent warning

### Security
- [ ] API keys encrypted at rest using crypto.subtle
- [ ] Audit log records all trading and auth events
- [ ] RBAC enforces permissions (viewer, trader, live_trader, admin)
- [ ] Input validation prevents invalid data
- [ ] XSS/CSRF protections implemented

### Skills Integration
- [ ] Skills adapter discovers globally installed skills
- [ ] Skills can be executed from VarunaX apps
- [ ] Custom VarunaX skills can be added
- [ ] Skill registry UI displays installed skills

### Testing
- [ ] Unit tests for all components (>80% coverage)
- [ ] E2E tests for core flows (window management, trading)
- [ ] Storybook builds without errors
- [ ] CI pipeline passes (lint, typecheck, tests, build)

### Documentation
- [ ] README.md updated with VarunaX branding
- [ ] Developer onboarding guide created
- [ ] API contracts documented (OpenAPI/JSON schema)
- [ ] Storybook component docs complete

---

## 📅 Sprint Timeline

| Week | Phase | Key Deliverables |
|------|-------|------------------|
| 1-2  | Foundation & Rebrand | Migration script, design system, brand assets |
| 3-4  | Window Manager & OS Core | Window manager, dock, menu bar, shortcuts |
| 5-6  | Dexter Integration & Financial UI | Dexter client, dashboards, trading panel |
| 7    | Skills Integration & Extensibility | Skills adapter, custom skills, skill registry |
| 8    | Security & Production Hardening | Encryption, audit logs, RBAC, validation |
| 9    | Developer Experience & Documentation | Storybook, tests, CI, onboarding docs |

---

## 🚀 Ready-to-Use Prompt for Your Coder

> **Copy and paste this section directly to your coder:**

---

### Task: Build VarunaX Browser OS v1.0.0

You are assigned to convert the VarunaX codebase into **VarunaX** - an independent, production-ready browser-based operating system with integrated financial research and trading capabilities.

**Objectives:**
1. **Complete Rebrand**: Replace all `varunax` references with `varunax` (code, docs, assets, configs)
2. **Original UI/UX**: Create macOS-inspired interactions with 100% original, legally-safe assets
3. **Design System**: Build component library using light-green palette, original fonts (IBM Plex/Work Sans), and distinctive aesthetics (avoid generic AI design patterns)
4. **Window Manager**: Implement resizable/draggable windows, dock with magnification, menu bar, keyboard shortcuts
5. **Dexter Integration**: Connect to Dexter CLI (v2026.2.6) for financial data, SEC filings, valuations
6. **Trading Engine**: Build trading panel with paper/live modes, order entry, position sizing, confirmation modals
7. **Skills Integration**: Integrate globally installed agent skills (vercel-react-best-practices, web-design-guidelines)
8. **Security**: Encrypt credentials, audit logging, RBAC, input validation
9. **Testing**: Unit tests (Vitest), E2E tests (Cypress), Storybook documentation
10. **CI/CD**: GitHub Actions pipeline (lint, typecheck, test, build)

**Critical Requirements:**
- ❌ NO Apple trademarks, copyrighted fonts (San Francisco), or macOS icons
- ✅ YES to original assets, open-source fonts, inspired-but-distinct interactions
- ✅ Paper trading is default (live trading requires explicit opt-in with warnings)
- ✅ All credentials encrypted (never plain text)
- ✅ Before coding UI, commit to a BOLD aesthetic direction (see Design Philosophy section)
- ✅ Leverage globally installed agent skills for code review and optimization

**Deliverables:**
1. Migration script to automate varunax→varunax rename
2. Design tokens (CSS variables) for colors, spacing, typography, motion
3. Component library in Storybook with >30 documented components
4. Window manager with full OS interactions (windows, dock, menu bar)
5. Dexter client library with API contracts and error handling
6. 4 dashboard templates (Portfolio, Ticker Wall, SEC Filings, Backtest)
7. Trading panel with paper/live modes and security features
8. Skills adapter for global agent skills integration
9. Encrypted credential storage and audit logging
10. Full test suite (unit + E2E) with >80% coverage
11. CI pipeline passing all checks
12. Developer onboarding documentation

**Starting Point:**
- Version: v1.0.0
- Monorepo structure: apps/, packages/, scripts/, docs/
- Tech stack: React 18+, TypeScript 5+, Vite, Zustand, CSS Modules, Framer Motion
- Global skills already installed: vercel-composition-patterns, vercel-react-best-practices, web-design-guidelines

**First Sprint Tasks:**
1. Run migration script to replace varunax→varunax
2. Scaffold design system and Storybook
3. Implement Window Manager, Dock, MenuBar components
4. Build Dashboard shell and Portfolio Overview widget
5. Wire Dexter mock API and display sample SEC filing
6. Implement paper trading flow with confirmation modal
7. Create original VarunaX logo and CLI banner
8. Add unit tests and E2E tests
9. Set up CI pipeline

**Reference the full enhanced prompt document for:**
- Detailed component specifications
- Code examples and templates
- Security implementation patterns
- Testing strategies
- Aesthetic guidelines

**Success Criteria:**
VarunaX v1.0.0 is complete when all acceptance criteria are met, CI pipeline passes, and a live demo can execute a paper trade end-to-end without errors.

---

## 📝 Final Notes

This enhanced prompt provides:

1. **Clear Aesthetic Direction**: Avoids generic AI design by committing to a bold visual identity
2. **Skills Integration**: Leverages globally installed agent skills for development workflow
3. **Security-First**: Encryption, audit logging, RBAC built-in from day 1
4. **Production-Ready**: CI/CD, testing, documentation, and legal compliance
5. **Extensibility**: Modular architecture for adding new skills and broker connectors

**Key Differentiators from VarunaX:**
- Original branding and visual identity
- Integrated financial research (Dexter)
- Trading capabilities (paper + live)
- Agent skills architecture
- Security-hardened for financial data

**Legal Compliance:**
- No copyrighted Apple assets
- Open-source fonts only
- Original iconography
- Inspired-by (not copied) interactions

Your coder now has everything needed to build VarunaX v1.0.0. Good luck! 🚀