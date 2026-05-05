import svelteConfig from './svelte.config.js';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import js from '@eslint/js';
import ts from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import prettier from 'eslint-config-prettier';

export default defineConfig(
	{
		ignores: ['.svelte-kit/', 'build/', 'dist/', 'src-tauri/target/', 'src-tauri/gen/', '.vite/', 'node_modules/']
	},
	js.configs.recommended,
	ts.configs.recommended,
	svelte.configs.recommended,
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser,
				svelteConfig
			}
		}
	},
	prettier,
	{
		rules: {
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': 'off',
			'svelte/no-target-blank': 'error',
			'svelte/block-lang': [
				'error',
				{
					enforceScriptPresent: true,
					enforceStylePresent: true,
					script: 'ts',
					style: null
				}
			],
			'svelte/no-add-event-listener': 'error',
			'svelte/no-at-debug-tags': 'warn',
			'svelte/no-spaces-around-equal-signs-in-attribute': 'error',
			'svelte/prefer-style-directive': 'error',
			'svelte/spaced-html-comment': ['error', 'always'],
			'no-trailing-spaces': 'off',
			'svelte/no-trailing-spaces': [
				'error',
				{
					skipBlankLines: false,
					ignoreComments: false
				}
			]
		}
	}
);
