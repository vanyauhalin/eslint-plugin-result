import type * as utils from "@typescript-eslint/utils"
import * as data from "./data.ts"
import * as rules from "./rules.ts"

export type {Settings} from "./util/rule.ts"
export * from "./patch.ts"

export type Definition = Reference & {
	configs: {
		recommended: {
			plugins: {
				result: Reference
			}
			rules: Partial<
				Record<
					`result/${keyof Reference["rules"]}`,
					utils.TSESLint.FlatConfig.RuleEntry
				>
			>
		}
	}
}

export type Reference = {
	meta: {
		name: string
		version: string
	}
	rules: {
		"no-arrow-function-argument": utils.ESLintUtils.RuleModule<string, unknown[]>
		"no-async-function-in-sync": utils.ESLintUtils.RuleModule<string, unknown[]>
		"no-bare-error-return": utils.ESLintUtils.RuleModule<string, unknown[]>
		"no-function-argument": utils.ESLintUtils.RuleModule<string, unknown[]>
		"no-iife-argument": utils.ESLintUtils.RuleModule<string, unknown[]>
		"no-newline-before-error-check": utils.ESLintUtils.RuleModule<string, unknown[]>
		"no-result-destructuring": utils.ESLintUtils.RuleModule<string, unknown[]>
		"prefer-safe-over-try-catch": utils.ESLintUtils.RuleModule<string, unknown[]>
	}
}

const ref: Reference = {
	meta: {
		name: data.plugin.name,
		version: data.plugin.version,
	},
	rules: {
		"no-arrow-function-argument": rules.noArrowFunctionArgument.module,
		"no-async-function-in-sync": rules.noAsyncInSync.module,
		"no-bare-error-return": rules.noBareErrorReturn.module,
		"no-function-argument": rules.noFunctionArgument.module,
		"no-iife-argument": rules.noIifeArgument.module,
		"no-newline-before-error-check": rules.noNewlineBeforeErrorCheck.module,
		"no-result-destructuring": rules.noResultDestructuring.module,
		"prefer-safe-over-try-catch": rules.preferSafeOverTryCatch.module,
	},
}

const def: Definition = {
	meta: {
		...ref.meta,
	},
	rules: {
		...ref.rules,
	},
	configs: {
		recommended: {
			plugins: {
				result: {
					meta: {
						...ref.meta,
					},
					rules: {
						...ref.rules,
					},
				},
			},
			rules: {
				"result/no-arrow-function-argument": "error",
				"result/no-async-function-in-sync": "error",
				"result/no-bare-error-return": "error",
				"result/no-function-argument": "error",
				"result/no-iife-argument": "error",
				"result/no-newline-before-error-check": "error",
				"result/no-result-destructuring": "error",
				"result/prefer-safe-over-try-catch": "error",
			},
		},
	},
}

// ESLint plugins conventionally use default exports.
// eslint-disable-next-line import-x/no-default-export
export default def
