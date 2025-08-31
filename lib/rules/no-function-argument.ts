import * as utils from "@typescript-eslint/utils"
import type * as data from "../data.ts"
import * as util from "../util.ts"

export type Options = []

export type MessageIds = "noFunction"

export const funcs: data.target.SafeFunc[] = ["safeSync", "safeAsync"]

export const module = util.rule.create<Options, MessageIds>({
	name: "no-function-argument",
	meta: {
		docs: {
			description: "Disallow function expressions (both named and anonymous) as the first argument to `safeSync` and `safeAsync` functions. Prefer to move function definitions outside of the call arguments.",
		},
		type: "suggestion",
		schema: [],
		messages: {
			noFunction: "Do not use a function expression",
		},
	},
	defaultOptions: [],
	create(ctx) {
		return util.target.guard(ctx, () => {
			return util.target.onCall(ctx, funcs, (c) => {
				util.target.onArg(c, (a) => {
					if (a.type === utils.AST_NODE_TYPES.FunctionExpression) {
						let d: util.lint.D<typeof ctx> = {
							node: a,
							messageId: "noFunction",
						}
						ctx.report(d)
					}
				})
			})
		})
	},
})
