#!/usr/bin/env node

/**
 * VarunaX Migration Script
 * 
 * Migrates the Shannon codebase to VarunaX by:
 * 1. Replacing all references to "shannon" with "varunax" (case-insensitive)
 * 2. Updating package names, imports, and environment variables
 * 3. Renaming files and directories
 * 4. Updating git metadata (branches, tags - optional)
 * 
 * Usage:
 *   node scripts/migrate-from-shannon.js [--dry-run] [--skip-git]
 * 
 * Options:
 *   --dry-run    Show what would be changed without making changes
 *   --skip-git   Skip git branch/tag renaming
 *   --rollback   Restore from backup (only if backup exists)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const REPLACEMENTS = [
  // Exact case matches
  { from: 'shannon', to: 'varunax', flags: 'g' },
  { from: 'Shannon', to: 'VarunaX', flags: 'g' },
  { from: 'SHANNON', to: 'VARUNAX', flags: 'g' },
  
  // Package scope (if using @shannon/)
  { from: '@shannon/', to: '@varunax/', flags: 'g' },
  
  // Environment variables
  { from: 'SHANNON_', to: 'VARUNAX_', flags: 'g' },
];

// Files/directories to exclude from text replacement
const EXCLUDE_PATTERNS = [
  /node_modules/,
  /\.git/,
  /dist/,
  /build/,
  /coverage/,
  /\.next/,
  /\.cache/,
  /\.DS_Store/,
  /\.log$/,
  /\.lock$/,
  /package-lock\.json$/,
  /yarn\.lock$/,
  /pnpm-lock\.yaml$/,
];

// File extensions to process for text replacement
const TEXT_FILE_EXTENSIONS = [
  '.js', '.jsx', '.ts', '.tsx',
  '.json', '.md', '.txt',
  '.css', '.scss', '.less',
  '.html', '.xml', '.yml', '.yaml',
  '.sh', '.bash', '.zsh',
  '.env', '.env.example', '.env.local',
  '.gitignore', '.npmrc', '.nvmrc',
];

// Track changes for reporting
const changes = {
  filesRenamed: [],
  filesModified: [],
  dirsRenamed: [],
  errors: [],
};

// Parse CLI arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const skipGit = args.includes('--skip-git');
const isRollback = args.includes('--rollback');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('');
  log(`${'='.repeat(60)}`, colors.bright);
  log(title, colors.bright + colors.cyan);
  log(`${'='.repeat(60)}`, colors.bright);
  console.log('');
}

function shouldExclude(filePath) {
  return EXCLUDE_PATTERNS.some(pattern => pattern.test(filePath));
}

function isTextFile(filePath) {
  const ext = path.extname(filePath);
  return TEXT_FILE_EXTENSIONS.includes(ext) || !ext; // Include files with no extension
}

function replaceInText(text) {
  let modified = text;
  let hasChanges = false;
  
  REPLACEMENTS.forEach(({ from, to, flags }) => {
    const regex = new RegExp(from, flags);
    if (regex.test(modified)) {
      modified = modified.replace(regex, to);
      hasChanges = true;
    }
  });
  
  return { modified, hasChanges };
}

function processFile(filePath) {
  try {
    if (!isTextFile(filePath)) return;
    
    const content = fs.readFileSync(filePath, 'utf8');
    const { modified, hasChanges } = replaceInText(content);
    
    if (hasChanges) {
      if (!isDryRun) {
        fs.writeFileSync(filePath, modified, 'utf8');
      }
      changes.filesModified.push(filePath);
      log(`  ✓ Modified: ${filePath}`, colors.green);
    }
  } catch (error) {
    changes.errors.push({ file: filePath, error: error.message });
    log(`  ✗ Error processing ${filePath}: ${error.message}`, colors.red);
  }
}

function renameFileOrDir(oldPath, newPath) {
  try {
    if (!isDryRun) {
      fs.renameSync(oldPath, newPath);
    }
    
    if (fs.statSync(isDryRun ? oldPath : newPath).isDirectory()) {
      changes.dirsRenamed.push({ from: oldPath, to: newPath });
      log(`  ✓ Renamed dir: ${oldPath} → ${newPath}`, colors.yellow);
    } else {
      changes.filesRenamed.push({ from: oldPath, to: newPath });
      log(`  ✓ Renamed file: ${oldPath} → ${newPath}`, colors.yellow);
    }
  } catch (error) {
    changes.errors.push({ file: oldPath, error: error.message });
    log(`  ✗ Error renaming ${oldPath}: ${error.message}`, colors.red);
  }
}

function walkDirectory(dir, callback) {
  if (shouldExclude(dir)) return;
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  // Process files first
  entries.forEach(entry => {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isFile()) {
      callback(fullPath, entry);
    }
  });
  
  // Then recurse into directories
  entries.forEach(entry => {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      walkDirectory(fullPath, callback);
    }
  });
}

function renamePaths(rootDir) {
  // Collect all paths that need renaming (deepest first)
  const pathsToRename = [];
  
  function collectPaths(dir) {
    if (shouldExclude(dir)) return;
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    entries.forEach(entry => {
      const fullPath = path.join(dir, entry.name);
      const { modified: newName, hasChanges } = replaceInText(entry.name);
      
      if (hasChanges) {
        const newPath = path.join(dir, newName);
        pathsToRename.push({ old: fullPath, new: newPath, isDir: entry.isDirectory() });
      }
      
      if (entry.isDirectory()) {
        collectPaths(fullPath);
      }
    });
  }
  
  collectPaths(rootDir);
  
  // Sort by depth (deepest first) to avoid renaming parent before children
  pathsToRename.sort((a, b) => {
    const depthA = a.old.split(path.sep).length;
    const depthB = b.old.split(path.sep).length;
    return depthB - depthA;
  });
  
  // Execute renames
  pathsToRename.forEach(({ old, new: newPath }) => {
    renameFileOrDir(old, newPath);
  });
}

function updatePackageJson() {
  const packagePath = path.join(process.cwd(), 'package.json');
  
  if (!fs.existsSync(packagePath)) {
    log('  ! No package.json found in root', colors.yellow);
    return;
  }
  
  try {
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const original = JSON.stringify(pkg, null, 2);
    
    // Update name
    if (pkg.name && pkg.name.toLowerCase().includes('shannon')) {
      pkg.name = pkg.name.replace(/shannon/gi, match => {
        if (match === 'shannon') return 'varunax';
        if (match === 'Shannon') return 'VarunaX';
        if (match === 'SHANNON') return 'VARUNAX';
        return match;
      });
    }
    
    // Update description
    if (pkg.description) {
      const { modified } = replaceInText(pkg.description);
      pkg.description = modified;
    }
    
    // Update repository
    if (pkg.repository && pkg.repository.url) {
      const { modified } = replaceInText(pkg.repository.url);
      pkg.repository.url = modified;
    }
    
    // Update homepage
    if (pkg.homepage) {
      const { modified } = replaceInText(pkg.homepage);
      pkg.homepage = modified;
    }
    
    // Update scripts
    if (pkg.scripts) {
      Object.keys(pkg.scripts).forEach(key => {
        const { modified } = replaceInText(pkg.scripts[key]);
        pkg.scripts[key] = modified;
      });
    }
    
    const updated = JSON.stringify(pkg, null, 2);
    
    if (original !== updated) {
      if (!isDryRun) {
        fs.writeFileSync(packagePath, updated + '\n', 'utf8');
      }
      changes.filesModified.push(packagePath);
      log(`  ✓ Updated package.json`, colors.green);
    }
  } catch (error) {
    changes.errors.push({ file: packagePath, error: error.message });
    log(`  ✗ Error updating package.json: ${error.message}`, colors.red);
  }
}

function updateGit() {
  if (skipGit) {
    log('  ! Skipping git updates (--skip-git)', colors.yellow);
    return;
  }
  
  try {
    // Check if we're in a git repo
    execSync('git rev-parse --git-dir', { stdio: 'ignore' });
  } catch {
    log('  ! Not a git repository, skipping git updates', colors.yellow);
    return;
  }
  
  try {
    // Get current branch
    const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    
    if (currentBranch.toLowerCase().includes('shannon')) {
      const newBranch = currentBranch.replace(/shannon/gi, match => {
        if (match === 'shannon') return 'varunax';
        if (match === 'Shannon') return 'VarunaX';
        if (match === 'SHANNON') return 'VARUNAX';
        return match;
      });
      
      if (!isDryRun) {
        execSync(`git branch -m ${currentBranch} ${newBranch}`, { stdio: 'inherit' });
      }
      log(`  ✓ Renamed git branch: ${currentBranch} → ${newBranch}`, colors.green);
    }
  } catch (error) {
    changes.errors.push({ file: 'git', error: error.message });
    log(`  ✗ Error updating git: ${error.message}`, colors.red);
  }
}

function createBackup() {
  const backupDir = path.join(process.cwd(), '.migration-backup');
  
  if (fs.existsSync(backupDir)) {
    log('  ! Backup already exists, skipping', colors.yellow);
    return;
  }
  
  log('  Creating backup...', colors.blue);
  
  try {
    fs.mkdirSync(backupDir, { recursive: true });
    
    // Backup critical files
    const filesToBackup = [
      'package.json',
      'package-lock.json',
      'README.md',
      '.env',
      '.env.example',
    ];
    
    filesToBackup.forEach(file => {
      const filePath = path.join(process.cwd(), file);
      if (fs.existsSync(filePath)) {
        fs.copyFileSync(filePath, path.join(backupDir, file));
      }
    });
    
    log(`  ✓ Backup created at ${backupDir}`, colors.green);
  } catch (error) {
    log(`  ✗ Error creating backup: ${error.message}`, colors.red);
  }
}

function rollback() {
  const backupDir = path.join(process.cwd(), '.migration-backup');
  
  if (!fs.existsSync(backupDir)) {
    log('  ✗ No backup found, cannot rollback', colors.red);
    return;
  }
  
  logSection('Rolling Back Changes');
  
  try {
    const backupFiles = fs.readdirSync(backupDir);
    
    backupFiles.forEach(file => {
      const backupPath = path.join(backupDir, file);
      const targetPath = path.join(process.cwd(), file);
      
      fs.copyFileSync(backupPath, targetPath);
      log(`  ✓ Restored: ${file}`, colors.green);
    });
    
    // Remove backup
    fs.rmSync(backupDir, { recursive: true, force: true });
    
    log('', colors.reset);
    log('✓ Rollback completed successfully!', colors.green + colors.bright);
  } catch (error) {
    log(`✗ Error during rollback: ${error.message}`, colors.red);
  }
}

function generateReport() {
  logSection('Migration Report');
  
  log(`Files Modified: ${changes.filesModified.length}`, colors.cyan);
  if (changes.filesModified.length > 0 && changes.filesModified.length <= 20) {
    changes.filesModified.forEach(file => log(`  - ${file}`, colors.reset));
  } else if (changes.filesModified.length > 20) {
    log(`  (showing first 20 of ${changes.filesModified.length})`, colors.yellow);
    changes.filesModified.slice(0, 20).forEach(file => log(`  - ${file}`, colors.reset));
  }
  
  console.log('');
  log(`Files Renamed: ${changes.filesRenamed.length}`, colors.cyan);
  if (changes.filesRenamed.length > 0) {
    changes.filesRenamed.forEach(({ from, to }) => {
      log(`  - ${from} → ${to}`, colors.reset);
    });
  }
  
  console.log('');
  log(`Directories Renamed: ${changes.dirsRenamed.length}`, colors.cyan);
  if (changes.dirsRenamed.length > 0) {
    changes.dirsRenamed.forEach(({ from, to }) => {
      log(`  - ${from} → ${to}`, colors.reset);
    });
  }
  
  if (changes.errors.length > 0) {
    console.log('');
    log(`Errors: ${changes.errors.length}`, colors.red);
    changes.errors.forEach(({ file, error }) => {
      log(`  - ${file}: ${error}`, colors.red);
    });
  }
  
  console.log('');
  
  if (isDryRun) {
    log('This was a DRY RUN - no changes were made', colors.yellow + colors.bright);
    log('Run without --dry-run to apply changes', colors.yellow);
  } else {
    log('✓ Migration completed successfully!', colors.green + colors.bright);
    log('', colors.reset);
    log('Next steps:', colors.cyan);
    log('  1. Review the changes with: git diff', colors.reset);
    log('  2. Test the application: npm run dev', colors.reset);
    log('  3. Run tests: npm run test', colors.reset);
    log('  4. Commit changes: git add . && git commit -m "Migrate from Shannon to VarunaX"', colors.reset);
    log('', colors.reset);
    log('If you need to rollback, run:', colors.yellow);
    log('  node scripts/migrate-from-shannon.js --rollback', colors.yellow);
  }
}

function main() {
  console.clear();
  
  log(`
╦  ╦┌─┐┬─┐┬ ┬┌┐┌┌─┐╦ ╦  ╔╦╗┬┌─┐┬─┐┌─┐┌┬┐┬┌─┐┌┐┌
╚╗╔╝├─┤├┬┘│ ││││├─┤╠╩╗  ║║║││ ┬├┬┘├─┤ │ ││ ││││
 ╚╝ ┴ ┴┴└─└─┘┘└┘┴ ┴╩ ╩  ╩ ╩┴└─┘┴└─┴ ┴ ┴ ┴└─┘┘└┘
  `, colors.cyan + colors.bright);
  
  log('Shannon → VarunaX Migration Script', colors.bright);
  log('v1.0.0', colors.reset);
  console.log('');
  
  if (isRollback) {
    rollback();
    return;
  }
  
  if (isDryRun) {
    log('🔍 DRY RUN MODE - No changes will be made', colors.yellow + colors.bright);
    console.log('');
  }
  
  // Create backup before making changes
  if (!isDryRun) {
    logSection('Creating Backup');
    createBackup();
  }
  
  // Step 1: Update package.json
  logSection('Step 1: Updating package.json');
  updatePackageJson();
  
  // Step 2: Replace text in files
  logSection('Step 2: Replacing Text in Files');
  log('Processing files...', colors.blue);
  walkDirectory(process.cwd(), (filePath) => {
    processFile(filePath);
  });
  
  // Step 3: Rename files and directories
  logSection('Step 3: Renaming Files and Directories');
  log('Scanning for paths to rename...', colors.blue);
  renamePaths(process.cwd());
  
  // Step 4: Update git metadata
  logSection('Step 4: Updating Git Metadata');
  updateGit();
  
  // Generate report
  generateReport();
}

// Run migration
main();
