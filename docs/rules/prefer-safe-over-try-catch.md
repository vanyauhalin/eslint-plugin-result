# prefer-safe-over-try-catch

💼 This rule is enabled in the ✅ `recommended` config.

## Rule details

Prefer [`safeNew`], [`safeSync`], and [`safeAsync`] calls over try-catch blocks.

Examples of **incorrect** code for this rule:

```js
try {
	const a = new URL("")
} catch {}

try {
	const b = JSON.parse("")
} catch {}

try {
	const c = await fetch("")
} catch {}
```

Examples of **correct** code for this rule:

```js
import * as result from "@vanyauhalin/result"

const a = result.safeNew(URL, "")
const b = result.safeSync(JSON.parse, "")
const c = await result.safeAsync(fetch, "")
```

## Resources

- [Rule source]
- [Test source]

<!-- Definitions -->

[`safeNew`]: https://github.com/vanyauhalin/result/blob/v0.0.0/README.md#safesyncfn-args
[`safeSync`]: https://github.com/vanyauhalin/result/blob/v0.0.0/README.md#safesyncfn-args
[`safeAsync`]: https://github.com/vanyauhalin/result/blob/v0.0.0/README.md#safeasyncfn-args

[Rule source]: ../../lib/rules/prefer-safe-over-try-catch.ts
[Test source]: ../../lib/rules/prefer-safe-over-try-catch.test.ts
