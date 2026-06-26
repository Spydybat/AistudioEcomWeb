import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_DIR = path.join(__dirname, 'src');

const replacements = [
  // Backgrounds
  { regex: /bg-neutral-50 dark:bg-\[#111214\]/g, replacement: 'bg-[#111214]' },
  { regex: /bg-white dark:bg-\[#1E1F22\]/g, replacement: 'bg-[#1E1F22]' },
  { regex: /bg-neutral-50 dark:bg-\[#2B2D31\]/g, replacement: 'bg-[#2B2D31]' },
  { regex: /bg-neutral-50 dark:bg-neutral-950/g, replacement: 'bg-neutral-950' },
  { regex: /bg-white dark:bg-neutral-900/g, replacement: 'bg-neutral-900' },
  
  // Text Colors
  { regex: /text-neutral-900 dark:text-white/g, replacement: 'text-white' },
  { regex: /text-neutral-500 dark:text-zinc-400/g, replacement: 'text-zinc-400' },
  { regex: /text-neutral-600 dark:text-zinc-300/g, replacement: 'text-zinc-300' },
  { regex: /text-neutral-400 dark:text-zinc-500/g, replacement: 'text-zinc-500' },
  
  // Hover Backgrounds
  { regex: /hover:bg-neutral-100 dark:hover:bg-\[#2B2D31\]/g, replacement: 'hover:bg-[#2B2D31]' },
  { regex: /hover:bg-neutral-100 dark:hover:bg-\[#313338\]/g, replacement: 'hover:bg-[#313338]' },
  { regex: /hover:bg-neutral-100 dark:hover:bg-white\/5/g, replacement: 'hover:bg-white/5' },
  { regex: /hover:bg-neutral-200 dark:hover:bg-white\/10/g, replacement: 'hover:bg-white/10' },
  
  // Hover Text
  { regex: /hover:text-neutral-900 dark:hover:text-white/g, replacement: 'hover:text-white' },
  
  // Borders
  { regex: /border-neutral-200 dark:border-white\/5/g, replacement: 'border-white/5' },
  { regex: /border-neutral-300 dark:border-white\/10/g, replacement: 'border-white/10' },
  { regex: /border-neutral-400 dark:border-white\/20/g, replacement: 'border-white/20' },
  
  // Divides
  { regex: /divide-neutral-200 dark:divide-white\/5/g, replacement: 'divide-white/5' },
  { regex: /divide-neutral-300 dark:divide-white\/10/g, replacement: 'divide-white/10' },
  
  // Also clean up any lingering edge cases that might just say dark:something
  // But actually we should be careful not to strip legitimate dark prefixes if they were there originally.
  // The original dark theme did not use dark: prefixes because the whole site was just dark.
  // Let's do a generic replace for any `dark:class` that might have been partially mangled.
  { regex: /dark:text-white/g, replacement: 'text-white' },
  { regex: /dark:text-zinc-400/g, replacement: 'text-zinc-400' },
  { regex: /dark:text-zinc-300/g, replacement: 'text-zinc-300' },
  { regex: /dark:text-zinc-500/g, replacement: 'text-zinc-500' },
  { regex: /dark:bg-\[#111214\]/g, replacement: 'bg-[#111214]' },
  { regex: /dark:bg-\[#1E1F22\]/g, replacement: 'bg-[#1E1F22]' },
  { regex: /dark:bg-\[#2B2D31\]/g, replacement: 'bg-[#2B2D31]' },
  { regex: /dark:bg-neutral-950/g, replacement: 'bg-neutral-950' },
  { regex: /dark:bg-neutral-900/g, replacement: 'bg-neutral-900' },
  { regex: /dark:hover:bg-\[#2B2D31\]/g, replacement: 'hover:bg-[#2B2D31]' },
  { regex: /dark:hover:bg-\[#313338\]/g, replacement: 'hover:bg-[#313338]' },
  { regex: /dark:hover:bg-white\/5/g, replacement: 'hover:bg-white/5' },
  { regex: /dark:hover:bg-white\/10/g, replacement: 'hover:bg-white/10' },
  { regex: /dark:hover:text-white/g, replacement: 'hover:text-white' },
  { regex: /dark:border-white\/5/g, replacement: 'border-white/5' },
  { regex: /dark:border-white\/10/g, replacement: 'border-white/10' },
  { regex: /dark:border-white\/20/g, replacement: 'border-white/20' },
  { regex: /dark:divide-white\/5/g, replacement: 'divide-white/5' },
  { regex: /dark:divide-white\/10/g, replacement: 'divide-white/10' },
];

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  for (const { regex, replacement } of replacements) {
    content = content.replace(regex, replacement);
  }
  
  // Final generic pass to remove orphaned light classes that might have been left if regex missed something.
  // E.g., `text-neutral-900 text-white` -> `text-white`
  content = content.replace(/bg-neutral-50 bg-\[/g, 'bg-[');
  content = content.replace(/bg-white bg-\[/g, 'bg-[');
  content = content.replace(/text-neutral-900 text-white/g, 'text-white');
  content = content.replace(/text-neutral-500 text-zinc-400/g, 'text-zinc-400');
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

processDirectory(TARGET_DIR);
console.log('Revert theme class replacement complete.');
