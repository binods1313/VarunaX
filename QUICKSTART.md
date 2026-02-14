# VarunaX Quick Start Guide 🚀

## What is VarunaX?

VarunaX is a browser-based operating system with integrated AI penetration testing, financial research (Dexter), and paper trading capabilities. It was transformed from Shannon (AI Pentester) with a beautiful light green theme.

---

## ✅ Current Status

The transformation is **COMPLETE**! All code has been migrated from Shannon to VarunaX.

---

## 🎯 Quick Start (3 Steps)

### Step 1: Verify the Light Green Banner

```bash
cd shannon
node test-splash.js
```

You should see the **VARUNAX** banner in light green! 🟢

### Step 2: Build the Project

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` folder.

### Step 3: Run VarunaX

```bash
# Show help
node dist/temporal/client.js --help

# Or use the CLI wrapper
./varunax --help
```

---

## 🖥️ Running a Pentest

VarunaX can perform AI-powered penetration testing on web applications:

```bash
# Basic pentest
./varunax https://example.com /path/to/repo

# With config file
./varunax https://example.com /path/to/repo --config auth.yaml

# Pipeline testing mode (faster)
./varunax https://example.com /path/to/repo --pipeline-testing
```

---

## 🏗️ Architecture

VarunaX uses **Temporal** for workflow orchestration:

```
┌─────────────────────────────────────────┐
│         VarunaX CLI (Entry Point)       │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│      Temporal Client (Workflow Start)   │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│    Temporal Worker (Execute Activities) │
│    - Pre-recon (nmap, subfinder)        │
│    - AI Agents (Claude)                 │
│    - Exploitation                       │
│    - Reporting                          │
└─────────────────────────────────────────┘
```

---

## 📊 Monitoring Workflows

### Option 1: Temporal Web UI

```bash
# Start Temporal server
npm run temporal:server

# Open browser
http://localhost:8233
```

### Option 2: Command Line

```bash
# Query workflow status
npm run temporal:query -- --workflow-id=varunax-123

# View logs
./varunax logs
```

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test
npm test -- src/trading/store.test.ts

# Watch mode
npm test -- --watch
```

---

## 🎨 Design System

VarunaX uses a light green color palette:

| Color | Hex | Usage |
|-------|-----|-------|
| Primary | #90EE90 | Main brand color |
| Primary Light | #98FB98 | Hover states |
| Primary Dark | #7CCD7C | Active states |
| Primary Muted | #A8E6A8 | Disabled states |

---

## 📁 Project Structure

```
shannon/ (VarunaX)
├── src/
│   ├── splash-screen.ts      # Light green banner ✅
│   ├── cli/ui.ts              # CLI interface
│   ├── temporal/
│   │   ├── client.ts          # Workflow starter
│   │   ├── worker.ts          # Activity executor
│   │   └── workflows.ts       # Workflow definitions
│   ├── ai/
│   │   └── claude-executor.ts # AI agent logic
│   └── phases/
│       ├── pre-recon.ts       # Reconnaissance
│       └── reporting.ts       # Report generation
├── dist/                      # Compiled JavaScript
├── docs/                      # Documentation
├── test-splash.js             # Banner test script
└── varunax                    # CLI wrapper script
```

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file:

```bash
# Anthropic API Key (required)
ANTHROPIC_API_KEY=your-key-here

# VarunaX Configuration
VARUNAX_ENV=development
VARUNAX_DEBUG=true
VARUNAX_API_URL=http://localhost:3000

# Temporal Configuration
TEMPORAL_ADDRESS=localhost:7233

# Dexter Integration (optional)
DEXTER_API_KEY=your-dexter-key
DEXTER_API_URL=http://localhost:8000

# Trading Configuration
TRADING_MODE=paper
BROKER_API_KEY=encrypted
```

---

## 🚨 Troubleshooting

### Issue: "Cannot find module"

**Solution:**
```bash
npm install
npm run build
```

### Issue: "Temporal not ready"

**Solution:**
```bash
# Start Temporal server
npm run temporal:server

# Wait 30 seconds for health check
# Then run your command
```

### Issue: Banner not showing light green

**Solution:**
```bash
# Rebuild the project
npm run build

# Test the banner
node test-splash.js
```

### Issue: TypeScript errors

**Solution:**
```bash
# Install dependencies
npm install

# Check for errors
npm run typecheck
```

---

## 📚 Documentation

- [Full Instructions](./docs/Instructions.md)
- [Transformation Summary](./docs/TRANSFORMATION_COMPLETE.md)
- [Migration Guide](./docs/migrate-from-varunax/MIGRATION_EXECUTION_GUIDE.md)
- [Sprint Timeline](./docs/migrate-from-varunax/FIRST_SPRINT_TIMELINE.md)
- [Claude Development Guide](./CLAUDE.md)

---

## 🎯 What's Next?

### Immediate Testing
1. Run `node test-splash.js` to see the light green banner
2. Build the project with `npm run build`
3. Test a simple pentest on a local app

### Future Development (Sprint 2)
- Build the browser-based UI (Window Manager, Dock, MenuBar)
- Connect Dexter to live financial data API
- Implement live trading with broker integration
- Add user authentication
- Deploy to production

---

## 💡 Tips

1. **Always build after code changes:** `npm run build`
2. **Use pipeline testing for faster runs:** `--pipeline-testing` flag
3. **Check Temporal UI for workflow status:** http://localhost:8233
4. **Read audit logs for detailed results:** `./audit-logs/`

---

## 🤝 Contributing

This is a personal project transformed from Shannon. If you want to contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📞 Support

- **GitHub Issues:** https://github.com/binods1313/VarunaX/issues
- **Email:** binods1313@gmail.com
- **Original Project:** https://github.com/KeygraphHQ/shannon

---

**Status:** ✅ Transformation Complete  
**Version:** 1.0.0  
**Last Updated:** February 14, 2026

Enjoy VarunaX! 🎉
