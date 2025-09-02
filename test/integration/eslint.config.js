/**
 * @typedef {import("@typescript-eslint/utils").TSESLint.FlatConfig.ConfigArray} ConfigArray
 */

import parser from "@typescript-eslint/parser"
import result from "./package/dist/main.js"

/**
 * @type {ConfigArray}
 */
const config = [
	{
		files: ["**/*.js", "**/*.ts"],
		languageOptions: {
			parser,
			parserOptions: {
				projectService: true,
			},
		},
	},
	{
		settings: {
			result: {
				disableTargetGuard: true,
			},
		},
	},
	result.configs.recommended,
]

export default config
