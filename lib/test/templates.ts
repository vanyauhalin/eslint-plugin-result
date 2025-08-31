import * as ruleTester from "@typescript-eslint/rule-tester"
import * as data from "../data.ts"
import * as util from "../util.ts"
import type * as shared from "./shared.ts"

let templates: Template[] = [
	(o, f) => `
		import {${f}} from "${data.target.name}"
		${o.glo}
		${o.pre}${f}(${o.arg})
		${o.aft}
	`,
	(o, f) => `
		import {${f}} from "${data.target.name}"
		${o.glo}
		function wr() {
		${o.pre}${f}(${o.arg})
		${o.aft}
		}
	`,
	(o, f) => `
		import {${f}} from "${data.target.name}"
		${o.glo}
		;() => {
		${o.pre}${f}(${o.arg})
		${o.aft}
		}
	`,
	(o, f) => `
		import * as result from "${data.target.name}"
		${o.glo}
		${o.pre}result.${f}(${o.arg})
		${o.aft}
	`,
	(o, f) => `
		import * as result from "${data.target.name}"
		${o.glo}
		function wr() {
		${o.pre}result.${f}(${o.arg})
		${o.aft}
		}
	`,
	(o, f) => `
		import * as result from "${data.target.name}"
		${o.glo}
		;() => {
		${o.pre}result.${f}(${o.arg})
		${o.aft}
		}
	`,
]

type Template = (
	o: ComputedTestTemplateOptions,
	f: data.target.SafeFunc
) => string

function render(
	t: Template,
	o: ComputedTestTemplateOptions,
	f: data.target.SafeFunc,
): string {
	return t(o, f).replaceAll(/^\t{2}/gm, "").trim()
}

export type RuleFile<
	M extends string,
	O extends readonly unknown[],
> = {
	funcs: data.target.SafeFunc[]
	module: util.rule.Module<M, O>
}

export type TestSuite<
	M extends string,
	O extends readonly unknown[],
> = {
	valid: ValidTest<O>[]
	invalid: InvalidTest<M, O>[]
}

export type ValidTest<
	O extends readonly unknown[],
> = ValidTestRuleOptions<O> & TestTemplateOptions

export type ValidTestRuleOptions<
	O extends readonly unknown[],
> = {
	opt?: O
}

export type InvalidTest<
	M extends string,
	O extends readonly unknown[],
> = FixableTest<M, O> | UnfixableTest<M, O>

export type FixableTest<
	M extends string,
	O extends readonly unknown[],
> = InvalidTestRuleOptions<M, O> & TestTemplateOptions & {
	inp: TestTemplateOptions
	out: TestTemplateOptions
}

export type UnfixableTest<
	M extends string,
	O extends readonly unknown[],
> = InvalidTestRuleOptions<M, O> & TestTemplateOptions

export type InvalidTestRuleOptions<
	M extends string,
	O extends readonly unknown[],
> = {
	opt?: O
	msg?: M
}

export type TestTemplateOptions = {
	glo?: string
	pre?: string
	arg?: string
	aft?: string
}

type ComputedValidTest<
	O extends readonly unknown[],
> = ComputedValidTestRuleOptions<O> & ComputedTestTemplateOptions

type ComputedValidTestRuleOptions<
	O extends readonly unknown[],
> = {
	opt: O
}

type ComputedInvalidTest<
	M extends string,
	O extends readonly unknown[],
> = ComputedFixableTest<M, O> | ComputedUnfixableTest<M, O>

type ComputedFixableTest<
	M extends string,
	O extends readonly unknown[],
> = ComputedInvalidTestRuleOptions<M, O> & ComputedTestTemplateOptions & {
	inp: ComputedTestTemplateOptions
	out: ComputedTestTemplateOptions
}

type ComputedUnfixableTest<
	M extends string,
	O extends readonly unknown[],
> = ComputedInvalidTestRuleOptions<M, O> & ComputedTestTemplateOptions

type ComputedInvalidTestRuleOptions<
	M extends string,
	O extends readonly unknown[],
> = {
	opt: O
	msg: M
}

export type ComputedTestTemplateOptions = {
	glo: string
	pre: string
	arg: string
	aft: string
}

export function js<
	M extends string,
	O extends readonly unknown[],
>(r: RuleFile<M, O>, s: TestSuite<M, O>): void {
	run(r, s, {})
}

export function ts<
	M extends string,
	O extends readonly unknown[],
>(r: RuleFile<M, O>, s: TestSuite<M, O>): void {
	let c: ruleTester.RuleTesterConfig = {
		languageOptions: {
			parserOptions: {
				project: true, // to test with older versions
				projectService: {
					allowDefaultProject: ["*.ts"],
				},
				tsconfigRootDir: import.meta.dirname,
			},
		},
	}
	run(r, s, c)
}

function run<
	M extends string,
	O extends readonly unknown[],
>(r: RuleFile<M, O>, s: TestSuite<M, O>, c: ruleTester.RuleTesterConfig): void {
	let n = util.rule.name(r.module)

	let messages = Object.keys(r.module.meta.messages) as M[]
	if (messages.length === 0) {
		throw new Error(`Rule ${n} does not have any messages`)
	}

	let m = messages[0]

	let t = new ruleTester.RuleTester(c)

	let x: shared.ValidTestCase<O>[] = []

	for (let [i, t] of s.valid.entries()) {
		let c = computeValidTest(t)
		x.push(...valid(r.funcs, i, c))
	}

	let y: shared.InvalidTestCase<M, O>[] = []

	for (let [i, t] of s.invalid.entries()) {
		let c = computeInvalidTest(m, t)
		y.push(...invalid(r.funcs, i, c))
	}

	let o: ruleTester.RunTests<M, O> = {
		valid: x,
		invalid: y,
	}

	t.run(n, r.module, o)
}

function valid<O extends readonly unknown[]>(
	funcs: data.target.SafeFunc[],
	i: number,
	t: ComputedValidTest<O>,
): shared.ValidTestCase<O>[] {
	let a: shared.ValidTestCase<O>[] = []

	for (let f of funcs) {
		for (let [j, h] of templates.entries()) {
			let c = render(h, t, f)

			let v: shared.ValidTestCase<O> = {
				name: `${i}:${j} ${f}`,
				options: t.opt,
				settings: {
					result: {
						disableTargetGuard: true,
					},
				},
				code: c,
			}

			a.push(v)
		}
	}

	return a
}

function invalid<
	M extends string,
	O extends readonly unknown[],
>(
	funcs: data.target.SafeFunc[],
	i: number,
	t: ComputedInvalidTest<M, O>,
): shared.InvalidTestCase<M, O>[] {
	if (isFixableTest(t)) {
		return fixable(funcs, i, t)
	}
	return unfixable(funcs, i, t)
}

function fixable<
	M extends string,
	O extends readonly unknown[],
>(
	funcs: data.target.SafeFunc[],
	i: number,
	t: ComputedFixableTest<M, O>,
): shared.InvalidTestCase<M, O>[] {
	let a: shared.InvalidTestCase<M, O>[] = []

	for (let f of funcs) {
		for (let [j, h] of templates.entries()) {
			let c = render(h, t.inp, f)
			let o = render(h, t.out, f)

			let v: shared.InvalidTestCase<M, O> = {
				name: `${i}:${j} ${f}`,
				options: t.opt,
				settings: {
					result: {
						disableTargetGuard: true,
					},
				},
				code: c,
				errors: [{messageId: t.msg}],
				output: o,
			}

			a.push(v)
		}
	}

	return a
}

function unfixable<
	M extends string,
	O extends readonly unknown[],
>(
	funcs: data.target.SafeFunc[],
	i: number,
	t: ComputedUnfixableTest<M, O>,
): shared.InvalidTestCase<M, O>[] {
	let a: shared.InvalidTestCase<M, O>[] = []

	for (let f of funcs) {
		for (let [j, h] of templates.entries()) {
			let c = render(h, t, f)

			let v: shared.InvalidTestCase<M, O> = {
				name: `${i}:${j} ${f}`,
				options: t.opt,
				settings: {
					result: {
						disableTargetGuard: true,
					},
				},
				code: c,
				errors: [{messageId: t.msg}],
			}

			a.push(v)
		}
	}

	return a
}

function computeValidTest<
	O extends readonly unknown[],
>(t: ValidTest<O>): ComputedValidTest<O> {
	let a = computeValidTestRuleOptions(t)
	let b = computeTestTemplateOptions(t)

	let r: ComputedValidTest<O> = {
		...b,
		...a,
	}

	return r
}

function computeValidTestRuleOptions<
	O extends readonly unknown[],
>(t: ValidTestRuleOptions<O>): ComputedValidTestRuleOptions<O> {
	let o: ComputedValidTestRuleOptions<O> = {
		opt: [] as unknown as O,
	}

	if (t.opt) {
		o.opt = t.opt
	}

	return o
}

function computeInvalidTest<
	M extends string,
	O extends readonly unknown[],
>(m: M, t: InvalidTest<M, O>): ComputedInvalidTest<M, O> {
	if (isFixableTest(t)) {
		return computeFixableTest(m, t)
	}
	return computeUnfixableTest(m, t)
}

function computeFixableTest<
	M extends string,
	O extends readonly unknown[],
>(m: M, t: FixableTest<M, O>): ComputedFixableTest<M, O> {
	let a = computeInvalidTestRuleOptions(m, t)
	let b = computeTestTemplateOptions(t)

	let c = overrideTestTemplateOptions(b, t.inp)
	let d = overrideTestTemplateOptions(b, t.out)

	let r: ComputedFixableTest<M, O> = {
		...a,
		...b,
		inp: c,
		out: d,
	}

	return r
}

function computeUnfixableTest<
	M extends string,
	O extends readonly unknown[],
>(m: M, t: UnfixableTest<M, O>): ComputedUnfixableTest<M, O> {
	let a = computeInvalidTestRuleOptions(m, t)
	let b = computeTestTemplateOptions(t)

	let r: ComputedUnfixableTest<M, O> = {
		...a,
		...b,
	}

	return r
}

function computeInvalidTestRuleOptions<
	M extends string,
	O extends readonly unknown[],
>(m: M, t: InvalidTestRuleOptions<M, O>): ComputedInvalidTestRuleOptions<M, O> {
	let o: ComputedInvalidTestRuleOptions<M, O> = {
		opt: [] as unknown as O,
		msg: m,
	}

	if (t.opt) {
		o.opt = t.opt
	}

	if (t.msg) {
		o.msg = t.msg
	}

	return o
}

function computeTestTemplateOptions(
	t: TestTemplateOptions,
): ComputedTestTemplateOptions {
	let o: ComputedTestTemplateOptions = {
		glo: "",
		pre: "",
		arg: "fn",
		aft: "",
	}

	if (t.glo) {
		o.glo = t.glo
	}

	if (t.pre) {
		o.pre = t.pre
	}

	if (t.arg) {
		o.arg = t.arg
	}

	if (t.aft) {
		o.aft = t.aft
	}

	return o
}

function overrideTestTemplateOptions(
	a: ComputedTestTemplateOptions,
	b: TestTemplateOptions,
): ComputedTestTemplateOptions {
	let o: ComputedTestTemplateOptions = {
		glo: a.glo,
		pre: a.pre,
		arg: a.arg,
		aft: a.aft,
	}

	if (b.glo) {
		o.glo = b.glo
	}

	if (b.pre) {
		o.pre = b.pre
	}

	if (b.arg) {
		o.arg = b.arg
	}

	if (b.aft) {
		o.aft = b.aft
	}

	return o
}

function isFixableTest<
	M extends string,
	O extends readonly unknown[],
>(t: InvalidTest<M, O>): t is FixableTest<M, O> {
	return "inp" in t && "out" in t
}
