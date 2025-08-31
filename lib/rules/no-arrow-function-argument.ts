import * as utils from "@typescript-eslint/utils"
import type * as data from "../data.ts"
import * as util from "../util.ts"

export type Options = []

export type MessageIds = "noArrowFunction"

export const funcs: data.target.SafeFunc[] = ["safeSync", "safeAsync"]

export const module = util.rule.create<Options, MessageIds>({
	name: "no-arrow-function-argument",
	meta: {
		docs: {
			description: "Disallow arrow functions as the first argument to `safeSync` and `safeAsync` calls. Prefer to move function definitions outside of the call arguments.",
		},
		type: "suggestion",
		schema: [],
		messages: {
			noArrowFunction: "Do not use an arrow function",
		},
	},
	defaultOptions: [],
	create(ctx) {
		return util.target.guard(ctx, () => {
			return util.target.onCall(ctx, funcs, (c) => {
				util.target.onArg(c, (a) => {
					if (a.type === utils.AST_NODE_TYPES.ArrowFunctionExpression) {
						let d: util.lint.D<typeof ctx> = {
							node: a,
							messageId: "noArrowFunction",
						}
						ctx.report(d)
					}
				})
			})
		})
	},
})
