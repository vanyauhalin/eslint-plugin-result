import * as utils from "@typescript-eslint/utils"
import type * as data from "../data.ts"
import * as util from "../util.ts"

export type Options = []

export type MessageIds = "noEmptyLines"

export const funcs: data.target.SafeFunc[] = ["safeNew", "safeSync", "safeAsync"]

export const module = util.rule.create<Options, MessageIds>({
	name: "no-newline-before-error-check",
	meta: {
		docs: {
			description: "Disallow empty lines between `safeNew`, `safeSync`, and `safeAsync` calls and their immediate error checks. Prefer to maintain locality of error handling.",
		},
		type: "layout",
		schema: [],
		messages: {
			noEmptyLines: "Remove empty lines",
		},
		fixable: "whitespace",
	},
	defaultOptions: [],
	create(ctx) {
		return util.target.guard(ctx, () => {
			return util.target.onCall(ctx, funcs, (c) => {
				util.target.onIfErr(c, (e) => {
					if (
						c.parent.type !== utils.AST_NODE_TYPES.AssignmentExpression &&
						c.parent.type !== utils.AST_NODE_TYPES.VariableDeclarator
					) {
						return
					}

					let x = ctx.sourceCode.getLastToken(c.parent.parent)
					if (!x) {
						return
					}

					let y = ctx.sourceCode.getFirstToken(e)
					if (!y) {
						return
					}

					if (y.loc.start.line - x.loc.end.line > 1) {
						let f: util.lint.F<typeof ctx> = (e) => {
							return e.replaceTextRange([x.range[1], y.range[0]], "\n")
						}

						let d: util.lint.D<typeof ctx> = {
							node: e,
							fix: f,
							messageId: "noEmptyLines",
						}

						ctx.report(d)
					}
				})
			})
		})
	},
})
