import config from "@vanyauhalin/eslint-config"

export default [
	...config,
	{
		files: ["**/*.md/*.js"],
		rules: {
			"func-names": "off",
			"no-empty-pattern": "off",
			"no-empty": "off",
			"prefer-arrow-callback": "off",
			"import-x/no-default-export": "off",
			"prefer-let/prefer-let": "off",
			"typescript/no-unused-vars": "off",
		},
	},
	{
		files: ["lib/main.ts"],
		rules: {
			"import-x/no-default-export": "off",
		},
	},
	{
		files: ["scripts/*.ts"],
		rules: {
			"unicorn/prefer-top-level-await": "off",
		},
	},
]
