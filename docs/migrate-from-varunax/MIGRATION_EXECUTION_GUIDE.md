# VarunaX Migration Execution Guide

## 📋 Pre-Migration Checklist

Before running the migration script, ensure:

- [ ] Current code is committed to git
- [ ] Working directory is clean (`git status` shows no uncommitted changes)
- [ ] All tests pass on current VarunaX codebase
- [ ] You have a recent backup (script will create one, but manual backup recommended)
- [ ] Node.js 18+ is installed
- [ ] You're on the correct branch (recommend creating new `varunax/v1.0.0` branch)

## 🚀 Migration Execution Steps

### Step 1: Create New Branch

```bash
# Create and switch to new branch
git checkout -b varunax/v1.0.0

# Verify you're on the new branch
git branch --show-current
# Should output: varunax/v1.0.0
```

### Step 2: Preview Changes (Dry Run)

```bash
# Run migration script in dry-run mode
node scripts/migrate-from-varunax.js --dry-run
```

**Expected Output**:
- Files to be modified (count and list)
- Files to be renamed (old → new paths)
- Directories to be renamed
- Any errors or warnings

**Review carefully**:
- Are the changes expected?
- Are any critical files affected unexpectedly?
- Are there files in node_modules being touched? (should be excluded)

### Step 3: Execute Migration

```bash
# Run migration script
node scripts/migrate-from-varunax.js
```

**What happens**:
1. Backup created at `.migration-backup/`
2. `package.json` updated
3. Text replacements in all files
4. Files/directories renamed
5. Git branch renamed (if applicable)
6. Migration report generated

**Expected Duration**: 30-60 seconds (depending on codebase size)

### Step 4: Verify Changes

#### 4.1 Check for Remaining References
```bash
# Should return ZERO results (ignoring backup)
grep -r "varunax" . \
  --exclude-dir=node_modules \
  --exclude-dir=.git \
  --exclude-dir=.migration-backup \
  --exclude-dir=dist \
  --exclude-dir=build

# Also check uppercase
grep -r "VarunaX" . \
  --exclude-dir=node_modules \
  --exclude-dir=.git \
  --exclude-dir=.migration-backup \
  --exclude-dir=dist \
  --exclude-dir=build
```

#### 4.2 Review Git Diff
```bash
git status    # Should show many modified files
git diff      # Review changes (will be large)

# Review specific files
git diff package.json
git diff README.md
git diff apps/ui/package.json  # If using monorepo
```

#### 4.3 Install Dependencies
```bash
# Remove old node_modules and lock files
rm -rf node_modules
rm package-lock.json  # or yarn.lock / pnpm-lock.yaml

# Fresh install
npm install

# Verify installation
npm list --depth=0
```

#### 4.4 Run Tests
```bash
# Run linting
npm run lint

# Type checking (if using TypeScript)
npm run typecheck

# Unit tests
npm run test:unit

# E2E tests (if they exist)
npm run test:e2e
```

**Expected**: All tests should pass (same count as before migration)

#### 4.5 Start Development Server
```bash
npm run dev
```

**Verify**:
- [ ] App starts without errors
- [ ] Console shows no "varunax" references
- [ ] Browser title shows "VarunaX" (or new name)
- [ ] No broken imports or module errors

### Step 5: Create Migration Commit

```bash
# Stage all changes
git add .

# Create commit with detailed message
git commit -m "feat: Migrate VarunaX to VarunaX

Complete rebrand from VarunaX to VarunaX:
- Replaced all text references (varunax → varunax)
- Updated package names and imports
- Renamed files and directories
- Updated environment variables
- Regenerated lock files

Migration statistics:
- Files modified: [INSERT COUNT]
- Files renamed: [INSERT COUNT]
- Directories renamed: [INSERT COUNT]

Backup available at .migration-backup/ for rollback

BREAKING CHANGE: All package imports must update from @varunax/* to @varunax/*"

# Verify commit
git log -1 --stat
```

### Step 6: Push to Remote

```bash
# Push new branch to remote
git push -u origin varunax/v1.0.0

# Verify push
git log origin/varunax/v1.0.0 -1
```

## 📊 Post-Migration Tasks

### Update Documentation
- [ ] Update README.md with VarunaX branding
- [ ] Update CONTRIBUTING.md (if exists)
- [ ] Update LICENSE (if needed)
- [ ] Create CHANGELOG.md entry for v1.0.0
- [ ] Update any wiki pages or external docs

### Update CI/CD
- [ ] Update GitHub Actions workflows (if they reference package names)
- [ ] Update Vercel/Netlify deployment configs
- [ ] Update Docker images (if used)
- [ ] Update environment variable names in hosting platforms

### Update External Services
- [ ] Update npm registry (if published)
- [ ] Update GitHub repository name/description
- [ ] Update Slack/Discord bot names (if applicable)
- [ ] Update analytics/monitoring service names

### Notify Team
- [ ] Announce migration in team channels
- [ ] Update onboarding docs for new developers
- [ ] Create migration guide for external contributors

## 🔄 Rollback Procedure

If critical issues arise:

### Option 1: Script Rollback (Fastest)
```bash
node scripts/migrate-from-varunax.js --rollback
```

This restores files from `.migration-backup/`

### Option 2: Git Rollback (Complete)
```bash
# If changes not yet pushed
git reset --hard HEAD~1  # Go back one commit

# If changes already pushed
git revert HEAD  # Create revert commit
git push origin varunax/v1.0.0

# Or force push (if branch not protected)
git reset --hard HEAD~1
git push --force origin varunax/v1.0.0
```

### Option 3: Fresh Clone (Nuclear)
```bash
# Clone original VarunaX version
git clone <repository-url> varunax-backup
cd varunax-backup
git checkout <original-branch>
```

## 🐛 Troubleshooting

### Issue: "Cannot find module '@varunax/...'"

**Cause**: Import paths not updated
**Fix**:
```bash
# Re-run migration
node scripts/migrate-from-varunax.js

# Or manually find and replace
find . -type f -name "*.ts" -o -name "*.tsx" | xargs sed -i 's/@varunax\//@varunax\//g'
```

### Issue: Tests failing after migration

**Cause**: Test snapshots or mocks reference old names
**Fix**:
```bash
# Update test snapshots
npm run test:unit -- -u

# Check test files for hardcoded strings
grep -r "varunax" . --include="*.test.*" --include="*.spec.*"
```

### Issue: Environment variables not working

**Cause**: .env files not updated
**Fix**:
```bash
# Check .env files
cat .env
cat .env.local
cat .env.example

# Update manually or re-run migration
node scripts/migrate-from-varunax.js
```

### Issue: Git conflicts after migration

**Cause**: Migration done on outdated branch
**Fix**:
```bash
# Stash migration changes
git stash

# Update from main
git checkout main
git pull origin main

# Create new branch
git checkout -b varunax/v1.0.0

# Re-run migration
node scripts/migrate-from-varunax.js

# If you had stashed changes, cherry-pick needed commits
git cherry-pick <commit-hash>
```

## 📈 Success Metrics

Migration is successful when:

- [ ] Zero "varunax" references in codebase (excluding backup)
- [ ] All tests pass
- [ ] Application runs without errors
- [ ] No broken imports or missing modules
- [ ] CI/CD pipeline passes
- [ ] Team can checkout and run code without issues

## 📞 Support

If you encounter issues:

1. Check this troubleshooting guide
2. Review migration script logs
3. Check the backup in `.migration-backup/`
4. Reach out in #varunax-dev Slack channel
5. Create GitHub issue with `migration` label

## 📚 Additional Resources

- [Migration PR Template](./MIGRATION_PR_TEMPLATE.md)
- [Enhanced Development Guide](../docs/VarunaX_Enhanced_Development_Prompt.md)
- [Migration Script Source](./migrate-from-varunax.js)

---

**Last Updated**: 2026-02-14
**Version**: 1.0.0
**Status**: ✅ READY FOR EXECUTION
