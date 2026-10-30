#!/usr/bin/env node

/**
 * Interactive Content Scaffolder for imagitech.online
 * Run with: npm run new
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question, defaultValue = '') {
  return new Promise((resolve) => {
    const promptText = defaultValue ? `${question} [${defaultValue}]: ` : `${question}: `;
    rl.question(promptText, (answer) => {
      resolve(answer.trim() || defaultValue);
    });
  });
}

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function main() {
  console.log('\n\x1b[36m┌───────────────────────────────────────────────┐\x1b[0m');
  console.log('\x1b[36m│   †hε drεαmεr // Content Scaffolder CLI       │\x1b[0m');
  console.log('\x1b[36m└───────────────────────────────────────────────┘\x1b[0m\n');

  console.log('Select content type:');
  console.log('  1. 📝 Blog Article   (Long-form technical guide / analysis)');
  console.log('  2. ⚡ Note / TIL      (Quick cheatsheet / debugging snippet)');
  console.log('  3. 🛠️  Project Case   (Full repository case study)');
  console.log('  4. 🏴 Writeup        (Security platform solve walkthrough)\n');

  const choice = await ask('Enter choice (1-4)', '1');
  const title = await ask('\nTitle');

  if (!title) {
    console.error('\x1b[31mError: Title cannot be empty.\x1b[0m');
    rl.close();
    process.exit(1);
  }

  const defaultSlug = slugify(title);
  const slug = await ask('Slug / filename', defaultSlug);
  const date = getToday();

  let targetDir = '';
  let content = '';

  if (choice === '1') {
    targetDir = path.join(process.cwd(), 'content', 'blog');
    const description = await ask('Short description');
    const tagsInput = await ask('Tags (comma separated)', 'Linux, Networking');
    const tags = tagsInput.split(',').map((t) => `"${t.trim()}"`).join(', ');

    content = `---
title: "${title}"
description: "${description}"
date: "${date}"
published: true
tags: [${tags}]
---

Write your technical post introduction here.

---

## 1. Overview & Problem

Explain the core context, problem statement, and engineering constraints.

\`\`\`mermaid
graph TD
    Client["Client Device"] -->|Request| Server["Server Gateway"]
    Server -->|Forward| Target["Target Service"]
\`\`\`

---

## 2. Implementation

Document the step-by-step configuration.

\`\`\`bash title="setup.sh"
# Example command snippet
sudo systemctl restart service
\`\`\`

<Callout type="tip" title="Pro Tip">
Add real-world lessons, gotchas, or security considerations here.
</Callout>

---

## 3. Key Takeaways & Lessons Learned

- **Takeaway 1**: Document trade-offs.
- **Takeaway 2**: Failure modes encountered and resolved.
`;
  } else if (choice === '2') {
    targetDir = path.join(process.cwd(), 'content', 'notes');
    const category = await ask('Category / System Area', 'Linux');

    content = `---
title: "${title}"
date: "${date}"
category: "${category}"
published: true
---

Quick reference note and command log for ${title}.

### 1. Core Command / Configuration

\`\`\`bash
# Insert commands here
\`\`\`

### 2. Diagnosis & Gotchas

* Note failure conditions or helpful flags here.
`;
  } else if (choice === '3') {
    targetDir = path.join(process.cwd(), 'content', 'projects');
    const description = await ask('Short description');
    const github = await ask('GitHub URL', 'https://github.com/DDreamer01/');
    const liveUrl = await ask('Live URL (optional, leave empty if none)', '');
    const techInput = await ask('Technologies (comma separated)', 'Linux, Bash, Python');
    const techs = techInput.split(',').map((t) => `"${t.trim()}"`).join(', ');

    content = `---
title: "${title}"
description: "${description}"
date: "${date}"
github: "${github}"
${liveUrl ? `url: "${liveUrl}"\n` : ''}technologies: [${techs}]
featured: true
published: true
---

## Overview

${description}

---

## Problem & Motivation

Explain why this project was built and what specific bottlenecks or limitations it resolves.

---

## Architecture & System Design

\`\`\`mermaid
graph TD
    User["User Client"] --> Engine["Core Engine"]
    Engine --> Storage[("Database / File Store")]
\`\`\`

---

## Key Features

- **Feature 1**: Description.
- **Feature 2**: Description.

---

## Installation & CLI Usage

\`\`\`bash
# Run installer or clone repo
git clone ${github}
\`\`\`
`;
  } else if (choice === '4') {
    console.log('Platforms:');
    console.log('  1. pwn.college');
    console.log('  2. hackthebox');
    console.log('  3. portswigger\n');
    const platformChoice = await ask('Enter platform (1-3)', '1');
    const platformMap = { '1': 'pwn-college', '2': 'hackthebox', '3': 'portswigger' };
    const platformName = platformMap[platformChoice];

    if (!platformName) {
      console.error('\x1b[31mInvalid platform choice.\x1b[0m');
      rl.close();
      process.exit(1);
    }

    targetDir = path.join(process.cwd(), 'content', 'writeups', platformName);
    const description = await ask('Short description');
    const difficulty = await ask('Difficulty (optional)', '');
    const points = await ask('Points (optional)', '');

    content = `---
title: "${title}"
description: "${description}"
date: "${date}"
${difficulty ? `difficulty: "${difficulty}"\n` : ''}${points ? `points: "${points}"\n` : ''}published: true
---

Write your introduction here: what the target was, what the goal is.

---

## Recon

\`\`\`bash
# Enumeration commands
\`\`\`

---

## Foothold

<Callout type="tip" title="Gotcha">
Document any tricky step or gotcha here.
</Callout>

---

## Escalation / Solve

\`\`\`bash
# Final exploit or flag capture
\`\`\`

---

## Lessons Learned

- **Takeaway 1**: What was new to you.
- **Takeaway 2**: What to revisit.
`;
  } else {
    console.error('\x1b[31mInvalid choice.\x1b[0m');
    rl.close();
    process.exit(1);
  }

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const filePath = path.join(targetDir, `${slug}.mdx`);

  if (fs.existsSync(filePath)) {
    const overwrite = await ask(`\n⚠️  File "${filePath}" already exists. Overwrite? (y/N)`, 'N');
    if (overwrite.toLowerCase() !== 'y') {
      console.log('\x1b[33mOperation aborted.\x1b[0m');
      rl.close();
      return;
    }
  }

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`\n\x1b[32m✔ Successfully created:\x1b[0m \x1b[36m${filePath}\x1b[0m\n`);
  rl.close();
}

main().catch((err) => {
  console.error(err);
  rl.close();
  process.exit(1);
});
