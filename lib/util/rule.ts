import * as utils from "@typescript-eslint/utils"
import * as data from "../data.ts"
import type * as types from "./types.ts"

export type Module<
	M extends string,
	O extends readonly unknown[],
> = Omit<utils.ESLintUtils.RuleModule<M, O>, "create"> & {
	create(c: Readonly<Context<M, O>>): utils.ESLintUtils.RuleListener
}

export type Context<
	M extends string,
	O extends readonly unknown[],
> = Readonly<Omit<utils.TSESLint.RuleContext<M, O>, "settings">> & {
	settings: {
		result?: Settings
	}
}

export type Settings = {
	disableTargetGuard?: boolean
}

export type CreateOptions<
	O extends readonly unknown[],
	M extends string,
> = Omit<Readonly<utils.ESLintUtils.RuleWithMetaAndName<O, M>>, "create"> & {
	create(
		c: Readonly<Context<M, O>>,
		o: types.Defaulted<O>,
	): utils.ESLintUtils.RuleListener
}

// https://github.com/typescript-eslint/typescript-eslint/issues/5439
export type Create = <
	O extends readonly unknown[],
	M extends string,
>(o: CreateOptions<O, M>) => Module<M, O>

// eslint-disable-next-line new-cap
export const create = utils.ESLintUtils.RuleCreator(url) as Create

function url(n: string): string {
	let b = data.plugin.repo
	if (!b.endsWith("/")) {
		b += "/"
	}

	let p = `blob/v${data.plugin.version}/docs/rules/${n}.md`
	let u = new URL(p, b)

	return u.toString()
}

const nameRegexp = new RegExp(`^${url("").slice(0, -3)}(.+)\\.md$`)

export function name(
	r: utils.ESLintUtils.RuleModule<string, readonly unknown[]>,
): string {
	if (!r.meta.docs) {
		throw new Error("Rule meta.docs is undefined")
	}

	if (!r.meta.docs.url) {
		throw new Error("Rule meta.docs.url is undefined")
	}

	let u = new URL(r.meta.docs.url)

	let m = nameRegexp.exec(u.href)
	if (!m) {
		throw new Error(`Rule meta.docs.url is not valid: ${u.href}`)
	}

	let n = m[1]
	if (!n) {
		throw new Error(`Rule name is empty: ${u.href}`)
	}

	return n
}
