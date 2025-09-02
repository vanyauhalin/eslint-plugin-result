# no-function-argument

💼 This rule is enabled in the ✅ `recommended` config.

## Rule details

Disallow function expressions (both named and anonymous) as the first argument
to [`safeSync`] and [`safeAsync`] functions. Prefer to move function definitions
outside of the call arguments.

Examples of **incorrect** code for this rule:

```js
import * as result from "@vanyauhalin/result"

result.safeSync(function fn() {})
result.safeAsync(function() {})
```

Examples of **correct** code for this rule:

```js
import * as result from "@vanyauhalin/result"

function fn() {}

result.safeSync(fn)
result.safeAsync(fn)
```

## Resources

- [Rule source]
- [Test source]

<!-- Definitions -->

[`safeSync`]: https://github.com/vanyauhalin/result/blob/v0.1.0/README.md#safesyncfn-args
[`safeAsync`]: https://github.com/vanyauhalin/result/blob/v0.1.0/README.md#safeasyncfn-args

[Rule source]: ../../lib/rules/no-function-argument.ts
[Test source]: ../../lib/rules/no-function-argument.test.ts
