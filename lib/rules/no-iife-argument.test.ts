import * as test from "../test.ts"
import * as rule from "./no-iife-argument.ts"

test.templates.js(rule, {
	valid: [
		{arg: "function() {}"},
		{arg: "() => {}"},
		{arg: "fn"},
		{arg: "new Function()"},
	],
	invalid: [
		{arg: "(function() {})()"},
		{arg: "(() => {})()"},
	],
})
