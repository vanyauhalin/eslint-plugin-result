import * as utils from "@typescript-eslint/utils"
import type ts from "typescript"
import type * as data from "../data.ts"
import * as util from "../util.ts"

export type Options = []

export type MessageIds = "useSafeAsync"

export const funcs: data.target.SafeFunc[] = ["safeSync"]

export const module = util.rule.create<Options, MessageIds>({
	name: "no-async-function-in-sync",
	meta: {
		docs: {
			description: "Disallow async functions as the first argument to `safeSync` calls. Prefer to use `safeAsync` for async functions.",
		},
		type: "problem",
		schema: [],
		messages: {
			useSafeAsync: "Use `safeAsync`",
		},
	},
	defaultOptions: [],
	create(ctx) {
		return util.target.guard(ctx, () => {
			let ps = utils.ESLintUtils.getParserServices(ctx)
			let tc = ps.program.getTypeChecker()

			return util.target.onCall(ctx, funcs, (sc) => {
				util.target.onArg(sc, (sa) => {
					let at = ps.getTypeAtLocation(sa)

					let signatures = at.getCallSignatures()
					if (signatures.length === 0) {
						return
					}

					let is = false
					for (let s of signatures) {
						let t = tc.getReturnTypeOfSignature(s)
						if (hasThenable(t)) {
							is = true
							break
						}
					}

					if (is) {
						let d: util.lint.D<typeof ctx> = {
							node: sa,
							messageId: "useSafeAsync",
						}
						ctx.report(d)
					}
				})
			})
		})
	},
})

function hasThenable(t: ts.Type): boolean {
	let types: ts.Type[] | undefined
	if (t.isUnion()) {
		types = t.types
	} else {
		types = [t]
	}

	for (let t of types) {
		if (util.ast.isThenable(t)) {
			return true
		}
	}

	return false
}
