# no-iife-argument

💼 This rule is enabled in the ✅ `recommended` config.

## Rule details

Disallow immediately invoked function expressions (IIFE) as the first argument
to [`safeNew`], [`safeSync`], and [`safeAsync`] calls. Prefer to define the
function outside the call arguments.

Examples of **incorrect** code for this rule:

```js
import * as result from "@vanyauhalin/result"

result.safeNew((() => {})())
result.safeSync((() => {})())
result.safeAsync((() => {})())
```

Examples of **correct** code for this rule:

```js
import * as result from "@vanyauhalin/result"

const fn = () => {}

result.safeNew(fn)
result.safeSync(fn)
result.safeAsync(fn)
```

## Resources

- [Rule source]
- [Test source]

<!-- Definitions -->

[`safeNew`]: https://github.com/vanyauhalin/result/blob/v0.1.0/README.md#safesyncfn-args
[`safeSync`]: https://github.com/vanyauhalin/result/blob/v0.1.0/README.md#safesyncfn-args
[`safeAsync`]: https://github.com/vanyauhalin/result/blob/v0.1.0/README.md#safeasyncfn-args

[Rule source]: ../../lib/rules/no-iife-argument.ts
[Test source]: ../../lib/rules/no-iife-argument.test.ts
