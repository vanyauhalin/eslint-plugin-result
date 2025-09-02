# no-bare-error-return

💼 This rule is enabled in the ✅ `recommended` config.

## Rule details

Disallow returning unwrapped errors from [`Result`] objects. Prefer to wrap
errors with additional context.

Examples of **incorrect** code for this rule:

```js
import * as result from "@vanyauhalin/result"

async function fn() {
	const a = result.safeNew(URL, "")
	if (a.err) {
		return a.err
	}

	const b = result.safeSync(JSON.parse, "")
	if (b.err) {
		return b.err
	}

	const c = await result.safeAsync(fetch, "")
	if (c.err) {
		return c.err
	}
}
```

Examples of **correct** code for this rule:

```js
import * as result from "@vanyauhalin/result"

async function fn() {
	const a = result.safeNew(URL, "")
	if (a.err) {
		return new Error("Creating a URL", {cause: a.err})
	}

	const b = result.safeSync(JSON.parse, "")
	if (b.err) {
		return new Error("Parsing JSON", {cause: b.err})
	}

	const c = await result.safeAsync(fetch, "")
	if (c.err) {
		return new Error("Fetching data", {cause: c.err})
	}
}
```

## Resources

- [Rule source]
- [Test source]

<!-- Definitions -->

[`Result`]: https://github.com/vanyauhalin/result/blob/v0.1.0/README.md#result-1

[Rule source]: ../../lib/rules/no-bare-error-return.ts
[Test source]: ../../lib/rules/no-bare-error-return.test.ts
