🛠️ Contributing to Offly
Thank you for your interest! Everyone is welcome—follow these steps and guidelines to contribute effectively.

🚀 Getting Started
Prerequisites
Node.js 16+

npm or yarn

Git

Setup Instructions
Fork and Clone

bash
git clone https://github.com/AbhinayAmbati/Offly.git
cd Offly
Install dependencies

bash
npm install
Build the project

bash
npm run build
Run tests

bash
npm test
🔨 Development Workflow
Project Structure Overview
text
Offly/
├── src/         # Source code
│   ├── cli/     # CLI commands and utilities
│   ├── runtime/ # Core runtime modules
│   ├── types/   # TypeScript definitions
│   ├── index.ts # Main entry
│   └── react.ts # React exports
├── tests/       # Unit and integration tests
└── dist/        # Build output
How to Contribute
Create a branch:

bash
git checkout -b feature/my-feature
Make your changes and add tests.

Run:

bash
npm test            # Run all tests
npm run build       # Compile project
npm run lint        # Lint code
Commit:

bash
git commit -m "feat: short description of your change"
🧾 Commit Message Conventions
Use Conventional Commits:

feat: - New features

fix: - Bug fixes

docs: - Documentation updates

style: - Formatting, missing semi colons, etc

refactor: - Code restructuring

test: - Adding tests

chore: - Maintenance work

Examples:

feat: add Vue.js support

fix: cache expiration bug

docs: update README with usage examples

🧪 Testing
Place tests in tests/

Name tests descriptively

Cover success and error cases

Run tests:

bash
npm test             # All tests
npm run test:watch   # Watch mode
npm run test:coverage# Coverage report
npm run test:ui      # Interactive UI
Example:

typescript
import { describe, it, expect } from 'vitest';

describe('myFunction', () => {
  it('returns expected output', () => {
    expect(myFunction('input')).toBe('output');
  });
});
📝 Code Style and Organization
Use TypeScript everywhere

Strict type annotations (prefer interface over type)

Format with Prettier, lint with ESLint:

bash
npm run format     # Format code
npm run lint       # Lint
npm run lint:fix   # Auto-fix issues
Keep functions small and clear

Use meaningful names

Add JSDoc for exported functions

Organize imports: external, then internal

🐛 Bug Reports
Before reporting:

Check existing issues

Update to latest version

Reproduce in a minimal example

Report template:

text
**Describe the bug**: What is the problem?
**To Reproduce**: Steps (list, short)
**Expected behavior**: What you anticipated
**Environment**: Offly version, Browser, Framework, Node.js version
**Additional context**: Logs, screenshots, etc
💡 Feature Requests
Before requesting:

Search features/issues

Make sure idea fits Offly’s focus

Request template:

text
**Problem statement**
**Proposed solution**
**Alternatives considered**
**Additional context** (optional)
🚢 Release & Versioning
Uses Semantic Versioning:

MAJOR: breaking change

MINOR: new feature (backwards-compatible)

PATCH: bug fix

Release steps:

Bump version in package.json

Update CHANGELOG.md

Tag and push

GitHub Actions publishes automatically

📋 Code Review & Pull Requests
Keep PRs focused, concise

Use checklist (template auto-filled on new PR):

 PR description written

 Bug fix/Feature/Docs/Breaking change ticked

 All tests pass locally

 Code style check

 Documentation updates if needed

Sync with latest main; address review comments

🤝 Community Guidelines
Be respectful and inclusive

Collaborate and offer help

Avoid dismissive or confrontational responses

🆘 Getting Help
Check: README, documentation, existing issues/discussions

Ask by opening a new issue

Join discussions for help/proposals

Contact:
GitHub: @AbhinayAmbati
Email: abhinayambati4@gmail.com

📜 License
Contributions are licensed under Apache-2.0.

Thank you for helping make Offly better! 🎉

