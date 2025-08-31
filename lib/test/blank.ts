import * as ruleTester from "@typescript-eslint/rule-tester"
import * as util from "../util.ts"
import type * as shared from "./shared.ts"

export type RuleFile<
	M extends string,
	O extends readonly unknown[],
> = {
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
> = ValidTestRuleOptions<O> & {
	inp: string
}

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
> = InvalidTestRuleOptions<M, O> & {
	inp: string
	out: string
}

export type UnfixableTest<
	M extends string,
	O extends readonly unknown[],
> = InvalidTestRuleOptions<M, O> & {
	inp: string
}

export type InvalidTestRuleOptions<
	M extends string,
	O extends readonly unknown[],
> = {
	opt?: O
	msg?: M
}

type ComputedValidTest<
	O extends readonly unknown[],
> = ComputedValidTestRuleOptions<O> & {
	inp: string
}

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
> = ComputedInvalidTestRuleOptions<M, O> & {
	inp: string
	out: string
}

type ComputedUnfixableTest<
	M extends string,
	O extends readonly unknown[],
> = ComputedInvalidTestRuleOptions<M, O> & {
	inp: string
}

type ComputedInvalidTestRuleOptions<
	M extends string,
	O extends readonly unknown[],
> = {
	opt: O
	msg: M
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
		x.push(valid(i, c))
	}

	let y: shared.InvalidTestCase<M, O>[] = []

	for (let [i, t] of s.invalid.entries()) {
		let c = computeInvalidTest(m, t)
		y.push(invalid(i, c))
	}

	let o: ruleTester.RunTests<M, O> = {
		valid: x,
		invalid: y,
	}

	t.run(n, r.module, o)
}

function valid<O extends readonly unknown[]>(
	i: number,
	t: ComputedValidTest<O>,
): shared.ValidTestCase<O> {
	return {
		name: `${i}`,
		options: t.opt,
		settings: {
			result: {
				disableTargetGuard: true,
			},
		},
		code: t.inp,
	}
}

function invalid<
	M extends string,
	O extends readonly unknown[],
>(
	i: number,
	t: ComputedInvalidTest<M, O>,
): shared.InvalidTestCase<M, O> {
	if (isFixableTest(t)) {
		return fixable(i, t)
	}
	return unfixable(i, t)
}

function fixable<
	M extends string,
	O extends readonly unknown[],
>(
	i: number,
	t: ComputedFixableTest<M, O>,
): shared.InvalidTestCase<M, O> {
	return {
		name: `${i}`,
		options: t.opt,
		settings: {
			result: {
				disableTargetGuard: true,
			},
		},
		code: t.inp,
		errors: [
			{
				messageId: t.msg,
			},
		],
		output: t.out,
	}
}

function unfixable<
	M extends string,
	O extends readonly unknown[],
>(
	i: number,
	t: ComputedUnfixableTest<M, O>,
): shared.InvalidTestCase<M, O> {
	return {
		name: `${i}`,
		options: t.opt,
		settings: {
			result: {
				disableTargetGuard: true,
			},
		},
		code: t.inp,
		errors: [
			{
				messageId: t.msg,
			},
		],
	}
}

function computeValidTest<
	O extends readonly unknown[],
>(t: ValidTest<O>): ComputedValidTest<O> {
	let b = computeValidTestRuleOptions(t)

	let r: ComputedValidTest<O> = {
		...b,
		inp: t.inp,
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

	let r: ComputedFixableTest<M, O> = {
		...a,
		inp: t.inp,
		out: t.out,
	}

	return r
}

function computeUnfixableTest<
	M extends string,
	O extends readonly unknown[],
>(m: M, t: UnfixableTest<M, O>): ComputedUnfixableTest<M, O> {
	let a = computeInvalidTestRuleOptions(m, t)

	let r: ComputedUnfixableTest<M, O> = {
		...a,
		inp: t.inp,
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

function isFixableTest<
	M extends string,
	O extends readonly unknown[],
>(t: InvalidTest<M, O>): t is FixableTest<M, O> {
	return "inp" in t && "out" in t
}
