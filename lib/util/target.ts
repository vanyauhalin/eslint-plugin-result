import * as module from "node:module"
import * as utils from "@typescript-eslint/utils"
import * as data from "../data.ts"
import * as array from "./array.ts"
import type * as rule from "./rule.ts"
import * as tree from "./tree.ts"

const require = module.createRequire(import.meta.url)

const guardCache = new Map<string, boolean>()

export type GuardCallback = () => utils.ESLintUtils.RuleListener

export function guard<
	M extends string,
	O extends readonly unknown[],
>(
	c: Readonly<rule.Context<M, O>>,
	cb: GuardCallback,
): utils.ESLintUtils.RuleListener {
	if (c.settings.result && c.settings.result.disableTargetGuard) {
		return cb()
	}

	let b = guardCache.get(c.cwd)
	if (b !== undefined) {
		if (b) {
			return cb()
		}
		return {}
	}

	try {
		require.resolve(data.target.name, {paths: [c.cwd]})
		guardCache.set(c.cwd, true)
		return cb()
	} catch {
		guardCache.set(c.cwd, false)
		return {}
	}
}

export type OnCallCallback = (n: utils.TSESTree.CallExpression) => void

export function onCall<
	M extends string,
	O extends readonly unknown[],
>(
	c: Readonly<rule.Context<M, O>>,
	funcs: data.target.SafeFunc[],
	cb: OnCallCallback,
): utils.ESLintUtils.RuleListener {
	let named: string[] = []
	let namespaces: string[] = []

	let inFuncs = (k: string): boolean => {
		return (funcs as string[]).includes(k)
	}

	let inNamed = (n: utils.TSESTree.Node, k: string): boolean => {
		return named.includes(k) && tree.isImported(c, n, k)
	}

	let inNamespaces = (n: utils.TSESTree.Node, k: string): boolean => {
		return namespaces.includes(k) && tree.isImported(c, n, k)
	}

	return {
		CallExpression(n) {
			if (
				n.callee.type === utils.AST_NODE_TYPES.Identifier &&
				inFuncs(n.callee.name) &&
				inNamed(n, n.callee.name)
			) {
				cb(n)
				return
			}

			if (
				n.callee.type === utils.AST_NODE_TYPES.MemberExpression &&
				n.callee.object.type === utils.AST_NODE_TYPES.Identifier &&
				n.callee.property.type === utils.AST_NODE_TYPES.Identifier &&
				inFuncs(n.callee.property.name) &&
				inNamespaces(n, n.callee.object.name)
			) {
				cb(n)
				return
			}
		},

		ImportDeclaration(n) {
			if (n.source.value === data.target.name) {
				for (let s of n.specifiers) {
					switch (s.type) {
					case utils.AST_NODE_TYPES.ImportSpecifier:
						if (s.imported.type === utils.AST_NODE_TYPES.Identifier) {
							named.push(s.imported.name)
						}
						break

					case utils.AST_NODE_TYPES.ImportNamespaceSpecifier:
						namespaces.push(s.local.name)
						break

					// no default
					}
				}
			}
		},
	}
}

export type OnArgCallback = (n: utils.TSESTree.Expression) => void

export function onArg(
	n: utils.TSESTree.CallExpression,
	cb: OnArgCallback,
): void {
	if (n.arguments.length !== 0) {
		let a = n.arguments[0]
		if (a.type !== utils.AST_NODE_TYPES.SpreadElement) {
			cb(a)
		}
	}
}

export type OnIfErrCallback = (n: utils.TSESTree.IfStatement) => void

export function onIfErr(
	n: utils.TSESTree.CallExpression,
	cb: OnIfErrCallback,
): void {
	if (
		n.parent.type !== utils.AST_NODE_TYPES.AssignmentExpression &&
		n.parent.type !== utils.AST_NODE_TYPES.VariableDeclarator
	) {
		return
	}

	let p = tree.topLevelStatement(n.parent.parent)
	if (!p) {
		return
	}

	let e = tree.nextSiblingStatement(p)
	if (!e) {
		return
	}

	if (e.type !== utils.AST_NODE_TYPES.IfStatement) {
		return
	}

	if (isErrAccess(n, e.test)) {
		cb(e)
	}
}

export function isErrAccess(
	s: utils.TSESTree.Node,
	t: utils.TSESTree.Node,
): boolean {
	if (!s.parent) {
		return false
	}

	let n: utils.TSESTree.Node | undefined

	switch (s.parent.type) {
	case utils.AST_NODE_TYPES.AssignmentExpression:
		n = s.parent.left
		break
	case utils.AST_NODE_TYPES.VariableDeclarator:
		n = s.parent.id
		break
	// no default
	}

	if (!n) {
		return false
	}

	if (t.type !== utils.AST_NODE_TYPES.MemberExpression) {
		return false
	}

	let x = tree.memberExpressionPath(n)
	if (x.length === 0) {
		return false
	}

	let y = tree.memberExpressionPath(t.object)
	if (y.length === 0) {
		return false
	}

	if (!array.isEqual(x, y)) {
		return false
	}

	if (
		t.property &&
		t.property.type === utils.AST_NODE_TYPES.Identifier &&
		t.property.name === data.target.errProp
	) {
		return true
	}

	return false
}
