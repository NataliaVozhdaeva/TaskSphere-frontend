import '@testing-library/jest-dom';

// Configure Jest test environment
window.matchMedia = window.matchMedia || function (query) {
  return {
    matches: function (media) {
      return media.matches;
    },
    addListener: function (callback) {
      // Mock implementation
    },
    removeListener: function (callback) {
      // Mock implementation
    },
  };
};
