/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
// eslint-disable-next-line no-undef
module.exports = {
    env: {
        browser: true,
        es2020: true
    },
    settings: {
        react: {
            version: 'detect'
        }
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
        'plugin:react/jsx-runtime',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeature: {
            jsx: true
        }
    },
    plugins: ['react-refresh', '@typescript-eslint'],
    ignorePatterns: ['**/dev/**/*.ts', '**/dev/**/*.tsx',],
    rules: {
        'react-hooks/exhaustive-deps': 'off',
        'react-refresh/only-export-components': 'warn',
        'react/jsx-uses-vars': 'error',
        'react/jsx-first-prop-new-line': ['error', 'multiline'],
        'space-before-function-paren': ['error', {
            anonymous: 'never',
            named: 'never',
            asyncArrow: 'always'
        }],
        'react/forbid-component-props': ['off', { forbid: ['style'] }],
        'react/jsx-closing-bracket-location': 'error',
        'react/jsx-closing-tag-location': 'error',
        'react/jsx-curly-brace-presence': ['warn', {
            props: 'never',
            children: 'never',
            propElementValues: 'always'
        }],
        'react/jsx-curly-newline': ['warn', {
            multiline: 'consistent',
            singleline: 'forbid'
        }],
        'react/jsx-curly-spacing': ['warn', { when: 'never' }],
        'react/jsx-props-no-multi-spaces': 'error',
        'react/jsx-handler-names': ['off', {
            eventHandlerPrefix: 'on',
            eventHandlerPropPrefix: ''
        }],
        'react/jsx-no-constructed-context-values': 'warn',
        'react/jsx-key': 'error',
        'react/jsx-max-depth': ['warn', { max: 5 }],
        'react/jsx-no-useless-fragment': 'warn',
        'react/jsx-tag-spacing': 'error',

        'padding-line-between-statements': ['error',
            { blankLine: 'always', prev: ['const', 'let'], next: '*' },
            { blankLine: 'any', prev: ['const', 'let'], next: ['const', 'let'] },
            { blankLine: 'always', prev: '*', next: ['if', 'try'] },
        ],
        'space-before-blocks': 'error',
        'no-console': ['warn', { 'allow': ['warn', 'error'] }],
        'eol-last': ['error', 'never'],
        'indent': ['error', 4, { SwitchCase: 1 }],
        'linebreak-style': ['off', process.platform === 'win32' ? 'windows' : 'unix'],
        'quotes': ['error', 'single'],
        'curly': ['error', 'all'],
        'no-return-await': 'error',
        'newline-before-return': 'error',
        'keyword-spacing': 'error',
        'max-len': ['error', { 
            code: 120,
            ignoreUrls: true,
            ignorePattern: '^(import\\s.+\\sfrom\\s.+|\\} from)'
        }],
        'comma-spacing': ['error', {
            before: false,
            after: true
        }],
        'object-curly-spacing': ['error', 'always'],
        'jsx-quotes': ['error', 'prefer-double'],
        'arrow-spacing': 'error',
        'rest-spread-spacing': ['error', 'never'],
        'key-spacing': ['error', {
            afterColon: true,
            beforeColon: false,
            mode: 'strict'
        }],
        'space-infix-ops': 'error',

        '@typescript-eslint/type-annotation-spacing': ['error', {
            before: false,
            after: true,
            overrides: { arrow: { before: true, after: true } }
        }],
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-var-requires': 'error',
        '@typescript-eslint/no-non-null-assertion': 'error',
        '@typescript-eslint/no-empty-interface': 'off',

    },
};