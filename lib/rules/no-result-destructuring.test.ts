import * as test from "../test.ts"
import * as rule from "./no-result-destructuring.ts"

test.templates.js(rule, {
	valid: [
		{pre: "const r = "},
		{pre: "o.r = "},
	],
	invalid: [
		{pre: "const {} = "},
	],
})
