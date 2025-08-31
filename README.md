# eslint-plugin-result

Rules for consistent [`@vanyauhalin/result`] usage.

## Contents

- [Installation](#installation)
	- [npm](#npm)
	- [GitHub Packages](#github-packages)
	- [JSR (JavaScript Registry)](#jsr-javascript-registry)
	- [GitHub Releases](#github-releases)
- [Usage](#usage)
- [Settings](#settings)
- [Rules](#rules)
- [Compatibility](#compatibility)
- [License](#license)

## Installation

### npm

```sh
npm install --save-dev @vanyauhalin/eslint-plugin-result
```

### GitHub Packages

```sh
npm install --save-dev --registry https://npm.pkg.github.com @vanyauhalin/eslint-plugin-result
```

### JSR (JavaScript Registry)

```sh
npx jsr add --dev @vanyauhalin/eslint-plugin-result
```

### GitHub Releases

```sh
npm install --save-dev vanyauhalin-eslint-plugin-result-x.x.x.tgz
```

## Usage

```js
import parser from "@typescript-eslint/parser"
import result from "@vanyauhalin/eslint-plugin-result"

export default [
	{
		files: ["**/*.js", "**/*.ts"],
		languageOptions: {
			parser,
			parserOptions: {
				projectService: true,
			},
		},
	},
	result.configs.recommended,
]
```

## Settings

Plugin settings go in the `settings.result` object.

###### Fields

* `disableTargetGuard` (`boolean`, default: `false`)
	— Controls whether the plugin should enforce rules when `@vanyauhalin/result`
		not detected in the project. By default, all rules become no-op when the
		target package is not installed. Set this to `true` to enforce rules
		regardless of package presence.

###### Example

```js
import result from "@vanyauhalin/result"

export default [
	{
		files: ["**/*.js", "**/*.ts"],
		settings: {
			result: {
				disableTargetGuard: true,
			},
		},
	},
	result.configs.recommended,
]
```

## Rules

💼 Configurations enabled in.\
✅ Set in the `recommended` configuration.\
🔧 Automatically fixable by the [`--fix` CLI option].\
💭 Requires [type information].

| Name                            | Description                                                                                                                                                                                     | 💼    | 🔧    | 💭    |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--- | :--- | :--- |
| [no-arrow-function-argument]    | Disallow arrow functions as the first argument to [`safeSync`] and [`safeAsync`] calls. Prefer to move function definitions outside of the call arguments.                                      | ✅    |      |      |
| [no-async-function-in-sync]     | Disallow async functions as the first argument to [`safeSync`] calls. Prefer to use [`safeAsync`] for async functions.                                                                          | ✅    |      | 💭    |
| [no-bare-error-return]          | Disallow returning unwrapped errors from [`Result`] objects. Prefer to wrap errors with additional context.                                                                                     | ✅    |      |      |
| [no-function-argument]          | Disallow function expressions (both named and anonymous) as the first argument to [`safeSync`] and [`safeAsync`] functions. Prefer to move function definitions outside of the call arguments.  | ✅    |      |      |
| [no-iife-argument]              | Disallow immediately invoked function expressions (IIFE) as the first argument to [`safeNew`], [`safeSync`], and [`safeAsync`] calls. Prefer to define the function outside the call arguments. | ✅    |      |      |
| [no-newline-before-error-check] | Disallow empty lines between [`safeNew`], [`safeSync`], and [`safeAsync`] calls and their immediate error checks. Prefer to maintain locality of error handling.                                | ✅    | 🔧    |      |
| [no-result-destructuring]       | Disallow destructuring [`Result`] objects from [`safeNew`], [`safeSync`], and [`safeAsync`] calls. Prefer to access `v` and `err` properties explicitly.                                        | ✅    |      |      |
| [prefer-safe-over-try-catch]    | Prefer [`safeNew`], [`safeSync`], and [`safeAsync`] calls over try-catch blocks.                                                                                                                | ✅    |      |      |

## Compatibility

This package is ESM only. The minimum supported ESLint version is 9, Node.js
version is 18.18, TypeScript version is 4.8.4, and `@typescript-eslint/parser`
version is 8.

## License

[MIT] © [Ivan Uhalin]

<!-- Definitions -->

[`@vanyauhalin/result`]: https://github.com/vanyauhalin/result/

[`--fix` CLI option]: https://eslint.org/docs/user-guide/command-line-interface#--fix
[type information]: https://typescript-eslint.io/linting/typed-linting

[`Result`]: https://github.com/vanyauhalin/result/blob/v0.0.0/README.md#result-1
[`safeNew`]: https://github.com/vanyauhalin/result/blob/v0.0.0/README.md#safesyncfn-args
[`safeSync`]: https://github.com/vanyauhalin/result/blob/v0.0.0/README.md#safesyncfn-args
[`safeAsync`]: https://github.com/vanyauhalin/result/blob/v0.0.0/README.md#safeasyncfn-args

[no-arrow-function-argument]: https://github.com/vanyauhalin/eslint-plugin-result/blob/v0.0.0/docs/rules/no-arrow-function-argument.md
[no-async-function-in-sync]: https://github.com/vanyauhalin/eslint-plugin-result/blob/v0.0.0/docs/rules/no-async-function-in-sync.md
[no-bare-error-return]: https://github.com/vanyauhalin/eslint-plugin-result/blob/v0.0.0/docs/rules/no-bare-error-return.md
[no-function-argument]: https://github.com/vanyauhalin/eslint-plugin-result/blob/v0.0.0/docs/rules/no-function-argument.md
[no-iife-argument]: https://github.com/vanyauhalin/eslint-plugin-result/blob/v0.0.0/docs/rules/no-iife-argument.md
[no-newline-before-error-check]: https://github.com/vanyauhalin/eslint-plugin-result/blob/v0.0.0/docs/rules/no-newline-before-error-check.md
[no-result-destructuring]: https://github.com/vanyauhalin/eslint-plugin-result/blob/v0.0.0/docs/rules/no-result-destructuring.md
[prefer-safe-over-try-catch]: https://github.com/vanyauhalin/eslint-plugin-result/blob/v0.0.0/docs/rules/prefer-safe-over-try-catch.md

[MIT]: https://github.com/vanyauhalin/moondusttheme/blob/main/LICENSE
[Ivan Uhalin]: https://github.com/vanyauhalin/
