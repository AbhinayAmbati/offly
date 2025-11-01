# Contributing to Offly

Thank you for your interest in contributing to Offly! We welcome contributions from everyone.

## ðŸš€ Getting Started

### Prerequisites

- Node.js 16 or higher
- npm or yarn
- Git

### Setting up the development environment

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/Offly.git
   cd Offly
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Build the project:
   ```bash
   npm run build
   ```

5. Run tests:
   ```bash
   npm test
   ```

## ðŸ› ï¸ Development Workflow

### Project Structure

```
Offly/
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ cli/                 # CLI commands
â”‚   â”‚   â”œâ”€â”€ commands/        # Individual CLI commands
â”‚   â”‚   â””â”€â”€ utils/          # CLI utilities
â”‚   â”œâ”€â”€ runtime/            # Runtime library
â”‚   â”‚   â”œâ”€â”€ cacheManager.ts # Cache management
â”‚   â”‚   â”œâ”€â”€ syncManager.ts  # Background sync
â”‚   â”‚   â”œâ”€â”€ fetchWrapper.ts # Enhanced fetch
â”‚   â”‚   â””â”€â”€ useOfflineData.ts # React hooks
â”‚   â”œâ”€â”€ types/              # TypeScript definitions
â”‚   â”œâ”€â”€ index.ts            # Main export
â”‚   â””â”€â”€ react.ts            # React-specific exports
â”œâ”€â”€ tests/                  # Test files
â””â”€â”€ dist/                   # Built files
```

### Making Changes

1. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes
3. Add tests for new functionality
4. Run the test suite:
   ```bash
   npm test
   ```

4. Build the project:
   ```bash
   npm run build
   ```

5. Run linting:
   ```bash
   npm run lint
   ```

6. Commit your changes:
   ```bash
   git commit -m "feat: add your feature description"
   ```

### Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
- `feat: add Vue.js composables support`
- `fix: resolve cache expiration bug`
- `docs: update README with new examples`

## ðŸ§ª Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### Writing Tests

- Place test files in the `tests/` directory
- Use descriptive test names
- Test both success and error cases
- Mock external dependencies when appropriate

Example test structure:

```typescript
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
```

## ðŸ“ Code Style

### TypeScript Guidelines

- Use TypeScript for all source code
- Provide proper type annotations
- Prefer interfaces over type aliases for object shapes
- Use strict mode settings

### Formatting

We use Prettier and ESLint for code formatting:

```bash
# Format code
npm run format

# Check linting
npm run lint

# Fix linting issues
npm run lint:fix
```

### Code Organization

- Keep functions small and focused
- Use descriptive variable and function names
- Add JSDoc comments for public APIs
- Organize imports: external libraries first, then internal modules

## ðŸ› Reporting Bugs

### Before Submitting

1. Check if the issue already exists
2. Try to reproduce with the latest version
3. Test in different browsers/environments

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
What you expected to happen.

**Environment:**
- Offly version: [e.g. 0.1.0]
- Browser: [e.g. Chrome 91]
- Framework: [e.g. React 18.2.0]
- Node.js version: [e.g. 16.14.0]

**Additional context**
Any other context about the problem.
```

## ðŸ’¡ Feature Requests

### Before Submitting

1. Check if the feature already exists
2. Search existing feature requests
3. Consider if it fits Offly's scope

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Alternative solutions or features you've considered.

**Additional context**
Any other context or screenshots about the feature request.
```

## ðŸš¢ Release Process

### Version Numbers

We use [Semantic Versioning (SemVer)](https://semver.org/):

- `MAJOR.MINOR.PATCH` (e.g., 1.2.3)
- MAJOR: Breaking changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes (backward compatible)

### Release Steps

1. Update version in `package.json`
2. Update CHANGELOG.md
3. Create a git tag
4. Push changes and tag
5. GitHub Actions will automatically publish to npm

## ðŸ“‹ Code Review Process

### For Contributors

1. Keep PRs focused and reasonably sized
2. Write clear PR descriptions
3. Respond to feedback promptly
4. Update your branch with latest main if needed

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Added tests for new functionality
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated (if needed)
- [ ] No new warnings/errors introduced
```

## ðŸ¤ Community Guidelines

### Be Respectful

- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Give constructive feedback
- Focus on what's best for the community

### Be Collaborative

- Help others learn and grow
- Share knowledge and resources
- Be open to learning from others
- Ask questions when unsure

## ðŸ†˜ Getting Help

If you need help:

1. Check the [README](README.md) and documentation
2. Search existing [GitHub Issues](https://github.com/AbhinayAmbati/Offly/issues)
3. Create a new issue with detailed information
4. Join our community discussions

## ðŸ“ž Contact

- GitHub: [@AbhinayAmbati](https://github.com/AbhinayAmbati)
- Email: abhinayambati4@gmail.com

Thank you for contributing to Offly! ðŸŽ‰
