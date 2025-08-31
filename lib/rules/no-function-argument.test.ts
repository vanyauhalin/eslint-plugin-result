import * as test from "../test.ts"
import * as rule from "./no-function-argument.ts"

test.templates.js(rule, {
	valid: [
		{arg: "() => {}"},
		{arg: "(function() {})()"},
		{arg: "(() => {})()"},
		{arg: "fn"},
		{arg: "new Function()"},
	],
	invalid: [
		{arg: "function() {}"},
	],
})
