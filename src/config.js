// Application configuration
export const config = {
  // API Configuration
  api: {
    baseUrl: process.env.REACT_APP_API_URL || "http://localhost:8000/api",
    timeout: parseInt(process.env.REACT_APP_API_TIMEOUT) || 10000,
  },

  // Environment
  environment: process.env.REACT_APP_ENVIRONMENT || "development",
  debug: process.env.REACT_APP_DEBUG === "true",

  // Application Info
  app: {
    name: process.env.REACT_APP_NAME || "TaskSphere",
    version: process.env.REACT_APP_VERSION || "1.0.0",
    description:
      process.env.REACT_APP_DESCRIPTION || "Task Management Application",
  },

  // Feature Flags
  features: {
    analytics: process.env.REACT_APP_ENABLE_ANALYTICS === "true",
    errorReporting: process.env.REACT_APP_ENABLE_ERROR_REPORTING === "true",
    performanceMonitoring:
      process.env.REACT_APP_ENABLE_PERFORMANCE_MONITORING === "true",
    tokenRefresh: process.env.REACT_APP_TOKEN_REFRESH_ENABLED === "true",
  },

  // Authentication
  auth: {
    sessionTimeout: parseInt(process.env.REACT_APP_SESSION_TIMEOUT) || 3600000, // 1 hour
    tokenRefreshEnabled: process.env.REACT_APP_TOKEN_REFRESH_ENABLED === "true",
  },

  // UI Configuration
  ui: {
    theme: process.env.REACT_APP_THEME || "light",
    language: process.env.REACT_APP_DEFAULT_LANGUAGE || "en",
    itemsPerPage: parseInt(process.env.REACT_APP_ITEMS_PER_PAGE) || 10,
  },

  // External Services
  services: {
    sentry: {
      dsn: process.env.REACT_APP_SENTRY_DSN,
      environment:
        process.env.REACT_APP_SENTRY_ENVIRONMENT ||
        process.env.REACT_APP_ENVIRONMENT,
    },
    analytics: {
      googleAnalyticsId: process.env.REACT_APP_GOOGLE_ANALYTICS_ID,
    },
  },

  // Build Information
  build: {
    number: process.env.REACT_APP_BUILD_NUMBER,
    commitSha: process.env.REACT_APP_COMMIT_SHA,
    date: process.env.REACT_APP_BUILD_DATE,
  },

  // Development
  development: {
    mockApi: process.env.REACT_APP_MOCK_API === "true",
    logLevel: process.env.REACT_APP_LOG_LEVEL || "error",
  },
};

// Helper functions
export const isDevelopment = () => config.environment === "development";
export const isProduction = () => config.environment === "production";
export const isTest = () => config.environment === "test";

export const isFeatureEnabled = (feature) => config.features[feature] || false;

export default config;
