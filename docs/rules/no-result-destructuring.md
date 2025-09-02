# no-result-destructuring

💼 This rule is enabled in the ✅ `recommended` config.

## Rule details

Disallow destructuring [`Result`] objects from [`safeNew`], [`safeSync`], and
[`safeAsync`] calls. Prefer to access `v` and `err` properties explicitly.

Examples of **incorrect** code for this rule:

```js
import * as result from "@vanyauhalin/result"

const {} = result.safeNew(URL, "")
const {} = result.safeSync(JSON.parse, "")
const {} = await result.safeAsync(fetch, "")
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

[`Result`]: https://github.com/vanyauhalin/result/blob/v0.1.0/README.md#result-1
[`safeNew`]: https://github.com/vanyauhalin/result/blob/v0.1.0/README.md#safesyncfn-args
[`safeSync`]: https://github.com/vanyauhalin/result/blob/v0.1.0/README.md#safesyncfn-args
[`safeAsync`]: https://github.com/vanyauhalin/result/blob/v0.1.0/README.md#safeasyncfn-args

[Rule source]: ../../lib/rules/no-result-destructuring.ts
[Test source]: ../../lib/rules/no-result-destructuring.test.ts
