import fs from "node:fs"
import type * as ruleTester from "@typescript-eslint/rule-tester"
import type * as util from "../util.ts"

export const pack = (() => {
	// Have to read the file instead of using import to test with older versions.
	let c = fs.readFileSync("package.json", "utf8")
	return JSON.parse(c)
})()

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
