module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    // ESLint-specific rules
    indent: ['error', 2], // Enforce 2 spaces for indentation
    'comma-spacing': ['error', { before: false, after: true }],
    'key-spacing': ['error', { beforeColon: false, afterColon: true }],
    'object-curly-spacing': ['error', 'always'], // Enforce space after { and before }
  },
};
