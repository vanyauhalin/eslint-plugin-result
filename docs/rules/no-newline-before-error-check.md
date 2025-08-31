# no-newline-before-error-check

💼 This rule is enabled in the ✅ `recommended` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option].

## Rule details

Disallow empty lines between [`safeNew`], [`safeSync`], and [`safeAsync`] calls
and their immediate error checks. Prefer to maintain locality of error handling.

Examples of **incorrect** code for this rule:

```js
import * as result from "@vanyauhalin/result"

const a = result.safeNew(URL, "")

if (a.err) {}

const b = result.safeSync(JSON.parse, "")

if (b.err) {}

const c = await result.safeAsync(fetch, "")

if (c.err) {}
```

Examples of **correct** code for this rule:

```js
import * as result from "@vanyauhalin/result"

const a = result.safeNew(URL, "")
if (a.err) {}

const b = result.safeSync(JSON.parse, "")
if (b.err) {}

const c = await result.safeAsync(fetch, "")
if (c.err) {}
```

## Resources

- [Rule source]
- [Test source]

<!-- Definitions -->

[`--fix` CLI option]: https://eslint.org/docs/user-guide/command-line-interface#--fix

[`safeNew`]: https://github.com/vanyauhalin/result/blob/v0.0.0/README.md#safesyncfn-args
[`safeSync`]: https://github.com/vanyauhalin/result/blob/v0.0.0/README.md#safesyncfn-args
[`safeAsync`]: https://github.com/vanyauhalin/result/blob/v0.0.0/README.md#safeasyncfn-args

[Rule source]: ../../lib/rules/no-newline-before-error-check.ts
[Test source]: ../../lib/rules/no-newline-before-error-check.test.ts
