import type * as data from "../data.ts"
import * as util from "../util.ts"

export type Options = []

export type MessageIds = "noIife"

export const funcs: data.target.SafeFunc[] = ["safeNew", "safeSync", "safeAsync"]

export const module = util.rule.create<Options, MessageIds>({
	name: "no-iife-argument",
	meta: {
		docs: {
			description: "Disallow immediately invoked function expressions (IIFE) as the first argument to `safeNew`, `safeSync`, and `safeAsync` calls. Prefer to define the function outside the call arguments.",
		},
		type: "suggestion",
		schema: [],
		messages: {
			noIife: "Do not use IIFE",
		},
	},
	defaultOptions: [],
	create(ctx) {
		return util.target.guard(ctx, () => {
			return util.target.onCall(ctx, funcs, (c) => {
				util.target.onArg(c, (a) => {
					if (util.tree.isIife(a)) {
						let d: util.lint.D<typeof ctx> = {
							node: a,
							messageId: "noIife",
						}
						ctx.report(d)
					}
				})
			})
		})
	},
})
