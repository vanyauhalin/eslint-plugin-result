import type * as data from "../data.ts"
import * as util from "../util.ts"

export type Options = []

export type MessageIds = "wrapError"

export const funcs: data.target.SafeFunc[] = ["safeNew", "safeSync", "safeAsync"]

export const module = util.rule.create<Options, MessageIds>({
	name: "no-bare-error-return",
	meta: {
		docs: {
			description: "Disallow returning unwrapped errors from `Result` objects. Prefer to wrap errors with additional context.",
		},
		type: "suggestion",
		schema: [],
		messages: {
			wrapError: "Wrap the error with additional context",
		},
	},
	defaultOptions: [],
	create(ctx) {
		return util.target.guard(ctx, () => {
			return util.target.onCall(ctx, funcs, (c) => {
				util.target.onIfErr(c, (e) => {
					let r = util.tree.directReturnStatement(e)
					if (r && r.argument && util.target.isErrAccess(c, r.argument)) {
						let d: util.lint.D<typeof ctx> = {
							node: r,
							messageId: "wrapError",
						}
						ctx.report(d)
					}
				})
			})
		})
	},
})
