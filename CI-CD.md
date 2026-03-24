# CI/CD Pipeline for TaskSphere Frontend

## Overview

This project uses GitHub Actions for continuous integration and deployment. The pipeline automatically tests, builds, and deploys the React application on every push and pull request.

## Workflow Triggers

### Main CI/CD Pipeline (`.github/workflows/ci-cd.yml`)
- **Triggers**: Push to `main` or `develop` branches, Pull Requests
- **Jobs**:
  - **Test**: Runs tests on Node.js 18.x and 20.x
  - **Security**: Performs security audit and vulnerability scanning
  - **Deploy**: Deploys to production (main branch only)

### Pull Request Validation (`.github/workflows/pr-validation.yml`)
- **Triggers**: Pull Requests to `main` or `develop`
- **Jobs**:
  - **Validate**: Code quality, tests, build validation
  - **Accessibility**: Automated accessibility testing

## Pipeline Stages

### 1. Code Quality Checks
- **ESLint**: JavaScript/JSX linting
- **Prettier**: Code formatting validation
- **TypeScript**: Type checking (if applicable)

### 2. Testing
- **Unit Tests**: Jest and React Testing Library
- **Coverage**: Code coverage reporting with Codecov
- **Integration Tests**: API integration testing

### 3. Security
- **Dependency Audit**: `npm audit` for known vulnerabilities
- **Snyk Scan**: Advanced vulnerability detection
- **Security Headers**: Automated security header validation

### 4. Build
- **Production Build**: Optimized React build
- **Bundle Analysis**: Bundle size monitoring
- **Asset Optimization**: Minification and compression

### 5. Deployment
- **GitHub Pages**: Automatic deployment to GitHub Pages
- **Staging Server**: SSH deployment to staging environment
- **Production Server**: SSH deployment to production (main branch only)

## Required GitHub Secrets

### Base Configuration
```bash
# Set these secrets in your GitHub repository settings
gh secret set DEPLOY_HOST --body "your-server.com"
gh secret set DEPLOY_USER --body "deploy-user"
gh secret set DEPLOY_KEY --body "$(cat ~/.ssh/id_rsa)"
gh secret set SNYK_TOKEN --body "your-snyk-token"
```

### Environment Variables
```bash
# Development
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_ENVIRONMENT=development

# Production
REACT_APP_API_URL=https://api.tasksphere.com/api
REACT_APP_ENVIRONMENT=production
```

## Local Development

### Running Tests Locally
```bash
# Install dependencies
npm install

# Run tests with coverage
npm test

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Build for production
npm run build
```

### Pre-commit Hooks (Optional)
```bash
# Install husky for pre-commit hooks
npm install --save-dev husky

# Add pre-commit hook
npx husky add .husky/pre-commit "npm run lint && npm test"
```

## Monitoring and Alerts

### Pipeline Status
- **GitHub Actions**: Real-time pipeline status
- **Codecov**: Code coverage tracking
- **Snyk**: Vulnerability monitoring
- **Bundle Size**: Automated bundle size alerts

### Notification Setup
```yaml
# Add to workflow files for notifications
- name: Notify Slack
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    channel: '#ci-cd'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## Deployment Environments

### GitHub Pages
- **URL**: `https://username.github.io/repository-name`
- **Branch**: `gh-pages`
- **Trigger**: Push to main branch

### Staging Environment
- **Server**: Configurable via `DEPLOY_HOST`
- **Path**: `/var/www/tasksphere-staging`
- **Branch**: `develop`

### Production Environment
- **Server**: Configurable via `DEPLOY_HOST`
- **Path**: `/var/www/tasksphere-production`
- **Branch**: `main`

## Troubleshooting

### Common Issues
1. **Build Failures**: Check Node.js version compatibility
2. **Test Failures**: Verify test environment setup
3. **Deployment Issues**: Check SSH keys and server configuration
4. **Security Scans**: Review dependency versions and update

### Debug Mode
```yaml
# Enable debug logging in workflows
env:
  ACTIONS_STEP_DEBUG: true
  ACTIONS_RUNNER_DEBUG: true
```

## Best Practices

1. **Branch Protection**: Protect main branch with required status checks
2. **Semantic Versioning**: Use conventional commits for version tracking
3. **Dependency Updates**: Regular dependency updates and security patches
4. **Documentation**: Keep CI/CD documentation up to date
5. **Monitoring**: Set up alerts for pipeline failures

## Performance Optimization

### Build Optimization
- **Code Splitting**: Automatic code splitting in React
- **Tree Shaking**: Dead code elimination
- **Asset Compression**: Gzip compression enabled
- **Caching**: Browser caching headers configured

### Monitoring
- **Lighthouse CI**: Automated performance testing
- **Bundle Analyzer**: Bundle size tracking
- **Core Web Vitals**: Performance metrics monitoring
