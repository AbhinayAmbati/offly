Contributing to Offly
Thank you for your interest in contributing to Offly! We welcome contributions from everyone.

🚀 Getting Started
Prerequisites
Node.js 16 or higher

npm or yarn

Git

Setting Up the Development Environment
Fork the repository

Clone your fork

bash
git clone https://github.com/your-username/Offly.git
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
🛠️ Development Workflow
Project Structure
text
Offly/
├── src/
│   ├── cli/                 # CLI commands
│   │   ├── commands/        # Individual CLI commands
│   │   └── utils/           # CLI utilities
│   ├── runtime/             # Runtime library
│   │   ├── cacheManager.ts  # Cache management
│   │   ├── syncManager.ts   # Background sync
│   │   ├── fetchWrapper.ts  # Enhanced fetch
│   │   └── useOfflineData.ts# React hooks
│   ├── types/               # TypeScript definitions
│   ├── index.ts             # Main export
│   └── react.ts             # React-specific exports
├── tests/                   # Test files
└── dist/                    # Built files
Making Changes
Create a feature branch:

bash
git checkout -b feature/your-feature-name
Make your changes.

Add tests for new functionality.

Run the test suite:

bash
npm test
Build the project:

bash
npm run build
Run linting:

bash
npm run lint
Commit your changes:

bash
git commit -m "feat: add your feature description"
🧾 Commit Messages
We follow the Conventional Commits standard.

feat: - New features

fix: - Bug fixes

docs: - Documentation updates

style: - Code style changes

refactor: - Code refactoring

test: - Adding or updating tests

chore: - Maintenance tasks

Examples:

feat: add Vue.js composables support

fix: resolve cache expiration bug

docs: update README with new examples

🧪 Testing
Running Tests
bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage

# With UI
npm run test:ui
Writing Tests
Place all test files under tests/

Use descriptive test names

Test both success and error cases

Mock external dependencies if needed

Example:

typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { yourFunction } from '../src/your-module';

describe('YourModule', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('yourFunction', () => {
    it('should handle valid input correctly', () => {
      const result = yourFunction('valid-input');
      expect(result).toBe('expected-output');
    });

    it('should handle error cases gracefully', () => {
      expect(() => yourFunction(null)).toThrow('Expected error message');
    });
  });
});
📝 Code Style
TypeScript Guidelines
Use TypeScript for all source code

Provide clear type annotations

Prefer interfaces over type aliases

Use strict mode

Formatting
We use Prettier and ESLint.

bash
# Format code
npm run format

# Check linting
npm run lint

# Fix linting issues
npm run lint:fix
Code Organization
Keep functions small and focused

Use descriptive names

Add JSDoc for public APIs

Group imports: external first, internal next

🐛 Reporting Bugs
Before Submitting
Check if the issue already exists

Reproduce it with the latest version

Test in multiple environments

Bug Report Template:

text
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Environment:**
- Offly version: [e.g. 0.1.0]
- Browser: [e.g. Chrome 91]
- Framework: [e.g. React 18.2.0]
- Node.js version: [e.g. 16.14.0]

**Additional context**
Any other context about the problem.
💡 Feature Requests
Before Submitting
Check if the feature already exists

Search existing requests

Ensure it aligns with Offly’s goals

Feature Request Template:

text
**Is your feature request related to a problem?**
Describe the problem.

**Describe the solution you'd like**
Describe your ideal solution.

**Describe alternatives you've considered**
List alternative ideas.

**Additional context**
Add screenshots or context.
🚢 Release Process
Versioning
We follow Semantic Versioning (SemVer):

MAJOR: Breaking changes

MINOR: New features (backward compatible)

PATCH: Bug fixes

Release Steps
Update version in package.json

Update CHANGELOG.md

Create a git tag

Push changes and tag

GitHub Actions will publish to npm

📋 Code Review Process
For Contributors
Keep PRs focused and small

Write clear PR descriptions

Address feedback promptly

Sync your branch with the latest main

PR Template:

text
## Description
Brief description of changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Added tests
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review done
- [ ] Documentation updated
- [ ] No new warnings/errors
🤝 Community Guidelines
Be Respectful
Use inclusive language

Respect differing views

Offer constructive feedback

Be Collaborative
Share knowledge

Help others grow

Ask when unsure

🆘 Getting Help
Check the README and docs

Browse GitHub Issues

Open a new issue with full details

Join community discussions

📞 Contact
GitHub: @AbhinayAmbati

Email: abhinayambati4@gmail.com

📜 License
By contributing to Offly, you agree that your contributions will be licensed under the Apache-2.0 License.

Thank you for contributing to Offly! 🎉