import * as test from "../test.ts"
import * as rule from "./no-async-function-in-sync.ts"

test.templates.ts(rule, {
	valid: [
		{arg: "function() {}"},
		{arg: "() => {}"},

		{glo: "class Promise {}\nfunction fn(): Promise {}"},
		{glo: "interface Promise {}\nfunction fn(): Promise {}"},
		{glo: "type Promise = {}\nfunction fn(): Promise {}"},

		{glo: "interface PromiseLike {}\nfunction fn(): PromiseLike {}"},
		{glo: "type PromiseLike = {}\nfunction fn(): PromiseLike {}"},
	],
	invalid: [
		{glo: "async function fn() {}"},
		{arg: "async() => {}"},

		{glo: "function fn() {return Promise.resolve()}"},
		{glo: "function fn() {if (x) {return Promise.resolve()} else {return 0}}"},

		{glo: "class P<T> extends Promise<T> {}\nfunction fn<T>(): P<T> {}"},
		{glo: "interface P<T> extends PromiseLike<T> {}\nfunction fn<T>(): P<T> {}"},
		{glo: "type P<T> = PromiseLike<T>\nfunction fn<T>(): P<T> {}"},

		{glo: "const t = {then() {}}\nfunction fn() {return t}"},
		{glo: "const t = {then = () => {}}\nfunction fn() {return t}"},
		{glo: "const t = {get then() {}}\nfunction fn() {return t}"},

		{glo: "class T {then() {}}\nfunction fn() {return new T()}"},
		{glo: "class T {then = () => {}}\nfunction fn() {return new T()}"},
		{glo: "class T {get then() {}}\nfunction fn() {return new T()}"},

		{glo: "class T {static then() {}}\nfunction fn() {return T}"},
		{glo: "class T {static then = () => {}}\nfunction fn() {return T}"},
		{glo: "class T {static get then() {}}\nfunction fn() {return T}"},
	],
})
