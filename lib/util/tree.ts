import * as scopeManager from "@typescript-eslint/scope-manager"
import * as utils from "@typescript-eslint/utils"

export function isImported(
	c: Readonly<utils.TSESLint.RuleContext<string, readonly unknown[]>>,
	n: utils.TSESTree.Node,
	k: string,
): boolean {
	let s: utils.TSESLint.Scope.Scope | null = c.sourceCode.getScope(n)
	while (s) {
		let v = s.set.get(k)
		if (v && v.defs.length !== 0) {
			let d = v.defs[0]
			if (d.type === scopeManager.DefinitionType.ImportBinding) {
				return true
			}
		}
		s = s.upper
	}
	return false
}

export function isIife(n: utils.TSESTree.Node): boolean {
	return (
		n.type === utils.AST_NODE_TYPES.CallExpression && (
			n.callee.type === utils.AST_NODE_TYPES.ArrowFunctionExpression ||
			n.callee.type === utils.AST_NODE_TYPES.FunctionExpression
		)
	)
}

export function isDestructuredCall(n: utils.TSESTree.CallExpression): boolean {
	if (!n.parent) {
		return false
	}

	if (
		n.parent.type === utils.AST_NODE_TYPES.VariableDeclarator &&
		n.parent.init === n &&
		n.parent.id &&
		n.parent.id.type === utils.AST_NODE_TYPES.ObjectPattern
	) {
		return true
	}

	if (
		n.parent.type === utils.AST_NODE_TYPES.AssignmentExpression &&
		n.parent.right === n &&
		n.parent.left &&
		n.parent.left.type === utils.AST_NODE_TYPES.ObjectPattern
	) {
		return true
	}

	return false
}

export function memberExpressionPath(n: utils.TSESTree.Node): string[] {
	if (n.type === utils.AST_NODE_TYPES.Identifier) {
		return [n.name]
	}

	if (n.type === utils.AST_NODE_TYPES.MemberExpression) {
		let p = memberExpressionPath(n.object)
		if (n.property.type === utils.AST_NODE_TYPES.Identifier) {
			return [...p, n.property.name]
		}
		return []
	}

	return []
}

export function topLevelStatement(
	n: utils.TSESTree.Node,
): utils.TSESTree.ProgramStatement | utils.TSESTree.Statement | undefined {
	while (n && n.parent) {
		if (
			(
				n.parent.type === utils.AST_NODE_TYPES.Program ||
				n.parent.type === utils.AST_NODE_TYPES.BlockStatement
			) &&
			n.parent.body
		) {
			for (let s of n.parent.body) {
				if (s === n) {
					return s
				}
			}
		}
		n = n.parent
	}
}

export function nextSiblingStatement(
	n: utils.TSESTree.Node,
): utils.TSESTree.ProgramStatement | utils.TSESTree.Statement | undefined {
	if (
		n.parent &&
		(
			n.parent.type === utils.AST_NODE_TYPES.Program ||
			n.parent.type === utils.AST_NODE_TYPES.BlockStatement
		)
	) {
		for (let [i, s] of n.parent.body.entries()) {
			if (s === n) {
				if (n.parent.body.length > i + 1) {
					return n.parent.body[i + 1]
				}
				return
			}
		}
	}
}

export function directReturnStatement(
	e: utils.TSESTree.IfStatement,
): utils.TSESTree.ReturnStatement | undefined {
	switch (e.consequent.type) {
	case utils.AST_NODE_TYPES.BlockStatement:
		if (e.consequent.body.length === 1) {
			let s = e.consequent.body[0]
			if (s.type === utils.AST_NODE_TYPES.ReturnStatement) {
				return s
			}
		}
		return

	case utils.AST_NODE_TYPES.ReturnStatement:
		return e.consequent

	// no default
	}
}
