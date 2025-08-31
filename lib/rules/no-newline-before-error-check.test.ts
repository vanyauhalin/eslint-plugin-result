import * as test from "../test.ts"
import * as rule from "./no-newline-before-error-check.ts"

test.templates.js(rule, {
	valid: [
		{
			pre: "const r = ",
			aft: "if (r.err) {}",
		},
		{
			pre: "const r = ",
			aft: "const z = 0\n\nif (r.err) {}",
		},
		{
			pre: "o.r = ",
			aft: "if (o.r.err) {}",
		},
		{
			pre: "o.r = ",
			aft: "const z = 0\n\nif (o.r.err) {}",
		},
		{
			pre: "o.o.r = ",
			aft: "if (o.o.r.err) {}",
		},
		{
			pre: "o.o.r = ",
			aft: "const z = 0\n\nif (o.o.r.err) {}",
		},
	],
	invalid: [
		{
			pre: "const r = ",
			inp: {aft: "\nif (r.err) {}"},
			out: {aft: "if (r.err) {}"},
		},
		{
			pre: "const r = ",
			inp: {aft: "\n\nif (r.err) {}"},
			out: {aft: "if (r.err) {}"},
		},
		{
			pre: "o.r = ",
			inp: {aft: "\nif (o.r.err) {}"},
			out: {aft: "if (o.r.err) {}"},
		},
		{
			pre: "o.r = ",
			inp: {aft: "\n\nif (o.r.err) {}"},
			out: {aft: "if (o.r.err) {}"},
		},
		{
			pre: "o.o.r = ",
			inp: {aft: "\nif (o.o.r.err) {}"},
			out: {aft: "if (o.o.r.err) {}"},
		},
		{
			pre: "o.o.r = ",
			inp: {aft: "\n\nif (o.o.r.err) {}"},
			out: {aft: "if (o.o.r.err) {}"},
		},
	],
})
