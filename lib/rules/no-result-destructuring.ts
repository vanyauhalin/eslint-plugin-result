import type * as data from "../data.ts"
import * as util from "../util.ts"

export type Options = []

export type MessageIds = "noDestructuring"

export const funcs: data.target.SafeFunc[] = ["safeNew", "safeSync", "safeAsync"]

export const module = util.rule.create<Options, MessageIds>({
	name: "no-result-destructuring",
	meta: {
		docs: {
			description: "Disallow destructuring `Result` objects from `safeNew`, `safeSync`, and `safeAsync` calls. Prefer to access `v` and `err` properties explicitly.",
		},
		type: "suggestion",
		schema: [],
		messages: {
			noDestructuring: "Do not destructure the result",
		},
	},
	defaultOptions: [],
	create(ctx) {
		return util.target.guard(ctx, () => {
			return util.target.onCall(ctx, funcs, (c) => {
				if (util.tree.isDestructuredCall(c)) {
					let d: util.lint.D<typeof ctx> = {
						node: c,
						messageId: "noDestructuring",
					}
					ctx.report(d)
				}
			})
		})
	},
})
