import path from "node:path"
import test from "node:test"
import * as ruleTester from "@typescript-eslint/rule-tester"
import * as tsconfig from "./tsconfig.ts"

const version = process.version.slice(1).split(".")
const major = Number.parseInt(version[0], 10)

ruleTester.RuleTester.afterAll = (cb) => {
	test.after(cb)
}

ruleTester.RuleTester.describe = (() => {
	// https://github.com/nodejs/node/pull/56664/
	if (major >= 24) {
		return (n, cb) => {
			void test(n, cb)
		}
	}
	return (_, cb) => {
		cb()
	}
})()

ruleTester.RuleTester.it = (n, cb) => {
	void test(n, cb)
}

async function main(): Promise<void> {
	let d = process.cwd()
	let c = await tsconfig.load(process)
	for (let f of c.files) {
		await import(`file://${path.join(d, f)}`)
	}
}

void main()
