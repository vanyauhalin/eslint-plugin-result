import type ts from "typescript"

export function isThenable(t: ts.Type): boolean {
	let p = t.getProperty("then")
	return p !== undefined
}
