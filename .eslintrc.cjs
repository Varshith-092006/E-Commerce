module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true,
    jest: true,
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'prettier',
  ],
  plugins: ['import'],
  rules: {
    // --- Error prevention ---
    'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    'no-process-exit': 'error',

    // --- Async safety (master_prompt §5.1) ---
    'no-async-promise-executor': 'error',
    'require-await': 'warn',

    // --- Import discipline ---
    'import/no-unresolved': 'off',         // Prisma client generated at runtime
    'import/order': ['warn', { 'newlines-between': 'always' }],
    'import/no-duplicates': 'error',

    // --- Style (Prettier handles formatting; ESLint catches logic issues) ---
    'eqeqeq': ['error', 'always'],
    'curly': ['error', 'all'],
    'no-var': 'error',
    'prefer-const': 'error',
  },
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    'coverage/',
    '*/prisma/generated/',
    '*.min.js',
  ],
};
