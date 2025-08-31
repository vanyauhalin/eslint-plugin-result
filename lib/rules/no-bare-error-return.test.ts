import * as test from "../test.ts"
import * as rule from "./no-bare-error-return.ts"

test.templates.js(rule, {
	valid: [
		{
			pre: "const r = ",
			aft: "if (r.err) return {cause: r.err}",
		},
		{
			pre: "const r = ",
			aft: "if (r.err) {return {cause: r.err}}",
		},
		{
			pre: "o.r = ",
			aft: "if (o.r.err) return {cause: o.r.err}",
		},
		{
			pre: "o.r = ",
			aft: "if (o.r.err) {return {cause: o.r.err}}",
		},
		{
			pre: "o.o.r = ",
			aft: "if (o.o.r.err) return {cause: o.o.r.err}",
		},
		{
			pre: "o.o.r = ",
			aft: "if (o.o.r.err) {return {cause: o.o.r.err}}",
		},
	],
	invalid: [
		{
			pre: "const r = ",
			aft: "if (r.err) return r.err",
		},
		{
			pre: "const r = ",
			aft: "if (r.err) {return r.err}",
		},
		{
			pre: "o.r = ",
			aft: "if (o.r.err) return o.r.err",
		},
		{
			pre: "o.r = ",
			aft: "if (o.r.err) {return o.r.err}",
		},
		{
			pre: "o.o.r = ",
			aft: "if (o.o.r.err) return o.o.r.err",
		},
		{
			pre: "o.o.r = ",
			aft: "if (o.o.r.err) {return o.o.r.err}",
		},
	],
})
