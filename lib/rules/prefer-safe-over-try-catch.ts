import * as util from "../util.ts"

export type Options = []

export type MessageIds = "noTry"

export const module = util.rule.create<Options, MessageIds>({
	name: "prefer-safe-over-try-catch",
	meta: {
		docs: {
			description: "Prefer `safeNew`, `safeSync`, and `safeAsync` calls over try-catch blocks.",
		},
		type: "suggestion",
		schema: [],
		messages: {
			noTry: "Prefer safe calls",
		},
	},
	defaultOptions: [],
	create(ctx) {
		return util.target.guard(ctx, () => {
			return {
				TryStatement(n) {
					let d: util.lint.D<typeof ctx> = {
						node: n,
						messageId: "noTry",
					}
					ctx.report(d)
				},
			}
		})
	},
})
