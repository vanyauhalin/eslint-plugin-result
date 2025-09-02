import type * as ruleTester from "@typescript-eslint/rule-tester"
import type * as util from "../util.ts"

export type ValidTestCase<
	O extends readonly unknown[],
> = Omit<ruleTester.ValidTestCase<O>, "settings"> & {
	settings?: util.rule.Context<string, O>["settings"]
}

export type InvalidTestCase<
	M extends string,
	O extends readonly unknown[],
> = Omit<ruleTester.InvalidTestCase<M, O>, keyof ruleTester.ValidTestCase<O>> &
	ValidTestCase<O>
