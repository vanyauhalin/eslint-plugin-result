import * as test from "../test.ts"
import * as rule from "./prefer-safe-over-try-catch.ts"

test.blank.js(rule, {
	valid: [
		{inp: "safeNew()"},
		{inp: "safeSync()"},
		{inp: "safeAsync()"},
	],
	invalid: [
		{inp: "try {} catch {}"},
	],
})
