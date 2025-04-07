import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import sortPlugin from 'eslint-plugin-simple-import-sort';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

import { defineConfig } from 'eslint/config';
import { includeIgnoreFile } from '@eslint/compat';
import { fileURLToPath } from 'node:url';

const gitignorePath = fileURLToPath(new URL('.gitignore', import.meta.url));

export default defineConfig([
	includeIgnoreFile(gitignorePath),
	{
		files: ['**/*.ts', '**/*.tsx'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
			},
			globals: {
				...globals.node,
				...globals.commonjs,
			},
		},
		plugins: {
			'@typescript-eslint': tsPlugin,
			import: importPlugin,
			'simple-import-sort': sortPlugin,
		},
		rules: {
			...tsPlugin.configs.recommended.rules,
			'import/first': 'error',
			'import/newline-after-import': 'error',
			'import/no-duplicates': 'error',
			'simple-import-sort/imports': 'error',
			'simple-import-sort/exports': 'error',

			'padding-line-between-statements': [
				'error',
				// { blankLine: 'never', prev: ['const', 'let', 'var'], next: '*' },
				{ blankLine: 'always', prev: 'directive', next: '*' },
				{ blankLine: 'always', prev: '*', next: 'return' },
			],
			'space-infix-ops': ['error', { int32Hint: false }],
			'keyword-spacing': ['error', { before: true, after: true }],
			'no-magic-numbers': ['off', { ignore: [0, 1, -1] }],
			'no-multi-spaces': 'error',
			'no-trailing-spaces': 'error',
		},
		settings: {
			'import/resolver': {
				typescript: {
					alwaysTryTypes: true,
				},
				node: {
					extensions: ['.ts', '.tsx', '.js', '.jsx'],
				},
			},
			'import/internal-regex': '^~/',
		},
	},
	{
		rules: {
			...prettierConfig.rules,
			'max-len': ['error', { code: 100 }],
		},
	},
]);
